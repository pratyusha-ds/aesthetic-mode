/**
 * @fileoverview EventCard component for the UK Fashion Scout.
 * Displays individual fashion event details in a responsive, interactive card.
 */

"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Calendar, MapPin, ExternalLink, Sparkles } from "lucide-react";
import { format } from "date-fns";
import type { FashionEvent } from "@/lib/supabase/types";

interface EventCardProps {
  event: FashionEvent;
}

export function EventCard({ event }: EventCardProps) {
  const imageSrc =
    event.image_url && event.image_url.trim() !== "" ? event.image_url : null;

  return (
    <a
      href={event.event_url}
      target="_blank"
      rel="noopener noreferrer"
      className="block group"
      aria-label={`View details for ${event.title}`}
    >
      <Card className="overflow-hidden rounded-xl border-0 shadow-md group-hover:shadow-2xl transition-all duration-300 bg-card h-full flex flex-col">
        <div className="relative aspect-3/4 overflow-hidden bg-muted">
          <div className="absolute top-3 left-3 z-10">
            <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md border border-white/20">
              {event.city}
            </span>
          </div>

          {imageSrc ? (
            <img
              src={imageSrc}
              alt={event.title}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-[#f5f5f0] transition-colors duration-500 group-hover:bg-[#ebebe5]">
              <MapPin className="h-10 w-10 text-[#d6d3d1] stroke-1" />
            </div>
          )}

          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
            <div className="bg-white/90 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 shadow-lg">
              <ExternalLink className="text-black h-5 w-5" />
            </div>
          </div>
        </div>

        <CardContent className="p-5 grow">
          <h3 className="font-serif text-xl font-semibold mb-3 text-foreground line-clamp-2 group-hover:text-primary transition-colors leading-snug">
            {event.title}
          </h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 shrink-0" />
              <span>{format(new Date(event.date), "EEEE, MMMM d")}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 shrink-0" />
              <span className="line-clamp-1">{event.location}</span>
            </div>
          </div>
        </CardContent>

        {event.description && (
          <CardFooter className="px-5 pb-5 pt-0">
            <p className="text-sm text-muted-foreground line-clamp-2 italic leading-relaxed">
              {event.description}
            </p>
          </CardFooter>
        )}
      </Card>
    </a>
  );
}
