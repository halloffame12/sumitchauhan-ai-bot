
import React, { useState, useEffect, useRef } from 'react';
import type { Chat } from '@google/genai';
import Sidebar from './components/Sidebar';
import ChatInterface from './components/ChatInterface';
import type { ChatMessage } from './types';
import { startChat, sendMessageStream } from './services/geminiService';

const App: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const chatRef = useRef<Chat | null>(null);

  useEffect(() => {
    // Initialize chat and set welcome message on component mount
    try {
      chatRef.current = startChat();
      setMessages([
        {
          id: 'init-message',
          role: 'assistant',
          content: "Hello! I'm an AI assistant representing Sumit Chauhan. I'm here to help answer any questions you might have about his professional experience, skills, and projects, based strictly on the resume provided.\n\nPlease feel free to ask me anything!",
        },
      ]);
    } catch (e) {
      const err = e as Error;
      setError(`Initialization failed: ${err.message}`);
      console.error(e);
    }
  }, []);

  useEffect(() => {
    if (error) {
        const timer = setTimeout(() => setError(null), 5000);
        return () => clearTimeout(timer);
    }
  }, [error]);

  const handleSendMessage = async (messageText: string) => {
    if (!chatRef.current) {
        setError("Chat is not initialized.");
        return;
    }

    setIsLoading(true);
    setError(null);

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: messageText,
    };
    
    setMessages(prev => [...prev, userMessage]);

    try {
      const stream = await sendMessageStream(chatRef.current, messageText);
      
      let assistantResponse = '';
      const assistantMessageId = `assistant-${Date.now()}`;
      
      // Add a placeholder for the assistant's message
      setMessages(prev => [...prev, { id: assistantMessageId, role: 'assistant', content: '' }]);

      for await (const chunk of stream) {
        assistantResponse += chunk.text;
        setMessages(prev => 
          prev.map(msg => 
            msg.id === assistantMessageId ? { ...msg, content: assistantResponse } : msg
          )
        );
      }

    } catch (e) {
      const err = e as Error;
      setError(err.message);
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: `Sorry, I encountered an error: ${err.message}. Please try again.`,
      };
      // Replace the placeholder with the error message
      setMessages(prev => prev.slice(0, -1).concat(errorMessage));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col lg:flex-row h-screen font-sans bg-brand-dark antialiased overflow-hidden">
        <div className="aurora-bg"></div>
        {error && (
            <div className="absolute top-4 right-4 bg-red-500/90 text-white p-3 rounded-lg shadow-lg text-sm z-50 animate-pulse">
                <strong>Error:</strong> {error}
            </div>
        )}
      <Sidebar 
        onPromptSelect={handleSendMessage} 
        isLoading={isLoading}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      <main className="flex-1 flex flex-col min-h-0 z-10">
        <ChatInterface 
          messages={messages} 
          onSendMessage={handleSendMessage} 
          isLoading={isLoading} 
          onToggleSidebar={() => setIsSidebarOpen(true)}
        />
      </main>
    </div>
  );
};

export default App;