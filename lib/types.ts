export type Message = {
  id: string;
  content: string;
  role: "user" | "assistant";
  createdAt: Date;
  pending?: boolean;
  failed?: boolean;
};

export type ChatRequest = {
  messages: Message[];
};

export type ChatResponse = {
  message: Message;
  chatTitle?: string;
};

export type Chat = {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
};
