
import React from 'react';
import { MapPin, MessageCircle } from 'lucide-react';
import { Message } from '@/types/chat';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.sender === 'user';
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom duration-300`}>
      <div className={`max-w-[80%] ${isUser ? 'order-2' : 'order-1'}`}>
        <div
          className={`p-4 rounded-2xl ${
            isUser
              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white ml-4'
              : 'bg-white border border-blue-100 mr-4 shadow-sm'
          }`}
        >
          {!isUser && message.isTravel && (
            <div className="flex items-center gap-2 mb-2 text-blue-600">
              <MapPin className="w-4 h-4" />
              <span className="text-xs font-medium">Travel Planning Mode</span>
            </div>
          )}
          
          <div className={`whitespace-pre-wrap ${isUser ? 'text-white' : 'text-gray-800'}`}>
            {message.content}
          </div>
          
          <div className={`text-xs mt-2 ${isUser ? 'text-blue-100' : 'text-gray-500'}`}>
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
      
      <div className={`flex-shrink-0 ${isUser ? 'order-1' : 'order-2'}`}>
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center ${
            isUser
              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
              : 'bg-gradient-to-r from-green-400 to-blue-500 text-white'
          }`}
        >
          {isUser ? (
            <span className="text-sm font-medium">U</span>
          ) : (
            <MessageCircle className="w-4 h-4" />
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
