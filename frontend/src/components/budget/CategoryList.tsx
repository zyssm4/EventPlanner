import React from 'react';

interface CategoryListProps {
  eventId: string;
  onCategorySelect?: (categoryId: string) => void;
}

export const CategoryList: React.FC<CategoryListProps> = ({ eventId, onCategorySelect }) => {
  return (
    <div className="space-y-4">
      <p className="text-gray-500">Budget categories for event {eventId}</p>
    </div>
  );
};
