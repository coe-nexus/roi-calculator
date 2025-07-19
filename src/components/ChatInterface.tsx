import React from 'react';
import { Send, User, Bot, Trash } from 'lucide-react';
import { Message } from '../types';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ChatInterfaceProps {
  messages: Message[];
  inputMessage: string;
  setInputMessage: (message: string) => void;
  handleSendMessage: () => void;
  handleClearMessages: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, inputMessage, setInputMessage, handleSendMessage, handleClearMessages }) => {
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
                  <div className="prose prose-sm max-w-none">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                      h1: ({children}) => <h1 className="text-2xl font-bold mb-4">{children}</h1>,
                      h2: ({children}) => <h2 className="text-xl font-bold mb-3">{children}</h2>,
                      h3: ({children}) => <h3 className="text-lg font-bold mb-2">{children}</h3>,
                      p: ({children}) => <p className="mb-2">{children}</p>,
                      ul: ({children}) => <ul className="list-disc list-inside mb-2">{children}</ul>,
                      ol: ({children}) => <ol className="list-decimal list-inside mb-2">{children}</ol>,
                      li: ({children}) => <li className="mb-1">{children}</li>,
                      table: ({children}) => (
                        <div className="overflow-x-auto mb-4">
                          <table className="min-w-full border-collapse border border-gray-300">{children}</table>
                        </div>
                      ),
                      thead: ({children}) => <thead className="bg-gray-100">{children}</thead>,
                      tbody: ({children}) => <tbody>{children}</tbody>,
                      tr: ({children}) => <tr className="border-b border-gray-300">{children}</tr>,
                      th: ({children}) => <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-sm">{children}</th>,
                      td: ({children}) => <td className="border border-gray-300 px-3 py-2 text-sm">{children}</td>,
                      code: ({inline, children}) => 
                        inline ? 
                        <code className="bg-gray-100 px-1 py-0.5 rounded text-sm">{children}</code> :
                        <pre className="bg-gray-100 p-3 rounded overflow-x-auto mb-2"><code>{children}</code></pre>,
                      blockquote: ({children}) => <blockquote className="border-l-4 border-gray-300 pl-4 italic mb-2">{children}</blockquote>,
                      a: ({href, children}) => <a href={href} className="text-blue-500 hover:underline">{children}</a>,
                      strong: ({children}) => <strong className="font-bold">{children}</strong>,
                      em: ({children}) => <em className="italic">{children}</em>,
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                  </div>
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
          <button
            onClick={handleClearMessages}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Trash className="w-5 h-5" />
            Clear
          </button>
        </div>
      </div>
    </>
  );
};
export default ChatInterface;
