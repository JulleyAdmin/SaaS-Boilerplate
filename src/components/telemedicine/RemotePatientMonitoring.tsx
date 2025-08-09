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
  Tablet,
  Activity,
  Heart,
  Thermometer,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Users,
  Smartphone,
  Wifi,
  Battery,
  Bell,
  Settings,
  Download,
  Upload,
  RefreshCcw,
  Eye,
  Plus,
  Filter,
  Calendar,
  Zap,
  Droplet,
  Wind,
  Brain,
  LineChart,
  BarChart3,
  PieChart,
  Shield,
  AlertTriangle,
  Info,
  Phone,
  Video,
  MessageSquare,
  User,
  UserCheck,
  MapPin,
  Home,
  Hospital,
  Watch,
  Gauge,
} from 'lucide-react';

interface RemotePatient {
  patientId: string;
  patientName: string;
  age: number;
  gender: string;
  deviceId: string;
  deviceType: 'smartwatch' | 'glucose-monitor' | 'bp-monitor' | 'pulse-oximeter' | 'ecg-device' | 'weight-scale';
  connectionStatus: 'online' | 'offline' | 'syncing';
  lastSync: string;
  batteryLevel: number;
  vitals: {
    heartRate?: number;
    bloodPressure?: string;
    spO2?: number;
    temperature?: number;
    glucoseLevel?: number;
    weight?: number;
    ecgStatus?: string;
  };
  alerts: Alert[];
  compliance: number;
  riskScore: 'low' | 'medium' | 'high' | 'critical';
  conditions: string[];
  lastConsultation: string;
  nextCheckIn: string;
  location: string;
  emergencyContact: string;
}

interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  message: string;
  timestamp: string;
  acknowledged: boolean;
  parameter: string;
  value: string;
  threshold: string;
}

