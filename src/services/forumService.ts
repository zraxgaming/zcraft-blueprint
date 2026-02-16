import { supabase } from '@/integrations/supabase/client';
import { sendWebhook, WebhookEvent } from './webhookService';

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
  post_count: number | null;
  reply_count: number | null;
  last_post_date: string | null;
  created_at: string | null;
}

export interface ForumPost {
  id: string;
  forum_id: string;
  author_id: string;
  author?: Author;
  title: string;
  content: string;
  views: number | null;
  replies: number | null;
  created_at: string | null;
  updated_at: string | null;
}

export async function getForums() {
  const { data, error } = await supabase
    .from('forums')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []) as Forum[];
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

export async function getForumById(id: string) {
  const { data, error } = await supabase
    .from('forums')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as Forum;
}

export async function getForumPosts(forumId: string, limit: number = 20, offset: number = 0) {
  const { data, error } = await supabase
    .from('forum_posts')
    .select('*, author:users!forum_posts_author_id_fkey(id, username, avatar_url)')
    .eq('forum_id', forumId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;
  return (data || []) as ForumPost[];
}

export async function getForumPostById(id: string) {
  const { data, error } = await supabase
    .from('forum_posts')
    .select('*, author:users!forum_posts_author_id_fkey(id, username, avatar_url)')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as ForumPost;
}

export async function createForum(forum: Omit<Forum, 'id' | 'created_at' | 'post_count' | 'reply_count' | 'last_post_date'>) {
  const { data, error } = await supabase
    .from('forums')
    .insert({
      ...forum,
      post_count: 0,
      reply_count: 0,
    })
    .select()
    .single();

  if (error) throw error;

  // Send webhook
  await sendWebhook(WebhookEvent.FORUM_CREATED, {
    forumId: data.id,
    title: data.title,
    slug: data.slug,
    category: data.category,
    description: data.description,
  });

  return data as Forum;
}

export async function updateForum(id: string, updates: Partial<Forum>) {
  const { data, error } = await supabase
    .from('forums')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;

  // Send webhook
  await sendWebhook(WebhookEvent.FORUM_UPDATED, {
    forumId: data.id,
    title: data.title,
    category: data.category,
    updates,
  });

  return data as Forum;
}

export async function deleteForum(id: string) {
  // Get forum info before deleting
  const forum = await getForumById(id);

  const { error } = await supabase
    .from('forums')
    .delete()
    .eq('id', id);

  if (error) throw error;

  // Send webhook
  await sendWebhook(WebhookEvent.FORUM_DELETED, {
    forumId: forum.id,
    title: forum.title,
    category: forum.category,
  });
}

export async function createForumPost(post: Omit<ForumPost, 'id' | 'created_at' | 'updated_at' | 'views' | 'replies' | 'author'>) {
  const { data, error } = await supabase
    .from('forum_posts')
    .insert({
      ...post,
      views: 0,
      replies: 0,
    })
    .select()
    .single();

  if (error) throw error;

  // Update forum post count
  const { data: forumData } = await supabase
    .from('forums')
    .select('post_count')
    .eq('id', post.forum_id)
    .single();

  if (forumData) {
    await supabase
      .from('forums')
      .update({
        post_count: (forumData.post_count || 0) + 1,
        last_post_date: new Date().toISOString(),
      })
      .eq('id', post.forum_id);
  }

  // Send webhook
  await sendWebhook(WebhookEvent.FORUM_POST_CREATED, {
    postId: data.id,
    forumId: data.forum_id,
    authorId: data.author_id,
    title: data.title,
    content: data.content,
  });

  return data as ForumPost;
}

export async function updateForumPost(id: string, updates: Partial<ForumPost>) {
  const { data, error } = await supabase
    .from('forum_posts')
    .update({
      title: updates.title,
      content: updates.content,
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;

  // Send webhook
  await sendWebhook(WebhookEvent.FORUM_POST_UPDATED, {
    postId: data.id,
    forumId: data.forum_id,
    title: data.title,
    updates,
  });

  return data as ForumPost;
}

export async function deleteForumPost(id: string) {
  // Get post info before deleting
  const { data: postData } = await supabase
    .from('forum_posts')
    .select('*')
    .eq('id', id)
    .single();

  const { error } = await supabase
    .from('forum_posts')
    .delete()
    .eq('id', id);

  if (error) throw error;

  // Send webhook
  if (postData) {
    await sendWebhook(WebhookEvent.FORUM_POST_DELETED, {
      postId: postData.id,
      forumId: postData.forum_id,
      title: postData.title,
    });
  }
}

// Forum reply functions (client-side management)
export async function createForumReply(reply: { post_id: string; author_id: string; content: string }) {
  // Store reply in localStorage temporarily
  const repliesKey = `forum_replies_${reply.post_id}`;
  const replies = JSON.parse(localStorage.getItem(repliesKey) || '[]');
  const newReply = {
    id: `reply_${Date.now()}`,
    ...reply,
    created_at: new Date().toISOString(),
    is_staff: false,
    likes: 0,
  };
  replies.push(newReply);
  localStorage.setItem(repliesKey, JSON.stringify(replies));
  return newReply;
}

export async function deleteForumReply(id: string) {
  // This is a simplified implementation
  // In production, this would delete from database
  // For now, we'll just remove from any stored replies
  const allKeys = Object.keys(localStorage);
  for (const key of allKeys) {
    if (key.startsWith('forum_replies_')) {
      const replies = JSON.parse(localStorage.getItem(key) || '[]');
      const filtered = replies.filter((r: any) => r.id !== id);
      localStorage.setItem(key, JSON.stringify(filtered));
    }
  }
}

// Like functions using client-side state (stored in memory/localStorage)
export async function likeForumPost(postId: string, userId: string) {
  // Optimistic like - store in localStorage
  const likesKey = `forum_post_likes_${postId}`;
  const likes = JSON.parse(localStorage.getItem(likesKey) || '[]');
  if (!likes.includes(userId)) {
    likes.push(userId);
    localStorage.setItem(likesKey, JSON.stringify(likes));
  }
  return { id: postId, user_id: userId };
}

export async function unlikeForumPost(postId: string, userId: string) {
  // Remove like from localStorage
  const likesKey = `forum_post_likes_${postId}`;
  const likes = JSON.parse(localStorage.getItem(likesKey) || '[]');
  const filtered = likes.filter((id: string) => id !== userId);
  localStorage.setItem(likesKey, JSON.stringify(filtered));
}

export async function likeForumReply(replyId: string, userId: string) {
  // Optimistic like for reply
  const likesKey = `forum_reply_likes_${replyId}`;
  const likes = JSON.parse(localStorage.getItem(likesKey) || '[]');
  if (!likes.includes(userId)) {
    likes.push(userId);
    localStorage.setItem(likesKey, JSON.stringify(likes));
  }
  return { id: replyId, user_id: userId };
}

export async function unlikeForumReply(replyId: string, userId: string) {
  // Remove like from localStorage
  const likesKey = `forum_reply_likes_${replyId}`;
  const likes = JSON.parse(localStorage.getItem(likesKey) || '[]');
  const filtered = likes.filter((id: string) => id !== userId);
  localStorage.setItem(likesKey, JSON.stringify(filtered));
}

export async function getForumPostLikes(postId: string) {
  // Get likes from localStorage
  const likesKey = `forum_post_likes_${postId}`;
  return JSON.parse(localStorage.getItem(likesKey) || '[]');
}

export async function getForumReplyLikes(replyId: string) {
  // Get likes from localStorage
  const likesKey = `forum_reply_likes_${replyId}`;
  return JSON.parse(localStorage.getItem(likesKey) || '[]');
}

export async function getCategories() {
  const { data, error } = await supabase
    .from('forums')
    .select('category');

  if (error) throw error;
  
  const uniqueCategories = [...new Set((data || []).map(f => f.category))];

  return uniqueCategories.map((category: string) => ({
    id: category.toLowerCase().replace(/\s+/g, '-'),
    name: category,
    description: `Forum category: ${category}`,
  }));
}

export async function getLatestThreads(limit: number = 10) {
  const { data, error } = await supabase
    .from('forum_posts')
    .select('id, title, replies, created_at, author:users!forum_posts_author_id_fkey(username), forum:forums!forum_posts_forum_id_fkey(title)')
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
    .select('id, title, replies, created_at, author:users!forum_posts_author_id_fkey(username), forum:forums!forum_posts_forum_id_fkey(title)')
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
  getForumById,
  getForumBySlug,
  getForumPosts,
  getForumPostById,
  createForum,
  updateForum,
  deleteForum,
  createForumPost,
  updateForumPost,
  deleteForumPost,
  createForumReply,
  deleteForumReply,
  likeForumPost,
  unlikeForumPost,
  likeForumReply,
  unlikeForumReply,
  getForumPostLikes,
  getForumReplyLikes,
  getCategories,
  getLatestThreads,
  getAllThreads,
};
