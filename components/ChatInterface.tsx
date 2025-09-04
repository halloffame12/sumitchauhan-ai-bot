
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import Message from './Message';
import { SendIcon, SparklesIcon, MenuIcon } from './Icons';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  onToggleSidebar: () => void;
}

const TypingIndicator = () => (
    <div className="flex items-start gap-4 my-4">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-brand-surface flex items-center justify-center text-brand-cyan ring-2 ring-white/10">
          <SparklesIcon className="w-6 h-6" />
        </div>
        <div className="max-w-xl p-4 rounded-2xl shadow-lg bg-brand-surface text-brand-light rounded-tl-none border border-white/10">
            <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-brand-gray rounded-full animate-pulse delay-75"></div>
                <div className="w-2 h-2 bg-brand-gray rounded-full animate-pulse delay-150"></div>
                <div className="w-2 h-2 bg-brand-gray rounded-full animate-pulse delay-300"></div>
            </div>
        </div>
    </div>
);


const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, onSendMessage, isLoading, onToggleSidebar }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-transparent min-h-0">
      <header className="p-4 border-b border-brand-pink/20 backdrop-blur-sm flex items-center gap-4">
        <button onClick={onToggleSidebar} className="text-brand-gray hover:text-brand-light lg:hidden" aria-label="Open sidebar">
          <MenuIcon />
        </button>
        <div>
          <h1 className="text-lg lg:text-xl font-bold text-brand-light">AI Resume Assistant</h1>
          <p className="text-sm text-brand-gray">Ask me anything about Sumit's skills, projects, or experience.</p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-6">
        {messages.map((msg) => (
           <div key={msg.id} className={`${msg.role === 'user' ? 'flex justify-end' : 'flex justify-start'}`}>
            <Message message={msg} />
           </div>
        ))}
        {isLoading && messages[messages.length - 1]?.role === 'user' && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 border-t border-brand-pink/20">
        <form onSubmit={handleSubmit} className="flex items-center space-x-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g., What's your experience with Flask?"
            className="flex-1 bg-brand-surface text-brand-light px-5 py-3 rounded-full border border-white/20 focus:outline-none focus:ring-2 focus:ring-brand-pink transition-all"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-gradient-to-r from-brand-pink to-brand-cyan text-white rounded-full p-3 hover:scale-110 active:scale-100 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 transition-all duration-200"
            aria-label="Send message"
          >
            <SendIcon className="w-6 h-6" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;