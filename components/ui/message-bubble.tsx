import { Message } from "@/lib/types";
import ReactMarkdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { CopyButton } from "./copy-button";

interface MessageBubbleProps {
  message: Message;
}

const markdownComponents: Components = {
  code: ({ className, children, ...props }) => {
    const match = /language-(\w+)/.exec(className || "");
    return match ? (
      <SyntaxHighlighter
        style={oneDark}
        language={match[1]}
        PreTag="div"
        customStyle={{ borderRadius: "0.5rem", fontSize: "0.95em", margin: 0 }}
        {...props}
      >
        {String(children).replace(/\n$/, "")}
      </SyntaxHighlighter>
    ) : (
      <code
        className="bg-muted-foreground/10 px-1.5 py-0.5 rounded text-sm"
        {...props}
      >
        {children}
      </code>
    );
  },
  a: ({ children, ...props }) => (
    <a
      className="text-primary underline underline-offset-4 break-all"
      {...props}
    >
      {children}
    </a>
  ),
  ul: ({ children, ...props }) => (
    <ul className="list-disc list-outside pl-6 space-y-1 text-left" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }) => (
    <ol
      className="list-decimal list-outside pl-6 space-y-1 text-left"
      {...props}
    >
      {children}
    </ol>
  ),
  li: ({ children, ...props }) => (
    <li className="text-left" {...props}>
      {children}
    </li>
  ),
  blockquote: ({ children, ...props }) => (
    <blockquote
      className="border-l-4 border-muted-foreground/20 pl-4 italic my-2"
      {...props}
    >
      {children}
    </blockquote>
  ),
  p: ({ children, ...props }) => (
    <p className="mb-2 last:mb-0 text-left" {...props}>
      {children}
    </p>
  ),
};

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className="group relative max-w-[90%]">
        <div
          className={`rounded-2xl px-6 py-3 text-base break-words transition-colors mt-2
            ${
              isUser
                ? "bg-[var(--chat-user-bubble)] self-end border border-[var(--chat-user-bubble-border)] text-[#22223b] dark:text-foreground"
                : "bg-[var(--chat-bot-bubble)] text-foreground border border-[var(--chat-bot-bubble-border)]"
            }`}
        >
          {isUser ? (
            message.content
          ) : (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={markdownComponents}
            >
              {message.content}
            </ReactMarkdown>
          )}
        </div>
        {!isUser && (
          <div className="absolute right-0 bottom--12">
            <CopyButton text={message.content} />
          </div>
        )}
      </div>
    </div>
  );
}
