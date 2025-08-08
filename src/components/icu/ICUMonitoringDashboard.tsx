'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Heart,
  Activity,
  Wind,
  Droplets,
  Thermometer,
  Brain,
  AlertCircle,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Minus,
  Monitor,
  Zap,
  Timer,
  Bell,
  BellOff,
  Users,
  Bed,
  Settings,
  RefreshCw,
  Maximize2,
  ChevronUp,
  ChevronDown,
  Stethoscope,
  Shield,
  Pill,
  Syringe,
  FileText,
  Phone,
  Volume2
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { format } from 'date-fns';

interface VitalSign {
  timestamp: string;
  heartRate: number;
  bloodPressureSystolic: number;
  bloodPressureDiastolic: number;
  respiratoryRate: number;
  oxygenSaturation: number;
  temperature: number;
  cvp?: number; // Central Venous Pressure
  map?: number; // Mean Arterial Pressure
}

interface ICUPatient {
  id: string;
  name: string;
  age: number;
  gender: string;
  bedNumber: string;
  admissionDate: string;
  primaryDiagnosis: string;
  secondaryDiagnosis?: string[];
  attendingDoctor: string;
  nurseInCharge: string;
  ventilatorMode?: string;
  sedationLevel?: string;
  glasgowComaScale?: number;
  apacheScore?: number;
  currentVitals: VitalSign;
  vitalsTrend: VitalSign[];
  medications: {
    name: string;
    dose: string;
    route: string;
    frequency: string;
    startTime: string;
  }[];
  labResults?: {
    test: string;
    value: string;
    unit: string;
    status: 'normal' | 'abnormal' | 'critical';
    timestamp: string;
  }[];
  alerts: {
    id: string;
    type: 'critical' | 'warning' | 'info';
    message: string;
    timestamp: string;
    acknowledged: boolean;
  }[];
  devices: {
    ventilator?: boolean;
    dialysis?: boolean;
    ecmo?: boolean;
    iabp?: boolean;
    continuousEEG?: boolean;
  };
}

// Generate mock vital signs data
const generateVitalsTrend = (): VitalSign[] => {
  const data: VitalSign[] = [];
  const now = new Date();
  
  for (let i = 23; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000);
    data.push({
      timestamp: timestamp.toISOString(),
      heartRate: 70 + Math.random() * 30 + (i < 6 ? Math.random() * 10 : 0),
      bloodPressureSystolic: 110 + Math.random() * 30,
      bloodPressureDiastolic: 70 + Math.random() * 20,
      respiratoryRate: 14 + Math.random() * 8,
      oxygenSaturation: 94 + Math.random() * 5,
      temperature: 36.5 + Math.random() * 1.5,
      cvp: 8 + Math.random() * 4,
      map: 80 + Math.random() * 20
    });
  }
  
  return data;
};

