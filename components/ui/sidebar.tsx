import { Button } from "./button";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Chat } from "@/lib/types";

interface SidebarProps {
  onChatSelect: (chatId: string | null) => void;
  currentChatId: string | null;
  chats: Chat[];
  onDeleteChat: (chatId: string) => void;
}

export function Sidebar({
  onChatSelect,
  currentChatId,
  chats,
  onDeleteChat,
}: Readonly<SidebarProps>) {
  return (
    <div className="w-64 h-full bg-[var(--chat-sidebar-bg)] border-r border-[var(--chat-sidebar-border)] flex flex-col relative z-30">
      <div className="p-4">
        <Button
          onClick={() => onChatSelect(null)}
          className="w-full justify-start gap-2"
          variant="outline"
        >
          <PlusIcon className="h-4 w-4" />
          New Chat
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto px-2">
        {chats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => onChatSelect(chat.id)}
            className={`flex items-center justify-between p-2 rounded-lg cursor-pointer hover:bg-[rgba(255,255,255,0.08)] ${
              currentChatId === chat.id ? "bg-[rgba(255,255,255,0.08)]" : ""
            }`}
          >
            <span className="truncate flex-1">{chat.title}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteChat(chat.id);
              }}
            >
              <TrashIcon className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
