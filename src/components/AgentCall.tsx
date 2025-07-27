import { useConversation } from '@elevenlabs/react';
import { useCallback } from 'react';
import { config } from '@/config';
import { knowledgeReference } from '@/services/tools';


async function requestMicrophonePermission() {
  try {
    await navigator.mediaDevices.getUserMedia({ audio: true });
    return true;
  } catch (error) {
    console.log(error);
    console.error('Microphone permission denied');
    return false;
  }
}


export default function AgentCall(
    {knowledge_reference, addMessage, handleClearMessages} 
    :   {knowledge_reference: typeof knowledgeReference,
        addMessage: (message: {content: string, type: "user" | "bot"}) => void,
        handleClearMessages: () => void})
    {
    const conversation = useConversation({
        onConnect: () => {
            console.log("Connected")
            handleClearMessages()
        },
        onDisonnect: () => {console.log("Disconnected")},
        onMessage: (message) => {
            const newMsg: { content: string; type: "bot" | "user" } = {
                content: message.message,
                type: message.source == "ai" ? 'bot' : 'user'
            };
            addMessage(newMsg)
        },
        onError: (error) => {
            console.error(error)
        }
    })

    const startConversation = useCallback(async () => {
        const hasPermission = await requestMicrophonePermission();
        if (!hasPermission){
            alert('No permission')
            return;
        }

        await conversation.startSession({
            agentId: config.agentID,
            connectionType: "webrtc",
            clientTools: {
                knowledge_reference
            }
        })
    }, [conversation, knowledge_reference])

    const stopConversation = useCallback(async () => {
        await conversation.endSession()
    }, [conversation])

    return (
        <button
        onClick={conversation.status == "disconnected" ? startConversation : stopConversation}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            {conversation.status == "disconnected" ? "Begin Call" : "End call"}
        </button>
    )
}