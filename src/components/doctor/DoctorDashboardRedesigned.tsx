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
  StandardSearch,
} from '@/components/dashboard/StandardUI';
import {
  Users,
  Calendar,
  Clock,
  FileText,
  Stethoscope,
  Activity,
  TrendingUp,
  AlertCircle,
  UserCheck,
  ClipboardList,
  Pill,
  Heart,
  Brain,
  Eye,
  Zap,
  Phone,
  Video,
  MessageSquare,
} from 'lucide-react';

const DoctorDashboardRedesigned: React.FC = () => {
  const [activeTab, setActiveTab] = useState('appointments');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock doctor statistics
  const stats = {
    todayAppointments: 18,
    completedConsultations: 12,
    pendingConsultations: 6,
    averageConsultTime: '15 min',
    patientsThisWeek: 84,
    followUps: 8,
    emergencyCalls: 2,
    satisfactionScore: 4.8,
  };

  // Mock appointments data
  const appointments = [
    {
      id: 'APT-001',
      patientName: 'Rajesh Kumar',
      patientAge: 45,
      time: '9:00 AM',
      type: 'Follow-up',
      condition: 'Hypertension',
      status: 'completed',
      duration: '20 min',
      notes: 'BP controlled, continue medication',
    },
    {
      id: 'APT-002',
      patientName: 'Priya Sharma',
      patientAge: 32,
      time: '9:30 AM',
      type: 'Consultation',
      condition: 'Migraine',
      status: 'in-progress',
      duration: '15 min',
      notes: 'Severe headaches for 2 weeks',
    },
    {
      id: 'APT-003',
      patientName: 'Mohammed Ali',
      patientAge: 28,
      time: '10:00 AM',
      type: 'New Patient',
      condition: 'Chest Pain',
      status: 'waiting',
      duration: '30 min',
      notes: 'First visit, comprehensive examination needed',
    },
    {
      id: 'APT-004',
      patientName: 'Sunita Rao',
      patientAge: 55,
      time: '10:30 AM',
      type: 'Teleconsult',
      condition: 'Diabetes Review',
      status: 'scheduled',
      duration: '15 min',
      notes: 'Monthly diabetes management review',
    },
  ];

  // Mock patient history for cross-department view
  const crossDepartmentHistory = [
    {
      patientName: 'Amit Verma',
      department: 'Cardiology',
      diagnosis: 'Atrial Fibrillation',
      icdCode: 'I48.91',
      date: '2024-11-15',
      doctor: 'Dr. Sarah Wilson',
      followUpRequired: true,
      chronic: true,
    },
    {
      patientName: 'Meera Patel',
      department: 'Neurology',
      diagnosis: 'Migraine with Aura',
      icdCode: 'G43.109',
      date: '2024-11-20',
      doctor: 'Dr. Raj Khanna',
      followUpRequired: true,
      chronic: true,
    },
    {
      patientName: 'Vikram Singh',
      department: 'Orthopedics',
      diagnosis: 'Lumbar Disc Herniation',
      icdCode: 'M51.26',
      date: '2024-11-22',
      doctor: 'Dr. Ahmed Khan',
      followUpRequired: false,
      chronic: false,
    },
  ];

  const systemAlerts = [
    {
      id: '1',
      label: 'Critical Lab Result',
      description: 'Rajesh Kumar - High glucose level 350 mg/dL',
      type: 'error' as const,
      action: () => console.log('View lab result'),
      actionLabel: 'View Result',
    },
    {
      id: '2',
      label: 'Prescription Renewal',
      description: '3 patients need prescription renewal today',
      type: 'warning' as const,
      action: () => console.log('View prescriptions'),
      actionLabel: 'Review',
    },
    {
      id: '3',
      label: 'Teleconsult Reminder',
      description: 'Video consultation with Sunita Rao at 10:30 AM',
      type: 'info' as const,
      action: () => console.log('Join call'),
      actionLabel: 'Prepare',
    },
  ];

  const tabs = [
    { id: 'appointments', label: 'Appointments', badge: stats.todayAppointments, icon: Calendar },
    { id: 'consultations', label: 'Active Consultations', badge: stats.pendingConsultations, icon: Stethoscope },
    { id: 'history', label: 'Cross-Dept History', icon: ClipboardList },
    { id: 'prescriptions', label: 'Prescriptions', icon: Pill },
  ];

  const quickActions = [
    {
      label: 'Start Consultation',
      icon: Stethoscope,
      onClick: () => console.log('Start consultation'),
      variant: 'primary' as const,
    },
    {
      label: 'Write Prescription',
      icon: FileText,
      onClick: () => console.log('Write prescription'),
      variant: 'secondary' as const,
    },
    {
      label: 'Order Lab Test',
      icon: Activity,
      onClick: () => console.log('Order test'),
      variant: 'secondary' as const,
    },
    {
      label: 'Video Call',
      icon: Video,
      onClick: () => console.log('Start video'),
      variant: 'secondary' as const,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'in-progress':
        return 'warning';
      case 'waiting':
        return 'info';
      case 'scheduled':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  const getSpecialtyIcon = (department: string) => {
    switch (department.toLowerCase()) {
      case 'cardiology':
        return <Heart className="w-4 h-4 text-red-500" />;
      case 'neurology':
        return <Brain className="w-4 h-4 text-purple-500" />;
      case 'ophthalmology':
        return <Eye className="w-4 h-4 text-blue-500" />;
      case 'orthopedics':
        return <Activity className="w-4 h-4 text-orange-500" />;
      default:
        return <Stethoscope className="w-4 h-4 text-cyan-500" />;
    }
  };

  return (
    <DashboardLayout
      title="Doctor Dashboard"
      subtitle="Manage consultations, appointments, and patient care"
      breadcrumbs={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Doctor' },
      ]}
      actions={
        <ButtonGroup>
          <StandardButton
            variant="secondary"
            icon={Phone}
            onClick={() => console.log('Emergency')}
          >
            Emergency Line
          </StandardButton>
          <StandardButton
            variant="primary"
            icon={UserCheck}
            onClick={() => console.log('Check in')}
          >
            Patient Check-In
          </StandardButton>
        </ButtonGroup>
      }
    >
      {/* Doctor Metrics */}
      <DashboardSection fullWidth>
        <MetricsRow columns={4}>
          <StandardMetricCard
            label="Today's Appointments"
            value={stats.todayAppointments}
            icon={Calendar}
            color="primary"
            subtitle={`${stats.completedConsultations} completed`}
          />
          <StandardMetricCard
            label="Avg Consultation Time"
            value={stats.averageConsultTime}
            icon={Clock}
            color="success"
            trend={{ value: 5, direction: 'down' }}
          />
          <StandardMetricCard
            label="Patients This Week"
            value={stats.patientsThisWeek}
            icon={Users}
            trend={{ value: 12, direction: 'up' }}
            color="secondary"
          />
          <StandardMetricCard
            label="Satisfaction Score"
            value={stats.satisfactionScore}
            icon={TrendingUp}
            subtitle="Out of 5.0"
            color="success"
          />
        </MetricsRow>
      </DashboardSection>

      {/* Additional Metrics Row */}
      <DashboardSection fullWidth>
        <MetricsRow columns={4}>
          <StandardMetricCard
            label="Pending Consultations"
            value={stats.pendingConsultations}
            icon={Stethoscope}
            color="warning"
            subtitle="Awaiting consultation"
          />
          <StandardMetricCard
            label="Follow-ups Today"
            value={stats.followUps}
            icon={UserCheck}
            color="info"
            subtitle="Scheduled follow-ups"
          />
          <StandardMetricCard
            label="Emergency Calls"
            value={stats.emergencyCalls}
            icon={AlertCircle}
            color="error"
            subtitle="Urgent consultations"
          />
          <StandardMetricCard
            label="Prescriptions Written"
            value={24}
            icon={Pill}
            color="secondary"
            subtitle="Today"
          />
        </MetricsRow>
      </DashboardSection>

      {/* Main Content */}
      <ContentGrid
        sidebar={
          <div className="space-y-6">
            {/* Quick Actions */}
            <ActionCard
              title="Quick Actions"
              icon={Zap}
              actions={quickActions}
            />

            {/* System Alerts */}
            <AlertCard title="Important Alerts" items={systemAlerts} />

            {/* Today's Progress */}
            <StatsCard
              title="Consultation Progress"
              value={stats.completedConsultations}
              total={stats.todayAppointments}
              unit="consultations"
              icon={Activity}
              color="primary"
            />
          </div>
        }
      >
        {/* Main Card */}
        <div className="card-base">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Patient Management</h2>
                <p className="text-sm text-gray-600">View and manage patient consultations</p>
              </div>
              <StandardButton variant="primary" icon={Stethoscope} size="sm">
                Start Next Consultation
              </StandardButton>
            </div>

            {/* Search Bar */}
            <StandardSearch
              placeholder="Search patients, conditions, or appointment ID..."
              value={searchQuery}
              onChange={setSearchQuery}
              className="w-full"
            />
          </div>

          {/* Tabs */}
          <StandardTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'appointments' && (
              <div className="space-y-4">
                {appointments.map((apt) => (
                  <QueueCard
                    key={apt.id}
                    id={apt.id}
                    patientName={`${apt.patientName} (${apt.patientAge}y)`}
                    doctorName={apt.type}
                    details={`${apt.condition} • ${apt.time} • ${apt.duration}`}
                    time={apt.notes}
                    status={apt.status === 'completed' ? 'completed' : apt.status === 'in-progress' ? 'in-progress' : 'pending'}
                    badge={
                      <StandardBadge variant={getStatusColor(apt.status) as any}>
                        {apt.status.replace('-', ' ').charAt(0).toUpperCase() + apt.status.slice(1).replace('-', ' ')}
                      </StandardBadge>
                    }
                    actions={[
                      apt.status === 'waiting' || apt.status === 'scheduled' ? {
                        label: 'Start Consultation',
                        onClick: () => console.log('Start', apt.id),
                        variant: 'primary',
                      } : {
                        label: 'View Details',
                        onClick: () => console.log('View', apt.id),
                        variant: 'secondary',
                      },
                      {
                        label: apt.type === 'Teleconsult' ? 'Join Video' : 'Patient History',
                        onClick: () => console.log('Action', apt.id),
                        variant: 'secondary',
                      },
                    ]}
                  />
                ))}
              </div>
            )}

            {activeTab === 'consultations' && (
              <div className="space-y-4">
                <QueueCard
                  id="CON-001"
                  patientName="Priya Sharma (32y)"
                  details="Migraine • Room 204"
                  time="In progress for 15 minutes"
                  status="in-progress"
                  badge={<StandardBadge variant="warning">Active</StandardBadge>}
                  actions={[
                    { label: 'Continue', onClick: () => console.log('Continue'), variant: 'primary' },
                    { label: 'End Consultation', onClick: () => console.log('End'), variant: 'secondary' },
                  ]}
                />
                <QueueCard
                  id="CON-002"
                  patientName="Mohammed Ali (28y)"
                  details="Chest Pain • Room 205"
                  time="Waiting for 5 minutes"
                  status="pending"
                  badge={<StandardBadge variant="info">Waiting</StandardBadge>}
                  actions={[
                    { label: 'Start Now', onClick: () => console.log('Start'), variant: 'primary' },
                    { label: 'View History', onClick: () => console.log('History'), variant: 'secondary' },
                  ]}
                />
              </div>
            )}

            {activeTab === 'history' && (
              <div className="space-y-4">
                <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-sm mb-2">Cross-Department Diagnosis History</h3>
                  <p className="text-sm text-gray-600">
                    View patient diagnoses across all departments from the last 6 months
                  </p>
                </div>
                {crossDepartmentHistory.map((history, idx) => (
                  <div key={idx} className="card-base p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getSpecialtyIcon(history.department)}
                        <div>
                          <h4 className="font-semibold">{history.patientName}</h4>
                          <p className="text-sm text-gray-600">
                            {history.department} • {history.doctor}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {history.chronic && (
                          <StandardBadge variant="warning" size="sm">Chronic</StandardBadge>
                        )}
                        {history.followUpRequired && (
                          <StandardBadge variant="info" size="sm">Follow-up Required</StandardBadge>
                        )}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm">
                        <span className="font-medium">Diagnosis:</span> {history.diagnosis}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">ICD Code:</span> {history.icdCode}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(history.date).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                    <div className="flex justify-end gap-2 mt-3">
                      <StandardButton size="sm" variant="secondary">
                        View Full Record
                      </StandardButton>
                      {history.followUpRequired && (
                        <StandardButton size="sm" variant="primary">
                          Schedule Follow-up
                        </StandardButton>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'prescriptions' && (
              <div className="space-y-4">
                <QueueCard
                  id="RX-001"
                  patientName="Rajesh Kumar"
                  details="Amlodipine 5mg, Metformin 500mg"
                  time="Prescribed today at 9:20 AM"
                  status="completed"
                  badge={<StandardBadge variant="success">Active</StandardBadge>}
                  actions={[
                    { label: 'View Prescription', onClick: () => console.log('View'), variant: 'secondary' },
                    { label: 'Renew', onClick: () => console.log('Renew'), variant: 'primary' },
                  ]}
                />
                <QueueCard
                  id="RX-002"
                  patientName="Priya Sharma"
                  details="Sumatriptan 50mg (PRN)"
                  time="Prescribed today at 9:45 AM"
                  status="pending"
                  badge={<StandardBadge variant="warning">Pending Pharmacy</StandardBadge>}
                  actions={[
                    { label: 'Track Status', onClick: () => console.log('Track'), variant: 'secondary' },
                  ]}
                />
                <QueueCard
                  id="RX-003"
                  patientName="Vikram Singh"
                  details="Ibuprofen 400mg, Muscle Relaxant"
                  time="Renewal due in 3 days"
                  status="pending"
                  badge={<StandardBadge variant="info">Renewal Due</StandardBadge>}
                  actions={[
                    { label: 'Review & Renew', onClick: () => console.log('Renew'), variant: 'primary' },
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

export default DoctorDashboardRedesigned;