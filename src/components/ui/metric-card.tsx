'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon?: LucideIcon;
  iconColor?: string;
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'neutral';
  };
  format?: 'number' | 'currency' | 'percentage';
  animate?: boolean;
  glassEffect?: boolean;
  gradientBg?: boolean;
  className?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = 'text-primary',
  trend,
  format = 'number',
  animate = true,
  glassEffect = true,
  gradientBg = false,
  className,
}) => {
  const [displayValue, setDisplayValue] = useState(animate ? 0 : value);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (animate && typeof value === 'number') {
      setIsAnimating(true);
      const duration = 1000;
      const steps = 30;
      const stepValue = value / steps;
      let current = 0;
      
      const timer = setInterval(() => {
        current += stepValue;
        if (current >= value) {
          setDisplayValue(value);
          setIsAnimating(false);
          clearInterval(timer);
        } else {
          setDisplayValue(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(timer);
    } else {
      setDisplayValue(value);
    }
  }, [value, animate]);

  const formatValue = (val: number | string) => {
    if (typeof val === 'string') return val;
    
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-IN', {
          style: 'currency',
          currency: 'INR',
          maximumFractionDigits: 0,
        }).format(val);
      case 'percentage':
        return `${val}%`;
      default:
        return new Intl.NumberFormat('en-IN').format(val);
    }
  };

  const getTrendIcon = () => {
    if (!trend) return null;
    
    const iconClass = cn(
      'w-4 h-4',
      trend.direction === 'up' ? 'text-green-500' : 
      trend.direction === 'down' ? 'text-red-500' : 
      'text-gray-500'
    );

    switch (trend.direction) {
      case 'up':
        return <TrendingUp className={iconClass} />;
      case 'down':
        return <TrendingDown className={iconClass} />;
      default:
        return <Minus className={iconClass} />;
    }
  };

  return (
    <Card
      className={cn(
        'relative overflow-hidden transition-all duration-300',
        glassEffect && 'glass-card hover-lift',
        !glassEffect && 'hover:shadow-lg',
        gradientBg && 'gradient-mesh',
        className
      )}
    >
      {/* Background decoration */}
      {Icon && (
        <div className="absolute -right-4 -top-4 opacity-10">
          <Icon className="w-24 h-24" />
        </div>
      )}

      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {/* Title */}
            <p className="text-sm font-medium text-muted-foreground mb-1">
              {title}
            </p>

            {/* Value with animation */}
            <div className="flex items-baseline gap-2">
              <p 
                className={cn(
                  'text-3xl font-bold',
                  isAnimating && 'animate-count'
                )}
              >
                {formatValue(displayValue)}
              </p>
              
              {/* Trend indicator */}
              {trend && (
                <div className="flex items-center gap-1">
                  {getTrendIcon()}
                  <span className={cn(
                    'text-sm font-medium',
                    trend.direction === 'up' ? 'text-green-500' : 
                    trend.direction === 'down' ? 'text-red-500' : 
                    'text-gray-500'
                  )}>
                    {trend.value}%
                  </span>
                </div>
              )}
            </div>

            {/* Subtitle */}
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-2">
                {subtitle}
              </p>
            )}
          </div>

          {/* Icon */}
          {Icon && (
            <div className={cn(
              'flex items-center justify-center w-12 h-12 rounded-lg',
              glassEffect ? 'bg-white/50' : 'bg-primary/10'
            )}>
              <Icon className={cn('w-6 h-6', iconColor)} />
            </div>
          )}
        </div>

        {/* Progress bar for percentage format */}
        {format === 'percentage' && typeof displayValue === 'number' && (
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full transition-all duration-1000 ease-out"
                style={{ 
                  width: `${Math.min(displayValue, 100)}%`,
                  animation: animate ? 'slideUp 1s ease-out' : 'none'
                }}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MetricCard;