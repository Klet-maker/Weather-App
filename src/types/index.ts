import type { WeatherData as OpenMeteoData, GeoSuggestion } from './weather';

export type WeatherData = OpenMeteoData;
export type CitySuggestion = {
    name: string;
    lat: number;
    lon: number;
    country: string;
    state?: string;
};

export type Language = 'en' | 'es' | 'fr' | 'it' | 'de';

export type Theme = 'light' | 'dark' | 'auto';

export type TimeFormat = '12h' | '24h';

export type Dictionary = {
  [key: string]: string | { [key: string]: string } | any;
};
