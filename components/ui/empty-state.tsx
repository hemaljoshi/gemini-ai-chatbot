export function EmptyState() {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="text-center text-gray-400">
        <div className="mb-4">
          <svg
            className="mx-auto h-12 w-12 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-300 mb-2">Start a conversation</h3>
        <p className="text-sm text-gray-500">Type a message below to get started</p>
      </div>
    </div>
  );
} 