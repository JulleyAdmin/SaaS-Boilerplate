'use client';

import React, { useState } from 'react';
import {
  DashboardLayout,
  MetricsRow,
  ContentGrid,
  DashboardSection,
} from '@/components/dashboard/DashboardLayout';
import {
  StandardMetricCard,
  ActionCard,
  AlertCard,
  QueueCard,
  StatsCard,
} from '@/components/dashboard/StandardCards';
import {
  StandardButton,
  ButtonGroup,
  StandardTabs,
  StandardBadge,
  EmptyState,
} from '@/components/dashboard/StandardUI';
import {
  AlertCircle,
  Ambulance,
  Clock,
  Users,
  Activity,
  Phone,
  UserPlus,
  FileText,
  Heart,
  Zap,
  TrendingUp,
  Bed,
} from 'lucide-react';

const EmergencyDashboardRedesigned: React.FC = () => {
  const [activeTab, setActiveTab] = useState('triage');

  // Mock emergency metrics
  const metrics = {
    activePatients: 23,
    waitingTriage: 8,
    avgWaitTime: '12 min',
    bedsAvailable: 5,
    criticalCases: 3,
    admittedToday: 47,
  };

  // Mock patient queue
  const emergencyQueue = [
    {
      id: 'ER-001',
      patientName: 'Rajesh Kumar',
      condition: 'Chest Pain',
      triageLevel: 'Critical',
      waitTime: '2 min',
      status: 'urgent' as const,
    },
    {
      id: 'ER-002',
      patientName: 'Priya Sharma',
      condition: 'Head Injury',
      triageLevel: 'High',
      waitTime: '5 min',
      status: 'urgent' as const,
    },
    {
      id: 'ER-003',
      patientName: 'Mohammed Ali',
      condition: 'Fracture',
      triageLevel: 'Medium',
      waitTime: '15 min',
      status: 'pending' as const,
    },
    {
      id: 'ER-004',
      patientName: 'Anita Desai',
      condition: 'Fever',
      triageLevel: 'Low',
      waitTime: '25 min',
      status: 'pending' as const,
    },
  ];

  const systemAlerts = [
    {
      id: '1',
      label: 'Critical Bed Shortage',
      description: 'Only 2 ICU beds available',
      type: 'error' as const,
      action: () => console.log('Manage beds'),
      actionLabel: 'Manage Beds',
    },
    {
      id: '2',
      label: 'Ambulance En Route',
      description: 'ETA 5 minutes - Trauma case',
      type: 'warning' as const,
      action: () => console.log('Prepare'),
      actionLabel: 'Prepare Team',
    },
    {
      id: '3',
      label: 'Staff Alert',
      description: 'Dr. Patel required in ER immediately',
      type: 'info' as const,
      action: () => console.log('Page doctor'),
      actionLabel: 'Page Now',
    },
  ];

  const tabs = [
    { id: 'triage', label: 'Triage Queue', badge: 8, icon: Users },
    { id: 'active', label: 'Active Cases', badge: 23, icon: Activity },
    { id: 'admitted', label: 'Admitted', badge: 47, icon: Bed },
  ];

  const quickActions = [
    {
      label: 'New Emergency',
      icon: UserPlus,
      onClick: () => console.log('New emergency'),
      variant: 'primary' as const,
    },
    {
      label: 'Call Ambulance',
      icon: Phone,
      onClick: () => console.log('Call ambulance'),
      variant: 'danger' as const,
    },
    {
      label: 'Triage Assessment',
      icon: FileText,
      onClick: () => console.log('Triage'),
      variant: 'secondary' as const,
    },
    {
      label: 'View Protocols',
      icon: FileText,
      onClick: () => console.log('Protocols'),
      variant: 'secondary' as const,
    },
  ];

  const getTriageColor = (level: string) => {
    switch (level) {
      case 'Critical':
        return 'danger';
      case 'High':
        return 'warning';
      case 'Medium':
        return 'info';
      default:
        return 'success';
    }
  };

  return (
    <DashboardLayout
      title="Emergency Department"
      subtitle="Real-time emergency patient management"
      breadcrumbs={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Emergency' },
      ]}
      actions={
        <ButtonGroup>
          <StandardButton
            variant="danger"
            icon={AlertCircle}
            onClick={() => console.log('Code Red')}
          >
            Code Red
          </StandardButton>
          <StandardButton
            variant="primary"
            icon={Ambulance}
            onClick={() => console.log('Dispatch')}
          >
            Dispatch Ambulance
          </StandardButton>
        </ButtonGroup>
      }
    >
      {/* Emergency Metrics */}
      <DashboardSection fullWidth>
        <MetricsRow columns={6}>
          <StandardMetricCard
            label="Active Patients"
            value={metrics.activePatients}
            icon={Users}
            color="primary"
            subtitle="In emergency"
          />
          <StandardMetricCard
            label="Waiting Triage"
            value={metrics.waitingTriage}
            icon={Clock}
            color="warning"
            trend={{ value: 20, direction: 'up' }}
            subtitle={`Avg: ${metrics.avgWaitTime}`}
          />
          <StandardMetricCard
            label="Critical Cases"
            value={metrics.criticalCases}
            icon={Heart}
            color="error"
            subtitle="Immediate attention"
          />
          <StandardMetricCard
            label="Beds Available"
            value={metrics.bedsAvailable}
            icon={Bed}
            color={metrics.bedsAvailable < 10 ? 'error' : 'success'}
            subtitle="Emergency beds"
          />
          <StandardMetricCard
            label="Admitted Today"
            value={metrics.admittedToday}
            icon={TrendingUp}
            trend={{ value: 15, direction: 'up' }}
            color="secondary"
          />
          <StandardMetricCard
            label="Response Time"
            value="4.2"
            icon={Zap}
            subtitle="Minutes average"
            color="success"
            trend={{ value: 10, direction: 'down' }}
          />
        </MetricsRow>
      </DashboardSection>

      {/* Main Content */}
      <ContentGrid
        sidebar={
          <div className="space-y-6">
            {/* Quick Actions */}
            <ActionCard
              title="Emergency Actions"
              icon={Zap}
              actions={quickActions}
            />

            {/* System Alerts */}
            <AlertCard title="System Alerts" items={systemAlerts} />

            {/* Department Stats */}
            <StatsCard
              title="Bed Occupancy"
              value={45}
              total={50}
              unit="beds"
              icon={Bed}
              color="warning"
            />
          </div>
        }
      >
        {/* Patient Queue */}
        <div className="card-base">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Emergency Queue</h2>
                <p className="text-sm text-gray-600">Patients awaiting treatment</p>
              </div>
              <StandardButton variant="primary" icon={UserPlus} size="sm">
                New Patient
              </StandardButton>
            </div>
          </div>

          {/* Tabs */}
          <StandardTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

          {/* Queue Items */}
          <div className="p-6 space-y-4">
            {activeTab === 'triage' && emergencyQueue.length > 0 ? (
              emergencyQueue.map((patient) => (
                <div key={patient.id} className="relative">
                  {patient.triageLevel === 'Critical' && (
                    <div className="absolute -left-1 top-0 bottom-0 w-1 bg-red-500 rounded-full" />
                  )}
                  <QueueCard
                    id={patient.id}
                    patientName={patient.patientName}
                    details={patient.condition}
                    time={`Wait: ${patient.waitTime}`}
                    status={patient.status}
                    badge={
                      <StandardBadge variant={getTriageColor(patient.triageLevel) as any}>
                        {patient.triageLevel}
                      </StandardBadge>
                    }
                    actions={[
                      {
                        label: 'Start Treatment',
                        onClick: () => console.log('Treat', patient.id),
                        variant: patient.triageLevel === 'Critical' ? 'danger' : 'primary',
                      },
                      {
                        label: 'View Details',
                        onClick: () => console.log('View', patient.id),
                        variant: 'secondary',
                      },
                    ]}
                  />
                </div>
              ))
            ) : (
              <EmptyState
                icon={Users}
                title={`No ${activeTab} patients`}
                description="All patients have been processed"
              />
            )}
          </div>
        </div>
      </ContentGrid>
    </DashboardLayout>
  );
};

export default EmergencyDashboardRedesigned;