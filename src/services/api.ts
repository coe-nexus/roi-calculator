import axios from 'axios';
import { config } from '../config'
import { Document, JWTInterface } from '@/types'
import axiosRetry from 'axios-retry'
import { MessageData, Chat } from '@/types';

const apiClient = axios.create({
    baseURL: config.serverApiUrl,
    headers: {
        'Content-Type': 'application/json',
    }
})

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("authToken")
    if (!token){
        getGuestToken()
    }
    config.headers.Authorization = `Bearer ${token}`
    return config
})


axiosRetry(apiClient, {
    retries: 3,
    retryDelay: (retryCount) => retryCount * 2000,
    retryCondition: (error) => {
        // Only retry on 403/401 errors, not for getGuestToken calls
        if (error.config?.url?.includes('auth/guest')) {
            return false; // Don't retry guest token calls to avoid infinite loop
        }
        return error.response?.status === 403 || error.response?.status === 401;
    },
    onRetry: async (retryCount, error, requestConfig) => {
        // This runs before each retry - refresh token here
        if (error.response?.status === 403 || error.response?.status === 401) {
            console.log(`Attempt ${retryCount}: Refreshing token due to ${error.response.status}`);
            try {
                await getGuestToken();
                // Update the Authorization header for the retry
                const newToken = localStorage.getItem("authToken");
                if (newToken && requestConfig.headers) {
                    requestConfig.headers.Authorization = `Bearer ${newToken}`;
                }
            } catch (tokenError) {
                console.error('Failed to refresh token:', tokenError);
                throw tokenError; // Stop retrying if token refresh fails
            }
        }
    }
});

async function getGuestToken() {
    try {
        // Create a separate axios instance for auth calls to avoid retry loop
        const authClient = axios.create({ baseURL: apiClient.defaults.baseURL });
        const response = await authClient.get('auth/guest');
        const tokens: JWTInterface = response.data as JWTInterface;
        localStorage.setItem("authToken", tokens.access_token);
        return tokens.access_token;
    } catch (error) {
        console.error('Error getting guest token:', error);
        throw error;
    }
}

// AKA Materials
export const getDocuments = async () => {
    try {
        const response = await apiClient.get(`/domains/${config.domainId}/documents`);
        const documents: Document[] = response.data as Document[];
        return documents
        // find a way how to create a Document type here based on the data
    } catch (error) {
        console.error('Error fetching documents:', error);
        throw error;
    }
}

export const getDocumentContent = async (document_id: number) => {
    try {
        const response = await apiClient.get(`/domains/${config.domainId}/documents/${document_id}`);
        const document: Document = response.data as Document;
        return document
    } catch (error) {
        console.error('Error getting document content:', error);
        throw error;
    }
}

// SSE works better with fetch rather than Axios, so this is a bit unusual.
export const sendMessageStreaming = async (messageData: MessageData, chatId: number) => {
    const endpoint = config.serverApiUrl + `/chats/${chatId}/messages/stream`
    await getGuestToken();
    const token = localStorage.getItem('authToken'); // Get current token

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
    };
    console.log(headers)
    try {
        
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(messageData),
        })

        if (!response.ok) {
            let errorPayload;
            try {
                errorPayload = await response.json();
            } catch (e) {
                errorPayload = { message: response.statusText };
            }
            throw new Error(errorPayload.detail || errorPayload.message || `HTTP error! status: ${response.status}`);
        }

        return response
    } catch (e) {
        console.log("Error when streaming response from server", e)
        throw e;
    }
}

export const createChat = async (name: string) => {
    try {
        const response = await apiClient.post(
            `chats/`,
            {
                name: name
            },
        )

        return response.data as Chat
    } catch (e) {
        console.log("Error when trying to create a chat", e)
        throw e
    }
}