import React, { createContext, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import type { Language } from '../types';

interface LanguageContextType {
  language: Language;
  changeLanguage: (lang: Language) => void;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const { i18n } = useTranslation();

  const changeLanguage = (lang: Language) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('language', lang);
  };

  return (
    <LanguageContext.Provider
      value={{
        language: i18n.language as Language,
        changeLanguage,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};
