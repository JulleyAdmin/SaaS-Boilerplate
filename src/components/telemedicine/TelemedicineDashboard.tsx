'use client';

import React, { useState, useEffect } from 'react';
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
  StandardSelect,
} from '@/components/dashboard/StandardUI';
import {
  Video,
  Phone,
  Calendar,
  Clock,
  Users,
  Activity,
  FileText,
  Tablet,
  Monitor,
  Wifi,
  WifiOff,
  PlayCircle,
  PauseCircle,
  AlertCircle,
  CheckCircle,
  PhoneCall,
  MessageSquare,
  CreditCard,
  Download,
  Plus,
  Settings,
  Heart,
  Thermometer,
  Stethoscope,
  Pill,
  UserCheck,
  Shield,
  Zap,
  TrendingUp,
  Globe,
  Smartphone,
} from 'lucide-react';

const TelemedicineDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState('all');

  // Mock telemedicine statistics
  const stats = {
    todayConsultations: 45,
    activeVideoSessions: 12,
    scheduledSessions: 28,
    digitalPrescriptions: 38,
    remoteMonitoringPatients: 156,
    averageSessionDuration: 18,
    connectionQuality: 94,
    patientSatisfaction: 4.8,
  };

  // Mock active video sessions
  const activeSessions = [
    {
      sessionId: 'VID-2024-001',
      patientName: 'Rajesh Kumar',
      patientAge: 45,
      doctorName: 'Dr. Priya Sharma',
      specialty: 'Cardiology',
      startTime: '14:30',
      duration: 12,
      status: 'In-Progress',
      connectionQuality: 'Excellent',
      platform: 'WebRTC',
      sessionType: 'Video',
      chiefComplaint: 'Chest pain and palpitations',
      vitalsShared: true,
      recordingEnabled: false,
    },
    {
      sessionId: 'VID-2024-002',
      patientName: 'Sunita Devi',
      patientAge: 62,
      doctorName: 'Dr. Amit Verma',
      specialty: 'General Medicine',
      startTime: '14:45',
      duration: 8,
      status: 'In-Progress',
      connectionQuality: 'Good',
      platform: 'Google Meet',
      sessionType: 'Video',
      chiefComplaint: 'Diabetes follow-up',
      vitalsShared: true,
      recordingEnabled: true,
    },
    {
      sessionId: 'AUD-2024-003',
      patientName: 'Mohammad Ali',
      patientAge: 35,
      doctorName: 'Dr. Meera Patel',
      specialty: 'Psychiatry',
      startTime: '15:00',
      duration: 15,
      status: 'In-Progress',
      connectionQuality: 'Fair',
      platform: 'Phone',
      sessionType: 'Audio',
      chiefComplaint: 'Anxiety and stress counseling',
      vitalsShared: false,
      recordingEnabled: false,
    },
  ];

  // Mock scheduled sessions
  const scheduledSessions = [
    {
      sessionId: 'VID-2024-004',
      patientName: 'Priyanka Singh',
      patientAge: 28,
      doctorName: 'Dr. Rahul Gupta',
      specialty: 'Dermatology',
      scheduledTime: '16:00',
      sessionType: 'Video',
      chiefComplaint: 'Skin rash and allergies',
      appointmentType: 'Follow-up',
      platformPreference: 'WebRTC',
      patientDeviceType: 'Mobile',
    },
    {
      sessionId: 'VID-2024-005',
      patientName: 'Arjun Sharma',
      patientAge: 52,
      doctorName: 'Dr. Kavita Joshi',
      specialty: 'Endocrinology',
      scheduledTime: '16:30',
      sessionType: 'Video',
      chiefComplaint: 'Diabetes management',
      appointmentType: 'Routine',
      platformPreference: 'Zoom',
      patientDeviceType: 'Desktop',
    },
  ];

  // Mock remote monitoring alerts
  const monitoringAlerts = [
    {
      id: '1',
      label: 'High Blood Pressure Alert',
      description: '3 patients with BP >140/90 in last 2 hours',
      type: 'error' as const,
      action: () => console.log('View BP alerts'),
      actionLabel: 'View Alerts',
    },
    {
      id: '2',
      label: 'Medication Reminders',
      description: '15 patients need medication adherence follow-up',
      type: 'warning' as const,
      action: () => console.log('View reminders'),
      actionLabel: 'Send Reminders',
    },
    {
      id: '3',
      label: 'Device Connectivity',
      description: '2 patients with device sync issues',
      type: 'warning' as const,
      action: () => console.log('Check devices'),
      actionLabel: 'Check Devices',
    },
  ];

  const tabs = [
    { id: 'active', label: 'Active Sessions', badge: stats.activeVideoSessions, icon: Video },
    { id: 'scheduled', label: 'Scheduled', badge: stats.scheduledSessions, icon: Calendar },
    { id: 'monitoring', label: 'Remote Monitoring', badge: 8, icon: Tablet },
    { id: 'prescriptions', label: 'Digital Rx', badge: stats.digitalPrescriptions, icon: FileText },
  ];

  const quickActions = [
    {
      label: 'Start Video Call',
      icon: Video,
      onClick: () => console.log('Start video call'),
      variant: 'primary' as const,
    },
    {
      label: 'Schedule Session',
      icon: Calendar,
      onClick: () => console.log('Schedule session'),
      variant: 'secondary' as const,
    },
    {
      label: 'Digital Prescription',
      icon: FileText,
      onClick: () => console.log('Digital prescription'),
      variant: 'secondary' as const,
    },
    {
      label: 'Monitor Patients',
      icon: Activity,
      onClick: () => console.log('Monitor patients'),
      variant: 'secondary' as const,
    },
  ];

  const getSessionStatusBadge = (status: string) => {
    switch (status) {
      case 'In-Progress':
        return <StandardBadge variant="success">Live</StandardBadge>;
      case 'Scheduled':
        return <StandardBadge variant="info">Scheduled</StandardBadge>;
      case 'Completed':
        return <StandardBadge variant="secondary">Completed</StandardBadge>;
      case 'Cancelled':
        return <StandardBadge variant="danger">Cancelled</StandardBadge>;
      default:
        return <StandardBadge variant="secondary">{status}</StandardBadge>;
    }
  };

  const getConnectionQualityIcon = (quality: string) => {
    switch (quality) {
      case 'Excellent':
        return <Wifi className="w-4 h-4 text-green-500" />;
      case 'Good':
        return <Wifi className="w-4 h-4 text-yellow-500" />;
      case 'Fair':
        return <Wifi className="w-4 h-4 text-orange-500" />;
      case 'Poor':
        return <WifiOff className="w-4 h-4 text-red-500" />;
      default:
        return <Wifi className="w-4 h-4 text-gray-500" />;
    }
  };

  const getSessionTypeIcon = (type: string) => {
    switch (type) {
      case 'Video':
        return <Video className="w-4 h-4" />;
      case 'Audio':
        return <PhoneCall className="w-4 h-4" />;
      case 'Chat':
        return <MessageSquare className="w-4 h-4" />;
      case 'Phone':
        return <Phone className="w-4 h-4" />;
      default:
        return <Video className="w-4 h-4" />;
    }
  };

  return (
    <DashboardLayout
      title="Telemedicine & Digital Health"
      subtitle="Virtual care delivery, remote monitoring, and digital health services"
      breadcrumbs={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Telemedicine' },
      ]}
      actions={
        <ButtonGroup>
          <StandardButton
            variant="secondary"
            icon={Download}
            onClick={() => console.log('Export report')}
          >
            Export Report
          </StandardButton>
          <StandardButton
            variant="primary"
            icon={Video}
            onClick={() => console.log('Start consultation')}
          >
            Start Consultation
          </StandardButton>
        </ButtonGroup>
      }
    >
      {/* Key Metrics */}
      <DashboardSection fullWidth>
        <MetricsRow columns={4}>
          <StandardMetricCard
            label="Today's Consultations"
            value={stats.todayConsultations}
            icon={Video}
            color="primary"
            trend={{ value: 18, direction: 'up' }}
            subtitle="12% above average"
          />
          <StandardMetricCard
            label="Active Video Sessions"
            value={stats.activeVideoSessions}
            icon={PlayCircle}
            color="success"
            subtitle="Live consultations"
          />
          <StandardMetricCard
            label="Remote Monitoring"
            value={stats.remoteMonitoringPatients}
            icon={Tablet}
            color="info"
            subtitle="Active patients"
          />
          <StandardMetricCard
            label="Connection Quality"
            value={`${stats.connectionQuality}%`}
            icon={Wifi}
            color="secondary"
            trend={{ value: 2, direction: 'up' }}
          />
        </MetricsRow>
      </DashboardSection>

      {/* Session Quality Metrics */}
      <DashboardSection fullWidth>
        <MetricsRow columns={4}>
          <StandardMetricCard
            label="Avg Session Duration"
            value={`${stats.averageSessionDuration}min`}
            icon={Clock}
            color="secondary"
            subtitle="Within normal range"
          />
          <StandardMetricCard
            label="Digital Prescriptions"
            value={stats.digitalPrescriptions}
            icon={FileText}
            color="info"
            subtitle="Today's prescriptions"
          />
          <StandardMetricCard
            label="Patient Satisfaction"
            value={stats.patientSatisfaction}
            icon={Heart}
            color="success"
            subtitle="Out of 5.0"
          />
          <StandardMetricCard
            label="Scheduled Sessions"
            value={stats.scheduledSessions}
            icon={Calendar}
            color="warning"
            subtitle="Upcoming today"
          />
        </MetricsRow>
      </DashboardSection>

      {/* Main Content */}
      <ContentGrid
        sidebar={
          <div className="space-y-6">
            {/* Quick Actions */}
            <ActionCard
              title="Telemedicine Actions"
              icon={Video}
              actions={quickActions}
            />

            {/* Remote Monitoring Alerts */}
            <AlertCard title="Monitoring Alerts" items={monitoringAlerts} />

            {/* Platform Status */}
            <StatsCard
              title="Platform Status"
              value={94}
              total={100}
              unit="% uptime"
              icon={Globe}
              color="success"
            />

            {/* Today's Stats */}
            <div className="card-base p-4">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-600" />
                Today's Activity
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Video Sessions</span>
                  <span className="font-medium">32</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Audio Calls</span>
                  <span className="font-medium">13</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Digital Rx</span>
                  <span className="font-medium">38</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Remote Alerts</span>
                  <span className="font-medium text-orange-600">8</span>
                </div>
              </div>
            </div>
          </div>
        }
      >
        {/* Sessions Management Card */}
        <div className="card-base">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Sessions Management</h2>
                <p className="text-sm text-gray-600">Manage video consultations and remote care</p>
              </div>
              <StandardButton variant="primary" icon={Plus} size="sm">
                New Session
              </StandardButton>
            </div>

            {/* Filters */}
            <div className="flex gap-3">
              <StandardSearch
                placeholder="Search patient name, doctor, or session ID..."
                value={searchQuery}
                onChange={setSearchQuery}
                className="flex-1"
              />
              <StandardSelect
                options={[
                  { value: 'all', label: 'All Sessions' },
                  { value: 'video', label: 'Video Only' },
                  { value: 'audio', label: 'Audio Only' },
                  { value: 'chat', label: 'Chat Only' },
                ]}
                value={filterMode}
                onChange={setFilterMode}
                placeholder="Session Type"
              />
            </div>
          </div>

          {/* Tabs */}
          <StandardTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'active' && (
              <div className="space-y-4">
                {activeSessions.map((session) => (
                  <div key={session.sessionId} className="relative">
                    <QueueCard
                      id={session.sessionId}
                      patientName={`${session.patientName} (${session.patientAge}y)`}
                      doctorName={`${session.doctorName} • ${session.specialty}`}
                      details={session.chiefComplaint}
                      time={`Started: ${session.startTime} • Duration: ${session.duration} min • ${session.platform}`}
                      status="in-progress"
                      badge={
                        <div className="flex items-center gap-2">
                          {getSessionStatusBadge(session.status)}
                          {getConnectionQualityIcon(session.connectionQuality)}
                          {getSessionTypeIcon(session.sessionType)}
                          {session.recordingEnabled && (
                            <StandardBadge variant="danger" size="sm">
                              Recording
                            </StandardBadge>
                          )}
                          {session.vitalsShared && (
                            <StandardBadge variant="info" size="sm">
                              Vitals Shared
                            </StandardBadge>
                          )}
                        </div>
                      }
                      actions={[
                        {
                          label: 'Join Session',
                          onClick: () => console.log('Join', session.sessionId),
                          variant: 'primary',
                        },
                        {
                          label: 'View Details',
                          onClick: () => console.log('View', session.sessionId),
                          variant: 'secondary',
                        },
                      ]}
                    />
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'scheduled' && (
              <div className="space-y-4">
                {scheduledSessions.map((session) => (
                  <QueueCard
                    key={session.sessionId}
                    id={session.sessionId}
                    patientName={`${session.patientName} (${session.patientAge}y)`}
                    doctorName={`${session.doctorName} • ${session.specialty}`}
                    details={session.chiefComplaint}
                    time={`Scheduled: ${session.scheduledTime} • ${session.appointmentType} • ${session.platformPreference}`}
                    status="pending"
                    badge={
                      <div className="flex items-center gap-2">
                        {getSessionTypeIcon(session.sessionType)}
                        <StandardBadge variant="info" size="sm">
                          {session.sessionType}
                        </StandardBadge>
                        <StandardBadge variant="secondary" size="sm">
                          {session.patientDeviceType}
                        </StandardBadge>
                      </div>
                    }
                    actions={[
                      {
                        label: 'Start Early',
                        onClick: () => console.log('Start', session.sessionId),
                        variant: 'primary',
                      },
                      {
                        label: 'Reschedule',
                        onClick: () => console.log('Reschedule', session.sessionId),
                        variant: 'secondary',
                      },
                    ]}
                  />
                ))}
              </div>
            )}

            {activeTab === 'monitoring' && (
              <EmptyState
                icon={Tablet}
                title="Remote Patient Monitoring"
                description="Monitor patient vitals and health data remotely"
                action={{
                  label: 'Setup Monitoring',
                  onClick: () => console.log('Setup monitoring'),
                }}
              />
            )}

            {activeTab === 'prescriptions' && (
              <EmptyState
                icon={FileText}
                title="Digital Prescriptions"
                description="Manage digital prescriptions with e-signatures"
                action={{
                  label: 'Create Prescription',
                  onClick: () => console.log('Create prescription'),
                }}
              />
            )}
          </div>
        </div>
      </ContentGrid>
    </DashboardLayout>
  );
};

export default TelemedicineDashboard;