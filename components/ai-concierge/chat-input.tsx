/**
 * @fileoverview Input management for the Style Concierge.
 * Provides a styled text field and submission button for interacting with the AI.
 */

import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ChatInputProps {
  value: string;
  onChange: (val: string) => void;
  onSubmit: (e: React.SyntheticEvent) => void;
  isLoading: boolean;
}

/**
 * ChatInput Component
 * @param {Object} props
 * @param {string} props.value - The current text value of the input field.
 * @param {Function} props.onChange - Setter function to update the input state.
 * @param {Function} props.onSubmit - Handler for the form submission.
 * @param {boolean} props.isLoading - Disables input while a request is in progress.
 */
export function ChatInput({
  value,
  onChange,
  onSubmit,
  isLoading,
}: ChatInputProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="p-4 bg-white border-t border-zinc-100 flex gap-2 items-center"
    >
      <div className="relative flex-1">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Type a message..."
          className="bg-zinc-50 border-none rounded-2xl focus-visible:ring-2 focus-visible:ring-zinc-100 pr-10 h-12 text-sm placeholder:text-zinc-400"
        />
      </div>
      <Button
        type="submit"
        disabled={isLoading || !value.trim()}
        size="icon"
        className="h-12 w-12 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-white shrink-0 transition-all active:scale-90 disabled:opacity-40 shadow-lg shadow-zinc-200"
      >
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
}
