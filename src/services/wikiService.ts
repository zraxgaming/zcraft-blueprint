import { supabase } from '@/integrations/supabase/client';

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
  views: number | null;
  created_at: string | null;
  updated_at: string | null;
}

export async function getWikiArticles(limit: number = 20, offset: number = 0) {
  const { data, error } = await supabase
    .from('wiki')
    .select('*, author:users!wiki_author_id_fkey(id, username, avatar_url)')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;
  return (data || []) as WikiArticle[];
}

export async function getWikiByCategory(category: string) {
  const { data, error } = await supabase
    .from('wiki')
    .select('*, author:users!wiki_author_id_fkey(id, username, avatar_url)')
    .eq('category', category)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []) as WikiArticle[];
}

export async function getWikiArticle(slug: string) {
  const { data, error } = await supabase
    .from('wiki')
    .select('*, author:users!wiki_author_id_fkey(id, username, avatar_url)')
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

export async function createWikiArticle(article: Omit<WikiArticle, 'id' | 'created_at' | 'updated_at' | 'views' | 'author'>) {
  const { data, error } = await supabase
    .from('wiki')
    .insert({
      ...article,
      views: 0,
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
      title: updates.title,
      content: updates.content,
      category: updates.category,
      slug: updates.slug,
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
    .from('wiki')
    .select('category');

  if (error) throw error;
  
  const uniqueCategories = [...new Set((data || []).map(a => a.category))];

  return uniqueCategories.map((category: string) => ({
    id: category.toLowerCase().replace(/\s+/g, '-'),
    name: category,
    description: `Wiki category: ${category}`,
    articles_count: (data || []).filter(a => a.category === category).length,
  }));
}

export async function getPopularArticles(limit: number = 5) {
  const { data, error } = await supabase
    .from('wiki')
    .select('id, title, slug, views, author:users!wiki_author_id_fkey(username)')
    .order('views', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data || []).map((article: any) => ({
    id: article.id,
    title: article.title,
    slug: article.slug,
    views_count: article.views || 0,
    author: article.author?.username || 'Unknown',
  }));
}

export async function getRecentArticles(limit: number = 5) {
  const { data, error } = await supabase
    .from('wiki')
    .select('id, title, slug, created_at, author:users!wiki_author_id_fkey(username)')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data || []).map((article: any) => ({
    id: article.id,
    title: article.title,
    slug: article.slug,
    created_at: article.created_at,
    author: article.author?.username || 'Unknown',
  }));
}

export async function getArticles(limit: number = 50) {
  const { data, error } = await supabase
    .from('wiki')
    .select('id, title, slug, category, views, created_at, author:users!wiki_author_id_fkey(username)')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data || []).map((article: any) => ({
    id: article.id,
    title: article.title,
    slug: article.slug,
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
