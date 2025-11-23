import { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { ChecklistItem } from '../types';

export const useChecklist = (eventId: string) => {
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchChecklist = async () => {
    try {
      setLoading(true);
      const data = await api.getChecklistItems(eventId);
      setItems(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch checklist');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (eventId) {
      fetchChecklist();
    }
  }, [eventId]);

  const createItem = async (item: Omit<ChecklistItem, 'id' | 'eventId' | 'createdAt' | 'updatedAt'>) => {
    const newItem = await api.createChecklistItem(eventId, item);
    setItems([...items, newItem]);
    return newItem;
  };

  const updateItem = async (itemId: string, updates: Partial<ChecklistItem>) => {
    const updatedItem = await api.updateChecklistItem(eventId, itemId, updates);
    setItems(items.map((i) => (i.id === itemId ? updatedItem : i)));
    return updatedItem;
  };

  const deleteItem = async (itemId: string) => {
    await api.deleteChecklistItem(eventId, itemId);
    setItems(items.filter((i) => i.id !== itemId));
  };

  const toggleComplete = async (itemId: string) => {
    const item = items.find((i) => i.id === itemId);
    if (item) {
      await updateItem(itemId, { completed: !item.completed });
    }
  };

  const generateTemplate = async (eventType: string) => {
    const templateItems = await api.generateChecklistTemplate(eventId, eventType);
    setItems([...items, ...templateItems]);
    return templateItems;
  };

  return {
    items,
    loading,
    error,
    createItem,
    updateItem,
    deleteItem,
    toggleComplete,
    generateTemplate,
    refetch: fetchChecklist,
  };
};
