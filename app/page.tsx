import { ChatInterface } from '@/components/chat-interface';
import { Toaster } from '@/components/ui/toaster';

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-transparent flex items-center justify-center p-4">
      <div className="w-full max-w-6xl h-[calc(100vh-2rem)] bg-[var(--chat-card-bg)] backdrop-blur rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        <header className="sticky top-0 z-30 bg-[var(--chat-card-bg)]/90 backdrop-blur border-b border-[rgba(255,255,255,0.08)] px-6 py-4 flex-shrink-0">
          <h1 className="text-4xl font-bold text-white text-center">Gemini AI Chatbot</h1>
        </header>
        <main className="flex-1 overflow-hidden">
          <ChatInterface />
        </main>
      </div>
      <Toaster/>
    </div>
  );
}