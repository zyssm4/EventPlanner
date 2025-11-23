import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { useAuth } from '../hooks/useAuth';
import { Card } from '../components/common/Card';
import { Select } from '../components/common/Select';
import { Button } from '../components/common/Button';

export const SettingsPage: React.FC = () => {
  const { t } = useTranslation();
  const { user, updateLanguage } = useAuth();
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit } = useForm({
    defaultValues: {
      language: user?.language || 'en',
    }
  });

  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'fr', label: 'Français' },
    { value: 'de', label: 'Deutsch' },
  ];

  const onSubmit = async (data: { language: string }) => {
    try {
      setLoading(true);
      await updateLanguage(data.language);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to update settings', error);
    } finally {
      setLoading(false);
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

        <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
          <p className="text-sm text-gray-600">
            <strong>{t('auth.name')}:</strong> {user?.name}
          </p>
          <p className="text-sm text-gray-600">
            <strong>{t('auth.email')}:</strong> {user?.email}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Select
            label={t('auth.language')}
            fullWidth
            options={languageOptions}
            {...register('language')}
          />

          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? t('common.loading') : t('settings.updateProfile')}
          </Button>
        </form>
      </Card>
    </div>
  );
};
