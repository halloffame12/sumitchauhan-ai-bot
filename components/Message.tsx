import React, { useMemo } from 'react';
import { ChatMessage } from '../types';
import { UserIcon, SparklesIcon } from './Icons';
import { marked } from 'marked';
// New: For XSS sanitization (npm install dompurify)
import DOMPurify from 'dompurify';

interface MessageProps {
  message: ChatMessage;
  // New: Optional timestamp or metadata if expanding
  timestamp?: string;
}

const Message: React.FC<MessageProps> = React.memo(({ message, timestamp }) => {
  const { role, content } = message;
  const isAssistant = role === 'assistant';

  // Markdown setup (move to a utils file if shared)
  marked.setOptions({
    breaks: true,
    gfm: true,
  });
  const renderer = new marked.Renderer();
  renderer.link = ({ href, title, text }: any) => {
    return `<a href="${href}" target="_blank" rel="noopener noreferrer" title="${title || ''}" class="text-brand-cyan hover:underline">${text}</a>`;
  };

  // New: Memoize parsing + sanitization
  const formattedContent = useMemo(() => {
    if (!content?.trim()) {
      return '<p>...</p>'; // New: Empty state fallback
    }
    const rawHtml = marked(content, { renderer });
    return DOMPurify.sanitize(rawHtml); // Sanitize for security
  }, [content]);

  return (
    <div className="flex items-start gap-4 animate-fade-in-up">
      {isAssistant && (
        <div
          className="flex-shrink-0 w-10 h-10 rounded-full bg-brand-surface flex items-center justify-center text-brand-cyan ring-2 ring-white/10"
          role="img"
          aria-label="Assistant avatar"
        >
          <SparklesIcon className="w-6 h-6" />
        </div>
      )}
      <div
        className={`max-w-xl p-4 rounded-2xl ${
          isAssistant
            ? 'bg-brand-surface text-brand-light rounded-tl-none border border-white/10 shadow-[0_4px_15px_rgba(0,255,255,0.15)]'
            : 'bg-gradient-to-br from-brand-pink to-brand-cyan text-white font-medium rounded-bl-none shadow-[0_4px_15px_rgba(217,0,255,0.2)]'
        }`}
      >
        <div
          className="prose prose-invert max-w-none prose-p:my-2 prose-li:my-1 prose-strong:text-white"
          dangerouslySetInnerHTML={{ __html: formattedContent }}
        />
        {/* New: Optional timestamp */}
        {timestamp && (
          <p className={`text-xs mt-2 ${
            isAssistant ? 'text-brand-gray' : 'text-white/70'
          }`}>
            {timestamp}
          </p>
        )}
      </div>
      {!isAssistant && (
        <div
          className="flex-shrink-0 w-10 h-10 rounded-full bg-brand-pink flex items-center justify-center text-white ring-2 ring-white/10" // Fixed: Consistent theme
          role="img"
          aria-label="User avatar"
        >
          <UserIcon className="w-6 h-6" />
        </div>
      )}
    </div>
  );
});

Message.displayName = 'Message'; // For debugging

export default Message;