export default function ICUMonitoringDashboard() {
  const [selectedBed, setSelectedBed] = useState<string>('all');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(30); // seconds
  const [selectedPatient, setSelectedPatient] = useState<ICUPatient | null>(null);
  const [showAlarmSettings, setShowAlarmSettings] = useState(false);
  const [alarmMuted, setAlarmMuted] = useState(false);
  const [expandedView, setExpandedView] = useState<string | null>(null);

  // Mock ICU patients data
  const [icuPatients, setIcuPatients] = useState<ICUPatient[]>([
    {
      id: 'ICU001',
      name: 'Rajesh Verma',
      age: 65,
      gender: 'Male',
      bedNumber: 'ICU-01',
      admissionDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      primaryDiagnosis: 'Acute Respiratory Distress Syndrome (ARDS)',
      secondaryDiagnosis: ['Type 2 Diabetes', 'Hypertension'],
      attendingDoctor: 'Dr. Sarah Wilson',
      nurseInCharge: 'Sister Mary',
      ventilatorMode: 'SIMV',
      sedationLevel: 'RASS -2',
      glasgowComaScale: 10,
      apacheScore: 18,
      currentVitals: {
        timestamp: new Date().toISOString(),
        heartRate: 92,
        bloodPressureSystolic: 125,
        bloodPressureDiastolic: 78,
        respiratoryRate: 18,
        oxygenSaturation: 94,
        temperature: 37.2,
        cvp: 10,
        map: 94
      },
      vitalsTrend: generateVitalsTrend(),
      medications: [
        { name: 'Propofol', dose: '50mg/hr', route: 'IV', frequency: 'Continuous', startTime: '08:00' },
        { name: 'Fentanyl', dose: '25mcg/hr', route: 'IV', frequency: 'Continuous', startTime: '08:00' },
        { name: 'Norepinephrine', dose: '0.1mcg/kg/min', route: 'IV', frequency: 'Continuous', startTime: '14:00' },
        { name: 'Meropenem', dose: '1g', route: 'IV', frequency: 'Q8H', startTime: '06:00' }
      ],
      labResults: [
        { test: 'pH', value: '7.35', unit: '', status: 'abnormal', timestamp: '2 hours ago' },
        { test: 'PaO2', value: '75', unit: 'mmHg', status: 'abnormal', timestamp: '2 hours ago' },
        { test: 'PaCO2', value: '48', unit: 'mmHg', status: 'abnormal', timestamp: '2 hours ago' },
        { test: 'Lactate', value: '2.8', unit: 'mmol/L', status: 'abnormal', timestamp: '2 hours ago' },
        { test: 'WBC', value: '14.5', unit: '10^3/μL', status: 'abnormal', timestamp: '6 hours ago' },
        { test: 'Creatinine', value: '1.8', unit: 'mg/dL', status: 'abnormal', timestamp: '6 hours ago' }
      ],
      alerts: [
        { id: 'A1', type: 'warning', message: 'Low SpO2: 92%', timestamp: '10 min ago', acknowledged: false },
        { id: 'A2', type: 'critical', message: 'High CVP: 15 mmHg', timestamp: '30 min ago', acknowledged: true },
        { id: 'A3', type: 'info', message: 'Ventilator weaning trial scheduled', timestamp: '1 hour ago', acknowledged: true }
      ],
      devices: {
        ventilator: true,
        dialysis: false,
        ecmo: false,
        iabp: false,
        continuousEEG: false
      }
    },
    {
      id: 'ICU002',
      name: 'Priya Singh',
      age: 45,
      gender: 'Female',
      bedNumber: 'ICU-02',
      admissionDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      primaryDiagnosis: 'Post-operative monitoring (CABG)',
      secondaryDiagnosis: ['Coronary Artery Disease'],
      attendingDoctor: 'Dr. Michael Brown',
      nurseInCharge: 'Sister Anna',
      glasgowComaScale: 15,
      apacheScore: 8,
      currentVitals: {
        timestamp: new Date().toISOString(),
        heartRate: 78,
        bloodPressureSystolic: 118,
        bloodPressureDiastolic: 72,
        respiratoryRate: 16,
        oxygenSaturation: 98,
        temperature: 36.8,
        cvp: 8,
        map: 87
      },
      vitalsTrend: generateVitalsTrend(),
      medications: [
        { name: 'Metoprolol', dose: '25mg', route: 'PO', frequency: 'BID', startTime: '08:00' },
        { name: 'Aspirin', dose: '75mg', route: 'PO', frequency: 'OD', startTime: '08:00' },
        { name: 'Atorvastatin', dose: '40mg', route: 'PO', frequency: 'OD', startTime: '20:00' }
      ],
      alerts: [
        { id: 'A4', type: 'info', message: 'Ready for step-down to ward', timestamp: '2 hours ago', acknowledged: false }
      ],
      devices: {
        ventilator: false,
        dialysis: false,
        ecmo: false,
        iabp: false,
        continuousEEG: false
      }
    },
    {
      id: 'ICU003',
      name: 'Mohammed Ali',
      age: 28,
      gender: 'Male',
      bedNumber: 'ICU-03',
      admissionDate: new Date().toISOString(),
      primaryDiagnosis: 'Severe Traumatic Brain Injury',
      secondaryDiagnosis: ['Multiple rib fractures', 'Pneumothorax'],
      attendingDoctor: 'Dr. Emily Chen',
      nurseInCharge: 'Sister Grace',
      ventilatorMode: 'AC/VC',
      sedationLevel: 'RASS -4',
      glasgowComaScale: 6,
      apacheScore: 24,
      currentVitals: {
        timestamp: new Date().toISOString(),
        heartRate: 110,
        bloodPressureSystolic: 145,
        bloodPressureDiastolic: 85,
        respiratoryRate: 22,
        oxygenSaturation: 96,
        temperature: 38.1,
        cvp: 12,
        map: 105
      },
      vitalsTrend: generateVitalsTrend(),
      medications: [
        { name: 'Propofol', dose: '100mg/hr', route: 'IV', frequency: 'Continuous', startTime: '08:00' },
        { name: 'Mannitol', dose: '50g', route: 'IV', frequency: 'Q6H', startTime: '06:00' },
        { name: 'Levetiracetam', dose: '1000mg', route: 'IV', frequency: 'BID', startTime: '08:00' },
        { name: 'Ceftriaxone', dose: '2g', route: 'IV', frequency: 'OD', startTime: '08:00' }
      ],
      labResults: [
        { test: 'ICP', value: '22', unit: 'mmHg', status: 'critical', timestamp: '30 min ago' },
        { test: 'CPP', value: '68', unit: 'mmHg', status: 'abnormal', timestamp: '30 min ago' },
        { test: 'Sodium', value: '148', unit: 'mEq/L', status: 'abnormal', timestamp: '4 hours ago' }
      ],
      alerts: [
        { id: 'A5', type: 'critical', message: 'Elevated ICP: 22 mmHg', timestamp: '5 min ago', acknowledged: false },
        { id: 'A6', type: 'warning', message: 'Temperature: 38.1°C', timestamp: '15 min ago', acknowledged: false }
      ],
      devices: {
        ventilator: true,
        dialysis: false,
        ecmo: false,
        iabp: false,
        continuousEEG: true
      }
    }
  ]);

  // Auto-refresh functionality
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        // Update vitals with slight variations to simulate live data
        setIcuPatients(prev => prev.map(patient => ({
          ...patient,
          currentVitals: {
            ...patient.currentVitals,
            timestamp: new Date().toISOString(),
            heartRate: patient.currentVitals.heartRate + (Math.random() - 0.5) * 4,
            bloodPressureSystolic: patient.currentVitals.bloodPressureSystolic + (Math.random() - 0.5) * 4,
            oxygenSaturation: Math.min(100, Math.max(85, patient.currentVitals.oxygenSaturation + (Math.random() - 0.5) * 2))
          }
        })));
      }, refreshInterval * 1000);
      
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval]);

  const getVitalStatus = (vital: string, value: number): 'normal' | 'warning' | 'critical' => {
    switch (vital) {
      case 'heartRate':
        if (value < 50 || value > 120) return 'critical';
        if (value < 60 || value > 100) return 'warning';
        return 'normal';
      case 'spo2':
        if (value < 90) return 'critical';
        if (value < 95) return 'warning';
        return 'normal';
      case 'bp':
        if (value > 140 || value < 90) return 'critical';
        if (value > 130 || value < 100) return 'warning';
        return 'normal';
      case 'temp':
        if (value > 38.5 || value < 35.5) return 'critical';
        if (value > 37.5 || value < 36) return 'warning';
        return 'normal';
      default:
        return 'normal';
    }
  };

  const getStatusColor = (status: 'normal' | 'warning' | 'critical') => {
    switch (status) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'normal': return 'text-green-600 bg-green-100';
    }
  };

  const getTrendIcon = (current: number, previous: number) => {
    const diff = current - previous;
    if (Math.abs(diff) < 1) return <Minus className="h-3 w-3" />;
    if (diff > 0) return <TrendingUp className="h-3 w-3 text-red-500" />;
    return <TrendingDown className="h-3 w-3 text-green-500" />;
  };

  const filteredPatients = selectedBed === 'all' 
    ? icuPatients 
    : icuPatients.filter(p => p.bedNumber === selectedBed);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">ICU Monitoring Dashboard</h1>
          <p className="text-muted-foreground">
            Real-time patient monitoring and vital signs tracking
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={alarmMuted ? "destructive" : "outline"}
            size="sm"
            onClick={() => setAlarmMuted(!alarmMuted)}
          >
            {alarmMuted ? <BellOff className="h-4 w-4" /> : <Bell className="h-4 w-4" />}
            {alarmMuted ? 'Unmute' : 'Mute'} Alarms
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAlarmSettings(true)}
          >
            <Settings className="h-4 w-4 mr-2" />
            Alarm Settings
          </Button>
          <Select value={refreshInterval.toString()} onValueChange={(v) => setRefreshInterval(parseInt(v))}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10 sec</SelectItem>
              <SelectItem value="30">30 sec</SelectItem>
              <SelectItem value="60">1 min</SelectItem>
              <SelectItem value="300">5 min</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant={autoRefresh ? "default" : "outline"}
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
            {autoRefresh ? 'Live' : 'Paused'}
          </Button>
        </div>
      </div>

      {/* Critical Alerts Summary */}
      {icuPatients.some(p => p.alerts.some(a => a.type === 'critical' && !a.acknowledged)) && (
        <Alert className="border-red-500 bg-red-50">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Critical Alerts</AlertTitle>
          <AlertDescription>
            <div className="mt-2 space-y-1">
              {icuPatients.flatMap(p => 
                p.alerts
                  .filter(a => a.type === 'critical' && !a.acknowledged)
                  .map(a => (
                    <div key={a.id} className="flex justify-between items-center">
                      <span>{p.bedNumber}: {a.message}</span>
                      <Button size="sm" variant="outline" onClick={() => {
                        setIcuPatients(prev => prev.map(patient => 
                          patient.id === p.id 
                            ? {
                                ...patient,
                                alerts: patient.alerts.map(alert => 
                                  alert.id === a.id ? { ...alert, acknowledged: true } : alert
                                )
                              }
                            : patient
                        ));
                      }}>
                        Acknowledge
                      </Button>
                    </div>
                  ))
              )}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Statistics Overview */}
      <div className="grid gap-4 md:grid-cols-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Beds</p>
                <p className="text-2xl font-bold">12</p>
              </div>
              <Bed className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Occupied</p>
                <p className="text-2xl font-bold">{icuPatients.length}</p>
              </div>
              <Users className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">On Ventilator</p>
                <p className="text-2xl font-bold">
                  {icuPatients.filter(p => p.devices.ventilator).length}
                </p>
              </div>
              <Wind className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Critical</p>
                <p className="text-2xl font-bold">
                  {icuPatients.filter(p => p.apacheScore && p.apacheScore > 20).length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Staff</p>
                <p className="text-2xl font-bold">8</p>
              </div>
              <Stethoscope className="h-8 w-8 text-indigo-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Stay</p>
                <p className="text-2xl font-bold">4.2d</p>
              </div>
              <Timer className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Monitoring Grid */}
      <div className="grid gap-4 lg:grid-cols-3">
        {filteredPatients.map(patient => (
          <Card key={patient.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Badge variant="outline">{patient.bedNumber}</Badge>
                    {patient.name}
                  </CardTitle>
                  <CardDescription>
                    {patient.age}Y {patient.gender[0]} | {patient.primaryDiagnosis}
                  </CardDescription>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setSelectedPatient(patient)}
                >
                  <Maximize2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Vital Signs Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-red-500" />
                    <span className="text-sm text-muted-foreground">Heart Rate</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">
                      {Math.round(patient.currentVitals.heartRate)}
                    </span>
                    <span className="text-sm text-muted-foreground">bpm</span>
                    {patient.vitalsTrend.length > 1 && 
                      getTrendIcon(
                        patient.currentVitals.heartRate,
                        patient.vitalsTrend[patient.vitalsTrend.length - 2].heartRate
                      )
                    }
                  </div>
                  <Badge className={getStatusColor(getVitalStatus('heartRate', patient.currentVitals.heartRate))}>
                    {getVitalStatus('heartRate', patient.currentVitals.heartRate)}
                  </Badge>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-blue-500" />
                    <span className="text-sm text-muted-foreground">Blood Pressure</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">
                      {Math.round(patient.currentVitals.bloodPressureSystolic)}/
                      {Math.round(patient.currentVitals.bloodPressureDiastolic)}
                    </span>
                  </div>
                  <Badge className={getStatusColor(getVitalStatus('bp', patient.currentVitals.bloodPressureSystolic))}>
                    MAP: {patient.currentVitals.map}
                  </Badge>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Droplets className="h-4 w-4 text-cyan-500" />
                    <span className="text-sm text-muted-foreground">SpO2</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">
                      {Math.round(patient.currentVitals.oxygenSaturation)}
                    </span>
                    <span className="text-sm text-muted-foreground">%</span>
                  </div>
                  <Badge className={getStatusColor(getVitalStatus('spo2', patient.currentVitals.oxygenSaturation))}>
                    {getVitalStatus('spo2', patient.currentVitals.oxygenSaturation)}
                  </Badge>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Thermometer className="h-4 w-4 text-orange-500" />
                    <span className="text-sm text-muted-foreground">Temperature</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">
                      {patient.currentVitals.temperature.toFixed(1)}
                    </span>
                    <span className="text-sm text-muted-foreground">°C</span>
                  </div>
                  <Badge className={getStatusColor(getVitalStatus('temp', patient.currentVitals.temperature))}>
                    {getVitalStatus('temp', patient.currentVitals.temperature)}
                  </Badge>
                </div>
              </div>

              {/* Devices and Support */}
              <div className="flex flex-wrap gap-2">
                {patient.devices.ventilator && (
                  <Badge variant="secondary" className="text-xs">
                    <Wind className="h-3 w-3 mr-1" />
                    Ventilator: {patient.ventilatorMode}
                  </Badge>
                )}
                {patient.sedationLevel && (
                  <Badge variant="secondary" className="text-xs">
                    <Brain className="h-3 w-3 mr-1" />
                    {patient.sedationLevel}
                  </Badge>
                )}
                {patient.glasgowComaScale && (
                  <Badge variant="secondary" className="text-xs">
                    GCS: {patient.glasgowComaScale}
                  </Badge>
                )}
              </div>

              {/* Mini Trend Chart */}
              <div className="h-24">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={patient.vitalsTrend.slice(-12)}>
                    <Line 
                      type="monotone" 
                      dataKey="heartRate" 
                      stroke="#ef4444" 
                      strokeWidth={2}
                      dot={false}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="oxygenSaturation" 
                      stroke="#06b6d4" 
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Active Medications */}
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">Active Medications</p>
                <div className="flex flex-wrap gap-1">
                  {patient.medications.slice(0, 3).map((med, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      <Pill className="h-3 w-3 mr-1" />
                      {med.name}
                    </Badge>
                  ))}
                  {patient.medications.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{patient.medications.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>

              {/* Recent Alerts */}
              {patient.alerts.filter(a => !a.acknowledged).length > 0 && (
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">Active Alerts</p>
                  {patient.alerts.filter(a => !a.acknowledged).map(alert => (
                    <Alert key={alert.id} className={`py-1 px-2 ${
                      alert.type === 'critical' ? 'border-red-500 bg-red-50' : 
                      alert.type === 'warning' ? 'border-yellow-500 bg-yellow-50' : 
                      'border-blue-500 bg-blue-50'
                    }`}>
                      <AlertDescription className="text-xs">
                        {alert.message}
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>
              )}

              {/* Staff Info */}
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Dr. {patient.attendingDoctor.split(' ').pop()}</span>
                <span>Nurse: {patient.nurseInCharge}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Patient View Dialog */}
      {selectedPatient && (
        <Dialog open={!!selectedPatient} onOpenChange={() => setSelectedPatient(null)}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Badge>{selectedPatient.bedNumber}</Badge>
                {selectedPatient.name} - Detailed Monitoring
              </DialogTitle>
              <DialogDescription>
                {selectedPatient.primaryDiagnosis} | Admitted: {format(new Date(selectedPatient.admissionDate), 'dd MMM yyyy')}
              </DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="vitals" className="mt-4">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="vitals">Vital Trends</TabsTrigger>
                <TabsTrigger value="medications">Medications</TabsTrigger>
                <TabsTrigger value="labs">Lab Results</TabsTrigger>
                <TabsTrigger value="alerts">Alerts</TabsTrigger>
                <TabsTrigger value="notes">Clinical Notes</TabsTrigger>
              </TabsList>

              <TabsContent value="vitals" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Heart Rate & Blood Pressure</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={selectedPatient.vitalsTrend}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis 
                            dataKey="timestamp" 
                            tickFormatter={(time) => format(new Date(time), 'HH:mm')}
                          />
                          <YAxis />
                          <Tooltip 
                            labelFormatter={(time) => format(new Date(time), 'HH:mm')}
                          />
                          <Legend />
                          <Line 
                            type="monotone" 
                            dataKey="heartRate" 
                            stroke="#ef4444" 
                            name="Heart Rate"
                          />
                          <Line 
                            type="monotone" 
                            dataKey="bloodPressureSystolic" 
                            stroke="#3b82f6" 
                            name="Systolic BP"
                          />
                          <Line 
                            type="monotone" 
                            dataKey="bloodPressureDiastolic" 
                            stroke="#6366f1" 
                            name="Diastolic BP"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Respiratory & Oxygen</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={selectedPatient.vitalsTrend}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis 
                            dataKey="timestamp" 
                            tickFormatter={(time) => format(new Date(time), 'HH:mm')}
                          />
                          <YAxis />
                          <Tooltip 
                            labelFormatter={(time) => format(new Date(time), 'HH:mm')}
                          />
                          <Legend />
                          <Line 
                            type="monotone" 
                            dataKey="respiratoryRate" 
                            stroke="#10b981" 
                            name="Resp Rate"
                          />
                          <Line 
                            type="monotone" 
                            dataKey="oxygenSaturation" 
                            stroke="#06b6d4" 
                            name="SpO2"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="medications" className="space-y-4">
                <div className="space-y-3">
                  {selectedPatient.medications.map((med, idx) => (
                    <Card key={idx}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold">{med.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {med.dose} via {med.route} - {med.frequency}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Started at {med.startTime}
                            </p>
                          </div>
                          <Badge variant="outline">Active</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="labs" className="space-y-4">
                {selectedPatient.labResults && (
                  <div className="space-y-3">
                    {selectedPatient.labResults.map((lab, idx) => (
                      <Card key={idx}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-semibold">{lab.test}</p>
                              <p className="text-sm">
                                {lab.value} {lab.unit}
                              </p>
                            </div>
                            <div className="text-right">
                              <Badge className={
                                lab.status === 'critical' ? 'bg-red-100 text-red-800' :
                                lab.status === 'abnormal' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-green-100 text-green-800'
                              }>
                                {lab.status}
                              </Badge>
                              <p className="text-xs text-muted-foreground mt-1">
                                {lab.timestamp}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="alerts" className="space-y-4">
                <div className="space-y-3">
                  {selectedPatient.alerts.map(alert => (
                    <Alert key={alert.id} className={
                      alert.type === 'critical' ? 'border-red-500' :
                      alert.type === 'warning' ? 'border-yellow-500' :
                      'border-blue-500'
                    }>
                      <AlertDescription>
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">{alert.message}</p>
                            <p className="text-xs text-muted-foreground">{alert.timestamp}</p>
                          </div>
                          {alert.acknowledged ? (
                            <Badge variant="outline">Acknowledged</Badge>
                          ) : (
                            <Button size="sm" variant="outline">Acknowledge</Button>
                          )}
                        </div>
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="notes" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Clinical Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="border-l-4 border-blue-500 pl-4">
                        <p className="text-sm font-medium">Admission Note</p>
                        <p className="text-sm text-muted-foreground">
                          Patient admitted with {selectedPatient.primaryDiagnosis}. 
                          {selectedPatient.secondaryDiagnosis && ` Secondary conditions: ${selectedPatient.secondaryDiagnosis.join(', ')}.`}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {format(new Date(selectedPatient.admissionDate), 'dd MMM yyyy HH:mm')}
                        </p>
                      </div>
                      <div className="border-l-4 border-green-500 pl-4">
                        <p className="text-sm font-medium">Latest Assessment</p>
                        <p className="text-sm text-muted-foreground">
                          Patient stable on current management. Continue monitoring vitals closely.
                          {selectedPatient.ventilatorMode && ` Ventilator mode: ${selectedPatient.ventilatorMode}.`}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          2 hours ago - {selectedPatient.attendingDoctor}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}