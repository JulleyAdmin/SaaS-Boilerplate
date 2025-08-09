'use client';

import React, { useState, useEffect } from 'react';
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
  Mic,
  MicOff,
  VideoOff,
  ScreenShare,
  ScreenShareOff,
  PhoneOff,
  Send,
  X,
  Check,
  RefreshCw,
  AlertTriangle,
  Info,
  Copy,
  ExternalLink,
  Share2,
  Timer,
  Loader2,
} from 'lucide-react';

interface TelemedicineSession {
  sessionId: string;
  patientName: string;
  patientAge: number;
  patientId: string;
  abhaNumber?: string;
  doctorName: string;
  specialty: string;
  startTime: string;
  duration: number;
  status: 'Scheduled' | 'Waiting' | 'In-Progress' | 'Completed' | 'Cancelled' | 'No-Show';
  connectionQuality: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  platform: 'WebRTC' | 'Zoom' | 'Phone' | 'WhatsApp';
  sessionType: 'Video' | 'Audio' | 'Chat' | 'Phone';
  chiefComplaint: string;
  vitalsShared: boolean;
  recordingEnabled: boolean;
  prescriptionIssued?: boolean;
  followUpScheduled?: boolean;
  paymentStatus?: 'paid' | 'pending' | 'failed';
  sessionLink?: string;
  waitingRoomLink?: string;
}

