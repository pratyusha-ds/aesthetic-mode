/**
 * @fileoverview Header component containing the primary branding and
 * quick-filter navigation for the Aesthetic Mode event dashboard.
 */

import { Sparkles } from "lucide-react";

export function SiteHeader({ advancedFilters, setQuickTimeframe }: any) {
  return (
    <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4 md:px-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="h-5 w-5 text-primary">
                  <Sparkles />
                </span>
              </div>
              <h1 className="font-serif text-xl md:text-2xl font-bold text-foreground">
                Aesthetic Mode
              </h1>
            </div>
          </div>
          <nav className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {[
              { id: "all", label: "All Events" },
              { id: "today", label: "Today" },
              { id: "upcoming", label: "Upcoming" },
              { id: "past", label: "Past" },
            ].map((pill) => (
              <button
                key={pill.id}
                onClick={() => setQuickTimeframe(pill.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
                  (pill.id === "all" &&
                    advancedFilters.timeframes.length === 0) ||
                  (advancedFilters.timeframes.length === 1 &&
                    advancedFilters.timeframes[0] === pill.id)
                    ? "bg-foreground text-background border-foreground shadow-sm"
                    : "bg-card hover:bg-muted text-muted-foreground border-border"
                }`}
              >
                {pill.label}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
