# Gemini AI Chatbot

A modern, responsive chatbot interface built with Next.js 14 and Google's Gemini AI API. This project features real-time streaming responses, a clean UI using Shadcn components, and a fully responsive design.

## Features

- 🎨 Modern UI with Shadcn components
- 💬 Real-time chat interface
- ⚡ Streaming responses
- 📱 Fully responsive design
- 🎯 Error handling with toast notifications
- 🔄 Auto-scrolling chat
- ⌨️ Loading states and animations

## Prerequisites

- Node.js 18+ and npm
- Google Gemini API key

## Getting Started

1. Clone the repository:

```bash
git clone <repository-url>
cd gemini-ai-chatbot
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file in the root directory and add your Google API key:

```env
GOOGLE_API_KEY=your_api_key_here
GEMINI_MODEL_NAME=gemini-pro  # Optional, defaults to gemini-pro
```

4. Start the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Shadcn UI
- Google Generative AI SDK

## Project Structure

```
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts    # API route for chat
│   └── page.tsx            # Main page
├── components/
│   ├── ui/                 # Shadcn UI components
│   └── chat-interface.tsx  # Chat interface component
├── lib/
│   └── types.ts           # TypeScript types
└── public/                # Static assets
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