const TelemedicineDashboardEnhanced: React.FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState('all');
  const [selectedSession, setSelectedSession] = useState<TelemedicineSession | null>(null);
  const [showJoinDialog, setShowJoinDialog] = useState(false);
  const [showEndDialog, setShowEndDialog] = useState(false);
  const [sessionActions, setSessionActions] = useState<Record<string, string>>({});
  const [connectionTests, setConnectionTests] = useState<Record<string, boolean>>({});
  const [notifications, setNotifications] = useState<Array<{id: string; message: string; type: 'info' | 'success' | 'warning' | 'error'}>>([]);

  // Auto-refresh active sessions
  useEffect(() => {
    const interval = setInterval(() => {
      // Refresh active sessions data
      console.log('Refreshing active sessions...');
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, []);

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

  // Mock sessions data
  const [sessions, setSessions] = useState<TelemedicineSession[]>([
    {
      sessionId: 'VID-2024-001',
      patientName: 'Rajesh Kumar',
      patientAge: 45,
      patientId: 'PAT-001',
      abhaNumber: '14-1234-5678-9012',
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
      sessionLink: 'https://meet.hospital.com/vid-2024-001',
      paymentStatus: 'paid',
    },
    {
      sessionId: 'VID-2024-002',
      patientName: 'Sunita Devi',
      patientAge: 62,
      patientId: 'PAT-002',
      doctorName: 'Dr. Amit Verma',
      specialty: 'General Medicine',
      startTime: '15:00',
      duration: 0,
      status: 'Waiting',
      connectionQuality: 'Good',
      platform: 'Zoom',
      sessionType: 'Video',
      chiefComplaint: 'Follow-up for diabetes',
      vitalsShared: false,
      recordingEnabled: true,
      waitingRoomLink: 'https://zoom.us/waiting/abc123',
      paymentStatus: 'pending',
    },
    {
      sessionId: 'AUD-2024-003',
      patientName: 'Mohammed Ali',
      patientAge: 35,
      patientId: 'PAT-003',
      doctorName: 'Dr. Meera Patel',
      specialty: 'Psychiatry',
      startTime: '15:30',
      duration: 0,
      status: 'Scheduled',
      connectionQuality: 'Fair',
      platform: 'Phone',
      sessionType: 'Audio',
      chiefComplaint: 'Anxiety management consultation',
      vitalsShared: false,
      recordingEnabled: false,
      paymentStatus: 'paid',
    },
  ]);

  // Handle session actions
  const handleJoinSession = (session: TelemedicineSession) => {
    setSelectedSession(session);
    setShowJoinDialog(true);
    
    // Test connection
    setConnectionTests({
      camera: false,
      microphone: false,
      internet: false,
    });

    // Simulate connection tests
    setTimeout(() => {
      setConnectionTests(prev => ({ ...prev, camera: true }));
    }, 1000);
    setTimeout(() => {
      setConnectionTests(prev => ({ ...prev, microphone: true }));
    }, 1500);
    setTimeout(() => {
      setConnectionTests(prev => ({ ...prev, internet: true }));
    }, 2000);
  };

  const confirmJoinSession = () => {
    if (selectedSession) {
      // Update session status
      setSessions(prev => prev.map(s => 
        s.sessionId === selectedSession.sessionId 
          ? { ...s, status: 'In-Progress', duration: 1 }
          : s
      ));

      // Add notification
      addNotification('success', `Joined session ${selectedSession.sessionId} successfully`);

      // Navigate to video consultation page
      router.push(`/dashboard/telemedicine/consultations?session=${selectedSession.sessionId}`);
    }
    setShowJoinDialog(false);
  };

  const handleEndSession = (session: TelemedicineSession) => {
    setSelectedSession(session);
    setShowEndDialog(true);
  };

  const confirmEndSession = () => {
    if (selectedSession) {
      // Update session status
      setSessions(prev => prev.map(s => 
        s.sessionId === selectedSession.sessionId 
          ? { ...s, status: 'Completed', prescriptionIssued: true, followUpScheduled: true }
          : s
      ));

      // Add notification
      addNotification('info', `Session ${selectedSession.sessionId} ended. Duration: ${selectedSession.duration} minutes`);
    }
    setShowEndDialog(false);
  };

  const handleCancelSession = (session: TelemedicineSession) => {
    setSessions(prev => prev.map(s => 
      s.sessionId === session.sessionId 
        ? { ...s, status: 'Cancelled' }
        : s
    ));
    addNotification('warning', `Session ${session.sessionId} has been cancelled`);
  };

  const handleRescheduleSession = (session: TelemedicineSession) => {
    addNotification('info', `Rescheduling session ${session.sessionId}...`);
    // Navigate to scheduling page
    router.push(`/dashboard/appointments?reschedule=${session.sessionId}`);
  };

  const handleSendReminder = (session: TelemedicineSession) => {
    setSessionActions(prev => ({ ...prev, [session.sessionId]: 'sending' }));
    
    setTimeout(() => {
      setSessionActions(prev => ({ ...prev, [session.sessionId]: 'sent' }));
      addNotification('success', `Reminder sent to ${session.patientName}`);
    }, 1500);
  };

  const handleShareSessionLink = (session: TelemedicineSession) => {
    const link = session.sessionLink || session.waitingRoomLink || 'https://meet.hospital.com/session';
    navigator.clipboard.writeText(link);
    addNotification('success', 'Session link copied to clipboard');
  };

  const handleIssuePrescription = (session: TelemedicineSession) => {
    router.push(`/dashboard/prescriptions?type=digital&session=${session.sessionId}`);
  };

  const handleViewPatientRecords = (patientId: string) => {
    router.push(`/dashboard/patients/${patientId}`);
  };

  const handleProcessPayment = (session: TelemedicineSession) => {
    router.push(`/dashboard/billing?type=telemedicine&session=${session.sessionId}`);
  };

  const addNotification = (type: 'info' | 'success' | 'warning' | 'error', message: string) => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { id, type, message }]);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'In-Progress':
        return <PlayCircle className="w-4 h-4 text-green-600 animate-pulse" />;
      case 'Waiting':
        return <Clock className="w-4 h-4 text-yellow-600 animate-pulse" />;
      case 'Scheduled':
        return <Calendar className="w-4 h-4 text-blue-600" />;
      case 'Completed':
        return <CheckCircle className="w-4 h-4 text-gray-600" />;
      case 'Cancelled':
        return <X className="w-4 h-4 text-red-600" />;
      case 'No-Show':
        return <UserCheck className="w-4 h-4 text-orange-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const getConnectionQualityIcon = (quality: string) => {
    switch (quality) {
      case 'Excellent':
        return <Wifi className="w-4 h-4 text-green-600" />;
      case 'Good':
        return <Wifi className="w-4 h-4 text-blue-600" />;
      case 'Fair':
        return <Wifi className="w-4 h-4 text-yellow-600" />;
      case 'Poor':
        return <WifiOff className="w-4 h-4 text-red-600" />;
      default:
        return <Wifi className="w-4 h-4 text-gray-600" />;
    }
  };

  const getSessionTypeIcon = (type: string) => {
    switch (type) {
      case 'Video':
        return <Video className="w-4 h-4" />;
      case 'Audio':
        return <Phone className="w-4 h-4" />;
      case 'Chat':
        return <MessageSquare className="w-4 h-4" />;
      case 'Phone':
        return <PhoneCall className="w-4 h-4" />;
      default:
        return <Monitor className="w-4 h-4" />;
    }
  };

  const tabs = [
    { id: 'active', label: 'Active Sessions', badge: sessions.filter(s => s.status === 'In-Progress').length, icon: PlayCircle },
    { id: 'waiting', label: 'Waiting Room', badge: sessions.filter(s => s.status === 'Waiting').length, icon: Clock },
    { id: 'scheduled', label: 'Scheduled', badge: sessions.filter(s => s.status === 'Scheduled').length, icon: Calendar },
    { id: 'completed', label: 'Completed', badge: sessions.filter(s => s.status === 'Completed').length, icon: CheckCircle },
    { id: 'monitoring', label: 'Remote Monitoring', badge: 12, icon: Activity },
  ];

  const quickActions = [
    {
      label: 'Start Instant Session',
      icon: Video,
      onClick: () => router.push('/dashboard/telemedicine/consultations?mode=instant'),
      variant: 'primary' as const,
    },
    {
      label: 'Schedule Session',
      icon: Calendar,
      onClick: () => router.push('/dashboard/appointments?type=telemedicine'),
      variant: 'secondary' as const,
    },
    {
      label: 'Test Connection',
      icon: Wifi,
      onClick: () => {
        addNotification('info', 'Running connection diagnostics...');
        setTimeout(() => {
          addNotification('success', 'Connection test passed. Ready for consultations!');
        }, 2000);
      },
      variant: 'secondary' as const,
    },
    {
      label: 'Settings',
      icon: Settings,
      onClick: () => router.push('/dashboard/settings/telemedicine'),
      variant: 'secondary' as const,
    },
  ];

  // Filter sessions based on active tab
  const filteredSessions = sessions.filter(session => {
    if (activeTab === 'active') return session.status === 'In-Progress';
    if (activeTab === 'waiting') return session.status === 'Waiting';
    if (activeTab === 'scheduled') return session.status === 'Scheduled';
    if (activeTab === 'completed') return session.status === 'Completed';
    return true;
  });

  return (
    <>
      <DashboardLayout
        title="Telemedicine Hub"
        subtitle="Manage video consultations, digital prescriptions, and remote patient monitoring"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Telemedicine' },
        ]}
        actions={
          <ButtonGroup>
            <StandardButton
              variant="secondary"
              icon={Download}
              onClick={() => {
                addNotification('info', 'Generating telemedicine report...');
                setTimeout(() => {
                  addNotification('success', 'Report downloaded successfully');
                }, 1500);
              }}
            >
              Export Report
            </StandardButton>
            <StandardButton
              variant="primary"
              icon={Plus}
              onClick={() => router.push('/dashboard/telemedicine/consultations?mode=new')}
            >
              New Consultation
            </StandardButton>
          </ButtonGroup>
        }
      >
        {/* Notifications */}
        {notifications.length > 0 && (
          <div className="fixed top-20 right-4 z-50 space-y-2">
            {notifications.map(notification => (
              <div
                key={notification.id}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg animate-slide-in
                  ${notification.type === 'success' ? 'bg-green-100 text-green-800' : ''}
                  ${notification.type === 'error' ? 'bg-red-100 text-red-800' : ''}
                  ${notification.type === 'warning' ? 'bg-yellow-100 text-yellow-800' : ''}
                  ${notification.type === 'info' ? 'bg-blue-100 text-blue-800' : ''}
                `}
              >
                {notification.type === 'success' && <CheckCircle className="w-4 h-4" />}
                {notification.type === 'error' && <AlertCircle className="w-4 h-4" />}
                {notification.type === 'warning' && <AlertTriangle className="w-4 h-4" />}
                {notification.type === 'info' && <Info className="w-4 h-4" />}
                <span className="text-sm font-medium">{notification.message}</span>
              </div>
            ))}
          </div>
        )}

        {/* Key Metrics */}
        <DashboardSection fullWidth>
          <MetricsRow columns={4}>
            <StandardMetricCard
              label="Today's Consultations"
              value={stats.todayConsultations}
              icon={Video}
              color="primary"
              trend={{ value: 15, direction: 'up' }}
              subtitle="Video & Audio sessions"
              onClick={() => setActiveTab('completed')}
            />
            <StandardMetricCard
              label="Active Sessions"
              value={stats.activeVideoSessions}
              icon={PlayCircle}
              color="success"
              subtitle="Currently ongoing"
              onClick={() => setActiveTab('active')}
            />
            <StandardMetricCard
              label="Scheduled Today"
              value={stats.scheduledSessions}
              icon={Calendar}
              color="info"
              subtitle="Upcoming sessions"
              onClick={() => setActiveTab('scheduled')}
            />
            <StandardMetricCard
              label="Patient Satisfaction"
              value={`${stats.patientSatisfaction}/5`}
              icon={Heart}
              color="warning"
              trend={{ value: 0.2, direction: 'up' }}
              subtitle="Average rating"
            />
          </MetricsRow>
        </DashboardSection>

        {/* Secondary Metrics */}
        <DashboardSection fullWidth>
          <MetricsRow columns={4}>
            <StandardMetricCard
              label="Digital Prescriptions"
              value={stats.digitalPrescriptions}
              icon={FileText}
              color="secondary"
              subtitle="E-prescriptions issued"
              onClick={() => router.push('/dashboard/prescriptions?type=digital')}
            />
            <StandardMetricCard
              label="Remote Monitoring"
              value={stats.remoteMonitoringPatients}
              icon={Activity}
              color="primary"
              subtitle="Active patients"
              onClick={() => router.push('/dashboard/telemedicine/monitoring')}
            />
            <StandardMetricCard
              label="Avg Session Time"
              value={`${stats.averageSessionDuration} min`}
              icon={Timer}
              color="info"
              subtitle="Consultation duration"
            />
            <StandardMetricCard
              label="Connection Quality"
              value={`${stats.connectionQuality}%`}
              icon={Wifi}
              color="success"
              subtitle="Network reliability"
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

              {/* System Status */}
              <div className="card-base p-4">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-green-600" />
                  System Status
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Video Platform</span>
                    <StandardBadge variant="success" size="sm">Online</StandardBadge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Audio Bridge</span>
                    <StandardBadge variant="success" size="sm">Active</StandardBadge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Recording Server</span>
                    <StandardBadge variant="success" size="sm">Ready</StandardBadge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">E-Prescription</span>
                    <StandardBadge variant="success" size="sm">Synced</StandardBadge>
                  </div>
                </div>
              </div>

              {/* Connection Stats */}
              <StatsCard
                title="Network Performance"
                value={94}
                total={100}
                unit="% uptime"
                icon={Wifi}
                color="success"
              />

              {/* Alerts */}
              <AlertCard
                title="System Alerts"
                items={[
                  {
                    id: '1',
                    label: 'Waiting Patients',
                    description: '3 patients in waiting room',
                    type: 'warning',
                    action: () => setActiveTab('waiting'),
                    actionLabel: 'View',
                  },
                  {
                    id: '2',
                    label: 'Pending Payments',
                    description: '2 sessions pending payment',
                    type: 'info',
                    action: () => router.push('/dashboard/billing?type=telemedicine'),
                    actionLabel: 'Process',
                  },
                  {
                    id: '3',
                    label: 'Connection Test',
                    description: 'All systems operational',
                    type: 'success',
                  },
                ]}
              />
            </div>
          }
        >
          {/* Session Management Card */}
          <div className="card-base">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Consultation Sessions</h2>
                  <p className="text-sm text-gray-600">Manage and monitor telemedicine consultations</p>
                </div>
                <StandardButton 
                  variant="primary" 
                  icon={Video} 
                  size="sm"
                  onClick={() => router.push('/dashboard/telemedicine/consultations?mode=instant')}
                >
                  Quick Start
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
                    { value: 'urgent', label: 'Urgent' },
                  ]}
                  value={filterMode}
                  onChange={setFilterMode}
                  placeholder="Filter"
                />
              </div>
            </div>

            {/* Tabs */}
            <StandardTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

            {/* Tab Content */}
            <div className="p-6">
              {(activeTab === 'active' || activeTab === 'waiting' || activeTab === 'scheduled') && (
                <div className="space-y-4">
                  {filteredSessions.length === 0 ? (
                    <EmptyState
                      icon={Video}
                      title={`No ${activeTab} sessions`}
                      description={`There are no ${activeTab} telemedicine sessions at the moment`}
                      action={{
                        label: 'Schedule Session',
                        onClick: () => router.push('/dashboard/appointments?type=telemedicine'),
                      }}
                    />
                  ) : (
                    filteredSessions.map((session) => (
                      <div key={session.sessionId} className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              {getStatusIcon(session.status)}
                              <span className="font-semibold text-gray-900">{session.sessionId}</span>
                              <StandardBadge 
                                variant={session.status === 'In-Progress' ? 'success' : 
                                        session.status === 'Waiting' ? 'warning' : 
                                        session.status === 'Scheduled' ? 'info' : 'secondary'}
                                size="sm"
                              >
                                {session.status}
                              </StandardBadge>
                              {getSessionTypeIcon(session.sessionType)}
                              {getConnectionQualityIcon(session.connectionQuality)}
                              {session.recordingEnabled && (
                                <StandardBadge variant="danger" size="sm">
                                  Recording
                                </StandardBadge>
                              )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {session.patientName} ({session.patientAge} yrs)
                                </div>
                                <div className="text-xs text-gray-600">ID: {session.patientId}</div>
                                {session.abhaNumber && (
                                  <div className="text-xs text-gray-600">ABHA: {session.abhaNumber}</div>
                                )}
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">{session.doctorName}</div>
                                <div className="text-xs text-gray-600">{session.specialty}</div>
                                <div className="text-xs text-gray-500">Platform: {session.platform}</div>
                              </div>
                              <div>
                                <div className="text-sm text-gray-900">{session.chiefComplaint}</div>
                                <div className="text-xs text-gray-600">
                                  Start: {session.startTime} 
                                  {session.duration > 0 && ` • ${session.duration} min`}
                                </div>
                                {session.paymentStatus && (
                                  <StandardBadge 
                                    variant={session.paymentStatus === 'paid' ? 'success' : 'warning'} 
                                    size="sm"
                                  >
                                    Payment: {session.paymentStatus}
                                  </StandardBadge>
                                )}
                              </div>
                            </div>

                            {session.vitalsShared && (
                              <div className="flex items-center gap-2 text-xs text-green-600 mb-2">
                                <Heart className="w-3 h-3" />
                                <span>Vitals shared</span>
                              </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex flex-wrap gap-2">
                              {session.status === 'Waiting' && (
                                <>
                                  <StandardButton
                                    variant="primary"
                                    size="sm"
                                    icon={PlayCircle}
                                    onClick={() => handleJoinSession(session)}
                                  >
                                    Join Session
                                  </StandardButton>
                                  <StandardButton
                                    variant="secondary"
                                    size="sm"
                                    icon={Send}
                                    onClick={() => handleSendReminder(session)}
                                    disabled={sessionActions[session.sessionId] === 'sending'}
                                  >
                                    {sessionActions[session.sessionId] === 'sending' ? (
                                      <Loader2 className="w-3 h-3 animate-spin" />
                                    ) : sessionActions[session.sessionId] === 'sent' ? (
                                      <>
                                        <Check className="w-3 h-3" />
                                        Sent
                                      </>
                                    ) : (
                                      'Send Reminder'
                                    )}
                                  </StandardButton>
                                </>
                              )}

                              {session.status === 'In-Progress' && (
                                <>
                                  <StandardButton
                                    variant="danger"
                                    size="sm"
                                    icon={PhoneOff}
                                    onClick={() => handleEndSession(session)}
                                  >
                                    End Session
                                  </StandardButton>
                                  <StandardButton
                                    variant="secondary"
                                    size="sm"
                                    icon={Monitor}
                                    onClick={() => router.push(`/dashboard/telemedicine/consultations?session=${session.sessionId}`)}
                                  >
                                    View Session
                                  </StandardButton>
                                  <StandardButton
                                    variant="secondary"
                                    size="sm"
                                    icon={FileText}
                                    onClick={() => handleIssuePrescription(session)}
                                  >
                                    Prescribe
                                  </StandardButton>
                                </>
                              )}

                              {session.status === 'Scheduled' && (
                                <>
                                  <StandardButton
                                    variant="primary"
                                    size="sm"
                                    icon={Share2}
                                    onClick={() => handleShareSessionLink(session)}
                                  >
                                    Share Link
                                  </StandardButton>
                                  <StandardButton
                                    variant="secondary"
                                    size="sm"
                                    icon={RefreshCw}
                                    onClick={() => handleRescheduleSession(session)}
                                  >
                                    Reschedule
                                  </StandardButton>
                                  <StandardButton
                                    variant="secondary"
                                    size="sm"
                                    icon={X}
                                    onClick={() => handleCancelSession(session)}
                                  >
                                    Cancel
                                  </StandardButton>
                                </>
                              )}

                              {/* Common Actions */}
                              <StandardButton
                                variant="secondary"
                                size="sm"
                                icon={FileText}
                                onClick={() => handleViewPatientRecords(session.patientId)}
                              >
                                Patient Records
                              </StandardButton>

                              {session.paymentStatus === 'pending' && (
                                <StandardButton
                                  variant="warning"
                                  size="sm"
                                  icon={CreditCard}
                                  onClick={() => handleProcessPayment(session)}
                                >
                                  Process Payment
                                </StandardButton>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'completed' && (
                <div className="space-y-4">
                  {sessions.filter(s => s.status === 'Completed').map(session => (
                    <div key={session.sessionId} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="font-medium">{session.sessionId}</span>
                            <span className="text-sm text-gray-600">
                              {session.patientName} • {session.doctorName}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600">
                            Duration: {session.duration} minutes • {session.chiefComplaint}
                          </div>
                          <div className="flex items-center gap-4 mt-2">
                            {session.prescriptionIssued && (
                              <StandardBadge variant="success" size="sm">
                                Prescription Issued
                              </StandardBadge>
                            )}
                            {session.followUpScheduled && (
                              <StandardBadge variant="info" size="sm">
                                Follow-up Scheduled
                              </StandardBadge>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <StandardButton variant="secondary" size="sm" icon={Download}>
                            Download Report
                          </StandardButton>
                          <StandardButton variant="secondary" size="sm" icon={FileText}>
                            View Summary
                          </StandardButton>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'monitoring' && (
                <EmptyState
                  icon={Activity}
                  title="Remote Patient Monitoring"
                  description="View and manage patients with remote monitoring devices"
                  action={{
                    label: 'Go to Monitoring',
                    onClick: () => router.push('/dashboard/telemedicine/monitoring'),
                  }}
                />
              )}
            </div>
          </div>
        </ContentGrid>
      </DashboardLayout>

      {/* Join Session Dialog */}
      {showJoinDialog && selectedSession && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Join Telemedicine Session</h3>
            
            <div className="space-y-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="text-sm font-medium text-blue-900">Session Details</div>
                <div className="text-sm text-blue-700 mt-1">
                  Patient: {selectedSession.patientName}<br />
                  Type: {selectedSession.sessionType} Consultation<br />
                  Platform: {selectedSession.platform}
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium text-gray-700">Pre-Session Checklist</div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {connectionTests.camera ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
                    )}
                    <span className="text-sm">Camera Test</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {connectionTests.microphone ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
                    )}
                    <span className="text-sm">Microphone Test</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {connectionTests.internet ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
                    )}
                    <span className="text-sm">Internet Connection</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <StandardButton
                  variant="primary"
                  className="flex-1"
                  onClick={confirmJoinSession}
                  disabled={!Object.values(connectionTests).every(v => v)}
                >
                  Join Now
                </StandardButton>
                <StandardButton
                  variant="secondary"
                  className="flex-1"
                  onClick={() => setShowJoinDialog(false)}
                >
                  Cancel
                </StandardButton>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* End Session Dialog */}
      {showEndDialog && selectedSession && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">End Consultation Session</h3>
            
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Are you sure you want to end this consultation session?
              </p>

              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-sm">
                  <strong>Session:</strong> {selectedSession.sessionId}<br />
                  <strong>Patient:</strong> {selectedSession.patientName}<br />
                  <strong>Duration:</strong> {selectedSession.duration} minutes
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" defaultChecked />
                  <span className="text-sm">Issue digital prescription</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" defaultChecked />
                  <span className="text-sm">Schedule follow-up appointment</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm">Send session summary to patient</span>
                </label>
              </div>

              <div className="flex gap-3 mt-6">
                <StandardButton
                  variant="danger"
                  className="flex-1"
                  onClick={confirmEndSession}
                >
                  End Session
                </StandardButton>
                <StandardButton
                  variant="secondary"
                  className="flex-1"
                  onClick={() => setShowEndDialog(false)}
                >
                  Continue Session
                </StandardButton>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TelemedicineDashboardEnhanced;