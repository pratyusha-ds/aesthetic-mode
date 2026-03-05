/**
 * @fileoverview Root Home page for the Aesthetic Mode application.
 * Manages the global state for fashion events, coordinates Supabase data fetching, and handles UI-level events
 * like click-outside dismissal for sidebars.
 * @module Home
 */

"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { EventCard } from "@/components/event-card";
import { AIConcierge } from "@/components/ai-concierge";
import { SiteHeader } from "@/components/site-header";
import { FilterSidebar } from "@/components/filter-sidebar";
import { supabase } from "@/lib/supabase/client";
import { locationOptions, mainCities } from "@/lib/constants/locations";
import type { FashionEvent } from "@/lib/supabase/types";

export default function Home() {
  const [events, setEvents] = useState<FashionEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState({
    timeframes: [] as string[],
    locations: [] as string[],
  });

  const filterContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isFilterOpen &&
        filterContainerRef.current &&
        !filterContainerRef.current.contains(event.target as Node)
      ) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isFilterOpen]);

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      let query = supabase.from("fashion_events").select("*");
      if (advancedFilters.locations.length > 0) {
        const isRuralSelected =
          advancedFilters.locations.includes("rural_hidden_gems");
        const selectedCities = advancedFilters.locations.flatMap(
          (id) => locationOptions.find((opt) => opt.id === id)?.cities || [],
        );
        if (isRuralSelected && selectedCities.length > 0) {
          query = query.or(
            `city.in.(${selectedCities.join(",")}),city.not.in.(${mainCities.join(",")})`,
          );
        } else if (isRuralSelected) {
          query = query.not("city", "in", `(${mainCities.join(",")})`);
        } else if (selectedCities.length > 0) {
          query = query.in("city", selectedCities);
        }
      }
      const todayStr = new Date().toISOString().split("T")[0];
      if (advancedFilters.timeframes.length > 0) {
        const filters: string[] = [];
        if (advancedFilters.timeframes.includes("today"))
          filters.push(`date.eq.${todayStr}`);
        if (advancedFilters.timeframes.includes("upcoming"))
          filters.push(`date.gt.${todayStr}`);
        if (advancedFilters.timeframes.includes("past"))
          filters.push(`date.lt.${todayStr}`);
        if (filters.length > 0) query = query.or(filters.join(","));
      }
      const { data, error } = await query.order("date", { ascending: true });
      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  }, [advancedFilters]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const toggleFilter = (key: "timeframes" | "locations", value: string) => {
    setAdvancedFilters((prev) => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter((v) => v !== value)
        : [...prev[key], value],
    }));
  };

  const setQuickTimeframe = (id: string) => {
    setAdvancedFilters((prev) => ({
      ...prev,
      timeframes: id === "all" ? [] : [id],
    }));
  };

  return (
    <div className="min-h-screen bg-background relative">
      <SiteHeader
        advancedFilters={advancedFilters}
        setQuickTimeframe={setQuickTimeframe}
      />

      <FilterSidebar
        isFilterOpen={isFilterOpen}
        setIsFilterOpen={setIsFilterOpen}
        filterContainerRef={filterContainerRef}
        advancedFilters={advancedFilters}
        toggleFilter={toggleFilter}
      />

      <main className="container mx-auto px-4 py-8 md:px-6">
        {loading ? (
          <div className="flex items-center justify-center min-h-100">
            <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="font-serif text-lg text-muted-foreground">
              No events found for these filters.
            </h2>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-start">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </main>

      <AIConcierge />
    </div>
  );
}
