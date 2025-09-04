
import React from 'react';
import { ChatMessage } from '../types';
import { UserIcon, SparklesIcon } from './Icons';
import { marked } from 'marked';

interface MessageProps {
  message: ChatMessage;
}

// Basic markdown setup for security and formatting
marked.setOptions({
  breaks: true,
  gfm: true,
});

const renderer = new marked.Renderer();
// FIX: The signature for the link renderer has changed in newer versions of `marked`.
// It now receives a single token object instead of separate arguments.
renderer.link = ({ href, title, text }: any) => {
  return `<a href="${href}" target="_blank" rel="noopener noreferrer" title="${title || ''}" class="text-brand-cyan hover:underline">${text}</a>`;
};

const Message: React.FC<MessageProps> = ({ message }) => {
  const { role, content } = message;
  const isAssistant = role === 'assistant';

  const formattedContent = marked(content, { renderer });

  return (
    <div className={`flex items-start gap-4 animate-fade-in-up`}>
      {isAssistant && (
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-brand-surface flex items-center justify-center text-brand-cyan ring-2 ring-white/10">
          <SparklesIcon className="w-6 h-6" />
        </div>
      )}

      <div className={`max-w-xl p-4 rounded-2xl ${
        isAssistant 
          ? 'bg-brand-surface text-brand-light rounded-tl-none border border-white/10 shadow-[0_4px_15px_rgba(0,255,255,0.15)]' 
          : 'bg-gradient-to-br from-brand-pink to-brand-cyan text-white font-medium rounded-bl-none shadow-[0_4px_15px_rgba(217,0,255,0.2)]'
      }`}>
        <div 
          className="prose prose-invert max-w-none prose-p:my-2 prose-li:my-1 prose-strong:text-white"
          dangerouslySetInnerHTML={{ __html: formattedContent }}
        />
      </div>
      
      {!isAssistant && (
         <div className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-600 flex items-center justify-center text-brand-light ring-2 ring-white/10">
          <UserIcon className="w-6 h-6" />
        </div>
      )}
    </div>
  );
};

export default Message;