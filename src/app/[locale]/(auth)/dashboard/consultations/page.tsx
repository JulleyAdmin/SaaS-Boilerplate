'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarInitials } from '@/components/ui/avatar';
import { 
  Stethoscope, 
  Clock, 
  User, 
  Search, 
  Calendar,
  FileText,
  Eye,
  Plus,
  CheckCircle,
  XCircle,
  AlertCircle,
  Activity,
  Users
} from 'lucide-react';
import { useState } from 'react';

// Mock consultation data
const consultations = [
  {
    id: 'CONS001',
    patientName: 'Rajesh Kumar',
    patientId: 'P001',
    doctorName: 'Dr. Sarah Wilson',
    department: 'General Medicine',
    appointmentTime: '2024-01-15 09:00:00',
    status: 'completed',
    consultationType: 'Follow-up',
    chiefComplaint: 'Diabetes follow-up and medication review',
    diagnosis: 'Type 2 Diabetes Mellitus - Well controlled',
    prescription: 'Continue Metformin 500mg BD, Lifestyle modifications',
    nextAppointment: '2024-02-15',
    duration: 25,
    fee: 500,
    paymentStatus: 'paid'
  },
  {
    id: 'CONS002',
    patientName: 'Sunita Devi',
    patientId: 'P003',
    doctorName: 'Dr. Michael Brown',
    department: 'Cardiology',
    appointmentTime: '2024-01-15 10:30:00',
    status: 'in-progress',
    consultationType: 'New Consultation',
    chiefComplaint: 'Chest pain and shortness of breath',
    diagnosis: 'Under evaluation - ECG and Echo ordered',
    prescription: 'Pending investigation results',
    nextAppointment: null,
    duration: null,
    fee: 800,
    paymentStatus: 'paid'
  },
  {
    id: 'CONS003',
    patientName: 'Baby Sharma',
    patientId: 'P004',
    doctorName: 'Dr. Priya Patel',
    department: 'Pediatrics',
    appointmentTime: '2024-01-15 11:15:00',
    status: 'scheduled',
    consultationType: 'Vaccination',
    chiefComplaint: 'Routine vaccination - MMR due',
    diagnosis: null,
    prescription: null,
    nextAppointment: null,
    duration: null,
    fee: 300,
    paymentStatus: 'pending'
  },
  {
    id: 'CONS004',
    patientName: 'Amit Patel',
    patientId: 'P006',
    doctorName: 'Dr. Sarah Wilson',
    department: 'General Medicine',
    appointmentTime: '2024-01-15 14:00:00',
    status: 'completed',
    consultationType: 'New Consultation',
    chiefComplaint: 'Fever, body ache, and fatigue for 3 days',
    diagnosis: 'Viral fever with myalgia',
    prescription: 'Paracetamol 650mg TDS, Rest, Adequate hydration',
    nextAppointment: '2024-01-20',
    duration: 20,
    fee: 500,
    paymentStatus: 'paid'
  },
  {
    id: 'CONS005',
    patientName: 'Priya Sharma',
    patientId: 'P002',
    doctorName: 'Dr. Kavya Reddy',
    department: 'Gynecology',
    appointmentTime: '2024-01-15 15:30:00',
    status: 'scheduled',
    consultationType: 'Routine Checkup',
    chiefComplaint: 'Regular gynecological examination',
    diagnosis: null,
    prescription: null,
    nextAppointment: null,
    duration: null,
    fee: 600,
    paymentStatus: 'paid'
  }
];

const consultationStats = {
  totalToday: 18,
  completed: 12,
  inProgress: 2,
  scheduled: 4,
  cancelled: 0,
  revenue: 12500
};

