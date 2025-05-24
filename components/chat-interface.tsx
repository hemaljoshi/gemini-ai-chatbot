"use client";

import { useState, useRef, useEffect } from "react";
import { Message } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { MessageBubble } from "@/components/ui/message-bubble";
import { LoadingIndicator } from "@/components/ui/loading-indicator";
import { ChatInput } from "@/components/ui/chat-input";
import { EmptyState } from "@/components/ui/empty-state";
import { Sidebar } from "@/components/ui/sidebar";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { Button } from "./ui/button";
import { ThemeToggle } from "./ui/theme-toggle";

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    const scrollToBottom = () => {
      if (scrollRef.current) {
        requestAnimationFrame(() => {
          scrollRef.current?.scrollTo({
            top: scrollRef.current.scrollHeight,
            behavior: "smooth",
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
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      content: input.trim(),
      role: "user",
      createdAt: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.details || data.error || "Failed to get response");
      }

      setMessages((prev) => [...prev, data.message]);
    } catch (error) {
      console.error("Chat error:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to get response from AI. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChatSelect = (chatId: string | null) => {
    setCurrentChatId(chatId);
    setIsSidebarOpen(false); // Close sidebar on mobile after chat selection
  };

  return (
    <div className="flex flex-col h-full w-full min-h-[calc(100vh-2rem)] relative">
      {/* Header (spans full width) */}
      <header className="sticky top-0 z-30 bg-[var(--chat-card-bg)]/90 backdrop-blur border-b border-[var(--chat-sidebar-border)] px-4 py-4 flex items-center justify-between flex-shrink-0 w-full">
        {/* Menu Button (mobile only) */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden mr-2"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <Bars3Icon className="h-6 w-6" />
        </Button>
        {/* Title (centered) */}
        <h1 className="text-2xl font-bold text-foreground text-center flex-1">
          Gemini AI Chatbot
        </h1>
        {/* Dark Mode Button (right) */}
        <ThemeToggle />
      </header>

      {/* Main content: sidebar + chat area */}
      <div className="flex flex-1 min-h-0">
        {/* Desktop Sidebar (column) */}
        <div className="hidden lg:block h-full">
          <Sidebar
            currentChatId={currentChatId}
            onChatSelect={handleChatSelect}
          />
        </div>

        {/* Chat Area */}
        <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
          <main className="flex-1 min-h-0 overflow-hidden">
            <div
              ref={scrollRef}
              className="flex-1 px-2 sm:px-4 py-4 h-full overflow-y-auto"
            >
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
          </main>
          <div className="sticky bottom-0 left-0 right-0 z-20 bg-[var(--chat-card-bg)]/90 backdrop-blur border-t border-[rgba(255,255,255,0.08)] px-4 pt-4 pb-4">
            <ChatInput
              input={input}
              isLoading={isLoading}
              onInputChange={setInput}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      </div>

      {/* Mobile Sidebar (overlay) */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-30 flex lg:hidden">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setIsSidebarOpen(false)}
          />
          {/* Sidebar */}
          <div className="relative z-40 w-64 h-full">
            <Sidebar
              currentChatId={currentChatId}
              onChatSelect={handleChatSelect}
            />
          </div>
        </div>
      )}
    </div>
  );
}
