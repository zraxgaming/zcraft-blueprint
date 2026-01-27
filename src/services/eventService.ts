import { supabase } from '@/integrations/supabase/client';
import { sendWebhook, WebhookEvent } from './webhookService';

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  image_url: string | null;
  max_players: number | null;
  registered_count: number | null;
  created_at: string | null;
}

export async function getEvents(limit: number = 10, offset: number = 0) {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('date', { ascending: true })
    .range(offset, offset + limit - 1);

  if (error) throw error;
  return (data || []) as Event[];
}

export async function getUpcomingEvents(limit: number = 5) {
  const today = new Date().toISOString();
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .gte('date', today)
    .order('date', { ascending: true })
    .limit(limit);

  if (error) throw error;
  return (data || []) as Event[];
}

export async function getEvent(id: string) {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as Event;
}

export async function createEvent(event: Omit<Event, 'id' | 'created_at' | 'registered_count'>) {
  const { data, error } = await supabase
    .from('events')
    .insert({
      ...event,
      registered_count: 0,
    })
    .select()
    .single();

  if (error) throw error;

  // Send webhook
  await sendWebhook(WebhookEvent.EVENT_CREATED, {
    eventId: data.id,
    title: data.title,
    date: data.date,
    location: data.location,
    description: data.description,
  });

  return data as Event;
}

export async function updateEvent(id: string, updates: Partial<Event>) {
  const { data, error } = await supabase
    .from('events')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;

  // Send webhook
  await sendWebhook(WebhookEvent.EVENT_UPDATED, {
    eventId: data.id,
    title: data.title,
    date: data.date,
    location: data.location,
    updates,
  });

  return data as Event;
}

export async function deleteEvent(id: string) {
  // Get event info before deleting for webhook
  const event = await getEvent(id);

  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', id);

  if (error) throw error;

  // Send webhook
  await sendWebhook(WebhookEvent.EVENT_DELETED, {
    eventId: event.id,
    title: event.title,
    date: event.date,
    location: event.location,
  });
}

export async function registerForEvent(eventId: string) {
  const event = await getEvent(eventId);
  const newCount = (event.registered_count || 0) + 1;

  if (event.max_players && newCount > event.max_players) {
    throw new Error('Event is full');
  }

  const result = await updateEvent(eventId, { registered_count: newCount });

  // Send webhook for registration
  await sendWebhook(WebhookEvent.EVENT_REGISTERED, {
    eventId,
    title: event.title,
    registeredCount: newCount,
    maxPlayers: event.max_players,
  });

  return result;
}

export async function unregisterFromEvent(eventId: string) {
  const event = await getEvent(eventId);
  const newCount = Math.max(0, (event.registered_count || 0) - 1);

  const result = await updateEvent(eventId, { registered_count: newCount });

  // Send webhook for unregistration
  await sendWebhook(WebhookEvent.EVENT_UNREGISTERED, {
    eventId,
    title: event.title,
    registeredCount: newCount,
  });

  return result;
}

export async function getPastEvents(limit: number = 5) {
  const today = new Date().toISOString();
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .lt('date', today)
    .order('date', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data || []) as Event[];
}

export const eventService = {
  getEvents,
  getUpcomingEvents,
  getPastEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  registerForEvent,
  unregisterFromEvent,
};
