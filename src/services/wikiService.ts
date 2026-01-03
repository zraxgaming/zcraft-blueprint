import { supabase } from '@/lib/supabase';

export interface Author {
  id: string;
  username: string;
  avatar_url: string | null;
}

export interface WikiArticle {
  id: string;
  title: string;
  slug: string;
  content: string;
  category: string;
  author_id: string;
  author?: Author;
  views: number;
  created_at: string;
  updated_at: string;
}

export async function getWikiArticles(limit: number = 20, offset: number = 0) {
  const { data, error } = await supabase
    .from('wiki')
    .select('*, author:author_id(id, username, avatar_url)')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;
  return data as WikiArticle[];
}

export async function getWikiByCategory(category: string) {
  const { data, error } = await supabase
    .from('wiki')
    .select('*, author:author_id(id, username, avatar_url)')
    .eq('category', category)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as WikiArticle[];
}

export async function getWikiArticle(slug: string) {
  const { data, error } = await supabase
    .from('wiki')
    .select('*, author:author_id(id, username, avatar_url)')
    .eq('slug', slug)
    .single();

  if (error) throw error;

  // Increment view count
  await supabase
    .from('wiki')
    .update({ views: (data.views || 0) + 1 })
    .eq('id', data.id);

  return data as WikiArticle;
}

export async function createWikiArticle(article: Omit<WikiArticle, 'id' | 'created_at' | 'updated_at' | 'views'>) {
  const { data, error } = await supabase
    .from('wiki')
    .insert({
      ...article,
      views: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;
  return data as WikiArticle;
}

export async function updateWikiArticle(id: string, updates: Partial<WikiArticle>) {
  const { data, error } = await supabase
    .from('wiki')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as WikiArticle;
}

export async function deleteWikiArticle(id: string) {
  const { error } = await supabase
    .from('wiki')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function getCategories() {
  const { data, error } = await supabase
    .from('wiki_categories')
    .select('id, name, description, articles_count:wiki(count)')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []).map((category: any) => ({
    id: category.id,
    name: category.name,
    description: category.description,
    articles_count: category.articles_count?.[0]?.count || 0,
  }));
}

export async function getPopularArticles(limit: number = 5) {
  const { data, error } = await supabase
    .from('wiki')
    .select('id, title, views, author:author_id(username)')
    .order('views', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data || []).map((article: any) => ({
    id: article.id,
    title: article.title,
    views_count: article.views || 0,
    author: article.author?.username || 'Unknown',
  }));
}

export async function getRecentArticles(limit: number = 5) {
  const { data, error } = await supabase
    .from('wiki')
    .select('id, title, created_at, author:author_id(username)')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data || []).map((article: any) => ({
    id: article.id,
    title: article.title,
    created_at: article.created_at,
    author: article.author?.username || 'Unknown',
  }));
}

export async function getArticles(limit: number = 50) {
  const { data, error } = await supabase
    .from('wiki')
    .select('id, title, category, views, created_at, author:author_id(username)')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data || []).map((article: any) => ({
    id: article.id,
    title: article.title,
    category: article.category,
    views_count: article.views || 0,
    created_at: article.created_at,
    author: article.author?.username || 'Unknown',
  }));
}

export const wikiService = {
  getWikiArticles,
  getWikiByCategory,
  getWikiArticle,
  createWikiArticle,
  updateWikiArticle,
  deleteWikiArticle,
  getCategories,
  getPopularArticles,
  getRecentArticles,
  getArticles,
};
