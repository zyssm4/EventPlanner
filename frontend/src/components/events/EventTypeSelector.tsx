import React from 'react';
import { useTranslation } from 'react-i18next';
import type { EventType } from '../../types';

interface EventTypeSelectorProps {
  value: EventType;
  onChange: (type: EventType) => void;
}

export const EventTypeSelector: React.FC<EventTypeSelectorProps> = ({ value, onChange }) => {
  const { t } = useTranslation();

  const types: EventType[] = ['wedding', 'birthday', 'company'];

  return (
    <div className="grid grid-cols-3 gap-4">
      {types.map((type) => (
        <button
          key={type}
          type="button"
          onClick={() => onChange(type)}
          className={`p-4 rounded-lg border-2 transition-colors ${
            value === type
              ? 'border-blue-600 bg-blue-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <p className="font-medium">{t(`events.types.${type}`)}</p>
        </button>
      ))}
    </div>
  );
};
