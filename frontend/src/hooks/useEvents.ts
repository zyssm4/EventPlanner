import { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { Event } from '../types';

export const useEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const data = await api.getEvents();
      setEvents(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const createEvent = async (event: Omit<Event, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    const newEvent = await api.createEvent(event);
    setEvents([...events, newEvent]);
    return newEvent;
  };

  const updateEvent = async (id: string, updates: Partial<Event>) => {
    const updatedEvent = await api.updateEvent(id, updates);
    setEvents(events.map((e) => (e.id === id ? updatedEvent : e)));
    return updatedEvent;
  };

  const deleteEvent = async (id: string) => {
    await api.deleteEvent(id);
    setEvents(events.filter((e) => e.id !== id));
  };

  return {
    events,
    loading,
    error,
    createEvent,
    updateEvent,
    deleteEvent,
    refetch: fetchEvents,
  };
};
