/**
 * @fileoverview A floating, toggleable sidebar that provides advanced filtering options
 * for timeframes and regional locations. Features a responsive design with
 * backdrop blurring and animated entry.
 */

import { X, SlidersHorizontal } from "lucide-react";
import { locationOptions } from "@/lib/constants/locations";

interface FilterSidebarProps {
  isFilterOpen: boolean;
  setIsFilterOpen: (open: boolean) => void;
  filterContainerRef: React.RefObject<HTMLDivElement | null>;
  advancedFilters: {
    timeframes: string[];
    locations: string[];
  };
  toggleFilter: (key: "timeframes" | "locations", value: string) => void;
}

export function FilterSidebar({
  isFilterOpen,
  setIsFilterOpen,
  filterContainerRef,
  advancedFilters,
  toggleFilter,
}: FilterSidebarProps) {
  return (
    <div ref={filterContainerRef}>
      <button
        onClick={() => setIsFilterOpen(!isFilterOpen)}
        className={`fixed top-4 right-4 md:top-6 md:right-6 z-50 flex items-center justify-center h-12 w-12 rounded-full shadow-lg transition-all border-2 active:scale-95 ${
          isFilterOpen
            ? "bg-foreground text-background border-foreground"
            : "bg-card text-foreground border-border hover:border-primary"
        }`}
      >
        {isFilterOpen ? <X size={20} /> : <SlidersHorizontal size={20} />}
      </button>

      {isFilterOpen && (
        <div className="fixed top-24 right-4 md:right-6 z-50 w-70 bg-card/98 backdrop-blur-md p-6 rounded-2xl border shadow-2xl animate-in fade-in zoom-in-95">
          <div className="space-y-8">
            <div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase mb-4 tracking-widest">
                Timeframe
              </p>
              <div className="flex flex-col gap-3">
                {["today", "upcoming", "past"].map((t) => (
                  <label
                    key={t}
                    className="flex items-center gap-3 text-sm font-medium cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      checked={advancedFilters.timeframes.includes(t)}
                      onChange={() => toggleFilter("timeframes", t)}
                      className="h-4 w-4 rounded border-gray-300 text-primary"
                    />
                    <span className="group-hover:text-primary transition-colors capitalize">
                      {t}
                    </span>
                  </label>
                ))}
              </div>
            </div>
            <div className="pt-4 border-t border-border">
              <p className="text-[10px] font-bold text-muted-foreground uppercase mb-4 tracking-widest">
                Regional Hubs
              </p>
              <div className="flex flex-col gap-3">
                {locationOptions.map((loc) => (
                  <label
                    key={loc.id}
                    className="flex items-center gap-3 text-sm font-medium cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      checked={advancedFilters.locations.includes(loc.id)}
                      onChange={() => toggleFilter("locations", loc.id)}
                      className="h-4 w-4 rounded border-gray-300 text-primary"
                    />
                    <span className="group-hover:text-primary transition-colors">
                      {loc.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
