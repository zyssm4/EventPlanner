import React from 'react';

interface TimelineViewProps {
  eventId: string;
}

export const TimelineView: React.FC<TimelineViewProps> = ({ eventId }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Timeline</h2>
      <p className="text-gray-500">Timeline for event {eventId}</p>
    </div>
  );
};