const RemotePatientMonitoring: React.FC = () => {
  const [activeTab, setActiveTab] = useState('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDevice, setFilterDevice] = useState('all');
  const [filterRisk, setFilterRisk] = useState('all');
  const [selectedPatient, setSelectedPatient] = useState<RemotePatient | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Mock statistics
  const stats = {
    totalMonitored: 156,
    activeDevices: 142,
    criticalAlerts: 3,
    pendingAlerts: 12,
    averageCompliance: 87,
    deviceUptime: 94.5,
    dataPointsToday: 28450,
    interventionsToday: 8,
  };

  // Mock remote patients data
  const remotePatients: RemotePatient[] = [
    {
      patientId: 'PAT-RM-001',
      patientName: 'Rajesh Kumar',
      age: 65,
      gender: 'Male',
      deviceId: 'WATCH-001',
      deviceType: 'smartwatch',
      connectionStatus: 'online',
      lastSync: '2 min ago',
      batteryLevel: 85,
      vitals: {
        heartRate: 78,
        bloodPressure: '130/85',
        spO2: 96,
        temperature: 98.4,
      },
      alerts: [
        {
          id: 'ALT-001',
          type: 'warning',
          message: 'Blood pressure slightly elevated',
          timestamp: '10:30 AM',
          acknowledged: false,
          parameter: 'Blood Pressure',
          value: '130/85',
          threshold: '120/80',
        },
      ],
      compliance: 92,
      riskScore: 'medium',
      conditions: ['Hypertension', 'Diabetes Type 2'],
      lastConsultation: '2024-01-10',
      nextCheckIn: '2024-01-20',
      location: 'Mumbai, Maharashtra',
      emergencyContact: '+91-9876543210',
    },
    {
      patientId: 'PAT-RM-002',
      patientName: 'Sunita Devi',
      age: 58,
      gender: 'Female',
      deviceId: 'GLUC-002',
      deviceType: 'glucose-monitor',
      connectionStatus: 'online',
      lastSync: '15 min ago',
      batteryLevel: 92,
      vitals: {
        glucoseLevel: 145,
        heartRate: 72,
      },
      alerts: [],
      compliance: 95,
      riskScore: 'low',
      conditions: ['Diabetes Type 2'],
      lastConsultation: '2024-01-12',
      nextCheckIn: '2024-01-26',
      location: 'Delhi NCR',
      emergencyContact: '+91-9123456789',
    },
    {
      patientId: 'PAT-RM-003',
      patientName: 'Arun Patel',
      age: 72,
      gender: 'Male',
      deviceId: 'ECG-003',
      deviceType: 'ecg-device',
      connectionStatus: 'syncing',
      lastSync: '1 hour ago',
      batteryLevel: 45,
      vitals: {
        heartRate: 82,
        ecgStatus: 'Irregular rhythm detected',
        bloodPressure: '140/90',
      },
      alerts: [
        {
          id: 'ALT-002',
          type: 'critical',
          message: 'Irregular heart rhythm detected',
          timestamp: '9:45 AM',
          acknowledged: false,
          parameter: 'ECG',
          value: 'Atrial Fibrillation',
          threshold: 'Normal Sinus Rhythm',
        },
        {
          id: 'ALT-003',
          type: 'warning',
          message: 'Device battery low',
          timestamp: '11:00 AM',
          acknowledged: true,
          parameter: 'Battery',
          value: '45%',
          threshold: '50%',
        },
      ],
      compliance: 78,
      riskScore: 'high',
      conditions: ['Cardiac Arrhythmia', 'Hypertension'],
      lastConsultation: '2024-01-08',
      nextCheckIn: '2024-01-16',
      location: 'Bangalore, Karnataka',
      emergencyContact: '+91-9988776655',
    },
  ];

  // Auto-refresh simulation
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        console.log('Refreshing patient data...');
      }, 30000); // Refresh every 30 seconds

      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const tabs = [
    { id: 'active', label: 'Active Monitoring', badge: stats.activeDevices, icon: Activity },
    { id: 'alerts', label: 'Alerts', badge: stats.criticalAlerts + stats.pendingAlerts, icon: AlertCircle },
    { id: 'devices', label: 'Devices', badge: stats.totalMonitored, icon: Tablet },
    { id: 'analytics', label: 'Analytics', icon: LineChart },
    { id: 'compliance', label: 'Compliance', icon: Shield },
  ];

  const quickActions = [
    {
      label: 'Add Patient',
      icon: Plus,
      onClick: () => console.log('Add patient'),
      variant: 'primary' as const,
    },
    {
      label: 'Sync Devices',
      icon: RefreshCcw,
      onClick: () => console.log('Sync devices'),
      variant: 'secondary' as const,
    },
    {
      label: 'Export Data',
      icon: Download,
      onClick: () => console.log('Export data'),
      variant: 'secondary' as const,
    },
    {
      label: 'Settings',
      icon: Settings,
      onClick: () => console.log('Settings'),
      variant: 'secondary' as const,
    },
  ];

  const getConnectionStatusBadge = (status: string) => {
    switch (status) {
      case 'online':
        return <StandardBadge variant="success" size="sm">Online</StandardBadge>;
      case 'offline':
        return <StandardBadge variant="danger" size="sm">Offline</StandardBadge>;
      case 'syncing':
        return <StandardBadge variant="warning" size="sm">Syncing</StandardBadge>;
      default:
        return <StandardBadge variant="secondary" size="sm">{status}</StandardBadge>;
    }
  };

  const getRiskScoreBadge = (score: string) => {
    switch (score) {
      case 'critical':
        return <StandardBadge variant="danger">Critical</StandardBadge>;
      case 'high':
        return <StandardBadge variant="warning">High Risk</StandardBadge>;
      case 'medium':
        return <StandardBadge variant="secondary">Medium Risk</StandardBadge>;
      case 'low':
        return <StandardBadge variant="success">Low Risk</StandardBadge>;
      default:
        return <StandardBadge variant="secondary">{score}</StandardBadge>;
    }
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'smartwatch':
        return <Watch className="w-4 h-4" />;
      case 'glucose-monitor':
        return <Droplet className="w-4 h-4" />;
      case 'bp-monitor':
        return <Heart className="w-4 h-4" />;
      case 'pulse-oximeter':
        return <Wind className="w-4 h-4" />;
      case 'ecg-device':
        return <Activity className="w-4 h-4" />;
      case 'weight-scale':
        return <Gauge className="w-4 h-4" />;
      default:
        return <Tablet className="w-4 h-4" />;
    }
  };

  const getBatteryIcon = (level: number) => {
    if (level > 75) return <Battery className="w-4 h-4 text-green-500" />;
    if (level > 50) return <Battery className="w-4 h-4 text-yellow-500" />;
    if (level > 25) return <Battery className="w-4 h-4 text-orange-500" />;
    return <Battery className="w-4 h-4 text-red-500" />;
  };

  return (
    <DashboardLayout
      title="Remote Patient Monitoring"
      subtitle="Monitor patient vitals and health data remotely with connected devices"
      breadcrumbs={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Telemedicine', href: '/dashboard/telemedicine' },
        { label: 'Remote Monitoring' },
      ]}
      actions={
        <ButtonGroup>
          <StandardButton
            variant={autoRefresh ? 'secondary' : 'ghost'}
            icon={RefreshCcw}
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={autoRefresh ? 'animate-spin-slow' : ''}
          >
            {autoRefresh ? 'Auto-Refresh On' : 'Auto-Refresh Off'}
          </StandardButton>
          <StandardButton
            variant="primary"
            icon={Plus}
            onClick={() => console.log('Add patient')}
          >
            Add Patient
          </StandardButton>
        </ButtonGroup>
      }
    >
      {/* Key Metrics */}
      <DashboardSection fullWidth>
        <MetricsRow columns={4}>
          <StandardMetricCard
            label="Total Monitored"
            value={stats.totalMonitored}
            icon={Users}
            color="primary"
            trend={{ value: 8, direction: 'up' }}
            subtitle="Active patients"
          />
          <StandardMetricCard
            label="Active Devices"
            value={stats.activeDevices}
            icon={Tablet}
            color="success"
            subtitle={`${Math.round((stats.activeDevices / stats.totalMonitored) * 100)}% online`}
          />
          <StandardMetricCard
            label="Critical Alerts"
            value={stats.criticalAlerts}
            icon={AlertCircle}
            color="danger"
            subtitle="Immediate attention"
          />
          <StandardMetricCard
            label="Device Uptime"
            value={`${stats.deviceUptime}%`}
            icon={Wifi}
            color="info"
            trend={{ value: 2.5, direction: 'up' }}
          />
        </MetricsRow>
      </DashboardSection>

      {/* Secondary Metrics */}
      <DashboardSection fullWidth>
        <MetricsRow columns={4}>
          <StandardMetricCard
            label="Pending Alerts"
            value={stats.pendingAlerts}
            icon={Bell}
            color="warning"
            subtitle="Require review"
          />
          <StandardMetricCard
            label="Avg Compliance"
            value={`${stats.averageCompliance}%`}
            icon={CheckCircle}
            color="success"
            subtitle="Device usage compliance"
          />
          <StandardMetricCard
            label="Data Points Today"
            value={stats.dataPointsToday.toLocaleString()}
            icon={Activity}
            color="secondary"
            subtitle="Vital readings"
          />
          <StandardMetricCard
            label="Interventions"
            value={stats.interventionsToday}
            icon={Phone}
            color="info"
            subtitle="Today's calls/messages"
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
              icon={Settings}
              actions={quickActions}
            />

            {/* Device Status */}
            <div className="card-base p-4">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Tablet className="w-5 h-5 text-blue-600" />
                Device Status
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Smartwatches</span>
                  <span className="font-medium">45</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Glucose Monitors</span>
                  <span className="font-medium">38</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">BP Monitors</span>
                  <span className="font-medium">32</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">ECG Devices</span>
                  <span className="font-medium">15</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Pulse Oximeters</span>
                  <span className="font-medium">12</span>
                </div>
              </div>
            </div>

            {/* Risk Distribution */}
            <div className="card-base p-4">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-red-600" />
                Risk Distribution
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Critical</span>
                  <span className="font-medium text-red-600">3</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">High Risk</span>
                  <span className="font-medium text-orange-600">12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Medium Risk</span>
                  <span className="font-medium text-yellow-600">45</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Low Risk</span>
                  <span className="font-medium text-green-600">96</span>
                </div>
              </div>
            </div>

            {/* Compliance Stats */}
            <StatsCard
              title="Overall Compliance"
              value={87}
              total={100}
              unit="% compliant"
              icon={CheckCircle}
              color="success"
            />
          </div>
        }
      >
        {/* Patient Monitoring Card */}
        <div className="card-base">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Remote Monitoring Dashboard</h2>
                <p className="text-sm text-gray-600">Real-time patient vital monitoring and alerts</p>
              </div>
              <StandardButton variant="primary" icon={Plus} size="sm">
                Add Device
              </StandardButton>
            </div>

            {/* Filters */}
            <div className="flex gap-3">
              <StandardSearch
                placeholder="Search patient name, device ID, or condition..."
                value={searchQuery}
                onChange={setSearchQuery}
                className="flex-1"
              />
              <StandardSelect
                options={[
                  { value: 'all', label: 'All Devices' },
                  { value: 'smartwatch', label: 'Smartwatches' },
                  { value: 'glucose-monitor', label: 'Glucose Monitors' },
                  { value: 'bp-monitor', label: 'BP Monitors' },
                  { value: 'ecg-device', label: 'ECG Devices' },
                ]}
                value={filterDevice}
                onChange={setFilterDevice}
                placeholder="Device Type"
              />
              <StandardSelect
                options={[
                  { value: 'all', label: 'All Risk Levels' },
                  { value: 'critical', label: 'Critical' },
                  { value: 'high', label: 'High Risk' },
                  { value: 'medium', label: 'Medium Risk' },
                  { value: 'low', label: 'Low Risk' },
                ]}
                value={filterRisk}
                onChange={setFilterRisk}
                placeholder="Risk Level"
              />
            </div>
          </div>

          {/* Tabs */}
          <StandardTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'active' && (
              <div className="space-y-4">
                {remotePatients.map((patient) => (
                  <div key={patient.patientId} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold text-gray-900">{patient.patientName}</span>
                          <span className="text-sm text-gray-600">({patient.age}y, {patient.gender})</span>
                          {getRiskScoreBadge(patient.riskScore)}
                          {getConnectionStatusBadge(patient.connectionStatus)}
                          <div className="flex items-center gap-1">
                            {getDeviceIcon(patient.deviceType)}
                            <span className="text-xs text-gray-600">{patient.deviceId}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
                          {/* Vitals Display */}
                          {patient.vitals.heartRate && (
                            <div className="flex items-center gap-2">
                              <Heart className="w-4 h-4 text-red-500" />
                              <div>
                                <div className="text-sm font-medium">{patient.vitals.heartRate} bpm</div>
                                <div className="text-xs text-gray-500">Heart Rate</div>
                              </div>
                            </div>
                          )}
                          {patient.vitals.bloodPressure && (
                            <div className="flex items-center gap-2">
                              <Activity className="w-4 h-4 text-blue-500" />
                              <div>
                                <div className="text-sm font-medium">{patient.vitals.bloodPressure}</div>
                                <div className="text-xs text-gray-500">Blood Pressure</div>
                              </div>
                            </div>
                          )}
                          {patient.vitals.spO2 && (
                            <div className="flex items-center gap-2">
                              <Wind className="w-4 h-4 text-cyan-500" />
                              <div>
                                <div className="text-sm font-medium">{patient.vitals.spO2}%</div>
                                <div className="text-xs text-gray-500">SpO2</div>
                              </div>
                            </div>
                          )}
                          {patient.vitals.glucoseLevel && (
                            <div className="flex items-center gap-2">
                              <Droplet className="w-4 h-4 text-purple-500" />
                              <div>
                                <div className="text-sm font-medium">{patient.vitals.glucoseLevel} mg/dL</div>
                                <div className="text-xs text-gray-500">Glucose</div>
                              </div>
                            </div>
                          )}
                          {patient.vitals.temperature && (
                            <div className="flex items-center gap-2">
                              <Thermometer className="w-4 h-4 text-orange-500" />
                              <div>
                                <div className="text-sm font-medium">{patient.vitals.temperature}°F</div>
                                <div className="text-xs text-gray-500">Temperature</div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Conditions */}
                        <div className="mb-2">
                          <span className="text-sm text-gray-600">Conditions: </span>
                          <span className="text-sm font-medium">{patient.conditions.join(', ')}</span>
                        </div>

                        {/* Alerts */}
                        {patient.alerts.length > 0 && (
                          <div className="mb-2">
                            {patient.alerts.map((alert) => (
                              <div key={alert.id} className={`text-sm p-2 rounded mb-1 ${
                                alert.type === 'critical' ? 'bg-red-50 text-red-800' :
                                alert.type === 'warning' ? 'bg-yellow-50 text-yellow-800' :
                                'bg-blue-50 text-blue-800'
                              }`}>
                                <div className="flex items-center gap-2">
                                  {alert.type === 'critical' ? <AlertCircle className="w-4 h-4" /> :
                                   alert.type === 'warning' ? <AlertTriangle className="w-4 h-4" /> :
                                   <Info className="w-4 h-4" />}
                                  <span className="font-medium">{alert.message}</span>
                                  <span className="text-xs ml-auto">{alert.timestamp}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Footer Info */}
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>Last sync: {patient.lastSync}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            {getBatteryIcon(patient.batteryLevel)}
                            <span>{patient.batteryLevel}%</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            <span>Compliance: {patient.compliance}%</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            <span>{patient.location}</span>
                          </div>
                        </div>
                      </div>

                      <div className="ml-4 flex flex-col gap-2">
                        <StandardButton
                          variant="primary"
                          size="sm"
                          icon={Eye}
                          onClick={() => setSelectedPatient(patient)}
                        >
                          View Details
                        </StandardButton>
                        <StandardButton
                          variant="secondary"
                          size="sm"
                          icon={Video}
                          onClick={() => console.log('Start video call')}
                        >
                          Video Call
                        </StandardButton>
                        <StandardButton
                          variant="secondary"
                          size="sm"
                          icon={MessageSquare}
                          onClick={() => console.log('Send message')}
                        >
                          Message
                        </StandardButton>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'alerts' && (
              <EmptyState
                icon={AlertCircle}
                title="Alert Management"
                description="View and manage patient monitoring alerts"
                action={{
                  label: 'View All Alerts',
                  onClick: () => console.log('View alerts'),
                }}
              />
            )}

            {activeTab === 'devices' && (
              <EmptyState
                icon={Tablet}
                title="Device Management"
                description="Manage connected monitoring devices"
                action={{
                  label: 'Add Device',
                  onClick: () => console.log('Add device'),
                }}
              />
            )}

            {activeTab === 'analytics' && (
              <EmptyState
                icon={LineChart}
                title="Monitoring Analytics"
                description="Analyze patient monitoring trends and patterns"
                action={{
                  label: 'View Analytics',
                  onClick: () => console.log('View analytics'),
                }}
              />
            )}

            {activeTab === 'compliance' && (
              <EmptyState
                icon={Shield}
                title="Compliance Tracking"
                description="Monitor device usage compliance and adherence"
                action={{
                  label: 'View Compliance Report',
                  onClick: () => console.log('View compliance'),
                }}
              />
            )}
          </div>
        </div>
      </ContentGrid>
    </DashboardLayout>
  );
};

export default RemotePatientMonitoring;