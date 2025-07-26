"use client";

import { useTheme } from '@/contexts/theme-context';
import { useLanguage } from '@/contexts/language-context';
import { useTimeFormat } from '@/contexts/time-format-context';
import type { Language, Theme, TimeFormat } from '@/types';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Languages, SunMoon, Clock } from 'lucide-react';

export function SettingsControls() {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, dictionary } = useLanguage();
  const { timeFormat, setTimeFormat } = useTimeFormat();

  const handleLanguageChange = (value: string) => {
    const newLang = value as Language;
    setLanguage(newLang);
  };

  const handleThemeChange = (value: string) => {
    setTheme(value as Theme);
  };

  const handleTimeFormatChange = (value: string) => {
    setTimeFormat(value as TimeFormat);
  };

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <SunMoon className="h-5 w-5" />
            <span className="sr-only">{dictionary.theme}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>{dictionary.theme}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup value={theme} onValueChange={handleThemeChange}>
            <DropdownMenuRadioItem value="light">{dictionary.light}</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="dark">{dictionary.dark}</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="auto">{dictionary.auto}</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <Languages className="h-5 w-5" />
            <span className="sr-only">{dictionary.language}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>{dictionary.language}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup value={language} onValueChange={handleLanguageChange}>
            <DropdownMenuRadioItem value="en">{dictionary.languages.en}</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="es">{dictionary.languages.es}</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="fr">{dictionary.languages.fr}</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="it">{dictionary.languages.it}</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="de">{dictionary.languages.de}</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <Clock className="h-5 w-5" />
            <span className="sr-only">{dictionary.timeFormat}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>{dictionary.timeFormat}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup value={timeFormat} onValueChange={handleTimeFormatChange}>
            <DropdownMenuRadioItem value="24h">{dictionary.timeFormats.h24}</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="12h">{dictionary.timeFormats.h12}</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
