import React, { useEffect, useState, useCallback } from 'react';
import { TabType, Message, CategoryType } from '../types';
import { ApiProvider, useApiData } from '@/components/ApiProvider';
import { config } from '@/config';
import Sidebar from '@/components/Sidebar';
import ChatInterface from '@/components/ChatInterface';
import MaterialsExplorer from '@/components/MaterialsExplorer';
import RepositoryView from '@/components/RepositoryView';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [chatId, setChatId] = useState(1);
  const { materials, sendMessage, createChat } = useApiData();


  
const createChatId = useCallback(async () => {
  setMessages([])
  setInputMessage('')
  const chat = await createChat("default chat");
  console.log("CREATED CHAT, with ID: " + chat.chat_id);
  setChatId(chat.chat_id);
}, [createChat]);

useEffect(() => {
  createChatId();
}, [createChatId]);

  const handleSendMessage = async () => {
    if (inputMessage.trim()) {
      const newMessage: Message = { id: messages.length + 1, type: 'user', content: inputMessage };
      const botResponse: Message = { id: messages.length + 2, type: 'bot', content: "..." };
      const botMessageId = botResponse.id;
      setMessages([...messages, newMessage, botResponse]);
      setInputMessage('');
      const response = await sendMessage({
        content: inputMessage,
        timestamp: new Date().toISOString(),
        domain_ids: [parseInt(config.domainId)]
      }, chatId);

      if (!response.body) {
        console.log(response);
        throw Error("An error occurred while sending the message");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      const processStream = async () => {
        let messageContent = '';
        // eslint-disable-next-line no-constant-condition
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });

          let eventPos;
          while ((eventPos = buffer.indexOf('\n\n')) >= 0) {
            const rawEvent = buffer.substring(0, eventPos);
            buffer = buffer.substring(eventPos + 2);

            let currentEvent = '';
            let currentData = '';

            const lines = rawEvent.split('\n');
            for (const line of lines) {
              if (line.startsWith('event: ')) {
                currentEvent = line.substring('event: '.length).trim();
              } else if (line.startsWith('data: ')) {
                currentData = line.substring('data: '.length);
              }
            }

            if (currentEvent === 'message' && currentData) {
              try {
                const parsed = JSON.parse(currentData);
                if (parsed.type === 'token' && parsed.content) {
                  messageContent += parsed.content;
                  const currentContent = messageContent;
                  setMessages(prevMessages =>
                    prevMessages.map(msg =>
                      msg.id === botMessageId
                        ? { ...msg, content: currentContent }
                        : msg
                    )
                  );
                }
              } catch (e) {
                console.error('Failed to parse message data:', e);
              }
            } else if (currentEvent === 'taskComplete') {
              try {
                const taskData = JSON.parse(currentData);
                console.log('Task Complete Event:', taskData);
              } catch (e) {
                console.error('Failed to parse taskComplete data:', e);
              }
            } else if (currentEvent === 'close') {
              console.log('Stream closed');
            }
          }
        }
      };
      processStream().catch(streamError => {
        console.error("Error processing stream:", streamError);
        setMessages(prevMessages => prevMessages.map(msg =>
          msg.id === botMessageId ? { ...msg, content: msg.content + " [Error in stream]" } : msg
        ));
      });
    }
  };
  const handleClearMessages = async () => {
    createChatId();
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 flex flex-col">
        {activeTab === 'home' && (
          <ChatInterface
            messages={messages}
            inputMessage={inputMessage}
            setInputMessage={setInputMessage}
            handleSendMessage={handleSendMessage}
            handleClearMessages={handleClearMessages}
          />
        )}
        {activeTab === 'materials' && (
          <MaterialsExplorer
            materials={materials}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        )}
        {activeTab === 'repository' && <RepositoryView />}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ApiProvider>
      <Dashboard />
    </ApiProvider>
  );
};

export default App;
