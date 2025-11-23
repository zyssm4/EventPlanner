import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { Calendar, Mail, Lock } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import type { LoginCredentials } from '../../types';

export const LoginForm: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginCredentials>();

  const onSubmit = async (data: LoginCredentials) => {
    try {
      setLoading(true);
      setError(null);
      await login(data);
      navigate('/');
    } catch (err) {
      setError(t('auth.loginError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4">
      <div className="max-w-md w-full">
        {/* Logo and Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl shadow-lg mb-4">
            <Calendar className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Event Planner</h1>
          <p className="text-gray-500 mt-1">Plan your perfect event</p>
        </div>

        {/* Login Card */}
        <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
            {t('auth.loginTitle')}
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="relative">
              <Mail className="absolute left-3 top-9 w-5 h-5 text-gray-400" />
              <Input
                label={t('auth.email')}
                type="email"
                fullWidth
                className="pl-10"
                placeholder="admin@eventplanner.local"
                {...register('email', { required: t('validation.required') })}
                error={errors.email?.message}
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-9 w-5 h-5 text-gray-400" />
              <Input
                label={t('auth.password')}
                type="password"
                fullWidth
                className="pl-10"
                placeholder="••••••••"
                {...register('password', { required: t('validation.required') })}
                error={errors.password?.message}
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              fullWidth
              disabled={loading}
              className="mt-6 py-3 text-base font-semibold shadow-lg hover:shadow-xl transition-shadow"
            >
              {loading ? t('common.loading') : t('auth.login')}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {t('auth.dontHaveAccount')}{' '}
              <Link to="/register" className="text-blue-600 hover:text-blue-700 font-semibold">
                {t('auth.register')}
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-6">
          Multi-language Event Planning Assistant
        </p>
      </div>
    </div>
  );
};
