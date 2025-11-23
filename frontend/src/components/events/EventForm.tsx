import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { useEvents } from '../../hooks/useEvents';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Button } from '../common/Button';
import type { EventType } from '../../types';

interface EventFormData {
  name: string;
  type: EventType;
  date: string;
  guestCount: number;
  description?: string;
}

export const EventForm: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { createEvent } = useEvents();
  const { register, handleSubmit, formState: { errors } } = useForm<EventFormData>();

  const eventTypeOptions = [
    { value: 'wedding', label: t('events.types.wedding') },
    { value: 'birthday', label: t('events.types.birthday') },
    { value: 'company', label: t('events.types.company') },
  ];

  const onSubmit = async (data: EventFormData) => {
    try {
      const event = await createEvent({
        ...data,
        date: new Date(data.date),
        guestCount: Number(data.guestCount),
      });
      navigate(`/events/${event.id}`);
    } catch (error) {
      console.error('Failed to create event', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-2xl">
      <Input
        label={t('events.eventName')}
        fullWidth
        {...register('name', { required: t('validation.required') })}
        error={errors.name?.message}
      />

      <Select
        label={t('events.eventType')}
        fullWidth
        options={eventTypeOptions}
        {...register('type', { required: t('validation.required') })}
        error={errors.type?.message}
      />

      <Input
        label={t('events.eventDate')}
        type="date"
        fullWidth
        {...register('date', { required: t('validation.required') })}
        error={errors.date?.message}
      />

      <Input
        label={t('events.guestCount')}
        type="number"
        fullWidth
        {...register('guestCount', { required: t('validation.required'), min: 1 })}
        error={errors.guestCount?.message}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t('events.description')}
        </label>
        <textarea
          {...register('description')}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
        />
      </div>

      <div className="flex gap-2">
        <Button type="submit" variant="primary">{t('common.save')}</Button>
        <Button type="button" variant="secondary" onClick={() => navigate(-1)}>{t('common.cancel')}</Button>
      </div>
    </form>
  );
};
