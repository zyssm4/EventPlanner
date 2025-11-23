import { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { BudgetCategory, BudgetItem } from '../types';

export const useBudget = (eventId: string) => {
  const [categories, setCategories] = useState<BudgetCategory[]>([]);
  const [items, setItems] = useState<BudgetItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBudget = async () => {
    try {
      setLoading(true);
      const summary = await api.getBudgetSummary(eventId);
      // Note: The summary doesn't include full category/item data
      // This would need a separate endpoint for full budget data
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch budget');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (eventId) {
      fetchBudget();
    }
  }, [eventId]);

  const createCategory = async (category: Omit<BudgetCategory, 'id' | 'eventId'>) => {
    const newCategory = await api.createBudgetCategory(eventId, category);
    setCategories([...categories, newCategory]);
    return newCategory;
  };

  const updateCategory = async (categoryId: string, updates: Partial<BudgetCategory>) => {
    const updatedCategory = await api.updateBudgetCategory(categoryId, updates);
    setCategories(categories.map((c) => (c.id === categoryId ? updatedCategory : c)));
    return updatedCategory;
  };

  const deleteCategory = async (categoryId: string) => {
    await api.deleteBudgetCategory(categoryId);
    setCategories(categories.filter((c) => c.id !== categoryId));
    setItems(items.filter((i) => i.categoryId !== categoryId));
  };

  const createItem = async (categoryId: string, item: Omit<BudgetItem, 'id' | 'categoryId'>) => {
    const newItem = await api.createBudgetItem(categoryId, item);
    setItems([...items, newItem]);
    return newItem;
  };

  const updateItem = async (_categoryId: string, itemId: string, updates: Partial<BudgetItem>) => {
    const updatedItem = await api.updateBudgetItem(itemId, updates);
    setItems(items.map((i) => (i.id === itemId ? updatedItem : i)));
    return updatedItem;
  };

  const deleteItem = async (_categoryId: string, itemId: string) => {
    await api.deleteBudgetItem(itemId);
    setItems(items.filter((i) => i.id !== itemId));
  };

  return {
    categories,
    items,
    loading,
    error,
    createCategory,
    updateCategory,
    deleteCategory,
    createItem,
    updateItem,
    deleteItem,
    refetch: fetchBudget,
  };
};
