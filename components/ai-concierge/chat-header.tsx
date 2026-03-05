/**
 * @fileoverview Header component for the Style Concierge chat window.
 * Displays the branding, status indicator, and provides a close toggle.
 */

import { Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatHeaderProps {
  onClose: () => void;
}

/**
 * ChatHeader Component
 * @param {ChatHeaderProps} props - The component props.
 * @param {Function} props.onClose - Callback function to close or minimize the concierge window.
 */
export function ChatHeader({ onClose }: ChatHeaderProps) {
  return (
    <div className="bg-zinc-900 p-5 flex items-center justify-between text-white">
      <div className="flex items-center gap-3">
        <div className="bg-linear-to-tr from-violet-400 to-fuchsia-400 p-2 rounded-xl shadow-lg shadow-fuchsia-500/20">
          <Sparkles className="h-4 w-4 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-sm tracking-tight">
            Style Concierge
          </span>
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[10px] text-zinc-400 font-medium uppercase tracking-wider">
              Always Online
            </span>
          </div>
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={onClose}
        className="text-zinc-400 hover:text-white hover:bg-white/10 rounded-full h-8 w-8 transition-colors"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
