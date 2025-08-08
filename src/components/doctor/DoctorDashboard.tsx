'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/components/ui/use-toast';
import { 
  Clock, 
  User, 
  Calendar,
  AlertCircle,
  Activity,
  ChevronRight,
  Users,
  CheckCircle,
  XCircle,
  Timer,
  Phone,
  Hash,
  FileText,
  Eye,
  Play,
  Pause,
  SkipForward
} from 'lucide-react';
import { format, formatDistanceToNow, isToday, parseISO } from 'date-fns';
import CrossDepartmentDiagnosisHistory from './CrossDepartmentDiagnosisHistory';

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  phone: string;
  photoUrl?: string;
}

interface Appointment {
  id: string;
  patient: Patient;
  appointmentTime: string;
  tokenNumber: number;
  appointmentType: 'Consultation' | 'Follow-up' | 'Emergency' | 'Vaccination' | 'Health Checkup';
  status: 'Scheduled' | 'In-Progress' | 'Completed' | 'No-Show' | 'Cancelled';
  chiefComplaint?: string;
  priority: 'normal' | 'urgent' | 'emergency';
  department: string;
  consultationFee: number;
  paymentStatus: 'Paid' | 'Pending';
  waitTime?: number;
  previousVisits?: number;
}

interface QueueStats {
  total: number;
  completed: number;
  pending: number;
  inProgress: number;
  noShow: number;
  avgConsultationTime: number;
  estimatedWaitTime: number;
}

