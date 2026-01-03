import { supabase } from '@/lib/supabase';

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  image_url: string | null;
  max_players: number | null;
  registered_count: number;
  created_at: string;
}

export async function getEvents(limit: number = 10, offset: number = 0) {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('date', { ascending: true })
    .range(offset, offset + limit - 1);

  if (error) throw error;
  return data as Event[];
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
  return data as Event[];
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
      created_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;
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
  return data as Event;
}

export async function deleteEvent(id: string) {
  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function registerForEvent(eventId: string) {
  const event = await getEvent(eventId);
  const newCount = event.registered_count + 1;

  if (event.max_players && newCount > event.max_players) {
    throw new Error('Event is full');
  }

  return updateEvent(eventId, { registered_count: newCount });
}

export async function unregisterFromEvent(eventId: string) {
  const event = await getEvent(eventId);
  return updateEvent(eventId, { registered_count: Math.max(0, event.registered_count - 1) });
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
  return data as Event[];
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
