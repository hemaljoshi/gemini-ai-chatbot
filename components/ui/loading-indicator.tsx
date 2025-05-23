export function LoadingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="bg-[var(--chat-bot-bubble)] rounded-2xl px-4 py-4">
        <div className="flex space-x-2">
          <div className="w-2 h-2 bg-white rounded-full animate-bounce" />
          <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-100" />
          <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-200" />
        </div>
      </div>
    </div>
  );
} 