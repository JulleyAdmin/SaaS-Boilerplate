'use client';

import { 
  AlertCircle,
  Ambulance,
  Clock,
  Heart,
  Activity,
  Users,
  Bed,
  Phone,
  Siren,
  Timer,
  Stethoscope,
  UserCheck,
  Thermometer,
  Zap,
  FileText,
  Plus,
  Filter,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useState, useEffect } from 'react';

export default function EmergencyDepartmentPage() {
  const [selectedTriage, setSelectedTriage] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Auto-refresh every 30 seconds for real-time updates
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        setLastUpdated(new Date());
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  // Emergency department statistics
  const emergencyStats = {
    totalPatients: 24,
    critical: 3,
    urgent: 7,
    standard: 10,
    minor: 4,
    averageWaitTime: 35,
    bedsAvailable: 2,
    totalBeds: 15,
    doctorsOnDuty: 4,
    nursesOnDuty: 8,
    ambulancesAvailable: 2,
    ambulancesTotal: 4
  };

  // Active emergency cases
  const emergencyCases = [
    {
      id: 'ER001',
      patientName: 'Rajesh Verma',
      age: 45,
      gender: 'M',
      arrivalTime: '10:15 AM',
      waitTime: '15 min',
      triage: 'critical',
      chiefComplaint: 'Chest pain, difficulty breathing',
      vitals: {
        bp: '160/95',
        pulse: '110',
        temp: '98.6°F',
        spo2: '92%',
        respRate: '24/min'
      },
      status: 'in-treatment',
      assignedTo: 'Dr. Sarah Wilson',
      bed: 'ER-01',
      tests: ['ECG', 'Troponin', 'Chest X-ray'],
      priority: 1
    },
    {
      id: 'ER002',
      patientName: 'Priya Singh',
      age: 28,
      gender: 'F',
      arrivalTime: '10:45 AM',
      waitTime: '5 min',
      triage: 'urgent',
      chiefComplaint: 'Severe abdominal pain, vomiting',
      vitals: {
        bp: '110/70',
        pulse: '95',
        temp: '100.2°F',
        spo2: '98%',
        respRate: '18/min'
      },
      status: 'waiting-doctor',
      assignedTo: null,
      bed: 'ER-03',
      tests: ['CBC', 'USG Abdomen'],
      priority: 2
    },
    {
      id: 'ER003',
      patientName: 'Amit Kumar',
      age: 8,
      gender: 'M',
      arrivalTime: '11:00 AM',
      waitTime: '10 min',
      triage: 'urgent',
      chiefComplaint: 'High fever, seizures',
      vitals: {
        bp: '90/60',
        pulse: '120',
        temp: '103.5°F',
        spo2: '96%',
        respRate: '28/min'
      },
      status: 'in-treatment',
      assignedTo: 'Dr. Priya Patel',
      bed: 'ER-02',
      tests: ['Blood Culture', 'CSF Analysis'],
      priority: 2
    },
    {
      id: 'ER004',
      patientName: 'Mohammed Ali',
      age: 35,
      gender: 'M',
      arrivalTime: '11:20 AM',
      waitTime: '25 min',
      triage: 'standard',
      chiefComplaint: 'Laceration on forearm, bleeding controlled',
      vitals: {
        bp: '120/80',
        pulse: '80',
        temp: '98.4°F',
        spo2: '99%',
        respRate: '16/min'
      },
      status: 'waiting-treatment',
      assignedTo: null,
      bed: null,
      tests: ['Tetanus status'],
      priority: 3
    },
    {
      id: 'ER005',
      patientName: 'Sunita Rao',
      age: 62,
      gender: 'F',
      arrivalTime: '11:30 AM',
      waitTime: '20 min',
      triage: 'critical',
      chiefComplaint: 'Unconscious, suspected stroke',
      vitals: {
        bp: '180/100',
        pulse: '88',
        temp: '99.1°F',
        spo2: '94%',
        respRate: '20/min'
      },
      status: 'in-treatment',
      assignedTo: 'Dr. Michael Brown',
      bed: 'ER-04',
      tests: ['CT Brain', 'MRI'],
      priority: 1
    }
  ];

  // Ambulance status
  const ambulanceStatus = [
    { id: 'AMB-01', status: 'available', location: 'Base', crew: 'Team A' },
    { id: 'AMB-02', status: 'en-route', location: 'Sector 15', eta: '10 min', patient: 'RTA victim' },
    { id: 'AMB-03', status: 'at-scene', location: 'Mall Road', patient: 'Cardiac emergency' },
    { id: 'AMB-04', status: 'available', location: 'Base', crew: 'Team D' }
  ];

  const getTriageBadge = (triage: string) => {
    switch (triage) {
      case 'critical':
        return <Badge className="bg-red-600">Critical</Badge>;
      case 'urgent':
        return <Badge className="bg-orange-500">Urgent</Badge>;
      case 'standard':
        return <Badge className="bg-yellow-500">Standard</Badge>;
      case 'minor':
        return <Badge className="bg-green-500">Minor</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'in-treatment':
        return <Badge variant="default">In Treatment</Badge>;
      case 'waiting-doctor':
        return <Badge variant="outline">Waiting for Doctor</Badge>;
      case 'waiting-treatment':
        return <Badge variant="outline">Waiting for Treatment</Badge>;
      case 'discharged':
        return <Badge className="bg-green-500">Discharged</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getAmbulanceStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'text-green-600 bg-green-50';
      case 'en-route':
        return 'text-orange-600 bg-orange-50';
      case 'at-scene':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const filteredCases = emergencyCases.filter(case_ => {
    const matchesSearch = 
      case_.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      case_.chiefComplaint.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTriage = selectedTriage === 'all' || case_.triage === selectedTriage;
    return matchesSearch && matchesTriage;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Emergency Department</h1>
          <p className="text-muted-foreground">
            Real-time emergency room management and patient triage
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant={autoRefresh ? "default" : "outline"}
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            <Activity className={`mr-2 size-4 ${autoRefresh ? 'animate-pulse' : ''}`} />
            {autoRefresh ? 'Live Updates ON' : 'Live Updates OFF'}
          </Button>
          <Button>
            <Plus className="mr-2 size-4" />
            Register Emergency
          </Button>
        </div>
      </div>

      {/* Critical Alert */}
      {emergencyStats.critical > 0 && (
        <Alert className="border-red-500 bg-red-50">
          <Siren className="size-4" />
          <AlertDescription>
            <strong>{emergencyStats.critical} critical patients</strong> require immediate attention. 
            Only {emergencyStats.bedsAvailable} emergency beds available.
          </AlertDescription>
        </Alert>
      )}

      {/* Emergency Statistics */}
      <div className="grid gap-4 md:grid-cols-6">
        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Critical</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-red-600">{emergencyStats.critical}</div>
              <AlertCircle className="size-4 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Urgent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-orange-600">{emergencyStats.urgent}</div>
              <AlertTriangle className="size-4 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Standard</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-yellow-600">{emergencyStats.standard}</div>
              <Clock className="size-4 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg Wait</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{emergencyStats.averageWaitTime}<span className="text-sm">min</span></div>
              <Timer className="size-4 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Beds</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{emergencyStats.bedsAvailable}/{emergencyStats.totalBeds}</div>
              <Bed className="size-4 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Staff</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{emergencyStats.doctorsOnDuty + emergencyStats.nursesOnDuty}</div>
              <Users className="size-4 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="active-cases" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="active-cases">Active Cases</TabsTrigger>
          <TabsTrigger value="triage">Triage Queue</TabsTrigger>
          <TabsTrigger value="ambulance">Ambulance Status</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>

        {/* Active Cases Tab */}
        <TabsContent value="active-cases" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Filter Emergency Cases</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search patient name or complaint..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full"
                  />
                </div>
                <Select value={selectedTriage} onValueChange={setSelectedTriage}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by triage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Triage Levels</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="minor">Minor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Cases List */}
          <div className="space-y-4">
            {filteredCases.map(case_ => (
              <Card key={case_.id} className={case_.triage === 'critical' ? 'border-red-500' : ''}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>
                          {case_.patientName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">
                          {case_.patientName} ({case_.age}y/{case_.gender})
                        </CardTitle>
                        <CardDescription>
                          ID: {case_.id} • Arrival: {case_.arrivalTime} • Wait: {case_.waitTime}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      {getTriageBadge(case_.triage)}
                      {getStatusBadge(case_.status)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <p className="font-medium text-sm mb-1">Chief Complaint</p>
                    <p className="text-sm">{case_.chiefComplaint}</p>
                  </div>

                  {/* Vital Signs */}
                  <div className="grid grid-cols-5 gap-4 p-3 bg-blue-50 rounded-lg">
                    <div className="text-center">
                      <Heart className="size-4 mx-auto mb-1 text-red-500" />
                      <p className="text-xs text-muted-foreground">BP</p>
                      <p className="text-sm font-medium">{case_.vitals.bp}</p>
                    </div>
                    <div className="text-center">
                      <Activity className="size-4 mx-auto mb-1 text-blue-500" />
                      <p className="text-xs text-muted-foreground">Pulse</p>
                      <p className="text-sm font-medium">{case_.vitals.pulse}</p>
                    </div>
                    <div className="text-center">
                      <Thermometer className="size-4 mx-auto mb-1 text-orange-500" />
                      <p className="text-xs text-muted-foreground">Temp</p>
                      <p className="text-sm font-medium">{case_.vitals.temp}</p>
                    </div>
                    <div className="text-center">
                      <Zap className="size-4 mx-auto mb-1 text-purple-500" />
                      <p className="text-xs text-muted-foreground">SpO2</p>
                      <p className="text-sm font-medium">{case_.vitals.spo2}</p>
                    </div>
                    <div className="text-center">
                      <Activity className="size-4 mx-auto mb-1 text-green-500" />
                      <p className="text-xs text-muted-foreground">Resp</p>
                      <p className="text-sm font-medium">{case_.vitals.respRate}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Assigned To</p>
                      <p className="font-medium">{case_.assignedTo || 'Awaiting assignment'}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Bed</p>
                      <p className="font-medium">{case_.bed || 'Not assigned'}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Tests Ordered</p>
                      <p className="font-medium">{case_.tests.join(', ')}</p>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button size="sm" variant="outline">
                      <FileText className="size-4 mr-1" />
                      View Details
                    </Button>
                    <Button size="sm" variant="outline">
                      <Stethoscope className="size-4 mr-1" />
                      Assign Doctor
                    </Button>
                    {case_.triage === 'critical' && (
                      <Button size="sm" variant="destructive">
                        <AlertCircle className="size-4 mr-1" />
                        Escalate
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Triage Queue Tab */}
        <TabsContent value="triage" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Triage Assessment Queue</CardTitle>
              <CardDescription>Patients awaiting initial triage assessment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Patient Name</Label>
                    <Input placeholder="Enter patient name" />
                  </div>
                  <div className="space-y-2">
                    <Label>Age</Label>
                    <Input type="number" placeholder="Enter age" />
                  </div>
                  <div className="space-y-2">
                    <Label>Chief Complaint</Label>
                    <Textarea placeholder="Describe primary symptoms..." />
                  </div>
                  <div className="space-y-2">
                    <Label>Initial Assessment</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select triage level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="critical">Critical - Immediate</SelectItem>
                        <SelectItem value="urgent">Urgent - 15 minutes</SelectItem>
                        <SelectItem value="standard">Standard - 60 minutes</SelectItem>
                        <SelectItem value="minor">Minor - 120 minutes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button className="w-full">
                  <UserCheck className="size-4 mr-2" />
                  Complete Triage Assessment
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Waiting Patients */}
          <Card>
            <CardHeader>
              <CardTitle>Patients in Triage Queue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Ravi Shankar</p>
                    <p className="text-sm text-muted-foreground">Severe headache, dizziness • Waiting: 5 min</p>
                  </div>
                  <Button size="sm">Start Triage</Button>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Meera Patel</p>
                    <p className="text-sm text-muted-foreground">Minor cut on hand • Waiting: 12 min</p>
                  </div>
                  <Button size="sm">Start Triage</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Ambulance Status Tab */}
        <TabsContent value="ambulance" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {ambulanceStatus.map(ambulance => (
              <Card key={ambulance.id} className={ambulance.status === 'available' ? 'border-green-500' : ''}>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>{ambulance.id}</CardTitle>
                    <Badge className={getAmbulanceStatusColor(ambulance.status)}>
                      {ambulance.status.replace('-', ' ').toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Location</span>
                      <span className="text-sm font-medium">{ambulance.location}</span>
                    </div>
                    {ambulance.crew && (
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Crew</span>
                        <span className="text-sm font-medium">{ambulance.crew}</span>
                      </div>
                    )}
                    {ambulance.eta && (
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">ETA</span>
                        <span className="text-sm font-medium">{ambulance.eta}</span>
                      </div>
                    )}
                    {ambulance.patient && (
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Patient</span>
                        <span className="text-sm font-medium">{ambulance.patient}</span>
                      </div>
                    )}
                  </div>
                  <div className="mt-4">
                    {ambulance.status === 'available' ? (
                      <Button size="sm" className="w-full">
                        <Ambulance className="size-4 mr-2" />
                        Dispatch
                      </Button>
                    ) : (
                      <Button size="sm" variant="outline" className="w-full">
                        <Phone className="size-4 mr-2" />
                        Contact Crew
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Dispatch New Ambulance */}
          <Card>
            <CardHeader>
              <CardTitle>Dispatch Ambulance</CardTitle>
              <CardDescription>Send ambulance for emergency pickup</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Pickup Location</Label>
                  <Input placeholder="Enter address or landmark" />
                </div>
                <div className="space-y-2">
                  <Label>Emergency Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select emergency type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cardiac">Cardiac Emergency</SelectItem>
                      <SelectItem value="trauma">Trauma/Accident</SelectItem>
                      <SelectItem value="stroke">Stroke</SelectItem>
                      <SelectItem value="respiratory">Respiratory Distress</SelectItem>
                      <SelectItem value="other">Other Emergency</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button className="mt-4">
                <Siren className="size-4 mr-2" />
                Dispatch Nearest Available
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Resources Tab */}
        <TabsContent value="resources" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Emergency Beds */}
            <Card>
              <CardHeader>
                <CardTitle>Emergency Bed Status</CardTitle>
                <CardDescription>Real-time bed availability</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Bed Occupancy</span>
                      <span className="text-sm font-medium">
                        {emergencyStats.totalBeds - emergencyStats.bedsAvailable}/{emergencyStats.totalBeds}
                      </span>
                    </div>
                    <Progress 
                      value={((emergencyStats.totalBeds - emergencyStats.bedsAvailable) / emergencyStats.totalBeds) * 100} 
                      className="h-2"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="p-3 border rounded">
                      <p className="text-muted-foreground">Resuscitation Beds</p>
                      <p className="text-xl font-bold">2/3</p>
                    </div>
                    <div className="p-3 border rounded">
                      <p className="text-muted-foreground">Observation Beds</p>
                      <p className="text-xl font-bold">8/10</p>
                    </div>
                    <div className="p-3 border rounded">
                      <p className="text-muted-foreground">Isolation Beds</p>
                      <p className="text-xl font-bold">1/2</p>
                    </div>
                    <div className="p-3 border rounded">
                      <p className="text-muted-foreground">Available</p>
                      <p className="text-xl font-bold text-green-600">{emergencyStats.bedsAvailable}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Staff on Duty */}
            <Card>
              <CardHeader>
                <CardTitle>Emergency Staff on Duty</CardTitle>
                <CardDescription>Current shift personnel</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Emergency Physicians</span>
                      <Badge>{emergencyStats.doctorsOnDuty}</Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Dr. Sarah Wilson, Dr. Michael Brown, Dr. Raj Sharma, Dr. Priya Patel
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Emergency Nurses</span>
                      <Badge>{emergencyStats.nursesOnDuty}</Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      8 nurses across triage, treatment, and observation areas
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Support Staff</span>
                      <Badge>6</Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Technicians, orderlies, and administrative staff
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Equipment Status */}
            <Card>
              <CardHeader>
                <CardTitle>Critical Equipment</CardTitle>
                <CardDescription>Availability of emergency equipment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Ventilators</span>
                    <div className="flex items-center gap-2">
                      <Progress value={60} className="w-24 h-2" />
                      <span className="text-sm font-medium">3/5</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Defibrillators</span>
                    <div className="flex items-center gap-2">
                      <Progress value={75} className="w-24 h-2" />
                      <span className="text-sm font-medium">3/4</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Crash Carts</span>
                    <div className="flex items-center gap-2">
                      <Progress value={100} className="w-24 h-2" />
                      <span className="text-sm font-medium">4/4</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Portable X-Ray</span>
                    <div className="flex items-center gap-2">
                      <Progress value={50} className="w-24 h-2" />
                      <span className="text-sm font-medium">1/2</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Emergency Supplies */}
            <Card>
              <CardHeader>
                <CardTitle>Emergency Supplies</CardTitle>
                <CardDescription>Stock levels of critical supplies</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Blood Units (O-ve)</span>
                    <Badge className="bg-red-500">Low - 8 units</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">IV Fluids</span>
                    <Badge className="bg-green-500">Adequate - 150 bags</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Emergency Medications</span>
                    <Badge className="bg-green-500">Stocked</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">PPE Kits</span>
                    <Badge className="bg-yellow-500">Medium - 45 kits</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Footer */}
      <div className="flex justify-between items-center text-sm text-muted-foreground">
        <div>
          Last updated: {lastUpdated.toLocaleTimeString()}
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>Emergency System Active</span>
        </div>
      </div>
    </div>
  );
}