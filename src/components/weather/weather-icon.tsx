"use client";

import { Sun, Moon, Cloud, CloudSun, CloudMoon, CloudRain, Cloudy, CloudSnow, CloudLightning, Wind, CloudFog, LucideProps } from 'lucide-react';
import React from 'react';

interface WeatherIconProps extends LucideProps {
  weatherCode: number;
  isDay: boolean;
}

export function WeatherIcon({ weatherCode, isDay, ...props }: WeatherIconProps) {
  // WMO Weather interpretation codes
  if (weatherCode >= 95) { // Thunderstorm
    return <CloudLightning {...props} />;
  }
  if (weatherCode >= 80 && weatherCode <= 82) { // Rain showers
      return <CloudRain {...props} />;
  }
  if ((weatherCode >= 51 && weatherCode <= 67) || (weatherCode >= 80 && weatherCode <= 82)) { // Drizzle, Rain
    return <CloudRain {...props} />;
  }
  if ((weatherCode >= 71 && weatherCode <= 77) || (weatherCode >= 85 && weatherCode <= 86)) { // Snow
    return <CloudSnow {...props} />;
  }
  if (weatherCode >= 45 && weatherCode <= 48) { // Fog
    return <CloudFog {...props} />;
  }
  if (weatherCode === 0) { // Clear
    return isDay ? <Sun {...props} /> : <Moon {...props} />;
  }
  if (weatherCode === 1) { // Mainly clear
    return isDay ? <CloudSun {...props} /> : <CloudMoon {...props} />;
  }
  if (weatherCode === 2) { // Partly cloudy
    return <Cloud {...props} />;
  }
  if (weatherCode === 3) { // Overcast
    return <Cloudy {...props} />;
  }
  
  return <Sun {...props} />; // Default
}
