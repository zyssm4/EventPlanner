import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Calendar, Users } from 'lucide-react';
import { Card } from '../common/Card';
import { formatDate } from '../../utils/format';
import type { Event } from '../../types';

interface EventCardProps {
  event: Event;
}

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate(`/events/${event.id}`)}>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{event.name}</h3>
      <p className="text-sm text-gray-600 mb-4">{t(`events.types.${event.type}`)}</p>
      
      <div className="flex items-center gap-4 text-sm text-gray-600">
        <div className="flex items-center gap-1">
          <Calendar size={16} />
          <span>{formatDate(event.date)}</span>
        </div>
        <div className="flex items-center gap-1">
          <Users size={16} />
          <span>{event.guestCount}</span>
        </div>
      </div>
    </Card>
  );
};
