import { supabase } from '@/lib/supabase';

export interface Author {
  id: string;
  username: string;
  avatar_url: string | null;
}

export interface Forum {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  post_count: number;
  reply_count: number;
  last_post_date: string | null;
  created_at: string;
}

export interface ForumPost {
  id: string;
  forum_id: string;
  author_id: string;
  author?: Author;
  title: string;
  content: string;
  views: number;
  replies: number;
  created_at: string;
  updated_at: string;
}

export async function getForums() {
  const { data, error } = await supabase
    .from('forums')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Forum[];
}

export async function getForumBySlug(slug: string) {
  const { data, error } = await supabase
    .from('forums')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) throw error;
  return data as Forum;
}

export async function getForumPosts(forumId: string, limit: number = 20, offset: number = 0) {
  const { data, error } = await supabase
    .from('forum_posts')
    .select('*, author:author_id(id, username, avatar_url)')
    .eq('forum_id', forumId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;
  return data as ForumPost[];
}

export async function createForumPost(post: Omit<ForumPost, 'id' | 'created_at' | 'updated_at' | 'views' | 'replies'>) {
  const { data, error } = await supabase
    .from('forum_posts')
    .insert({
      ...post,
      views: 0,
      replies: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;

  // Update forum post count
  const forum = await getForumBySlug((await supabase.from('forums').select('slug').eq('id', post.forum_id)).data?.[0]?.slug);
  if (forum) {
    await supabase
      .from('forums')
      .update({
        post_count: forum.post_count + 1,
        last_post_date: new Date().toISOString(),
      })
      .eq('id', post.forum_id);
  }

  return data as ForumPost;
}

export async function updateForumPost(id: string, updates: Partial<ForumPost>) {
  const { data, error } = await supabase
    .from('forum_posts')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as ForumPost;
}

export async function deleteForumPost(id: string) {
  const { error } = await supabase
    .from('forum_posts')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function getCategories() {
  const { data, error } = await supabase
    .from('forums')
    .select('category')
    .order('category', { ascending: true });

  if (error) throw error;
  
  // Group by unique categories
  const uniqueCategories = Array.from(new Map(
    (data || []).map((forum: any) => [forum.category, forum.category])
  ).values());

  return uniqueCategories.map((category: string) => ({
    id: category.toLowerCase().replace(/\s+/g, '-'),
    name: category,
    description: `Forum category: ${category}`,
  }));
}

export async function getLatestThreads(limit: number = 10) {
  const { data, error } = await supabase
    .from('forum_posts')
    .select('id, title, author:author_id(username), forum:forum_id(title), replies, created_at')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data || []).map((thread: any) => ({
    id: thread.id,
    title: thread.title,
    author: thread.author?.username || 'Unknown',
    category: thread.forum?.title || 'General',
    replies_count: thread.replies || 0,
    created_at: thread.created_at,
  }));
}

export async function getAllThreads(limit: number = 50) {
  const { data, error } = await supabase
    .from('forum_posts')
    .select('id, title, author:author_id(username), forum:forum_id(title), replies, created_at')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data || []).map((thread: any) => ({
    id: thread.id,
    title: thread.title,
    author: thread.author?.username || 'Unknown',
    category: thread.forum?.title || 'General',
    replies_count: thread.replies || 0,
    created_at: thread.created_at,
  }));
}

export const forumService = {
  getForums,
  getForumBySlug,
  getForumPosts,
  createForumPost,
  updateForumPost,
  deleteForumPost,
  getCategories,
  getLatestThreads,
  getAllThreads,
};
