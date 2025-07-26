"use client";

import { ThemeProvider } from "@/contexts/theme-context";
import { LanguageProvider } from "@/contexts/language-context";
import { TimeFormatProvider } from "@/contexts/time-format-context";
import { useEffect, useState } from "react";
import type { Dictionary, Language } from "@/types";
import { getDictionary } from "@/lib/dictionaries";

export function Providers({ children }: { children: React.ReactNode }) {
    const [initialDictionary, setInitialDictionary] = useState<Dictionary | null>(null);
    const [initialLanguage, setInitialLanguage] = useState<Language>('es');

    useEffect(() => {
        const fetchInitialData = async () => {
            const lang = (localStorage.getItem('weather-app-language') as Language) || 'es';
            setInitialLanguage(lang);
            const dict = await getDictionary(lang);
            setInitialDictionary(dict);
        };
        fetchInitialData();
    }, []);

    if (!initialDictionary) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
        );
    }
    
    return (
        <ThemeProvider>
            <LanguageProvider initialLanguage={initialLanguage} initialDictionary={initialDictionary}>
                <TimeFormatProvider>
                    {children}
                </TimeFormatProvider>
            </LanguageProvider>
        </ThemeProvider>
    );
}
