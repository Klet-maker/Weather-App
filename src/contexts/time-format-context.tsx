"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { TimeFormat } from '@/types';

interface TimeFormatContextType {
  timeFormat: TimeFormat;
  setTimeFormat: (format: TimeFormat) => void;
}

const TimeFormatContext = createContext<TimeFormatContextType | undefined>(undefined);

export const TimeFormatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [timeFormat, setTimeFormatState] = useState<TimeFormat>('24h');

  useEffect(() => {
    const storedFormat = localStorage.getItem('weather-app-time-format') as TimeFormat | null;
    if (storedFormat) {
      setTimeFormatState(storedFormat);
    }
  }, []);

  const setTimeFormat = useCallback((newFormat: TimeFormat) => {
    setTimeFormatState(newFormat);
    localStorage.setItem('weather-app-time-format', newFormat);
  }, []);

  return (
    <TimeFormatContext.Provider value={{ timeFormat, setTimeFormat }}>
      {children}
    </TimeFormatContext.Provider>
  );
};

export const useTimeFormat = (): TimeFormatContextType => {
  const context = useContext(TimeFormatContext);
  if (context === undefined) {
    throw new Error('useTimeFormat must be used within a TimeFormatProvider');
  }
  return context;
};
