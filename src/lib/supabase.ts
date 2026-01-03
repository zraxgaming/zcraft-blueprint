import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          username: string;
          email: string;
          avatar_url: string | null;
          bio: string | null;
          created_at: string;
          role: 'user' | 'moderator' | 'admin';
        };
        Insert: {
          id?: string;
          username: string;
          email: string;
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string;
          role?: 'user' | 'moderator' | 'admin';
        };
        Update: {
          username?: string;
          email?: string;
          avatar_url?: string | null;
          bio?: string | null;
          role?: 'user' | 'moderator' | 'admin';
        };
      };
      news: {
        Row: {
          id: string;
          title: string;
          slug: string;
          content: string;
          excerpt: string;
          author_id: string;
          image_url: string | null;
          views: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          content: string;
          excerpt: string;
          author_id: string;
          image_url?: string | null;
          views?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          content?: string;
          excerpt?: string;
          image_url?: string | null;
          views?: number;
          updated_at?: string;
        };
      };
      forums: {
        Row: {
          id: string;
          title: string;
          slug: string;
          description: string;
          category: string;
          post_count: number;
          reply_count: number;
          last_post_date: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          description: string;
          category: string;
          post_count?: number;
          reply_count?: number;
          last_post_date?: string | null;
          created_at?: string;
        };
        Update: {
          title?: string;
          description?: string;
          post_count?: number;
          reply_count?: number;
          last_post_date?: string | null;
        };
      };
      forum_posts: {
        Row: {
          id: string;
          forum_id: string;
          author_id: string;
          title: string;
          content: string;
          views: number;
          replies: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          forum_id: string;
          author_id: string;
          title: string;
          content: string;
          views?: number;
          replies?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          content?: string;
          views?: number;
          replies?: number;
          updated_at?: string;
        };
      };
      wiki: {
        Row: {
          id: string;
          title: string;
          slug: string;
          content: string;
          category: string;
          author_id: string;
          views: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          content: string;
          category: string;
          author_id: string;
          views?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          content?: string;
          category?: string;
          views?: number;
          updated_at?: string;
        };
      };
      events: {
        Row: {
          id: string;
          title: string;
          description: string;
          date: string;
          location: string;
          image_url: string | null;
          max_players: number | null;
          registered_count: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          date: string;
          location: string;
          image_url?: string | null;
          max_players?: number | null;
          registered_count?: number;
          created_at?: string;
        };
        Update: {
          title?: string;
          description?: string;
          date?: string;
          location?: string;
          image_url?: string | null;
          max_players?: number | null;
          registered_count?: number;
        };
      };
      admin_settings: {
        Row: {
          id: string;
          key: string;
          value: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          key: string;
          value: string;
          updated_at?: string;
        };
        Update: {
          value?: string;
          updated_at?: string;
        };
      };
    };
  };
};
