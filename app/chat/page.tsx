"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

type Message = {
  role: "user" | "assistant";
  text: string;
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "Hello! I'm GrievanceAI Assistant. I can help you submit a grievance, choose a category, understand statuses, or prepare a clear complaint.",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

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
        body: JSON.stringify({
          message,
        }),
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
    <main className="min-h-screen bg-[#f5f7fb] text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-5 py-4">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-xl font-black text-white">
              G
            </div>

            <div>
              <h1 className="text-xl font-black tracking-tight">
                Grievance<span className="text-blue-600">AI</span>
              </h1>
              <p className="text-[11px] font-medium text-slate-500">
                AI Citizen Assistant
              </p>
            </div>
          </Link>

          <Link
            href="/dashboard"
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50"
          >
            ← Dashboard
          </Link>
        </div>
      </header>

      <section className="mx-auto flex max-w-4xl flex-col px-5 py-6 sm:py-10">
        <div className="mb-5">
          <div className="mb-2 inline-flex rounded-full bg-violet-100 px-3 py-1 text-xs font-bold text-violet-700">
            🤖 AI POWERED
          </div>

          <h2 className="text-3xl font-black tracking-tight">
            How can I help?
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Ask about grievances, categories, priorities, evidence,
            tracking, or complaint writing.
          </p>
        </div>

        <div className="flex min-h-[520px] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="flex-1 space-y-4 overflow-y-auto p-5 sm:p-6">
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
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                    message.role === "user"
                      ? "rounded-br-md bg-blue-600 text-white"
                      : "rounded-bl-md bg-slate-100 text-slate-700"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-md bg-slate-100 px-4 py-3 text-sm text-slate-500">
                  <span className="inline-flex items-center gap-2">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:150ms]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:300ms]" />
                  </span>
                </div>
              </div>
            )}
          </div>

          <form
            onSubmit={sendMessage}
            className="border-t border-slate-200 bg-slate-50 p-4"
          >
            <div className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask GrievanceAI something..."
                disabled={loading}
                className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
              />

              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "..." : "Send"}
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
