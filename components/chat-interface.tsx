"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { Message } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { useChatHistory } from "@/hooks/use-chat-history";
import { MessageBubble } from "@/components/ui/message-bubble";
import { LoadingIndicator } from "@/components/ui/loading-indicator";
import { ChatInput } from "@/components/ui/chat-input";
import { EmptyState } from "@/components/ui/empty-state";
import { Sidebar } from "@/components/ui/sidebar";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { Button } from "./ui/button";
import { ThemeToggle } from "./ui/theme-toggle";

const generateMessageId = () => {
  // Use a more stable ID generation that won't cause hydration issues
  return `msg-${Math.random().toString(36).substring(2, 11)}`;
};

export function ChatInterface() {
  const [mounted, setMounted] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [optimisticMessages, setOptimisticMessages] = useState<Message[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const {
    chats,
    currentChatId,
    setCurrentChatId,
    createNewChat,
    addMessageToCurrentChat,
    createChatWithFirstMessages,
    getCurrentChat,
    deleteChat,
  } = useChatHistory();

  const currentChat = getCurrentChat();
  const messages = useMemo(() => currentChat?.messages || [], [currentChat]);

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      requestAnimationFrame(() => {
        scrollRef.current?.scrollTo({
          top: scrollRef.current.scrollHeight,
          behavior: "smooth",
        });
      });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
    const timeoutId = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timeoutId);
  }, [messages, isLoading, optimisticMessages, scrollToBottom]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: generateMessageId(),
      content: input.trim(),
      role: "user",
      createdAt: new Date(),
    };

    setInput("");
    setIsLoading(true);

    const isFirstMessage = !currentChatId;
    let previousMessages = messages;

    if (isFirstMessage) {
      setOptimisticMessages([userMessage]);
    } else {
      addMessageToCurrentChat(userMessage);
      previousMessages = [...messages, userMessage];
    }

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            ...previousMessages,
            ...(isFirstMessage ? [userMessage] : []),
          ],
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("No response stream available");
      }

      let accumulatedData = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // Convert the chunk to text and accumulate it
        const chunk = new TextDecoder().decode(value);
        accumulatedData += chunk;

        try {
          // Try to parse the accumulated data as JSON
          const data = JSON.parse(accumulatedData);

          if (isFirstMessage) {
            setOptimisticMessages([]);
            createChatWithFirstMessages(
              userMessage,
              data.message,
              data.chatTitle ?? "New Chat"
            );
          } else {
            addMessageToCurrentChat(data.message, data.chatTitle);
          }
          break; // Exit the loop once we have the complete response
        } catch {
          // If parsing fails, continue accumulating data
          continue;
        }
      }
    } catch (error) {
      if (isFirstMessage) {
        setOptimisticMessages([{ ...userMessage, failed: true }]);
      }
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
    if (chatId === null) {
      createNewChat();
    } else {
      setCurrentChatId(chatId);
    }
    setIsSidebarOpen(false);
  };

  const handleDeleteChat = (chatId: string) => {
    deleteChat(chatId);
    toast({
      title: "Chat deleted",
      description: "The chat has been deleted successfully.",
    });
  };

  const renderMessages = () => {
    if (
      messages.length === 0 &&
      !isLoading &&
      optimisticMessages.length === 0
    ) {
      return <EmptyState />;
    }

    return (
      <div className="space-y-6 pb-2">
        {optimisticMessages.map((message) => (
          <div key={message.id}>
            <MessageBubble message={message} />
            {message.failed && (
              <div className="text-red-500 text-sm mt-1 ml-2">
                Failed to send. This message will not be saved.
              </div>
            )}
          </div>
        ))}
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        {isLoading && <LoadingIndicator />}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full w-full min-h-[calc(100vh-2rem)] relative">
      <header className="sticky top-0 z-30 bg-[var(--chat-card-bg)]/90 backdrop-blur border-b border-[var(--chat-sidebar-border)] px-4 py-4 flex items-center justify-between flex-shrink-0 w-full">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden mr-2"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <Bars3Icon className="h-6 w-6" />
        </Button>
        <h1 className="text-2xl font-bold text-foreground text-center flex-1">
          Gemini AI Chatbot
        </h1>
        <ThemeToggle />
      </header>

      <div className="flex flex-1 min-h-0">
        <div className="hidden lg:block h-full">
          <Sidebar
            chats={chats}
            currentChatId={currentChatId}
            onChatSelect={handleChatSelect}
            onDeleteChat={handleDeleteChat}
          />
        </div>

        <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
          <main className="flex-1 min-h-0 overflow-hidden">
            <div
              ref={scrollRef}
              className="flex-1 px-2 sm:px-4 py-4 h-full overflow-y-auto"
            >
              {renderMessages()}
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

      {isSidebarOpen && (
        <div className="fixed inset-0 z-30 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setIsSidebarOpen(false)}
          />
          <div className="relative z-40 w-64 h-full">
            <Sidebar
              chats={chats}
              currentChatId={currentChatId}
              onChatSelect={handleChatSelect}
              onDeleteChat={handleDeleteChat}
            />
          </div>
        </div>
      )}
    </div>
  );
}
