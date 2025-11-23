import React from 'react';
import { useTranslation } from 'react-i18next';
import { useEvents } from '../../hooks/useEvents';
import { EventCard } from './EventCard';
import { Loading } from '../common/Loading';

export const EventList: React.FC = () => {
  const { t } = useTranslation();
  const { events, loading } = useEvents();

  if (loading) {
    return <Loading />;
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
        <p className="text-gray-600 mb-2">{t('dashboard.noEvents')}</p>
        <p className="text-sm text-gray-500">{t('dashboard.getStarted')}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
};
