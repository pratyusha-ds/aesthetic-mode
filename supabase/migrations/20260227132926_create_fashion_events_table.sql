/*
  # Create Fashion Events Table

  ## Tables Created
  - `fashion_events`
    - `id` (uuid, primary key) - Unique identifier for each event
    - `title` (text) - Event title/name
    - `date` (timestamptz) - Event date and time
    - `location` (text) - Event location/venue
    - `city` (text) - City where event takes place
    - `category` (text) - Event category (e.g., 'sample-sale', 'exhibition', 'fashion-week')
    - `image_url` (text) - URL to event image
    - `description` (text, nullable) - Detailed event description
    - `created_at` (timestamptz) - Record creation timestamp
    - `updated_at` (timestamptz) - Record update timestamp

  ## Security
  - Enable RLS on `fashion_events` table
  - Add policy for public read access (events are publicly viewable)
  - Add policy for authenticated insert/update/delete operations
*/

CREATE TABLE IF NOT EXISTS fashion_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  date timestamptz NOT NULL,
  location text NOT NULL,
  city text NOT NULL,
  category text NOT NULL DEFAULT 'general',
  image_url text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE fashion_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view fashion events"
  ON fashion_events
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert events"
  ON fashion_events
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update events"
  ON fashion_events
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete events"
  ON fashion_events
  FOR DELETE
  TO authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_fashion_events_city ON fashion_events(city);
CREATE INDEX IF NOT EXISTS idx_fashion_events_category ON fashion_events(category);
CREATE INDEX IF NOT EXISTS idx_fashion_events_date ON fashion_events(date);