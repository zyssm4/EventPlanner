import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Edit, Trash2, ArrowLeft } from 'lucide-react';
import { api } from '../../services/api';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Loading } from '../common/Loading';
import { formatDate } from '../../utils/format';
import type { Event } from '../../types';

interface EventDetailProps {
  eventId: string;
}

export const EventDetail: React.FC<EventDetailProps> = ({ eventId }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const data = await api.getEvent(eventId);
        setEvent(data);
      } catch (error) {
        console.error('Failed to fetch event', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [eventId]);

  if (loading) return <Loading />;
  if (!event) return <div>{t('errors.notFound')}</div>;

  return (
    <div>
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
        <ArrowLeft size={20} className="mr-2" />
        {t('common.back')}
      </Button>

      <Card>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">{event.name}</h1>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm">
              <Edit size={16} className="mr-2" />
              {t('common.edit')}
            </Button>
            <Button variant="danger" size="sm">
              <Trash2 size={16} className="mr-2" />
              {t('common.delete')}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">{t('events.eventType')}</p>
            <p className="text-lg font-medium">{t(`events.types.${event.type}`)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">{t('events.eventDate')}</p>
            <p className="text-lg font-medium">{formatDate(event.date)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">{t('events.guestCount')}</p>
            <p className="text-lg font-medium">{event.guestCount}</p>
          </div>
        </div>

        {event.description && (
          <div className="mt-6">
            <p className="text-sm text-gray-600 mb-2">{t('events.description')}</p>
            <p className="text-gray-900">{event.description}</p>
          </div>
        )}
      </Card>

      <div className="grid grid-cols-2 gap-4 mt-6">
        <Button onClick={() => navigate(`/budget?eventId=${eventId}`)}>{t('nav.budget')}</Button>
        <Button onClick={() => navigate(`/checklist?eventId=${eventId}`)}>{t('nav.checklist')}</Button>
        <Button onClick={() => navigate(`/timeline?eventId=${eventId}`)}>{t('nav.timeline')}</Button>
        <Button onClick={() => navigate(`/exports?eventId=${eventId}`)}>{t('nav.exports')}</Button>
      </div>
    </div>
  );
};