export default function ConsultationsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [doctorFilter, setDoctorFilter] = useState('all');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500">Completed</Badge>;
      case 'in-progress':
        return <Badge className="bg-blue-500">In Progress</Badge>;
      case 'scheduled':
        return <Badge variant="outline">Scheduled</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getPaymentBadge = (paymentStatus: string) => {
    switch (paymentStatus) {
      case 'paid':
        return <Badge className="bg-green-500">Paid</Badge>;
      case 'pending':
        return <Badge className="bg-orange-500">Pending</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const filteredConsultations = consultations.filter(consultation => {
    const matchesSearch = 
      consultation.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      consultation.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      consultation.chiefComplaint.toLowerCase().includes(searchQuery.toLowerCase()) ||
      consultation.patientId.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || consultation.status === statusFilter;
    const matchesDepartment = departmentFilter === 'all' || consultation.department === departmentFilter;
    const matchesDoctor = doctorFilter === 'all' || consultation.doctorName === doctorFilter;
    
    return matchesSearch && matchesStatus && matchesDepartment && matchesDoctor;
  });

  const departments = Array.from(new Set(consultations.map(c => c.department)));
  const doctors = Array.from(new Set(consultations.map(c => c.doctorName)));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Consultations</h1>
          <p className="text-muted-foreground">Manage patient consultations and medical records</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="mr-2 size-4" />
            Schedule View
          </Button>
          <Button>
            <Plus className="mr-2 size-4" />
            New Consultation
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Today</CardTitle>
            <Stethoscope className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{consultationStats.totalToday}</div>
            <p className="text-xs text-muted-foreground">Consultations scheduled</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="size-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{consultationStats.completed}</div>
            <p className="text-xs text-muted-foreground">Successfully completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Activity className="size-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{consultationStats.inProgress}</div>
            <p className="text-xs text-muted-foreground">Currently ongoing</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
            <Clock className="size-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{consultationStats.scheduled}</div>
            <p className="text-xs text-muted-foreground">Upcoming appointments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cancelled</CardTitle>
            <XCircle className="size-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{consultationStats.cancelled}</div>
            <p className="text-xs text-muted-foreground">Today's cancellations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <Users className="size-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">₹{consultationStats.revenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Today's earnings</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                <Input
                  placeholder="Search by patient name, doctor, complaint, or patient ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map(dept => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={doctorFilter} onValueChange={setDoctorFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by doctor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Doctors</SelectItem>
                {doctors.map(doctor => (
                  <SelectItem key={doctor} value={doctor}>{doctor}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Consultations List */}
      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">Consultation List</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <div className="space-y-4">
            {filteredConsultations.map(consultation => (
              <Card key={consultation.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarFallback>
                          <AvatarInitials name={consultation.patientName} />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{consultation.patientName}</CardTitle>
                        <CardDescription>
                          ID: {consultation.patientId} • {consultation.department}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      {getStatusBadge(consultation.status)}
                      {getPaymentBadge(consultation.paymentStatus)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Doctor</p>
                      <p className="flex items-center">
                        <User className="size-4 mr-1" />
                        {consultation.doctorName}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Appointment Time</p>
                      <p className="flex items-center">
                        <Clock className="size-4 mr-1" />
                        {new Date(consultation.appointmentTime).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Type</p>
                      <p>{consultation.consultationType}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Fee</p>
                      <p>₹{consultation.fee}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Chief Complaint</p>
                    <p className="text-sm">{consultation.chiefComplaint}</p>
                  </div>

                  {consultation.diagnosis && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-2">Diagnosis</p>
                      <p className="text-sm font-medium">{consultation.diagnosis}</p>
                    </div>
                  )}

                  {consultation.prescription && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-2">Prescription</p>
                      <p className="text-sm">{consultation.prescription}</p>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-4 border-t">
                    <div className="text-sm text-muted-foreground">
                      {consultation.duration && (
                        <span>Duration: {consultation.duration} minutes</span>
                      )}
                      {consultation.nextAppointment && (
                        <span className="ml-4">Next: {consultation.nextAppointment}</span>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="size-4 mr-1" />
                        View Details
                      </Button>
                      <Button size="sm" variant="outline">
                        <FileText className="size-4 mr-1" />
                        View Prescription
                      </Button>
                      {consultation.status === 'scheduled' && (
                        <Button size="sm">
                          <Stethoscope className="size-4 mr-1" />
                          Start Consultation
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="calendar">
          <Card>
            <CardHeader>
              <CardTitle>Calendar View</CardTitle>
              <CardDescription>View consultations in calendar format</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Calendar className="size-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Calendar View</h3>
                <p className="text-muted-foreground">
                  Calendar integration will be implemented here to show consultations by date and time.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Consultation Reports</CardTitle>
              <CardDescription>Analytics and reports for consultation data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <Card className="p-4">
                  <h4 className="font-medium mb-2">Daily Summary Report</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Comprehensive daily consultation statistics and revenue
                  </p>
                  <Button size="sm">Generate Report</Button>
                </Card>
                <Card className="p-4">
                  <h4 className="font-medium mb-2">Doctor Performance</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Individual doctor consultation metrics and patterns
                  </p>
                  <Button size="sm">Generate Report</Button>
                </Card>
                <Card className="p-4">
                  <h4 className="font-medium mb-2">Department Analytics</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Department-wise consultation volume and trends
                  </p>
                  <Button size="sm">Generate Report</Button>
                </Card>
                <Card className="p-4">
                  <h4 className="font-medium mb-2">Revenue Analysis</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Financial analysis of consultation income and patterns
                  </p>
                  <Button size="sm">Generate Report</Button>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}