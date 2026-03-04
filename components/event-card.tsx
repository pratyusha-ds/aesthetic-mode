'use client';

import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Calendar, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import type { FashionEvent } from '@/lib/supabase/types';

interface EventCardProps {
  event: FashionEvent;
}

export function EventCard({ event }: EventCardProps) {
  return (
    <Card className="overflow-hidden rounded-xl border-0 shadow-md hover:shadow-xl transition-shadow duration-300">
      <div className="relative aspect-[3/4] overflow-hidden bg-muted">
        <img
          src={event.image_url}
          alt={event.title}
          className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>
      <CardContent className="p-5">
        <h3 className="font-serif text-xl font-semibold mb-3 text-foreground line-clamp-2">
          {event.title}
        </h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{format(new Date(event.date), 'EEEE, MMMM d, yyyy')}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span className="line-clamp-1">{event.location}, {event.city}</span>
          </div>
        </div>
      </CardContent>
      {event.description && (
        <CardFooter className="px-5 pb-5 pt-0">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {event.description}
          </p>
        </CardFooter>
      )}
    </Card>
  );
}