export default function DoctorDashboard() {
  const router = useRouter();
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [currentPatient, setCurrentPatient] = useState<Appointment | null>(null);
  const [queueStats, setQueueStats] = useState<QueueStats>({
    total: 0,
    completed: 0,
    pending: 0,
    inProgress: 0,
    noShow: 0,
    avgConsultationTime: 15,
    estimatedWaitTime: 0
  });
  const [viewMode, setViewMode] = useState<'cards' | 'queue'>('cards');
  const [selectedTab, setSelectedTab] = useState('pending');
  const [isConsultationActive, setIsConsultationActive] = useState(false);
  const [consultationTimer, setConsultationTimer] = useState(0);

  // Mock data - replace with API call
  useEffect(() => {
    const mockAppointments: Appointment[] = [
      {
        id: '1',
        patient: {
          id: 'P001',
          name: 'Rajesh Kumar',
          age: 45,
          gender: 'Male',
          phone: '9876543210'
        },
        appointmentTime: new Date().toISOString(),
        tokenNumber: 1,
        appointmentType: 'Consultation',
        status: 'In-Progress',
        chiefComplaint: 'Fever and headache for 2 days',
        priority: 'normal',
        department: 'General Medicine',
        consultationFee: 500,
        paymentStatus: 'Paid',
        previousVisits: 3
      },
      {
        id: '2',
        patient: {
          id: 'P002',
          name: 'Priya Sharma',
          age: 28,
          gender: 'Female',
          phone: '9876543211'
        },
        appointmentTime: new Date(Date.now() + 30 * 60000).toISOString(),
        tokenNumber: 2,
        appointmentType: 'Follow-up',
        status: 'Scheduled',
        chiefComplaint: 'Follow-up for diabetes',
        priority: 'normal',
        department: 'General Medicine',
        consultationFee: 300,
        paymentStatus: 'Paid',
        previousVisits: 5
      },
      {
        id: '3',
        patient: {
          id: 'P003',
          name: 'Emergency Patient',
          age: 35,
          gender: 'Male',
          phone: '9876543212'
        },
        appointmentTime: new Date(Date.now() + 45 * 60000).toISOString(),
        tokenNumber: 999,
        appointmentType: 'Emergency',
        status: 'Scheduled',
        chiefComplaint: 'Severe chest pain',
        priority: 'emergency',
        department: 'Emergency',
        consultationFee: 1000,
        paymentStatus: 'Pending',
        previousVisits: 0
      },
      {
        id: '4',
        patient: {
          id: 'P004',
          name: 'Amit Patel',
          age: 52,
          gender: 'Male',
          phone: '9876543213'
        },
        appointmentTime: new Date(Date.now() + 60 * 60000).toISOString(),
        tokenNumber: 3,
        appointmentType: 'Health Checkup',
        status: 'Scheduled',
        chiefComplaint: 'Annual health checkup',
        priority: 'normal',
        department: 'General Medicine',
        consultationFee: 800,
        paymentStatus: 'Paid',
        previousVisits: 2
      },
      {
        id: '5',
        patient: {
          id: 'P005',
          name: 'Sunita Devi',
          age: 65,
          gender: 'Female',
          phone: '9876543214'
        },
        appointmentTime: new Date(Date.now() - 60 * 60000).toISOString(),
        tokenNumber: 4,
        appointmentType: 'Consultation',
        status: 'Completed',
        chiefComplaint: 'Joint pain and arthritis',
        priority: 'normal',
        department: 'General Medicine',
        consultationFee: 500,
        paymentStatus: 'Paid',
        previousVisits: 8
      }
    ];

    setAppointments(mockAppointments);
    
    // Calculate stats
    const stats: QueueStats = {
      total: mockAppointments.length,
      completed: mockAppointments.filter(a => a.status === 'Completed').length,
      pending: mockAppointments.filter(a => a.status === 'Scheduled').length,
      inProgress: mockAppointments.filter(a => a.status === 'In-Progress').length,
      noShow: mockAppointments.filter(a => a.status === 'No-Show').length,
      avgConsultationTime: 15,
      estimatedWaitTime: mockAppointments.filter(a => a.status === 'Scheduled').length * 15
    };
    
    setQueueStats(stats);
    
    // Set current patient
    const current = mockAppointments.find(a => a.status === 'In-Progress');
    if (current) {
      setCurrentPatient(current);
      setIsConsultationActive(true);
    }
  }, []);

  // Timer for consultation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isConsultationActive) {
      interval = setInterval(() => {
        setConsultationTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isConsultationActive]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startConsultation = (appointment: Appointment) => {
    // Navigate to consultation page
    router.push(`/dashboard/doctor/consultation/${appointment.id}`);
    
    // Update appointment status
    setAppointments(prev => 
      prev.map(apt => 
        apt.id === appointment.id 
          ? { ...apt, status: 'In-Progress' as const }
          : apt
      )
    );
    
    setCurrentPatient(appointment);
    setIsConsultationActive(true);
    setConsultationTimer(0);
    
    toast({
      title: "Consultation Started",
      description: `Started consultation for ${appointment.patient.name}`,
    });
  };

  const viewPatientHistory = (patientId: string) => {
    router.push(`/dashboard/patients/${patientId}/history`);
  };

  const markNoShow = (appointmentId: string) => {
    setAppointments(prev => 
      prev.map(apt => 
        apt.id === appointmentId 
          ? { ...apt, status: 'No-Show' as const }
          : apt
      )
    );
    
    toast({
      title: "Marked as No-Show",
      description: "Patient has been marked as no-show",
    });
  };

  const skipPatient = (appointmentId: string) => {
    const appointment = appointments.find(a => a.id === appointmentId);
    if (appointment) {
      // Move to end of queue
      setAppointments(prev => {
        const filtered = prev.filter(a => a.id !== appointmentId);
        return [...filtered, { ...appointment, tokenNumber: filtered.length + 1 }];
      });
      
      toast({
        title: "Patient Skipped",
        description: "Patient moved to end of queue",
      });
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'emergency': return 'bg-red-100 text-red-800 border-red-300';
      case 'urgent': return 'bg-orange-100 text-orange-800 border-orange-300';
      default: return 'bg-green-100 text-green-800 border-green-300';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed': return <Badge className="bg-green-500">Completed</Badge>;
      case 'In-Progress': return <Badge className="bg-blue-500">In Progress</Badge>;
      case 'No-Show': return <Badge variant="destructive">No Show</Badge>;
      case 'Cancelled': return <Badge variant="secondary">Cancelled</Badge>;
      default: return <Badge variant="outline">Scheduled</Badge>;
    }
  };

  const filteredAppointments = appointments.filter(apt => {
    switch (selectedTab) {
      case 'pending': return apt.status === 'Scheduled';
      case 'completed': return apt.status === 'Completed';
      case 'all': return true;
      default: return true;
    }
  });

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Doctor Dashboard</h1>
          <p className="text-gray-600">
            {format(new Date(), 'EEEE, MMMM dd, yyyy')}
          </p>
        </div>
        
        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={() => setViewMode(viewMode === 'cards' ? 'queue' : 'cards')}
            data-testid="queue-view-toggle"
          >
            {viewMode === 'cards' ? 'Queue View' : 'Card View'}
          </Button>
          
          {isConsultationActive && (
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg">
              <Activity className="h-4 w-4 text-blue-600 animate-pulse" />
              <span className="font-mono text-blue-600">{formatTimer(consultationTimer)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4" data-testid="appointment-queue">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="total-appointments">
              {queueStats.total}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600" data-testid="completed-count">
              {queueStats.completed}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600" data-testid="pending-count">
              {queueStats.pending}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg. Consultation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {queueStats.avgConsultationTime} min
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Est. Wait Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {queueStats.estimatedWaitTime} min
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Current Patient */}
      {currentPatient && (
        <Card className="border-blue-500 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-600" />
              Current Consultation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="space-y-2">
                <p className="text-lg font-semibold">{currentPatient.patient.name}</p>
                <p className="text-sm text-gray-600">
                  {currentPatient.patient.age} years, {currentPatient.patient.gender}
                </p>
                <p className="text-sm">{currentPatient.chiefComplaint}</p>
              </div>
              <Button 
                onClick={() => router.push(`/dashboard/doctor/consultation/${currentPatient.id}`)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Continue Consultation
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Patient Queue */}
      <Card>
        <CardHeader>
          <CardTitle>Patient Queue</CardTitle>
          <CardDescription>Today's appointments and walk-ins</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="pending">Pending ({queueStats.pending})</TabsTrigger>
              <TabsTrigger value="completed">Completed ({queueStats.completed})</TabsTrigger>
              <TabsTrigger value="all">All ({queueStats.total})</TabsTrigger>
            </TabsList>

            <TabsContent value={selectedTab}>
              {viewMode === 'cards' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredAppointments.map((appointment) => (
                    <Card 
                      key={appointment.id} 
                      data-testid="patient-card"
                      data-priority={appointment.priority}
                      className={`${appointment.priority === 'emergency' ? 'border-red-500 emergency' : ''}`}
                    >
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={appointment.patient.photoUrl} />
                              <AvatarFallback>
                                {appointment.patient.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-semibold" data-testid="patient-name">
                                {appointment.patient.name}
                              </p>
                              <p className="text-sm text-gray-600" data-testid="patient-age">
                                {appointment.patient.age} years, {appointment.patient.gender}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex flex-col items-end gap-1">
                            <Badge 
                              className={getPriorityColor(appointment.priority)}
                              data-testid={appointment.priority === 'emergency' ? 'emergency-badge' : ''}
                            >
                              {appointment.priority}
                            </Badge>
                            {getStatusBadge(appointment.status)}
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="space-y-3">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="flex items-center gap-2">
                            <Hash className="h-4 w-4 text-gray-400" />
                            <span data-testid="token-number">Token: {appointment.tokenNumber}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <span data-testid="appointment-time">
                              {format(parseISO(appointment.appointmentTime), 'HH:mm')}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-gray-400" />
                            <span data-testid="appointment-type">{appointment.appointmentType}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-gray-400" />
                            <span>{appointment.patient.phone}</span>
                          </div>
                        </div>
                        
                        {appointment.chiefComplaint && (
                          <div className="p-2 bg-gray-50 rounded text-sm">
                            <p className="font-medium">Chief Complaint:</p>
                            <p>{appointment.chiefComplaint}</p>
                          </div>
                        )}
                        
                        {appointment.previousVisits !== undefined && appointment.previousVisits > 0 && (
                          <p className="text-sm text-gray-600">
                            Previous visits: {appointment.previousVisits}
                          </p>
                        )}
                        
                        <div className="flex gap-2 pt-2">
                          {appointment.status === 'Scheduled' && (
                            <>
                              <Button 
                                size="sm"
                                onClick={() => startConsultation(appointment)}
                                data-testid="start-consultation-btn"
                                className="flex-1"
                              >
                                <Play className="h-4 w-4 mr-1" />
                                Start Consultation
                              </Button>
                              <Button 
                                size="sm"
                                variant="outline"
                                onClick={() => viewPatientHistory(appointment.patient.id)}
                                data-testid="view-history-btn"
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                History
                              </Button>
                            </>
                          )}
                          
                          {appointment.status === 'Scheduled' && appointment.priority !== 'emergency' && (
                            <Button 
                              size="sm"
                              variant="ghost"
                              onClick={() => skipPatient(appointment.id)}
                            >
                              <SkipForward className="h-4 w-4" />
                            </Button>
                          )}
                          
                          {appointment.status === 'Scheduled' && (
                            <Button 
                              size="sm"
                              variant="ghost"
                              onClick={() => markNoShow(appointment.id)}
                              data-testid="mark-no-show"
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                // Queue View
                <ScrollArea className="h-[500px]">
                  <div className="space-y-2" data-testid="queue-list">
                    {filteredAppointments.map((appointment, index) => (
                      <div 
                        key={appointment.id}
                        data-testid="queue-item"
                        className={`flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 
                          ${appointment.status === 'No-Show' ? 'no-show opacity-50' : ''}`}
                      >
                        <div className="flex items-center gap-4">
                          <div 
                            className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600 font-bold"
                            data-testid="token"
                          >
                            {appointment.tokenNumber}
                          </div>
                          
                          <div>
                            <p className="font-semibold">{appointment.patient.name}</p>
                            <p className="text-sm text-gray-600">
                              {appointment.appointmentType} • {format(parseISO(appointment.appointmentTime), 'HH:mm')}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {getStatusBadge(appointment.status)}
                          {appointment.status === 'Scheduled' && (
                            <Button 
                              size="sm"
                              onClick={() => startConsultation(appointment)}
                            >
                              Start
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Cross-Department Diagnosis History */}
      <CrossDepartmentDiagnosisHistory />

      {/* Quick Actions for Emergency */}
      {appointments.some(a => a.priority === 'emergency' && a.status === 'Scheduled') && (
        <Card className="border-red-500 bg-red-50" data-testid="emergency-alert">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <AlertCircle className="h-5 w-5" />
              Emergency Patient Waiting
            </CardTitle>
          </CardHeader>
          <CardContent data-testid="quick-actions">
            <div className="flex gap-2">
              <Button 
                variant="destructive"
                onClick={() => {
                  const emergency = appointments.find(a => a.priority === 'emergency' && a.status === 'Scheduled');
                  if (emergency) startConsultation(emergency);
                }}
              >
                Start Emergency Consultation
              </Button>
              <Button 
                variant="outline"
                data-testid="admission-button"
              >
                Direct Admission
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}