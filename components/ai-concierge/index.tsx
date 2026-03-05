/**
 * @fileoverview Entry point for the AI Concierge widget.
 * Coordinates state between the Chat SDK, UI components, and the floating trigger button.
 * Implements a RAG-based fashion event discovery interface.
 */
"use client";

import { useState, useRef, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { MessageCircle, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { ChatHeader } from "./chat-header";
import { ChatMessages } from "./chat-messages";
import { ChatInput } from "./chat-input";

/**
 * AIConcierge Main Component
 * This component manages the visibility state of the chat window and
 * handles the communication with the /api/chat endpoint.
 */
export function AIConcierge() {
  const [isOpen, setIsOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });

  const isLoading = status === "submitted" || status === "streaming";

  const handleFormSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isLoading) return;

    const val = chatInput;
    setChatInput("");
    await sendMessage({ text: val });
  };

  useEffect(() => {
    if (scrollRef.current)
      scrollRef.current.scrollTo(0, scrollRef.current.scrollHeight);
  }, [messages, isOpen]);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
      {isOpen && (
        <div className="mb-4 w-[320px] sm:w-100 h-125 max-h-[calc(100vh-120px)] bg-white border border-zinc-200 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-300">
          <ChatHeader onClose={() => setIsOpen(false)} />

          <ScrollArea className="flex-1 p-4 bg-[#F8F8FA]">
            <ChatMessages
              messages={messages}
              isLoading={isLoading}
              scrollRef={scrollRef}
            />
          </ScrollArea>

          <ChatInput
            value={chatInput}
            onChange={setChatInput}
            onSubmit={handleFormSubmit}
            isLoading={isLoading}
          />

          <p className="text-[10px] text-center text-zinc-400 mt-4 pb-2 ">
            Powered by Google Gemini
          </p>
        </div>
      )}

      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "h-16 w-16 rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.2)] transition-all duration-300 active:scale-95 border-none",
          isOpen
            ? "bg-zinc-100 text-zinc-900 hover:bg-zinc-200"
            : "bg-zinc-900 text-white hover:bg-zinc-800",
        )}
      >
        {isOpen ? (
          <Minus className="h-7 w-7" />
        ) : (
          <div className="relative">
            <MessageCircle className="h-7 w-7" />
            <span className="absolute -top-1 -right-1 h-3.5 w-3.5 bg-fuchsia-500 border-[3px] border-zinc-900 rounded-full" />
          </div>
        )}
      </Button>
    </div>
  );
}
