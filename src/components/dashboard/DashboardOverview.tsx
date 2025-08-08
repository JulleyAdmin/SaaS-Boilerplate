'use client';

import { useUser } from '@clerk/nextjs';
import { useTranslations } from 'next-intl';
import { Suspense, useEffect, useState } from 'react';

import { Skeleton } from '@/components/ui/skeleton';
import type { UserRole } from '@/types/hms';

import { AdminDashboard } from './role-dashboards/AdminDashboard';
import { DoctorDashboard } from './role-dashboards/DoctorDashboard';
import { GeneralDashboard } from './role-dashboards/GeneralDashboard';
import { LabDashboard } from './role-dashboards/LabDashboard';
import { NurseDashboard } from './role-dashboards/NurseDashboard';
import { PharmacyDashboard } from './role-dashboards/PharmacyDashboard';
import { ReceptionDashboard } from './role-dashboards/ReceptionDashboard';

/**
 * Main Dashboard Overview Component
 * Routes users to appropriate role-based dashboard
 */
export function DashboardOverview() {
  const { user } = useUser();
  const t = useTranslations('Dashboard');
  const [currentDate, setCurrentDate] = useState('');

  // Get user role from metadata (this would come from your user management system)
  const userRole = user?.publicMetadata?.role as UserRole || 'Support-Staff';

  // Handle date on client side to prevent hydration errors
  useEffect(() => {
    setCurrentDate(new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t('welcome')}
            ,
            {user?.firstName || 'User'}
          </h1>
          <p className="text-muted-foreground">
            {t('role')}
            :
            {userRole.replace('-', ' ')}
          </p>
        </div>
        <div className="text-sm text-muted-foreground">
          {currentDate}
        </div>
      </div>

      <Suspense fallback={<DashboardSkeleton />}>
        <RoleBasedDashboard role={userRole} />
      </Suspense>
    </div>
  );
}

/**
 * Role-based dashboard router
 */
function RoleBasedDashboard({ role }: { role: UserRole }) {
  // Route to appropriate dashboard based on role
  if (role.includes('Doctor') || role.includes('Surgeon') || role.includes('Specialist')) {
    return <DoctorDashboard />;
  }

  if (role.includes('Nurse') || role === 'Midwife') {
    return <NurseDashboard />;
  }

  if (role === 'Receptionist' || role === 'Front-Desk-Executive') {
    return <ReceptionDashboard />;
  }

  if (role === 'Admin' || role === 'Hospital-Administrator' || role === 'Medical-Superintendent') {
    return <AdminDashboard />;
  }

  if (role.includes('Pharmacist')) {
    return <PharmacyDashboard />;
  }

  if (role.includes('Lab') || role.includes('Technician')) {
    return <LabDashboard />;
  }

  // Default dashboard for other roles
  return <GeneralDashboard />;
}

/**
 * Loading skeleton for dashboard
 */
function DashboardSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <Skeleton key={i} className="h-32" />
      ))}
    </div>
  );
}
