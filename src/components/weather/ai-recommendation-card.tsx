"use client";

import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useLanguage } from '@/contexts/language-context';
import { Sparkles } from 'lucide-react';

interface AIRecommendationCardProps {
  alert: string | null;
  isLoading: boolean;
}

export function AIRecommendationCard({ alert, isLoading }: AIRecommendationCardProps) {
  const { dictionary } = useLanguage();

  return (
    <Card className="relative overflow-hidden rounded-xl border-primary/20 bg-gradient-to-br from-primary/10 via-background to-background shadow-lg">
      <div className="flex flex-col h-full p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-primary/80 rounded-full">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-primary">{dictionary.aiRecommendationTitle}</h3>
        </div>
        <div className="flex-grow">
          {isLoading && (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-[80%]" />
            </div>
          )}
          {alert && !isLoading && (
            <p className="text-sm md:text-base text-foreground/90">{alert}</p>
          )}
        </div>
      </div>
    </Card>
  );
}
