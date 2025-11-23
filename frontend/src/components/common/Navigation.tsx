import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LayoutDashboard, Calendar, DollarSign, CheckSquare, Clock, Truck, Download, Settings } from 'lucide-react';

export const Navigation: React.FC = () => {
  const { t } = useTranslation();

  const navItems = [
    { to: '/', icon: LayoutDashboard, label: t('nav.dashboard') },
    { to: '/events', icon: Calendar, label: t('nav.events') },
    { to: '/budget', icon: DollarSign, label: t('nav.budget') },
    { to: '/checklist', icon: CheckSquare, label: t('nav.checklist') },
    { to: '/timeline', icon: Clock, label: t('nav.timeline') },
    { to: '/logistics', icon: Truck, label: t('nav.logistics') },
    { to: '/exports', icon: Download, label: t('nav.exports') },
    { to: '/settings', icon: Settings, label: t('nav.settings') },
  ];

  return (
    <nav className="bg-white border-r border-gray-200 w-64 min-h-screen p-4">
      <div className="space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                }`
              }
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
