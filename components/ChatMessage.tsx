import React from 'react';

interface ChatMessageProps {
  content: string;
  isUser?: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ content, isUser = false }) => {
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[80%] p-4 rounded-lg backdrop-blur-md ${
        isUser ? 'bg-white/10' : 'bg-white/5'
      }`}>
        <p className="text-white">{content}</p>
      </div>
    </div>
  );
};

export default ChatMessage