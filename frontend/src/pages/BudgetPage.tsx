import React from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { BudgetOverview } from '../components/budget/BudgetOverview';

export const BudgetPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const eventId = searchParams.get('eventId');
  
  if (!eventId) {
    return <div className="p-8 text-center text-gray-600">Please select an event</div>;
  }
  
  return <BudgetOverview eventId={eventId} />;
};
