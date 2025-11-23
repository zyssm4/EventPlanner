import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { ExportOptions } from '../components/exports/ExportOptions';

export const ExportsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const eventId = searchParams.get('eventId');
  
  if (!eventId) {
    return <div className="p-8 text-center text-gray-600">Please select an event</div>;
  }
  
  return <ExportOptions eventId={eventId} />;
};
