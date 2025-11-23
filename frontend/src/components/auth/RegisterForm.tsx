import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../hooks/useAuth';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Button } from '../common/Button';
import type { RegisterData, Language } from '../../types';

export const RegisterForm: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterData>();

  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'fr', label: 'Francais' },
    { value: 'de', label: 'Deutsch' },
  ];

  const onSubmit = async (data: RegisterData) => {
    try {
      setLoading(true);
      setError(null);
      await registerUser(data);
      navigate('/');
    } catch (err) {
      setError(t('auth.registerError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            {t('auth.registerTitle')}
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label={t('auth.name')}
              type="text"
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

            <Input
              label={t('auth.password')}
              type="password"
              fullWidth
              {...register('password', {
                required: t('validation.required'),
                minLength: { value: 6, message: t('validation.minLength', { count: 6 }) }
              })}
              error={errors.password?.message}
            />

            <Select
              label={t('auth.language')}
              fullWidth
              options={languageOptions}
              {...register('language', { required: t('validation.required') })}
              error={errors.language?.message}
            />

            <Button type="submit" variant="primary" fullWidth disabled={loading}>
              {loading ? t('common.loading') : t('auth.register')}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {t('auth.alreadyHaveAccount')}{' '}
              <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                {t('auth.login')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
