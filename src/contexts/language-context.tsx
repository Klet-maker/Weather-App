"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Language, Dictionary } from '@/types';
import { getDictionary } from '@/lib/dictionaries';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  dictionary: Dictionary;
  isLanguageLoading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode; initialLanguage?: Language; initialDictionary: Dictionary }> = ({ children, initialLanguage = 'es', initialDictionary }) => {
  const [language, setLanguageState] = useState<Language>(initialLanguage);
  const [dictionary, setDictionary] = useState<Dictionary>(initialDictionary);
  const [isLanguageLoading, setIsLanguageLoading] = useState(false);

  const setLanguage = async (newLanguage: Language) => {
    if (newLanguage !== language) {
      setIsLanguageLoading(true);
      const newDictionary = await getDictionary(newLanguage);
      setDictionary(newDictionary);
      setLanguageState(newLanguage);
      localStorage.setItem('weather-app-language', newLanguage);
      setIsLanguageLoading(false);
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, dictionary, isLanguageLoading }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
