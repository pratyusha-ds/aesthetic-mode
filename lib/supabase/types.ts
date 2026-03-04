export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      fashion_events: {
        Row: {
          id: string;
          title: string;
          date: string;
          location: string;
          city: string;
          category: string;
          image_url: string;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          date: string;
          location: string;
          city: string;
          category?: string;
          image_url: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          date?: string;
          location?: string;
          city?: string;
          category?: string;
          image_url?: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}

export type FashionEvent = Database['public']['Tables']['fashion_events']['Row'];
