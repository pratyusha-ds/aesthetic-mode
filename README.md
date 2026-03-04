# Aesthetic Mode

![Vercel Deploy](https://deploy-badge.vercel.app/vercel/aesthetic-mode?style=for-the-badge)
[![Next.js 16](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![Tailwind v4](https://img.shields.io/badge/Tailwind-v4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com)

A premium fashion events discovery platform built with Next.js 16.

## Features

- **Masonry Grid Layout** - Beautiful responsive grid showcasing fashion events with 3:4 aspect ratio images
- **Navigation Pills** - Filter events by location (London, Berlin) and category (Sample Sales, Exhibitions)
- **AI Concierge** - Floating chat drawer for personalized event assistance

## Tech Stack

- **Framework**: Next.js 16
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Database**: Supabase
- **Background Workers**: Inngest
- **Typography**: Playfair Display (serif) + Inter (sans-serif)

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Configure environment variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_SUPABASE_URL.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_KEY
```

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
  A single line
