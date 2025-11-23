import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import { useBudget } from '../../hooks/useBudget';
import { CategoryList } from './CategoryList';
import { BudgetSummary } from './BudgetSummary';
import { CategoryForm } from './CategoryForm';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { Loading } from '../common/Loading';

interface BudgetOverviewProps {
  eventId: string;
}

export const BudgetOverview: React.FC<BudgetOverviewProps> = ({ eventId }) => {
  const { t } = useTranslation();
  const { categories, items, loading } = useBudget(eventId);
  const [showAddCategory, setShowAddCategory] = useState(false);

  if (loading) return <Loading />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">{t('budget.title')}</h1>
        <Button onClick={() => setShowAddCategory(true)}>
          <Plus size={20} className="mr-2" />
          {t('budget.addCategory')}
        </Button>
      </div>

      <BudgetSummary categories={categories} items={items} />

      <div className="mt-8">
        <CategoryList eventId={eventId} categories={categories} items={items} />
      </div>

      <Modal isOpen={showAddCategory} onClose={() => setShowAddCategory(false)} title={t('budget.addCategory')}>
        <CategoryForm eventId={eventId} onSuccess={() => setShowAddCategory(false)} />
      </Modal>
    </div>
  );
};
