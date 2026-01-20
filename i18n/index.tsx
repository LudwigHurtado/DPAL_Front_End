import React, { createContext, useState, useContext, ReactNode } from 'react';
import { translations } from './translations';

type Language = 'EN' | 'ES' | 'KO';

const SUPPORTED_LANGUAGES: Language[] = ['EN', 'ES', 'KO'];

interface LanguageContextType {
  language: Language;
  setLanguage: (language: string) => void;
  t: (key: string, replacements?: { [key: string]: string | number }) => string;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('EN');

  const setLanguage = (langCode: string) => {
    if (SUPPORTED_LANGUAGES.includes(langCode as Language)) {
        setLanguageState(langCode as Language);
    } else {
        setLanguageState('EN'); // Default to English if unsupported
    }
  }

  const t = (key: string, replacements?: { [key: string]: string | number }): string => {
    const keys = key.split('.');
    let result = (translations as any)[language] as any;
    for (const k of keys) {
      result = result?.[k];
      if (result === undefined) {
        // Fallback to English if translation is missing
        let fallbackResult = translations['EN'] as any;
        for (const fk of keys) {
            fallbackResult = fallbackResult?.[fk];
        }
        if(fallbackResult === undefined) return key;
        result = fallbackResult;
        break;
      }
    }

    if (typeof result === 'string' && replacements) {
      return Object.entries(replacements).reduce((acc, [placeholder, value]) => {
        return acc.replace(`{${placeholder}}`, String(value));
      }, result);
    }

    return result || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslations = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslations must be used within a LanguageProvider');
  }
  return context;
};