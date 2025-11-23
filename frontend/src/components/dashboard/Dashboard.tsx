import React from 'react';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import { EventList } from './EventList';
import { Stats } from './Stats';
import { Button } from '../common/Button';
import { useNavigate } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">{t('dashboard.title')}</h1>
        <Button variant="primary" onClick={() => navigate('/events/new')}>
          <Plus size={20} className="mr-2" />
          {t('dashboard.createEvent')}
        </Button>
      </div>

      <Stats />
      
      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('dashboard.myEvents')}</h2>
        <EventList />
      </div>
    </div>
  );
};
