import { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { Supplier } from '../types';

export const useSuppliers = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const data = await api.getSuppliers();
      setSuppliers(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch suppliers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const createSupplier = async (supplier: Omit<Supplier, 'id' | 'userId'>) => {
    const newSupplier = await api.createSupplier(supplier);
    setSuppliers([...suppliers, newSupplier]);
    return newSupplier;
  };

  const updateSupplier = async (id: string, updates: Partial<Supplier>) => {
    const updatedSupplier = await api.updateSupplier(id, updates);
    setSuppliers(suppliers.map((s) => (s.id === id ? updatedSupplier : s)));
    return updatedSupplier;
  };

  const deleteSupplier = async (id: string) => {
    await api.deleteSupplier(id);
    setSuppliers(suppliers.filter((s) => s.id !== id));
  };

  return {
    suppliers,
    loading,
    error,
    createSupplier,
    updateSupplier,
    deleteSupplier,
    refetch: fetchSuppliers,
  };
};
