import { supabase } from '@/lib/supabase';

export interface Author {
  id: string;
  username: string;
  avatar_url: string | null;
}

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author_id: string;
  author?: Author;
  image_url: string | null;
  views: number;
  created_at: string;
  updated_at: string;
}

export async function getNews(limit: number = 10, offset: number = 0) {
  const { data, error } = await supabase
    .from('news')
    .select('*, author:author_id(id, username, avatar_url)')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;
  return data as NewsArticle[];
}

export async function getNewsArticle(slug: string) {
  const { data, error } = await supabase
    .from('news')
    .select('*, author:author_id(id, username, avatar_url)')
    .eq('slug', slug)
    .single();

  if (error) throw error;

  // Increment view count
  await supabase
    .from('news')
    .update({ views: (data.views || 0) + 1 })
    .eq('id', data.id);

  return data as NewsArticle;
}

export async function createNews(article: Omit<NewsArticle, 'id' | 'created_at' | 'updated_at' | 'views'>) {
  const { data, error } = await supabase
    .from('news')
    .insert({
      ...article,
      views: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;
  return data as NewsArticle;
}

export async function updateNews(id: string, updates: Partial<NewsArticle>) {
  const { data, error } = await supabase
    .from('news')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as NewsArticle;
}

export async function deleteNews(id: string) {
  const { error } = await supabase
    .from('news')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export const newsService = {
  getNews,
  getNewsArticle,
  createNews,
  updateNews,
  deleteNews,
};
