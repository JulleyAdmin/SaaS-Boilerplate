'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  StandardSearch,
  StandardSelect,
  EmptyState,
} from '@/components/dashboard/StandardUI';
import {
  Users,
  UserPlus,
  User,
  Stethoscope,
  Calendar,
  TestTube,
  Filter,
  Activity,
  TrendingUp,
  AlertCircle,
  Clock,
  Heart,
  Download,
  RefreshCw,
} from 'lucide-react';
import { 
  usePatients, 
  usePatientStatistics, 
  useTodayActivity,
  formatPatientName, 
  calculateAge,
  type PatientSearchParams
} from '@/hooks/api/usePatients';

const PatientManagementRedesigned: React.FC = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [activeTab, setActiveTab] = useState('list');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Prepare search parameters
  const searchParams = useMemo((): PatientSearchParams => {
    const params: PatientSearchParams = {
      page: currentPage,
      pageSize,
      isActive: true,
    };

    if (searchQuery.trim()) {
      params.query = searchQuery.trim();
    }

    if (selectedStatus !== 'all') {
      params.status = selectedStatus as any;
    }

    return params;
  }, [searchQuery, selectedStatus, currentPage]);

  // Fetch data using hooks
  const { data: patientsResponse, isLoading: patientsLoading, error: patientsError } = usePatients(searchParams);
  const { data: statisticsResponse, isLoading: statsLoading } = usePatientStatistics();
  const { data: todayActivityResponse } = useTodayActivity();

  const patients = patientsResponse?.data || [];
  const pagination = patientsResponse?.pagination;
  const statistics = statisticsResponse?.data;
  const todayActivity = todayActivityResponse?.data;

  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'emergency':
        return 'danger';
      case 'admitted':
        return 'warning';
      case 'outpatient':
        return 'success';
      case 'discharged':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  const tabs = [
    { id: 'list', label: 'Patient List', badge: pagination?.total || 0 },
    { id: 'analytics', label: 'Analytics', icon: Activity },
    { id: 'appointments', label: "Today's Appointments", badge: todayActivity?.appointments || 0 },
  ];

  const quickActions = [
    {
      label: 'Register Patient',
      icon: UserPlus,
      onClick: () => router.push('/dashboard/patients/new'),
      variant: 'primary' as const,
    },
    {
      label: 'Schedule Appointment',
      icon: Calendar,
      onClick: () => router.push('/dashboard/appointments/new'),
    },
    {
      label: 'Order Lab Test',
      icon: TestTube,
      onClick: () => router.push('/dashboard/lab/new'),
    },
    {
      label: 'Quick Consultation',
      icon: Stethoscope,
      onClick: () => router.push('/dashboard/consultations/new'),
    },
  ];

  const alerts = statistics ? [
    statistics.emergency > 0 && {
      id: '1',
      label: 'Emergency Cases',
      description: `${statistics.emergency} patients require immediate attention`,
      type: 'error' as const,
      action: () => router.push('/dashboard/emergency'),
      actionLabel: 'View Emergency',
    },
    statistics.todayRegistrations > 10 && {
      id: '2',
      label: 'High Registration Volume',
      description: `${statistics.todayRegistrations} new patients registered today`,
      type: 'warning' as const,
      action: () => router.push('/dashboard/patients?status=new'),
      actionLabel: 'View New Patients',
    },
    todayActivity?.appointments && todayActivity.appointments > 0 && {
      id: '3',
      label: 'Pending Appointments',
      description: `${todayActivity.appointments} appointments scheduled for today`,
      type: 'info' as const,
      action: () => setActiveTab('appointments'),
      actionLabel: 'View Appointments',
    },
  ].filter(Boolean) : [];

  // Error state
  if (patientsError) {
    return (
      <DashboardLayout
        title="Patient Management"
        subtitle="Manage patient records, appointments, and medical history"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Patients' },
        ]}
      >
        <AlertCard
          title="Error Loading Patients"
          items={[
            {
              id: '1',
              label: 'Failed to load patient data',
              description: 'Please try refreshing the page or contact support if the issue persists.',
              type: 'error',
              action: () => window.location.reload(),
              actionLabel: 'Refresh Page',
            },
          ]}
        />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Patient Management"
      subtitle="Manage patient records, appointments, and medical history"
      breadcrumbs={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Patients' },
      ]}
      actions={
        <ButtonGroup>
          <StandardButton
            variant="secondary"
            icon={RefreshCw}
            onClick={() => window.location.reload()}
          >
            Refresh
          </StandardButton>
          <StandardButton
            variant="primary"
            icon={UserPlus}
            onClick={() => router.push('/dashboard/patients/new')}
          >
            Register Patient
          </StandardButton>
        </ButtonGroup>
      }
    >
      {/* Metrics Section */}
      <DashboardSection fullWidth>
        <MetricsRow columns={4}>
          <StandardMetricCard
            label="Total Patients"
            value={statistics?.totalPatients || 0}
            icon={Users}
            color="primary"
            subtitle="Registered patients"
          />
          <StandardMetricCard
            label="Outpatients"
            value={statistics?.outpatient || 0}
            icon={User}
            color="success"
            trend={{ value: 12, direction: 'up' }}
            subtitle="Active visits"
          />
          <StandardMetricCard
            label="New Today"
            value={statistics?.todayRegistrations || 0}
            icon={UserPlus}
            color="secondary"
            subtitle="New registrations"
          />
          <StandardMetricCard
            label="Emergency Cases"
            value={statistics?.emergency || 0}
            icon={AlertCircle}
            color="error"
            subtitle="Require attention"
          />
        </MetricsRow>
      </DashboardSection>

      {/* Main Content with Sidebar */}
      <ContentGrid
        sidebar={
          <div className="space-y-6">
            {/* Quick Actions */}
            <ActionCard
              title="Quick Actions"
              description="Common patient operations"
              icon={Activity}
              actions={quickActions}
            />

            {/* System Alerts */}
            {alerts.length > 0 && (
              <AlertCard title="System Alerts" items={alerts as any} />
            )}

            {/* Status Distribution */}
            <StatsCard
              title="Active Patients"
              value={(statistics?.outpatient || 0) + (statistics?.admitted || 0) + (statistics?.emergency || 0)}
              total={statistics?.totalPatients || 1}
              unit="patients"
              icon={Heart}
              color="primary"
            />
          </div>
        }
      >
        {/* Patient Directory Card */}
        <div className="card-base">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Patient Directory</h2>
                <p className="text-sm text-gray-600">
                  Search and manage patient information
                </p>
              </div>
              <StandardButton variant="primary" icon={UserPlus} size="sm">
                Add Patient
              </StandardButton>
            </div>

            {/* Search and Filter Bar */}
            <div className="flex gap-3">
              <StandardSearch
                placeholder="Search patients by name, ID, or phone..."
                value={searchQuery}
                onChange={setSearchQuery}
                className="flex-1"
              />
              <StandardSelect
                options={[
                  { value: 'all', label: 'All Patients' },
                  { value: 'outpatient', label: 'Outpatient' },
                  { value: 'admitted', label: 'Admitted' },
                  { value: 'emergency', label: 'Emergency' },
                  { value: 'discharged', label: 'Discharged' },
                ]}
                value={selectedStatus}
                onChange={setSelectedStatus}
                placeholder="Filter by status"
              />
              <StandardButton variant="secondary" icon={Filter} size="sm">
                More Filters
              </StandardButton>
            </div>
          </div>

          {/* Tabs */}
          <StandardTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'list' && (
              <div className="space-y-4">
                {patientsLoading ? (
                  <div className="text-center py-12">
                    <div className="inline-flex items-center space-x-2">
                      <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      <span>Loading patients...</span>
                    </div>
                  </div>
                ) : patients.length === 0 ? (
                  <EmptyState
                    icon={Users}
                    title="No patients found"
                    description="Try adjusting your search or filters"
                    action={{
                      label: 'Register First Patient',
                      onClick: () => router.push('/dashboard/patients/new'),
                    }}
                  />
                ) : (
                  <>
                    {patients.map(patient => (
                      <QueueCard
                        key={patient.patientId}
                        id={patient.patientCode}
                        patientName={formatPatientName(patient)}
                        doctorName={patient.lastConsultationDoctor}
                        details={`${patient.age || calculateAge(patient.dateOfBirth)} years • ${patient.gender} • ${patient.bloodGroup || 'Unknown'}`}
                        time={patient.lastVisitDate ? 
                          `Last visit: ${new Date(patient.lastVisitDate).toLocaleDateString()}` : 
                          'No visits'
                        }
                        status={patient.status === 'emergency' ? 'urgent' : 'pending'}
                        badge={
                          <StandardBadge variant={getStatusVariant(patient.status) as any}>
                            {patient.status.charAt(0).toUpperCase() + patient.status.slice(1)}
                          </StandardBadge>
                        }
                        actions={[
                          {
                            label: 'View Details',
                            onClick: () => router.push(`/dashboard/patients/${patient.patientId}`),
                            variant: 'primary',
                          },
                          {
                            label: 'Quick Actions',
                            onClick: () => console.log('Quick actions', patient.patientId),
                            variant: 'secondary',
                          },
                        ]}
                      />
                    ))}

                    {/* Pagination */}
                    {pagination && pagination.totalPages > 1 && (
                      <div className="flex items-center justify-between pt-4">
                        <div className="text-sm text-gray-500">
                          Showing {((pagination.page - 1) * pagination.pageSize) + 1} to{' '}
                          {Math.min(pagination.page * pagination.pageSize, pagination.total)} of{' '}
                          {pagination.total} patients
                        </div>
                        <ButtonGroup>
                          <StandardButton
                            variant="secondary"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            disabled={pagination.page <= 1}
                          >
                            Previous
                          </StandardButton>
                          <StandardButton
                            variant="secondary"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
                            disabled={pagination.page >= pagination.totalPages}
                          >
                            Next
                          </StandardButton>
                        </ButtonGroup>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <StatsCard
                  title="Status Distribution"
                  value={statistics?.outpatient || 0}
                  total={statistics?.totalPatients || 1}
                  unit="outpatients"
                  color="success"
                />
                <StatsCard
                  title="Admitted Patients"
                  value={statistics?.admitted || 0}
                  total={statistics?.totalPatients || 1}
                  unit="admitted"
                  color="warning"
                />
                <StatsCard
                  title="Emergency Cases"
                  value={statistics?.emergency || 0}
                  total={statistics?.totalPatients || 1}
                  unit="emergency"
                  color="error"
                />
              </div>
            )}

            {activeTab === 'appointments' && (
              <div className="space-y-4">
                <QueueCard
                  id="APT-001"
                  patientName="John Doe"
                  doctorName="Dr. Sarah Wilson"
                  details="Cardiology • 9:00 AM - 9:30 AM"
                  status="pending"
                  badge={<StandardBadge variant="success">Confirmed</StandardBadge>}
                  actions={[
                    { label: 'Check In', onClick: () => console.log('Check in'), variant: 'primary' },
                    { label: 'View', onClick: () => console.log('View'), variant: 'secondary' },
                  ]}
                />
                <QueueCard
                  id="APT-002"
                  patientName="Priya Sharma"
                  doctorName="Dr. Michael Brown"
                  details="General Medicine • 10:30 AM - 11:00 AM"
                  status="pending"
                  badge={<StandardBadge variant="warning">Waiting</StandardBadge>}
                  actions={[
                    { label: 'View Details', onClick: () => console.log('View'), variant: 'secondary' },
                  ]}
                />
              </div>
            )}
          </div>
        </div>
      </ContentGrid>
    </DashboardLayout>
  );
};

export default PatientManagementRedesigned;