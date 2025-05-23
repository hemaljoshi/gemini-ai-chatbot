"use client"

import { useState, useRef, useEffect } from 'react';
import { Message } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { MessageBubble } from '@/components/ui/message-bubble';
import { LoadingIndicator } from '@/components/ui/loading-indicator';
import { ChatInput } from '@/components/ui/chat-input';
import { EmptyState } from '@/components/ui/empty-state';

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    const scrollToBottom = () => {
      if (scrollRef.current) {
        requestAnimationFrame(() => {
          scrollRef.current?.scrollTo({
            top: scrollRef.current.scrollHeight,
            behavior: 'smooth'
          });
        });
      }
    };

    scrollToBottom();
    const timeoutId = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timeoutId);
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      content: input.trim(),
      role: 'user',
      createdAt: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.details || data.error || 'Failed to get response');
      }

      setMessages((prev) => [...prev, data.message]);
    } catch (error) {
      console.error('Chat error:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to get response from AI. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full min-h-[calc(100vh-200px)]">
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-2 sm:px-4 py-4">
        {messages.length === 0 && !isLoading ? (
          <EmptyState />
        ) : (
          <div className="space-y-6 pb-2">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            {isLoading && <LoadingIndicator />}
          </div>
        )}
      </div>
      <div className="sticky bottom-0 left-0 right-0 z-20 bg-[var(--chat-card-bg)]/90 backdrop-blur border-t border-[rgba(255,255,255,0.08)] px-4 pt-4 pb-4">
        <ChatInput
          input={input}
          isLoading={isLoading}
          onInputChange={setInput}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}