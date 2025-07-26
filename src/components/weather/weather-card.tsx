"use client";

import type { WeatherData } from '@/types';
import { useLanguage } from '@/contexts/language-context';
import { useTimeFormat } from '@/contexts/time-format-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { WeatherIcon } from '@/components/weather/weather-icon';
import { Droplets, Wind, Thermometer, Clock, Sun, Umbrella, Cloud, Percent, Eye, CloudFog, Gauge } from 'lucide-react';
import { WMO_CODE_DESCRIPTIONS } from '@/lib/weather-codes';
import { useEffect, useState } from 'react';

interface WeatherCardProps {
  data: WeatherData;
}

export function WeatherCard({ data }: WeatherCardProps) {
  const { dictionary, language } = useLanguage();
  const { timeFormat } = useTimeFormat();
  const [currentTime, setCurrentTime] = useState('');

  const timeOptions: Intl.DateTimeFormatOptions = {
    timeStyle: 'short',
    hour12: timeFormat === '12h',
  };

  useEffect(() => {
    const getTimeDetails = (timezone: string) => {
      const now = new Date();
      const time = new Intl.DateTimeFormat(language, {
        ...timeOptions,
        timeZone: timezone,
      }).format(now);
      setCurrentTime(time);
    };

    if (data.timezone) {
      getTimeDetails(data.timezone);
      const intervalId = setInterval(() => getTimeDetails(data.timezone), 1000);
      return () => clearInterval(intervalId);
    }
  }, [data.timezone, language, timeOptions]);
  
  const weatherDescription = WMO_CODE_DESCRIPTIONS[data.current.weather_code]?.[language] || WMO_CODE_DESCRIPTIONS[data.current.weather_code]?.en || "Unknown";

  const getDayOfWeek = (dateString: string, timeZone: string) => {
    const date = new Date(dateString + 'T00:00:00');
    return new Intl.DateTimeFormat(language, { weekday: 'short', timeZone }).format(date);
  };
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
            <h2 className="text-3xl md:text-4xl font-bold">{data.name}, {data.country}</h2>
            <div className="flex items-center gap-2 mt-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <p className="text-lg text-muted-foreground">{dictionary.localTime}: {currentTime}</p>
            </div>
            <div className="flex items-center gap-4 mt-4">
                <WeatherIcon weatherCode={data.current.weather_code} isDay={!!data.current.is_day} className="w-24 h-24 text-accent" />
                <div>
                    <p className="text-6xl md:text-7xl font-bold">{Math.round(data.current.temperature_2m)}°C</p>
                    <p className="text-lg capitalize text-muted-foreground">{weatherDescription}</p>
                </div>
            </div>

            <div className="mt-8 w-full">
              <h3 className="text-lg font-semibold mb-2 text-primary">{dictionary.forecast}</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                {data.daily.time.map((day, index) => (
                  <div key={day} className="flex flex-col items-center p-2 rounded-lg gap-1 bg-primary/5">
                    <p className="font-semibold">{getDayOfWeek(day, data.timezone)}</p>
                    <WeatherIcon weatherCode={data.daily.weather_code[index]} isDay={true} className="w-8 h-8 text-accent" />
                    <div className="flex flex-col text-sm">
                      <p className="font-medium text-foreground">{Math.round(data.daily.temperature_2m_max[index])}°</p>
                      <p className="text-muted-foreground">{Math.round(data.daily.temperature_2m_min[index])}°</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
        </div>
        
        <Card className="w-full bg-primary/5 border-primary/10">
            <CardHeader>
                <CardTitle>{dictionary.details}</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 sm:grid-cols-2 gap-4 text-base">
                <div className="flex items-center gap-3" title={dictionary.feelsLike as string}>
                    <Thermometer className="w-6 h-6 text-primary" />
                    <div>
                        <p className="font-medium">{Math.round(data.current.apparent_temperature)}°C</p>
                        <p className="text-sm text-muted-foreground">{dictionary.feelsLike}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3" title={dictionary.humidity as string}>
                    <Droplets className="w-6 h-6 text-primary" />
                    <div>
                        <p className="font-medium">{data.current.relative_humidity_2m}%</p>
                        <p className="text-sm text-muted-foreground">{dictionary.humidity}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3" title={dictionary.windSpeed as string}>
                    <Wind className="w-6 h-6 text-primary" />
                    <div>
                        <p className="font-medium">{data.current.wind_speed_10m.toFixed(1)} km/h</p>
                        <p className="text-sm text-muted-foreground">{dictionary.windSpeed}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3" title={dictionary.uvIndex as string}>
                    <Sun className="w-6 h-6 text-primary" />
                    <div>
                        <p className="font-medium">{data.current.uv_index?.toFixed(1) ?? 'N/A'}</p>
                        <p className="text-sm text-muted-foreground">{dictionary.uvIndex}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3" title={dictionary.precipitationProbability as string}>
                    <Umbrella className="w-6 h-6 text-primary" />
                    <div>
                        <p className="font-medium">{data.daily.precipitation_probability_max[0] ?? 0}%</p>
                        <p className="text-sm text-muted-foreground">{dictionary.precipitationProbability}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3" title={dictionary.visibility as string}>
                    <Eye className="w-6 h-6 text-primary" />
                    <div>
                        <p className="font-medium">{(data.current.visibility / 1000).toFixed(1)} km</p>
                        <p className="text-sm text-muted-foreground">{dictionary.visibility}</p>
                    </div>
                </div>
                 <div className="flex items-center gap-3" title={dictionary.cloudCover as string}>
                    <Cloud className="w-6 h-6 text-primary" />
                    <div>
                        <p className="font-medium">{data.current.cloud_cover}%</p>
                        <p className="text-sm text-muted-foreground">{dictionary.cloudCover}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3" title={dictionary.pressure as string}>
                    <Gauge className="w-6 h-6 text-primary" />
                    <div>
                        <p className="font-medium">{Math.round(data.current.surface_pressure)} hPa</p>
                        <p className="text-sm text-muted-foreground">{dictionary.pressure}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    </div>
  );
}
