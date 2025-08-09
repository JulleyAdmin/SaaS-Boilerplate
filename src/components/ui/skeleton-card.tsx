import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface SkeletonCardProps {
  className?: string;
  lines?: number;
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({ 
  className,
  lines = 3 
}) => {
  return (
    <Card className={cn('animate-pulse', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-200 animate-shimmer" />
            <div className="space-y-2">
              <div className="h-5 w-32 bg-gray-200 rounded animate-shimmer" />
              <div className="h-4 w-24 bg-gray-200 rounded animate-shimmer" />
            </div>
          </div>
          <div className="w-8 h-8 bg-gray-200 rounded animate-shimmer" />
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div 
            key={i} 
            className="h-4 bg-gray-200 rounded animate-shimmer"
            style={{ 
              width: `${Math.random() * 40 + 60}%`,
              animationDelay: `${i * 0.1}s`
            }}
          />
        ))}
      </CardContent>
    </Card>
  );
};

export const SkeletonMetricCard: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <Card className={cn('animate-pulse', className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-2">
            <div className="h-4 w-24 bg-gray-200 rounded animate-shimmer" />
            <div className="h-8 w-16 bg-gray-200 rounded animate-shimmer" />
            <div className="h-3 w-20 bg-gray-200 rounded animate-shimmer" />
          </div>
          <div className="w-12 h-12 bg-gray-200 rounded-lg animate-shimmer" />
        </div>
      </CardContent>
    </Card>
  );
};