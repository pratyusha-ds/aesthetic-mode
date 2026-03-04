'use client';

import { useState, useEffect } from 'react';
import { EventCard } from '@/components/event-card';
import { AIConcierge } from '@/components/ai-concierge';
import { supabase } from '@/lib/supabase/client';
import type { FashionEvent } from '@/lib/supabase/types';
import { Sparkles } from 'lucide-react';

const categories = [
  { id: 'all', label: 'All Events' },
  { id: 'london', label: 'London' },
  { id: 'manchester', label: 'Manchester' },
  { id: 'sample-sale', label: 'Sample Sales' },
  { id: 'exhibition', label: 'Exhibitions' },
];

export default function Home() {
  const [events, setEvents] = useState<FashionEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<FashionEvent[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    filterEvents();
  }, [activeCategory, events]);

  async function fetchEvents() {
    try {
      const { data, error } = await supabase
        .from('fashion_events')
        .select('*')
        .order('date', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  }

  function filterEvents() {
    if (activeCategory === 'all') {
      setFilteredEvents(events);
    } else if (activeCategory === 'london' || activeCategory === 'manchester') {
      setFilteredEvents(
        events.filter(event =>
          event.city.toLowerCase() === activeCategory.toLowerCase()
        )
      );
    } else {
      setFilteredEvents(
        events.filter(event => event.category === activeCategory)
      );
    }
  }

  return (
    <div className="min-h-screen">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="font-serif text-3xl font-bold text-foreground">
                  UK Fashion Events
                </h1>
                <p className="text-sm text-muted-foreground">
                  Discover premium fashion experiences
                </p>
              </div>
            </div>
          </div>

          <nav className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                  activeCategory === category.id
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'bg-card hover:bg-muted text-muted-foreground hover:text-foreground border'
                }`}
              >
                {category.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center space-y-4">
              <div className="h-12 w-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin mx-auto" />
              <p className="text-muted-foreground">Loading events...</p>
            </div>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-20">
            <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Sparkles className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="font-serif text-2xl font-semibold mb-2">No events found</h2>
            <p className="text-muted-foreground mb-6">
              {activeCategory === 'all'
                ? 'No events are currently available. Check back soon!'
                : `No ${categories.find(c => c.id === activeCategory)?.label} events available at the moment.`}
            </p>
          </div>
        ) : (
          <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
            {filteredEvents.map((event) => (
              <div key={event.id} className="break-inside-avoid">
                <EventCard event={event} />
              </div>
            ))}
          </div>
        )}
      </main>

      <AIConcierge />
    </div>
  );
}
