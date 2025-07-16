import React from 'react';
import { Send, User, Bot } from 'lucide-react';
import { Message } from '../types';

interface ChatInterfaceProps {
  messages: Message[];
  inputMessage: string;
  setInputMessage: (message: string) => void;
  handleSendMessage: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, inputMessage, setInputMessage, handleSendMessage }) => {
  return (
    <>
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-3xl mx-auto">
          {messages.map((message) => (
            <div key={message.id} className={`mb-4 flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex gap-3 max-w-[70%] ${message.type === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  message.type === 'user' ? 'bg-blue-600' : 'bg-gray-200'
                }`}>
                  {message.type === 'user' ? <User className="w-6 h-6 text-white" /> : <Bot className="w-6 h-6 text-gray-600" />}
                </div>
                <div className={`rounded-lg px-4 py-3 ${
                  message.type === 'user' ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200'
                }`}>
                  {message.content}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="border-t border-gray-200 p-4">
        <div className="max-w-3xl mx-auto flex gap-3">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask Atlas anything..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSendMessage}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Send className="w-5 h-5" />
            Send
          </button>
        </div>
      </div>
    </>
  );
};

export default ChatInterface;
