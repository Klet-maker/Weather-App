"use client";

import { useState, useEffect, useCallback } from 'react';
import type { WeatherData, CitySuggestion } from '@/types';
import { useLanguage } from '@/contexts/language-context';
import { useTheme } from '@/contexts/theme-context';
import { useToast } from '@/hooks/use-toast';
import { generateWeatherAlert } from '@/ai/flows/weather-alert-generator';
import { WMO_CODE_DESCRIPTIONS } from '@/lib/weather-codes';

import { SearchBar } from '@/components/weather/search-bar';
import { WeatherCard } from '@/components/weather/weather-card';
import { AIRecommendationCard } from '@/components/weather/ai-recommendation-card';
import { SettingsControls } from '@/components/weather/settings-controls';
import { Card } from '@/components/ui/card';

export default function WeatherApp() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [aiAlert, setAiAlert] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(true);

  const { dictionary, language, isLanguageLoading } = useLanguage();
  const { theme, setEffectiveTheme } = useTheme();
  const { toast } = useToast();

  const fetchWeather = useCallback(async (lat: number, lon: number, cityName: string, country: string) => {
    setLoading(true);
    setError(null);
    setAiAlert(null);
    setIsAiLoading(true);
    
    try {
      const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m,cloud_cover,surface_pressure,uv_index,visibility&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&forecast_days=4&timezone=auto`);
      if (!weatherResponse.ok) {
        throw new Error(dictionary.fetchError as string);
      }
      const data: WeatherData = await weatherResponse.json();
      data.name = cityName;
      data.country = country;
      setWeatherData(data);

      const weatherDescription = WMO_CODE_DESCRIPTIONS[data.current.weather_code]?.[language] || WMO_CODE_DESCRIPTIONS[data.current.weather_code]?.en || "Unknown";
      
      try {
          const alertInput = {
            city: data.name,
            weatherDescription: weatherDescription,
            temperature: data.current.temperature_2m,
            humidity: data.current.relative_humidity_2m,
            windSpeed: data.current.wind_speed_10m,
            language: language,
          };
          const result = await generateWeatherAlert(alertInput);
          setAiAlert(result.alert);
      } catch (aiError) {
          console.error("AI Alert generation failed:", aiError);
          setAiAlert(null);
      } finally {
          setIsAiLoading(false);
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : dictionary.fetchError as string;
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
      setIsAiLoading(false);
    } finally {
      setLoading(false);
    }
  }, [dictionary, toast, language]);

  useEffect(() => {
    fetchWeather(40.4165, -3.70256, "Madrid", "ES");
  }, [fetchWeather]);

  useEffect(() => {
    if (theme === 'auto' && weatherData) {
        setEffectiveTheme(weatherData.current.is_day ? 'light' : 'dark');
    } else if (theme !== 'auto') {
        setEffectiveTheme(theme);
    }
  }, [theme, weatherData, setEffectiveTheme]);

  useEffect(() => {
    if (weatherData && !isLanguageLoading) {
      fetchWeather(weatherData.latitude, weatherData.longitude, weatherData.name!, weatherData.country!);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language, isLanguageLoading]);

  const handleSearch = (city: CitySuggestion) => {
    fetchWeather(city.lat, city.lon, city.name, city.country);
  };
  
  if (isLanguageLoading && !weatherData) {
    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 p-4">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl md:text-3xl font-bold text-primary">{dictionary.appName}</h1>
        <SettingsControls />
      </header>
      <main className="flex flex-col gap-6">
        <Card className="p-4 sm:p-6 rounded-xl shadow-lg border-primary/20">
            <SearchBar onSearch={handleSearch} />
            <div className="mt-6">
                {(loading || isLanguageLoading) && (
                    <div className="flex flex-col items-center justify-center h-96 gap-4">
                        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                        <p className="text-muted-foreground">{dictionary.loading}</p>
                    </div>
                )}
                {error && !loading && !isLanguageLoading && (
                    <div className="flex flex-col items-center justify-center h-96 text-center">
                        <p className="text-destructive">{error}</p>
                    </div>
                )}
                {weatherData && !loading && !isLanguageLoading && (
                  <div className="animate-in fade-in duration-500">
                    <WeatherCard data={weatherData} />
                  </div>
                )}
            </div>
        </Card>
        
        <div className="animate-in fade-in duration-700">
          <AIRecommendationCard alert={aiAlert} isLoading={isAiLoading} />
        </div>
      </main>
    </div>
  );
}
