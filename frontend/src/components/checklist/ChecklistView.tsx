import React from 'react';

interface ChecklistViewProps {
  eventId: string;
}

export const ChecklistView: React.FC<ChecklistViewProps> = ({ eventId }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Checklist</h2>
      <p className="text-gray-500">Checklist items for event {eventId}</p>
    </div>
  );
};
