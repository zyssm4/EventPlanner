import React from 'react';

interface CategoryFormProps {
  eventId: string;
  onClose: () => void;
  onSaved?: () => void;
}

export const CategoryForm: React.FC<CategoryFormProps> = ({ onClose, onSaved }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Add Category</h2>
        <div className="mt-4 flex justify-end space-x-2">
          <button onClick={onClose} className="px-4 py-2 text-gray-600">Cancel</button>
          <button onClick={onSaved} className="px-4 py-2 bg-indigo-600 text-white rounded">Save</button>
        </div>
      </div>
    </div>
  );
};
