import React from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, CheckCircle, DollarSign } from 'lucide-react';
import { useEvents } from '../../hooks/useEvents';
import { Card } from '../common/Card';

export const Stats: React.FC = () => {
  const { t } = useTranslation();
  const { events } = useEvents();

  const stats = [
    {
      icon: Calendar,
      label: t('dashboard.totalEvents'),
      value: events.length,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      icon: CheckCircle,
      label: t('dashboard.completedTasks'),
      value: 0,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      icon: DollarSign,
      label: t('dashboard.totalBudget'),
      value: '0',
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} padding="md">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-lg ${stat.bg}`}>
                <Icon className={stat.color} size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
