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
  StandardSelect,
} from '@/components/dashboard/StandardUI';
import {
  Heart,
  Activity,
  Thermometer,
  Wind,
  Droplet,
  Zap,
  AlertCircle,
  TrendingUp,
  Monitor,
  Users,
  Bell,
  BellOff,
  RefreshCw,
  Settings,
  FileText,
  Clock,
  BedDouble,
} from 'lucide-react';

const ICUMonitoringRedesigned: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedBed, setSelectedBed] = useState('all');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [alarmsEnabled, setAlarmsEnabled] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(5000);

  // Mock ICU metrics
  const metrics = {
    totalBeds: 20,
    occupiedBeds: 18,
    criticalPatients: 7,
    ventilatorPatients: 12,
    avgStayDays: 4.2,
    nursePatientRatio: '1:2',
  };

  // Mock patient vitals data
  const [patientsVitals, setPatientsVitals] = useState([
    {
      bedId: 'ICU-01',
      patientName: 'Rajesh Kumar',
      age: 65,
      diagnosis: 'Post-op cardiac surgery',
      ventilatorMode: 'SIMV',
      apacheScore: 22,
      gcs: 10,
      vitals: {
        heartRate: 82,
        bp: '118/72',
        spo2: 94,
        temp: 37.2,
        respRate: 18,
        cvp: 8,
        map: 87,
      },
      alerts: [
        { type: 'warning', message: 'Low SpO2' },
      ],
      trend: 'stable',
    },
    {
      bedId: 'ICU-02',
      patientName: 'Priya Sharma',
      age: 42,
      diagnosis: 'Severe pneumonia',
      ventilatorMode: 'BiPAP',
      apacheScore: 18,
      gcs: 12,
      vitals: {
        heartRate: 96,
        bp: '132/85',
        spo2: 92,
        temp: 38.5,
        respRate: 24,
        cvp: 10,
        map: 101,
      },
      alerts: [
        { type: 'critical', message: 'High temperature' },
        { type: 'warning', message: 'Elevated resp rate' },
      ],
      trend: 'declining',
    },
    {
      bedId: 'ICU-03',
      patientName: 'Mohammed Ali',
      age: 55,
      diagnosis: 'Stroke, GCS monitoring',
      ventilatorMode: 'None',
      apacheScore: 15,
      gcs: 8,
      vitals: {
        heartRate: 68,
        bp: '145/90',
        spo2: 96,
        temp: 37.0,
        respRate: 16,
        cvp: 6,
        map: 108,
      },
      alerts: [],
      trend: 'improving',
    },
  ]);

  // Simulate real-time data updates
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      setPatientsVitals(prev => prev.map(patient => ({
        ...patient,
        vitals: {
          ...patient.vitals,
          heartRate: patient.vitals.heartRate + Math.floor(Math.random() * 5 - 2),
          spo2: Math.max(88, Math.min(100, patient.vitals.spo2 + Math.floor(Math.random() * 3 - 1))),
          respRate: Math.max(12, Math.min(30, patient.vitals.respRate + Math.floor(Math.random() * 3 - 1))),
        }
      })));
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval]);

  const systemAlerts = [
    {
      id: '1',
      label: 'Critical Alarm',
      description: 'ICU-02: High temperature 38.5°C',
      type: 'error' as const,
      action: () => console.log('View patient'),
      actionLabel: 'View Patient',
    },
    {
      id: '2',
      label: 'Ventilator Alert',
      description: 'ICU-05: Low tidal volume detected',
      type: 'warning' as const,
      action: () => console.log('Check ventilator'),
      actionLabel: 'Check Settings',
    },
    {
      id: '3',
      label: 'Medication Due',
      description: '3 patients require medication in 30 minutes',
      type: 'info' as const,
      action: () => console.log('View schedule'),
      actionLabel: 'View Schedule',
    },
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', badge: metrics.occupiedBeds, icon: Monitor },
    { id: 'vitals', label: 'Live Vitals', icon: Activity },
    { id: 'alarms', label: 'Alarms', badge: 3, icon: Bell },
    { id: 'reports', label: 'Reports', icon: FileText },
  ];

  const quickActions = [
    {
      label: 'Admit Patient',
      icon: Users,
      onClick: () => console.log('Admit patient'),
      variant: 'primary' as const,
    },
    {
      label: 'Emergency Code',
      icon: AlertCircle,
      onClick: () => console.log('Emergency'),
      variant: 'danger' as const,
    },
    {
      label: 'Handover Report',
      icon: FileText,
      onClick: () => console.log('Handover'),
      variant: 'secondary' as const,
    },
    {
      label: 'Equipment Check',
      icon: Settings,
      onClick: () => console.log('Equipment'),
      variant: 'secondary' as const,
    },
  ];

  const getVitalStatus = (vital: string, value: number): 'normal' | 'warning' | 'critical' => {
    switch (vital) {
      case 'heartRate':
        if (value < 60 || value > 100) return 'warning';
        if (value < 50 || value > 120) return 'critical';
        return 'normal';
      case 'spo2':
        if (value < 95) return 'warning';
        if (value < 90) return 'critical';
        return 'normal';
      case 'temp':
        if (value < 36 || value > 37.5) return 'warning';
        if (value < 35 || value > 38.5) return 'critical';
        return 'normal';
      default:
        return 'normal';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal':
        return 'text-green-600';
      case 'warning':
        return 'text-yellow-600';
      case 'critical':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'stable':
        return <Activity className="w-4 h-4 text-blue-500" />;
      case 'declining':
        return <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />;
      default:
        return null;
    }
  };

  return (
    <DashboardLayout
      title="ICU Monitoring"
      subtitle="Real-time intensive care unit patient monitoring"
      breadcrumbs={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'ICU' },
      ]}
      actions={
        <ButtonGroup>
          <StandardButton
            variant={autoRefresh ? 'primary' : 'secondary'}
            icon={RefreshCw}
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            {autoRefresh ? 'Auto-Refresh ON' : 'Auto-Refresh OFF'}
          </StandardButton>
          <StandardButton
            variant={alarmsEnabled ? 'secondary' : 'danger'}
            icon={alarmsEnabled ? Bell : BellOff}
            onClick={() => setAlarmsEnabled(!alarmsEnabled)}
          >
            {alarmsEnabled ? 'Alarms ON' : 'Alarms OFF'}
          </StandardButton>
        </ButtonGroup>
      }
    >
      {/* ICU Metrics */}
      <DashboardSection fullWidth>
        <MetricsRow columns={6}>
          <StandardMetricCard
            label="Bed Occupancy"
            value={`${metrics.occupiedBeds}/${metrics.totalBeds}`}
            icon={BedDouble}
            color={metrics.occupiedBeds > 17 ? 'error' : 'primary'}
            subtitle="90% occupied"
          />
          <StandardMetricCard
            label="Critical Patients"
            value={metrics.criticalPatients}
            icon={AlertCircle}
            color="error"
            trend={{ value: 2, direction: 'up' }}
          />
          <StandardMetricCard
            label="On Ventilator"
            value={metrics.ventilatorPatients}
            icon={Wind}
            color="warning"
            subtitle="60% of beds"
          />
          <StandardMetricCard
            label="Avg Stay"
            value={metrics.avgStayDays}
            icon={Clock}
            subtitle="Days"
            color="secondary"
          />
          <StandardMetricCard
            label="Nurse:Patient"
            value={metrics.nursePatientRatio}
            icon={Users}
            color="success"
            subtitle="Ratio"
          />
          <StandardMetricCard
            label="Alarms Today"
            value={47}
            icon={Bell}
            trend={{ value: 15, direction: 'down' }}
            color="info"
          />
        </MetricsRow>
      </DashboardSection>

      {/* Main Content */}
      <ContentGrid
        sidebar={
          <div className="space-y-6">
            {/* Quick Actions */}
            <ActionCard
              title="ICU Actions"
              icon={Zap}
              actions={quickActions}
            />

            {/* System Alerts */}
            <AlertCard title="Active Alerts" items={systemAlerts} />

            {/* Bed Status */}
            <StatsCard
              title="Critical Beds"
              value={7}
              total={20}
              unit="beds"
              icon={AlertCircle}
              color="error"
            />
          </div>
        }
      >
        {/* Patient Monitoring Card */}
        <div className="card-base">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Patient Monitoring</h2>
                <p className="text-sm text-gray-600">Live vital signs and alerts</p>
              </div>
              <StandardSelect
                options={[
                  { value: 'all', label: 'All Beds' },
                  { value: 'critical', label: 'Critical Only' },
                  { value: 'ventilator', label: 'On Ventilator' },
                ]}
                value={selectedBed}
                onChange={setSelectedBed}
                placeholder="Filter beds"
              />
            </div>
          </div>

          {/* Tabs */}
          <StandardTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-4">
                {patientsVitals.map((patient) => (
                  <div key={patient.bedId} className="card-base p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-lg">{patient.bedId}</h3>
                          <StandardBadge variant="secondary" size="sm">
                            {patient.ventilatorMode !== 'None' ? patient.ventilatorMode : 'No Ventilator'}
                          </StandardBadge>
                          {getTrendIcon(patient.trend)}
                        </div>
                        <p className="text-sm text-gray-600">
                          {patient.patientName} • {patient.age}y • {patient.diagnosis}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          APACHE: {patient.apacheScore} • GCS: {patient.gcs}
                        </p>
                      </div>
                      {patient.alerts.length > 0 && (
                        <div className="flex gap-2">
                          {patient.alerts.map((alert, idx) => (
                            <StandardBadge 
                              key={idx} 
                              variant={alert.type === 'critical' ? 'danger' : 'warning'}
                              size="sm"
                            >
                              {alert.message}
                            </StandardBadge>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Vital Signs Grid */}
                    <div className="grid grid-cols-7 gap-4 p-3 bg-gray-50 rounded-lg">
                      <div className="text-center">
                        <Heart className={`w-4 h-4 mx-auto mb-1 ${getStatusColor(getVitalStatus('heartRate', patient.vitals.heartRate))}`} />
                        <p className="text-xs text-gray-500">HR</p>
                        <p className="text-sm font-semibold">{patient.vitals.heartRate}</p>
                      </div>
                      <div className="text-center">
                        <Droplet className="w-4 h-4 mx-auto mb-1 text-red-500" />
                        <p className="text-xs text-gray-500">BP</p>
                        <p className="text-sm font-semibold">{patient.vitals.bp}</p>
                      </div>
                      <div className="text-center">
                        <Activity className={`w-4 h-4 mx-auto mb-1 ${getStatusColor(getVitalStatus('spo2', patient.vitals.spo2))}`} />
                        <p className="text-xs text-gray-500">SpO2</p>
                        <p className="text-sm font-semibold">{patient.vitals.spo2}%</p>
                      </div>
                      <div className="text-center">
                        <Thermometer className={`w-4 h-4 mx-auto mb-1 ${getStatusColor(getVitalStatus('temp', patient.vitals.temp))}`} />
                        <p className="text-xs text-gray-500">Temp</p>
                        <p className="text-sm font-semibold">{patient.vitals.temp}°C</p>
                      </div>
                      <div className="text-center">
                        <Wind className="w-4 h-4 mx-auto mb-1 text-blue-500" />
                        <p className="text-xs text-gray-500">RR</p>
                        <p className="text-sm font-semibold">{patient.vitals.respRate}</p>
                      </div>
                      <div className="text-center">
                        <Zap className="w-4 h-4 mx-auto mb-1 text-purple-500" />
                        <p className="text-xs text-gray-500">CVP</p>
                        <p className="text-sm font-semibold">{patient.vitals.cvp}</p>
                      </div>
                      <div className="text-center">
                        <Activity className="w-4 h-4 mx-auto mb-1 text-indigo-500" />
                        <p className="text-xs text-gray-500">MAP</p>
                        <p className="text-sm font-semibold">{patient.vitals.map}</p>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 mt-4">
                      <StandardButton size="sm" variant="secondary">
                        View Trends
                      </StandardButton>
                      <StandardButton size="sm" variant="primary">
                        View Details
                      </StandardButton>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'vitals' && (
              <div className="grid gap-4 md:grid-cols-2">
                {patientsVitals.map((patient) => (
                  <div key={patient.bedId} className="card-base p-4">
                    <h4 className="font-semibold mb-3">{patient.bedId}: {patient.patientName}</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="text-sm">Heart Rate</span>
                        <span className={`font-semibold ${getStatusColor(getVitalStatus('heartRate', patient.vitals.heartRate))}`}>
                          {patient.vitals.heartRate} bpm
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="text-sm">Blood Pressure</span>
                        <span className="font-semibold">{patient.vitals.bp} mmHg</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="text-sm">SpO2</span>
                        <span className={`font-semibold ${getStatusColor(getVitalStatus('spo2', patient.vitals.spo2))}`}>
                          {patient.vitals.spo2}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="text-sm">Temperature</span>
                        <span className={`font-semibold ${getStatusColor(getVitalStatus('temp', patient.vitals.temp))}`}>
                          {patient.vitals.temp}°C
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'alarms' && (
              <div className="space-y-4">
                <QueueCard
                  id="ALM-001"
                  patientName="ICU-02: Priya Sharma"
                  details="High temperature alert - 38.5°C"
                  time="2 minutes ago"
                  status="urgent"
                  badge={<StandardBadge variant="danger">Critical</StandardBadge>}
                  actions={[
                    { label: 'Acknowledge', onClick: () => console.log('Acknowledge'), variant: 'primary' },
                    { label: 'Mute', onClick: () => console.log('Mute'), variant: 'secondary' },
                  ]}
                />
                <QueueCard
                  id="ALM-002"
                  patientName="ICU-05: Amit Verma"
                  details="Low tidal volume on ventilator"
                  time="5 minutes ago"
                  status="pending"
                  badge={<StandardBadge variant="warning">Warning</StandardBadge>}
                  actions={[
                    { label: 'View', onClick: () => console.log('View'), variant: 'secondary' },
                  ]}
                />
                <QueueCard
                  id="ALM-003"
                  patientName="ICU-01: Rajesh Kumar"
                  details="SpO2 below threshold - 92%"
                  time="10 minutes ago"
                  status="pending"
                  badge={<StandardBadge variant="info">Info</StandardBadge>}
                  actions={[
                    { label: 'Resolved', onClick: () => console.log('Resolved'), variant: 'success' },
                  ]}
                />
              </div>
            )}

            {activeTab === 'reports' && (
              <EmptyState
                icon={FileText}
                title="Reports Available"
                description="Generate shift reports, patient summaries, and equipment logs"
                action={{
                  label: 'Generate Report',
                  onClick: () => console.log('Generate report'),
                }}
              />
            )}
          </div>
        </div>
      </ContentGrid>
    </DashboardLayout>
  );
};

export default ICUMonitoringRedesigned;