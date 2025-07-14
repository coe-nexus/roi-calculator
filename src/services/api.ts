import axios from 'axios'
import { config } from '../config'

const apiClient = axios.create({
    baseURL: config.serverApiUrl,
    headers: {
        'Content-Type': 'application/json',
    }
})

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("authToken")
    if (token){
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// AKA Materials
export const getDocuments = async () => {
    try {
        const response = await apiClient.get('/documents');
        return response.data;
        // find a way how to create a Document type here based on the data
    } catch (error) {
        console.error('Error fetching documents:', error);
        throw error;
    }
}