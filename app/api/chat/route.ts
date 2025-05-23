import { GoogleGenerativeAI } from "@google/generative-ai";
import { Message } from "@/lib/types";
import { NextRequest } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

export async function POST(req: NextRequest) {
  try {
    console.log("API Key available:", !!process.env.GOOGLE_API_KEY);
    console.log("Model name:", process.env.GEMINI_MODEL_NAME || "gemini-pro");

    const { messages } = await req.json();
    console.log("Received messages:", messages.length);

    if (!process.env.GOOGLE_API_KEY) {
      throw new Error("GOOGLE_API_KEY is not configured");
    }

    const model = genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL_NAME || "gemini-pro",
    });

    // Convert messages to the format expected by Gemini
    const history = messages.map((msg: Message) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }));
    console.log("Converted history:", history.length);

    // Start a chat session
    const chat = model.startChat({
      history,
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
    });

    // Get the last user message
    const lastMessage = messages[messages.length - 1];
    console.log(
      "Sending message:",
      lastMessage.content.substring(0, 100) + "..."
    );

    // Send the message and get the response
    const result = await chat.sendMessage(lastMessage.content);
    const response = await result.response;
    const text = response.text();
    console.log("Received response:", text.substring(0, 100) + "...");

    // Create a new message object
    const newMessage: Message = {
      id: crypto.randomUUID(),
      content: text,
      role: "assistant",
      createdAt: new Date(),
    };

    return new Response(JSON.stringify({ message: newMessage }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in chat route:", error);
    // Log the full error details
    if (error instanceof Error) {
      console.error("Error name:", error.name);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }

    return new Response(
      JSON.stringify({
        error: "Failed to process chat request",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
