import React from 'react';

interface BudgetCategory {
  id: string;
  name: string;
}

interface BudgetItem {
  id: string;
  estimatedCost: number;
  actualCost: number;
}

interface BudgetSummaryProps {
  categories: BudgetCategory[];
  items: BudgetItem[];
}

export const BudgetSummary: React.FC<BudgetSummaryProps> = ({ categories, items }) => {
  const totalEstimated = items.reduce((sum, item) => sum + item.estimatedCost, 0);
  const totalActual = items.reduce((sum, item) => sum + item.actualCost, 0);

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="font-semibold text-gray-900">Budget Summary</h3>
      <div className="mt-2 grid grid-cols-3 gap-4">
        <div>
          <p className="text-sm text-gray-500">Categories</p>
          <p className="text-xl font-bold">{categories.length}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Estimated</p>
          <p className="text-xl font-bold">${totalEstimated.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Actual</p>
          <p className="text-xl font-bold">${totalActual.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};
