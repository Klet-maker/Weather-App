"use client";

import { useState, useEffect, useCallback } from 'react';
import type { CitySuggestion } from '@/types';
import { useLanguage } from '@/contexts/language-context';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger, PopoverAnchor } from '@/components/ui/popover';
import { Search } from 'lucide-react';
import type { GeoSearchResponse } from '@/types/weather';

interface SearchBarProps {
  onSearch: (city: CitySuggestion) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<CitySuggestion[]>([]);
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const { dictionary } = useLanguage();

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [query]);

  const fetchSuggestions = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setSuggestions([]);
      return;
    }
    try {
      const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${searchQuery}&count=5&language=en&format=json`);
      if (!response.ok) {
          throw new Error('Failed to fetch suggestions');
      }
      const data: GeoSearchResponse = await response.json();
      const citySuggestions = data.results?.map(r => ({
        name: r.name,
        lat: r.latitude,
        lon: r.longitude,
        country: r.country,
        state: r.admin1,
      })) || [];
      setSuggestions(citySuggestions);
      if (citySuggestions.length > 0) {
        setIsPopoverOpen(true);
      }
    } catch (error) {
      console.error(error);
      setSuggestions([]);
    }
  }, []);

  useEffect(() => {
    if (debouncedQuery) {
      fetchSuggestions(debouncedQuery);
    } else {
      setSuggestions([]);
      setIsPopoverOpen(false);
    }
  }, [debouncedQuery, fetchSuggestions]);

  const handleSuggestionClick = (city: CitySuggestion) => {
    setQuery(city.name);
    onSearch(city);
    setSuggestions([]);
    setIsPopoverOpen(false);
  };
  
  const handleSearchClick = () => {
    if(suggestions.length > 0) {
      handleSuggestionClick(suggestions[0]);
    }
  };

  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <div className="relative">
        <PopoverAnchor asChild>
          <div className="flex w-full items-center space-x-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={dictionary.searchPlaceholder as string}
              className="pl-10"
              aria-label="Search city"
            />
            <Button type="button" onClick={handleSearchClick} aria-label={dictionary.searchButton as string}>
              {dictionary.searchButton}
            </Button>
          </div>
        </PopoverAnchor>
      </div>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" onOpenAutoFocus={(e) => e.preventDefault()}>
        {suggestions.length > 0 && (
          <ul className="py-1">
            {suggestions.map((city, index) => (
              <li
                key={`${city.lat}-${city.lon}-${index}`}
                onClick={() => handleSuggestionClick(city)}
                className="px-4 py-2 hover:bg-accent cursor-pointer text-sm"
              >
                {city.name}{city.state ? `, ${city.state}` : ''}, {city.country}
              </li>
            ))}
          </ul>
        )}
      </PopoverContent>
    </Popover>
  );
}
