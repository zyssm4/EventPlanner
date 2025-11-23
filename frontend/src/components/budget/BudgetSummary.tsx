import React from 'react';

interface BudgetSummaryProps {
  eventId: string;
}

export const BudgetSummary: React.FC<BudgetSummaryProps> = ({ eventId }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="font-semibold text-gray-900">Budget Summary</h3>
      <p className="text-gray-500">Summary for event {eventId}</p>
    </div>
  );
};
