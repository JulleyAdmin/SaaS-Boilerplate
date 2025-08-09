'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon, TrendingUp, TrendingDown, AlertCircle, Info, CheckCircle, XCircle } from 'lucide-react';

// ============= Standard Metric Card =============
interface StandardMetricCardProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
  subtitle?: string;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  className?: string;
}

export const StandardMetricCard: React.FC<StandardMetricCardProps> = ({
  label,
  value,
  icon: Icon,
  trend,
  subtitle,
  color = 'primary',
  className,
}) => {
  const colorClasses = {
    primary: 'text-cyan-600 bg-cyan-50',
    secondary: 'text-indigo-600 bg-indigo-50',
    success: 'text-green-600 bg-green-50',
    warning: 'text-amber-600 bg-amber-50',
    error: 'text-red-600 bg-red-50',
  };

  return (
    <div className={cn('card-base card-hover p-6', className)}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="metric-label">{label}</p>
          <div className="flex items-baseline gap-2 mt-2">
            <p className="metric-value">{value}</p>
            {trend && (
              <div className={cn(
                'metric-change',
                trend.direction === 'up' ? 'metric-change-positive' : 'metric-change-negative'
              )}>
                {trend.direction === 'up' ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                <span>{trend.value}%</span>
              </div>
            )}
          </div>
          {subtitle && <p className="text-xs text-gray-500 mt-2">{subtitle}</p>}
        </div>
        {Icon && (
          <div className={cn('p-3 rounded-lg', colorClasses[color])}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </div>
  );
};

// ============= Action Card =============
interface ActionCardProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  actions: Array<{
    label: string;
    onClick: () => void;
    icon?: LucideIcon;
    variant?: 'primary' | 'secondary';
  }>;
  className?: string;
}

export const ActionCard: React.FC<ActionCardProps> = ({
  title,
  description,
  icon: Icon,
  actions,
  className,
}) => {
  return (
    <div className={cn('card-base p-6', className)}>
      <div className="flex items-start gap-4 mb-4">
        {Icon && (
          <div className="p-2 bg-gray-100 rounded-lg">
            <Icon className="w-5 h-5 text-gray-700" />
          </div>
        )}
        <div>
          <h3 className="font-semibold text-gray-900">{title}</h3>
          {description && <p className="text-sm text-gray-600 mt-1">{description}</p>}
        </div>
      </div>
      <div className="space-y-2">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className={cn(
              'w-full text-left px-4 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2',
              action.variant === 'primary'
                ? 'bg-cyan-600 text-white hover:bg-cyan-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            )}
          >
            {action.icon && <action.icon className="w-4 h-4" />}
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
};

// ============= Alert Card =============
interface AlertCardProps {
  title: string;
  items: Array<{
    id: string;
    label: string;
    description?: string;
    type: 'info' | 'success' | 'warning' | 'error';
    action?: () => void;
    actionLabel?: string;
  }>;
  className?: string;
}

export const AlertCard: React.FC<AlertCardProps> = ({ title, items, className }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return CheckCircle;
      case 'warning':
        return AlertCircle;
      case 'error':
        return XCircle;
      default:
        return Info;
    }
  };

  const getColorClass = (type: string) => {
    switch (type) {
      case 'success':
        return 'text-green-600 bg-green-50';
      case 'warning':
        return 'text-amber-600 bg-amber-50';
      case 'error':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-blue-600 bg-blue-50';
    }
  };

  return (
    <div className={cn('card-base', className)}>
      <div className="p-6 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="divide-y divide-gray-100">
        {items.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-500" />
            <p>All systems operational</p>
          </div>
        ) : (
          items.map((item) => {
            const Icon = getIcon(item.type);
            return (
              <div key={item.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-3">
                  <div className={cn('p-1.5 rounded-lg', getColorClass(item.type))}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{item.label}</p>
                    {item.description && (
                      <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                    )}
                    {item.action && (
                      <button
                        onClick={item.action}
                        className="text-sm text-cyan-600 hover:text-cyan-700 font-medium mt-2"
                      >
                        {item.actionLabel || 'Take Action'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

// ============= Queue Card =============
interface QueueCardProps {
  id: string;
  patientName: string;
  doctorName?: string;
  time?: string;
  status: 'pending' | 'in-progress' | 'completed' | 'urgent';
  details?: string;
  badge?: string;
  actions?: Array<{
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'danger';
  }>;
  className?: string;
}

export const QueueCard: React.FC<QueueCardProps> = ({
  id,
  patientName,
  doctorName,
  time,
  status,
  details,
  badge,
  actions,
  className,
}) => {
  const statusColors = {
    pending: 'bg-gray-100 text-gray-700',
    'in-progress': 'bg-blue-100 text-blue-700',
    completed: 'bg-green-100 text-green-700',
    urgent: 'bg-red-100 text-red-700',
  };

  const actionColors = {
    primary: 'bg-cyan-600 text-white hover:bg-cyan-700',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  };

  return (
    <div className={cn('card-base p-4 hover:shadow-md transition-all', className)}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white font-semibold">
            {id}
          </div>
          <div>
            <p className="font-semibold text-gray-900">{patientName}</p>
            {doctorName && <p className="text-sm text-gray-600">Dr. {doctorName}</p>}
            {details && <p className="text-sm text-gray-500 mt-1">{details}</p>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {badge && (
            <span className={cn('badge-base', statusColors[status])}>
              {badge}
            </span>
          )}
          {time && <span className="text-sm text-gray-500">{time}</span>}
        </div>
      </div>
      {actions && actions.length > 0 && (
        <div className="flex gap-2">
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              className={cn(
                'px-3 py-1.5 text-sm font-medium rounded-lg transition-all',
                actionColors[action.variant || 'secondary']
              )}
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ============= Stats Card with Progress =============
interface StatsCardProps {
  title: string;
  value: number;
  total: number;
  unit?: string;
  color?: 'primary' | 'success' | 'warning' | 'error';
  icon?: LucideIcon;
  showProgress?: boolean;
  className?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  total,
  unit = '',
  color = 'primary',
  icon: Icon,
  showProgress = true,
  className,
}) => {
  const percentage = Math.round((value / total) * 100);
  
  const colorClasses = {
    primary: 'bg-cyan-600',
    success: 'bg-green-600',
    warning: 'bg-amber-600',
    error: 'bg-red-600',
  };

  return (
    <div className={cn('card-base p-6', className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">{title}</h3>
        {Icon && <Icon className="w-5 h-5 text-gray-400" />}
      </div>
      <div className="space-y-2">
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold">{value}</span>
          <span className="text-gray-500">/ {total} {unit}</span>
        </div>
        {showProgress && (
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Progress</span>
              <span className="font-medium">{percentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className={cn('h-full transition-all duration-500', colorClasses[color])}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};