import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import Message from './Message';
import { SendIcon, SparklesIcon, MenuIcon } from './Icons';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  onToggleSidebar: () => void;
  error?: string | null;
}

const TypingIndicator = () => (
  <div className="flex items-start gap-2 my-2 sm:my-3 sm:gap-3"> {/* Tighter mobile gap */}
    <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-brand-surface flex items-center justify-center text-brand-cyan ring-2 ring-white/10">
      <SparklesIcon className="w-4 h-4 sm:w-6 sm:h-6" />
    </div>
    <div className="w-full max-w-[90vw] p-2.5 sm:p-4 rounded-2xl shadow-lg bg-brand-surface text-brand-light rounded-tl-none border border-white/10 chat-bubble overflow-wrap-anywhere"> {/* Added overflow-wrap, tighter mobile p */}
      <div className="flex items-center space-x-1.5"> {/* Tighter dots */}
        <div className="w-1.5 h-1.5 bg-brand-gray rounded-full animate-pulse delay-75"></div>
        <div className="w-1.5 h-1.5 bg-brand-gray rounded-full animate-pulse delay-150"></div>
        <div className="w-1.5 h-1.5 bg-brand-gray rounded-full animate-pulse delay-300"></div>
      </div>
    </div>
  </div>
);

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  onSendMessage,
  isLoading,
  onToggleSidebar,
  error,
}) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleSubmit(e as any);
    }
  };

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center h-48 px-2 sm:h-64 sm:px-4 text-center text-brand-gray hyphens-auto overflow-wrap-anywhere"> {/* Shorter mobile height, added overflow-wrap */}
      <SparklesIcon className="w-8 h-8 sm:w-12 sm:h-12 mb-3 sm:mb-4 text-brand-cyan" />
      <h2 className="text-base sm:text-lg font-semibold text-brand-light mb-1.5 sm:mb-2 leading-relaxed"> {/* Tighter mb */}
        Welcome to AI Resume Assistant!
      </h2>
      <p className="max-w-[calc(100vw-2rem)] sm:max-w-md text-xs sm:text-sm leading-relaxed hyphens-auto chat-bubble break-words"> {/* Viewport-aware max-w for mobile */}
        Ask me anything about Sumit's skills, projects, or experience. e.g., "What's your experience with Flask?"
      </p>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col bg-transparent min-h-0">
      {/* Header: Better wrapping + no zoom on focus */}
      <header className="px-2 py-1.5 sm:px-3 sm:py-2 sm:p-4 border-b border-brand-pink/20 backdrop-blur-sm flex items-center gap-2 sm:gap-3">
        <button
          onClick={onToggleSidebar}
          className="text-brand-gray hover:text-brand-light lg:hidden flex-shrink-0 p-1"
          aria-label="Open sidebar"
        >
          <MenuIcon className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
        <div className="min-w-0 flex-1 hyphens-auto overflow-wrap-anywhere"> {/* Added overflow-wrap */}
          <h1 className="text-base sm:text-lg lg:text-xl font-bold text-brand-light truncate">AI Resume Assistant</h1>
          <p className="text-xs sm:text-sm text-brand-gray line-clamp-2 break-words leading-relaxed hyphens-auto chat-bubble max-w-full"> {/* max-w-full to force wrap */}
            Ask me anything about Sumit's skills, projects, or experience.
          </p>
        </div>
      </header>

      <div
        className="flex-1 overflow-y-auto px-2 py-1.5 sm:px-4 sm:py-3 lg:px-6 lg:py-4 space-y-2 sm:space-y-4 lg:space-y-6" // Even tighter mobile py/space-y
        role="log"
        aria-live="polite"
        aria-label="Chat messages"
      >
        {messages.length === 0 ? (
          renderEmptyState()
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`${msg.role === 'user' ? 'flex justify-end' : 'flex justify-start'} items-start`}
            >
              <Message message={msg} />
            </div>
          ))
        )}
        {isLoading && messages[messages.length - 1]?.role === 'user' && <TypingIndicator />}
        {error && (
          <div className="flex justify-center px-2">
            <div className="w-full max-w-[90vw] p-2.5 sm:p-4 rounded-2xl bg-brand-pink/20 text-brand-light border border-brand-pink/30 text-xs sm:text-sm chat-bubble hyphens-auto"> {/* Tighter p, added hyphens */}
              {error}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input: Better mobile touch targets + wrapping */}
      <div className="px-2 py-1.5 sm:px-3 sm:py-2 sm:p-4 border-t border-brand-pink/20">
        <form onSubmit={handleSubmit} className="flex items-end space-x-1.5 sm:space-x-3"> {/* Tighter x on mobile */}
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g., What's your experience with Flask?"
            className="flex-1 bg-brand-surface text-brand-light px-3 py-2.5 sm:px-4 sm:py-3 rounded-full border border-white/20 focus:outline-none focus:ring-2 focus:ring-brand-pink transition-all text-sm break-words min-h-[40px] max-h-[80px] resize-none hyphens-auto chat-bubble overflow-wrap-anywhere [font-size-adjust:0.5]" // Tighter py, iOS zoom fix, overflow-wrap
            disabled={isLoading}
            aria-label="Type your message"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="flex-shrink-0 bg-gradient-to-r from-brand-pink to-brand-cyan text-white rounded-full p-2.5 sm:p-3 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 transition-all duration-200 min-h-[40px] min-w-[40px] flex items-center justify-center" // Tighter p for mobile
            aria-label="Send message"
          >
            <SendIcon className="w-4 h-4 sm:w-6 sm:h-6" /> {/* Slightly smaller icon on mobile */}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
