import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { TimelineView } from '../components/timeline/TimelineView';

export const TimelinePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const eventId = searchParams.get('eventId');
  
  if (!eventId) {
    return <div className="p-8 text-center text-gray-600">Please select an event</div>;
  }
  
  return <TimelineView eventId={eventId} />;
};
