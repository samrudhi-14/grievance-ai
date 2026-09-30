"use client";

import { FormEvent, useState } from "react";

type Message = {
  role: "user" | "assistant";
  text: string;
};

export default function AIChatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "Hi! I'm GrievanceAI Assistant. How can I help you today?",
    },
  ]);

  async function sendMessage(event: FormEvent) {
    event.preventDefault();

    const message = input.trim();

    if (!message || loading) return;

    setInput("");

    setMessages((current) => [
      ...current,
      {
        role: "user",
        text: message,
      },
    ]);

    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.error || "Unable to get an AI response."
        );
      }

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          text: result.reply,
        },
      ]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          text:
            error instanceof Error
              ? error.message
              : "Sorry, I couldn't connect to the AI assistant.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Floating AI Button */}
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open GrievanceAI Assistant"
          className="fixed bottom-20 right-5 z-[100] flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-2xl text-white shadow-xl shadow-blue-200 transition hover:scale-105 hover:bg-blue-700 sm:bottom-6 sm:right-6"
        >
          🤖
        </button>
      )}

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-20 right-4 z-[100] flex h-[520px] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl sm:bottom-6 sm:right-6">

          {/* Header */}
          <div className="flex items-center justify-between bg-blue-600 px-4 py-3 text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15">
                🤖
              </div>

              <div>
                <p className="text-sm font-black">
                  GrievanceAI
                </p>

                <p className="text-[11px] text-blue-100">
                  Citizen Assistant
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close chatbot"
              className="rounded-lg px-2 py-1 text-lg transition hover:bg-white/10"
            >
              ×
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50 p-4">

            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`flex ${
                  message.role === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-5 ${
                    message.role === "user"
                      ? "rounded-br-md bg-blue-600 text-white"
                      : "rounded-bl-md bg-white text-slate-700 shadow-sm"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-md bg-white px-4 py-3 text-sm text-slate-500 shadow-sm">
                  AI is thinking...
                </div>
              </div>
            )}

          </div>

          {/* Input */}
          <form
            onSubmit={sendMessage}
            className="border-t border-slate-200 bg-white p-3"
          >
            <div className="flex gap-2">

              <input
                type="text"
                value={input}
                onChange={(event) =>
                  setInput(event.target.value)
                }
                placeholder="Ask me anything..."
                disabled={loading}
                className="min-w-0 flex-1 rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-50"
              >
                →
              </button>

            </div>
          </form>

        </div>
      )}
    </>
  );
}