/**
 * @fileoverview Message display area for the Style Concierge.
 * Handles the rendering of user and assistant messages using Markdown and
 * provides a loading state for active AI generation.
 */

import ReactMarkdown from "react-markdown";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatMessagesProps {
  messages: any[];
  isLoading: boolean;
  scrollRef: React.RefObject<HTMLDivElement | null>;
}

/**
 * ChatMessages Component
 * @param {Object} props
 * @param {Array} props.messages - The array of message objects from the useChat hook.
 * @param {boolean} props.isLoading - State indicating if the AI is currently streaming a response.
 * @param {React.RefObject} props.scrollRef - Reference to the scrollable container for auto-scrolling logic.
 */
export function ChatMessages({
  messages,
  isLoading,
  scrollRef,
}: ChatMessagesProps) {
  return (
    <div className="space-y-4 pr-3" ref={scrollRef}>
      {messages.length === 0 && (
        <div className="text-center py-8 px-4">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-zinc-100">
            <span className="text-2xl mb-2 block">✨</span>
            <p className="text-sm font-medium text-zinc-800">
              Your Front-Row Access Awaits.
            </p>
            <p className="text-xs text-zinc-500 mt-1">
              Discover exclusive sample sales, runway shows, and fashion
              pop-ups.
            </p>
          </div>
        </div>
      )}

      {messages.map((m) => (
        <div
          key={m.id}
          className={cn(
            "flex",
            m.role === "user" ? "justify-end" : "justify-start",
          )}
        >
          <div
            className={cn(
              "max-w-[85%] px-4 py-3 text-sm transition-all whitespace-pre-wrap",
              m.role === "user"
                ? "bg-zinc-900 text-white rounded-[1.25rem] rounded-tr-none shadow-md shadow-zinc-200"
                : "bg-white border border-zinc-100 text-zinc-800 rounded-[1.25rem] rounded-tl-none shadow-sm",
            )}
          >
            {m.parts.map((part: any, i: number) =>
              part.type === "text" ? (
                <div
                  key={i}
                  className="prose prose-sm max-w-none leading-relaxed"
                >
                  <ReactMarkdown>{part.text}</ReactMarkdown>
                </div>
              ) : null,
            )}
          </div>
        </div>
      ))}

      {isLoading && (
        <div className="flex justify-start items-center gap-2">
          <div className="bg-white border border-zinc-100 p-3 rounded-2xl shadow-sm">
            <Loader2 className="h-4 w-4 animate-spin text-fuchsia-500" />
          </div>
        </div>
      )}
    </div>
  );
}
