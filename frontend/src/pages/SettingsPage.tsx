import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { useAuth } from '../hooks/useAuth';
import { Card } from '../components/common/Card';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import { Button } from '../components/common/Button';
import type { Language } from '../types';

export const SettingsPage: React.FC = () => {
  const { t } = useTranslation();
  const { user, updateUser } = useAuth();
  const [success, setSuccess] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      language: user?.language || 'en',
    }
  });

  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'fr', label: 'Francais' },
    { value: 'de', label: 'Deutsch' },
  ];

  const onSubmit = async (data: any) => {
    try {
      await updateUser(data);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to update profile', error);
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">{t('settings.title')}</h1>
      
      <Card>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('settings.profile')}</h2>
        
        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg">
            {t('settings.updateSuccess')}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label={t('auth.name')}
            fullWidth
            {...register('name', { required: t('validation.required') })}
            error={errors.name?.message}
          />

          <Input
            label={t('auth.email')}
            type="email"
            fullWidth
            {...register('email', { required: t('validation.required') })}
            error={errors.email?.message}
          />

          <Select
            label={t('auth.language')}
            fullWidth
            options={languageOptions}
            {...register('language')}
          />

          <Button type="submit" variant="primary">
            {t('settings.updateProfile')}
          </Button>
        </form>
      </Card>
    </div>
  );
};
