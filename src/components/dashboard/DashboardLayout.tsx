'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { ChevronRight, Home } from 'lucide-react';
import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface DashboardLayoutProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  title,
  subtitle,
  breadcrumbs = [],
  actions,
  children,
  className,
}) => {
  return (
    <div className={cn('dashboard-container animate-fade-in', className)}>
      {/* Breadcrumbs */}
      {breadcrumbs.length > 0 && (
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
          <Link href="/dashboard" className="hover:text-gray-900 transition-colors">
            <Home className="w-4 h-4" />
          </Link>
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={index}>
              <ChevronRight className="w-4 h-4 text-gray-400" />
              {crumb.href ? (
                <Link href={crumb.href} className="hover:text-gray-900 transition-colors">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-gray-900 font-medium">{crumb.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>
      )}

      {/* Header */}
      <div className="dashboard-header">
        <div className="section-header">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
            {subtitle && <p className="section-subtitle">{subtitle}</p>}
          </div>
          {actions && <div className="flex items-center gap-3">{actions}</div>}
        </div>
      </div>

      {/* Content */}
      <div className="dashboard-grid">{children}</div>
    </div>
  );
};

interface DashboardSectionProps {
  children: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
}

export const DashboardSection: React.FC<DashboardSectionProps> = ({
  children,
  className,
  fullWidth = false,
}) => {
  return (
    <section className={cn(fullWidth ? 'col-span-full' : '', className)}>
      {children}
    </section>
  );
};

interface MetricsRowProps {
  children: React.ReactNode;
  className?: string;
  columns?: 2 | 3 | 4 | 5 | 6;
}

export const MetricsRow: React.FC<MetricsRowProps> = ({
  children,
  className,
  columns = 4,
}) => {
  const gridCols = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-5',
    6: 'grid-cols-1 md:grid-cols-3 lg:grid-cols-6',
  };

  return (
    <div className={cn('grid gap-4', gridCols[columns], className)}>
      {children}
    </div>
  );
};

interface ContentGridProps {
  children: React.ReactNode;
  className?: string;
  sidebar?: React.ReactNode;
}

export const ContentGrid: React.FC<ContentGridProps> = ({
  children,
  className,
  sidebar,
}) => {
  if (!sidebar) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div className={cn('content-grid', className)}>
      <div className="main-content">{children}</div>
      <div className="sidebar-content">{sidebar}</div>
    </div>
  );
};