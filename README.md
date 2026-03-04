# UK Fashion Event Tracker

A premium fashion events discovery platform built with Next.js 15, featuring the Desert Luxe aesthetic.

## Features

- **Masonry Grid Layout** - Beautiful responsive grid showcasing fashion events with 3:4 aspect ratio images
- **Navigation Pills** - Filter events by location (London, Manchester) and category (Sample Sales, Exhibitions)
- **AI Concierge** - Floating chat drawer for personalized event assistance
- **Desert Luxe Design** - Warm oat background (#F2EFE9) with espresso text (#1C1917), serif headings (Playfair Display) and sans body text (Inter)

## Tech Stack

- **Framework**: Next.js 15
- **Styling**: Tailwind CSS with custom Desert Luxe color palette
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Database**: Supabase
- **Background Workers**: Inngest (scaffolded)
- **Typography**: Playfair Display (serif) + Inter (sans-serif)

## Project Structure

```
├── app/
│   ├── layout.tsx          # Root layout with font configuration
│   ├── page.tsx            # Main page with events grid and filters
│   └── globals.css         # Global styles and Desert Luxe palette
├── components/
│   ├── event-card.tsx      # Event card component with 3:4 aspect ratio
│   ├── ai-concierge.tsx    # AI chat drawer component
│   └── ui/                 # shadcn/ui components
├── lib/
│   ├── supabase/
│   │   ├── client.ts       # Supabase client initialization
│   │   └── types.ts        # Database type definitions
│   └── inngest/
│       ├── client.ts       # Inngest client (scaffolded)
│       └── functions/      # Background worker functions
└── .env                    # Environment variables (Supabase credentials)
```

## Database Schema

### fashion_events table

- `id` (uuid) - Primary key
- `title` (text) - Event name
- `date` (timestamptz) - Event date and time
- `location` (text) - Venue name
- `city` (text) - City (London, Manchester, etc.)
- `category` (text) - Event type (sample-sale, exhibition, fashion-week)
- `image_url` (text) - Event image URL
- `description` (text) - Event description
- `created_at` (timestamptz) - Record creation timestamp
- `updated_at` (timestamptz) - Record update timestamp

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
The `.env` file is already configured with Supabase credentials.

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Design System

### Color Palette (Desert Luxe)
- **Background**: #F2EFE9 (Warm Oat)
- **Text**: #1C1917 (Espresso)
- **Cards**: Pure white (#FFFFFF)
- **Shadows**: Soft, subtle shadows
- **Borders**: 12px rounded corners

### Typography
- **Headings**: Playfair Display (serif)
- **Body**: Inter (sans-serif)

### Components
- All cards use soft shadows and 12px border radius
- Navigation pills with smooth transitions
- Floating AI Concierge button with larger shadow
- Responsive masonry grid (1-4 columns based on screen size)

## Database Security

Row Level Security (RLS) is enabled on the `fashion_events` table:
- **Public Read**: Anyone can view events
- **Authenticated Write**: Only authenticated users can create, update, or delete events

## Future Enhancements

The Inngest directory structure is scaffolded and ready for:
- Automated event scraping
- Email notifications for new events
- Image optimization and processing
- Event recommendation engine

## Build

```bash
npm run build
```

The build compiles successfully with type checking and generates an optimized production build.
