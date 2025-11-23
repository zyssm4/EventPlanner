import React from 'react';

interface BudgetCategory {
  id: string;
  name: string;
}

interface BudgetItem {
  id: string;
  categoryId: string;
  name: string;
  estimatedCost: number;
  actualCost: number;
}

interface CategoryListProps {
  eventId: string;
  categories: BudgetCategory[];
  items: BudgetItem[];
  onCategorySelect?: (categoryId: string) => void;
}

export const CategoryList: React.FC<CategoryListProps> = ({ categories, items, onCategorySelect }) => {
  return (
    <div className="space-y-4">
      {categories.length === 0 ? (
        <p className="text-gray-500">No categories yet. Add your first budget category.</p>
      ) : (
        categories.map((category) => {
          const categoryItems = items.filter((item) => item.categoryId === category.id);
          const total = categoryItems.reduce((sum, item) => sum + item.estimatedCost, 0);

          return (
            <div
              key={category.id}
              className="bg-white rounded-lg shadow p-4 cursor-pointer hover:shadow-md"
              onClick={() => onCategorySelect?.(category.id)}
            >
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-gray-900">{category.name}</h3>
                <span className="text-gray-600">${total.toFixed(2)}</span>
              </div>
              <p className="text-sm text-gray-500">{categoryItems.length} items</p>
            </div>
          );
        })
      )}
    </div>
  );
};
