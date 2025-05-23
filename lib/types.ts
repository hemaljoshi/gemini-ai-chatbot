export type Message = {
  id: string;
  content: string;
  role: "user" | "assistant";
  createdAt: Date;
};

export type ChatRequest = {
  messages: Message[];
};

export type ChatResponse = {
  message: Message;
};
