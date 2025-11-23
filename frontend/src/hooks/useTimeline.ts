import { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { TimelineEntry } from '../types';

export const useTimeline = (eventId: string) => {
  const [entries, setEntries] = useState<TimelineEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTimeline = async () => {
    try {
      setLoading(true);
      const data = await api.getTimelineEntries(eventId);
      setEntries(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch timeline');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (eventId) {
      fetchTimeline();
    }
  }, [eventId]);

  const createEntry = async (entry: Omit<TimelineEntry, 'id' | 'eventId'>) => {
    const newEntry = await api.createTimelineEntry(eventId, entry);
    setEntries([...entries, newEntry]);
    return newEntry;
  };

  const updateEntry = async (entryId: string, updates: Partial<TimelineEntry>) => {
    const updatedEntry = await api.updateTimelineEntry(entryId, updates);
    setEntries(entries.map((e) => (e.id === entryId ? updatedEntry : e)));
    return updatedEntry;
  };

  const deleteEntry = async (entryId: string) => {
    await api.deleteTimelineEntry(entryId);
    setEntries(entries.filter((e) => e.id !== entryId));
  };

  return {
    entries,
    loading,
    error,
    createEntry,
    updateEntry,
    deleteEntry,
    refetch: fetchTimeline,
  };
};
