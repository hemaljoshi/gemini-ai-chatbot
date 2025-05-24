import { useState, useEffect, useMemo } from 'react';
import { Chat, Message } from '@/lib/types';

const STORAGE_KEY = 'gemini-chat-history';

type StoredChat = Omit<Chat, 'createdAt' | 'updatedAt' | 'messages'> & {
  createdAt: string;
  updatedAt: string;
  messages: Array<Omit<Message, 'createdAt'> & { createdAt: string }>;
};

const generateChatId = () => {
  // Use a more stable ID generation that won't cause hydration issues
  return `chat-${Math.random().toString(36).substr(2, 9)}`;
};

const parseStoredChats = (storedChats: StoredChat[]): Chat[] => {
  return storedChats.map((chat) => ({
    ...chat,
    createdAt: new Date(chat.createdAt),
    updatedAt: new Date(chat.updatedAt),
    messages: chat.messages.map((msg) => ({
      ...msg,
      createdAt: new Date(msg.createdAt),
    })),
  }));
};

export function useChatHistory() {
  const [mounted, setMounted] = useState(false);
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);

  const sortedChats = useMemo(() => 
    [...chats].sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()),
    [chats]
  );

  // Initialize on client-side only
  useEffect(() => {
    setMounted(true);
    const storedChats = localStorage.getItem(STORAGE_KEY);
    if (storedChats) {
      setChats(parseStoredChats(JSON.parse(storedChats)));
    }
  }, []);

  // Only save to localStorage when mounted
  useEffect(() => {
    if (mounted) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(chats));
    }
  }, [chats, mounted]);

  const createNewChat = () => setCurrentChatId(null);

  const addMessageToCurrentChat = (message: Message, chatTitle?: string) => {
    if (!currentChatId) return;

    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === currentChatId
          ? {
              ...chat,
              messages: [...chat.messages, message],
              updatedAt: new Date(),
              ...(chatTitle && { title: chatTitle }),
            }
          : chat
      )
    );
  };

  const createChatWithFirstMessages = (
    userMessage: Message,
    assistantMessage: Message | null,
    chatTitle: string
  ) => {
    const messages = assistantMessage ? [userMessage, assistantMessage] : [userMessage];
    const newChat: Chat = {
      id: generateChatId(),
      title: chatTitle,
      messages,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setChats((prevChats) => [...prevChats, newChat]);
    setCurrentChatId(newChat.id);
  };

  const getCurrentChat = () => chats.find((chat) => chat.id === currentChatId);

  const deleteChat = (chatId: string) => {
    setChats((prevChats) => prevChats.filter((chat) => chat.id !== chatId));
    if (currentChatId === chatId) {
      setCurrentChatId(null);
    }
  };

  return {
    chats: sortedChats,
    currentChatId,
    setCurrentChatId,
    createNewChat,
    addMessageToCurrentChat,
    createChatWithFirstMessages,
    getCurrentChat,
    deleteChat,
  };
} 