'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { toast } from '@/components/ui/use-toast';
import { 
  Users, 
  Search, 
  Filter, 
  MapPin, 
  Phone, 
  Mail,
  Star,
  Calendar as CalendarIcon,
  Clock,
  Building,
  Video,
  UserPlus,
  CheckCircle,
  Award,
  GraduationCap,
  Stethoscope,
  Activity,
  MessageSquare,
  TrendingUp
} from 'lucide-react';
import { mockDoctors, mockHospitals } from '@/data/mock-network-collaboration';

interface NetworkDoctor {
  doctorId: string;
  name: string;
  email: string;
  phone: string;
  designation: string;
  qualification: string;
  specialization: string;
  yearsOfExperience: number;
  primaryClinic: string;
  practicingClinics: string[];
  consultationModes: string[];
  acceptsReferrals: boolean;
  maxReferralsPerWeek: number;
  averageResponseTime: string;
  patientSatisfactionScore: number;
}

export default function NetworkDoctors() {
  const [doctors, setDoctors] = useState<NetworkDoctor[]>(mockDoctors);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSpecialty, setFilterSpecialty] = useState('all');
  const [filterClinic, setFilterClinic] = useState('all');
  const [filterConsultationMode, setFilterConsultationMode] = useState('all');
  const [selectedDoctor, setSelectedDoctor] = useState<NetworkDoctor | null>(null);
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const specialties = [
    'All Specialties',
    'Cardiology',
    'Neurology',
    'Oncology',
    'Nephrology',
    'Orthopedics',
    'Pediatrics',
    'Internal Medicine'
  ];

  const filteredDoctors = doctors.filter(doctor => {
    const searchMatch = searchTerm === '' || 
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.qualification.toLowerCase().includes(searchTerm.toLowerCase());
    
    const specialtyMatch = filterSpecialty === 'all' || 
      doctor.specialization.toLowerCase().includes(filterSpecialty.toLowerCase());
    
    const clinicMatch = filterClinic === 'all' || 
      doctor.practicingClinics.includes(filterClinic);
    
    const modeMatch = filterConsultationMode === 'all' || 
      doctor.consultationModes.includes(filterConsultationMode);
    
    return searchMatch && specialtyMatch && clinicMatch && modeMatch;
  });

  const handleReferPatient = (doctor: NetworkDoctor) => {
    setSelectedDoctor(doctor);
    setShowScheduleDialog(true);
  };

  const handleScheduleAppointment = () => {
    toast({
      title: 'Appointment Scheduled',
      description: `Appointment scheduled with ${selectedDoctor?.name} on ${selectedDate?.toLocaleDateString()}`,
    });
    setShowScheduleDialog(false);
  };

  const getClinicName = (clinicId: string) => {
    const clinic = mockHospitals.find(h => h.clinicId === clinicId);
    return clinic?.clinicName || clinicId;
  };

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating) 
            ? 'fill-yellow-400 text-yellow-400' 
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Network Doctors</h1>
          <p className="text-muted-foreground">
            Find and connect with specialists across the hospital network
          </p>
        </div>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Register as Network Doctor
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Doctors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{doctors.length}</div>
            <p className="text-xs text-muted-foreground">Across network</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Accepting Referrals</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {doctors.filter(d => d.acceptsReferrals).length}
            </div>
            <p className="text-xs text-muted-foreground">Available now</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.5 hrs</div>
            <p className="text-xs text-muted-foreground">For referrals</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Satisfaction Score</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.7/5</div>
            <p className="text-xs text-muted-foreground">Average rating</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <Label>Search</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search doctors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div>
              <Label>Specialty</Label>
              <Select value={filterSpecialty} onValueChange={setFilterSpecialty}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Specialties</SelectItem>
                  {specialties.map(specialty => (
                    <SelectItem key={specialty} value={specialty.toLowerCase()}>
                      {specialty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Hospital</Label>
              <Select value={filterClinic} onValueChange={setFilterClinic}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Hospitals</SelectItem>
                  {mockHospitals.map(hospital => (
                    <SelectItem key={hospital.clinicId} value={hospital.clinicId}>
                      {hospital.clinicName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Consultation Mode</Label>
              <Select value={filterConsultationMode} onValueChange={setFilterConsultationMode}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Modes</SelectItem>
                  <SelectItem value="In-Person">In-Person</SelectItem>
                  <SelectItem value="Video">Video</SelectItem>
                  <SelectItem value="Phone">Phone</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Doctors Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredDoctors.map((doctor) => (
          <Card key={doctor.doctorId} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${doctor.name}`} />
                    <AvatarFallback>{doctor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{doctor.name}</CardTitle>
                    <CardDescription>{doctor.designation}</CardDescription>
                  </div>
                </div>
                {doctor.acceptsReferrals && (
                  <Badge variant="success">
                    <CheckCircle className="mr-1 h-3 w-3" />
                    Accepting
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Qualifications */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                  <span>{doctor.qualification}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Stethoscope className="h-4 w-4 text-muted-foreground" />
                  <span>{doctor.specialization}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Award className="h-4 w-4 text-muted-foreground" />
                  <span>{doctor.yearsOfExperience} years experience</span>
                </div>
              </div>

              {/* Primary Hospital */}
              <div>
                <p className="text-sm text-muted-foreground mb-1">Primary Hospital</p>
                <div className="flex items-center gap-2 text-sm">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{getClinicName(doctor.primaryClinic)}</span>
                </div>
              </div>

              {/* Practicing At */}
              {doctor.practicingClinics.length > 1 && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Also Practicing At</p>
                  <div className="flex flex-wrap gap-1">
                    {doctor.practicingClinics
                      .filter(c => c !== doctor.primaryClinic)
                      .map(clinicId => (
                        <Badge key={clinicId} variant="outline" className="text-xs">
                          {getClinicName(clinicId).split(' - ')[0]}
                        </Badge>
                      ))}
                  </div>
                </div>
              )}

              {/* Consultation Modes */}
              <div>
                <p className="text-sm text-muted-foreground mb-1">Consultation Modes</p>
                <div className="flex gap-2">
                  {doctor.consultationModes.map(mode => (
                    <Badge key={mode} variant="secondary">
                      {mode === 'Video' && <Video className="mr-1 h-3 w-3" />}
                      {mode === 'Phone' && <Phone className="mr-1 h-3 w-3" />}
                      {mode === 'In-Person' && <Users className="mr-1 h-3 w-3" />}
                      {mode}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t">
                <div>
                  <p className="text-xs text-muted-foreground">Response Time</p>
                  <p className="text-sm font-medium">{doctor.averageResponseTime}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Patient Rating</p>
                  <div className="flex items-center gap-1">
                    {getRatingStars(doctor.patientSatisfactionScore)}
                    <span className="text-sm font-medium ml-1">
                      {doctor.patientSatisfactionScore}
                    </span>
                  </div>
                </div>
              </div>

              {/* Contact Actions */}
              <div className="flex gap-2 pt-2">
                <Button 
                  className="flex-1" 
                  size="sm"
                  onClick={() => handleReferPatient(doctor)}
                  disabled={!doctor.acceptsReferrals}
                >
                  <UserPlus className="mr-1 h-4 w-4" />
                  Refer Patient
                </Button>
                <Button variant="outline" size="sm">
                  <MessageSquare className="mr-1 h-4 w-4" />
                  Message
                </Button>
                <Button variant="outline" size="sm">
                  <Phone className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Schedule Appointment Dialog */}
      <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Schedule Referral Appointment</DialogTitle>
            <DialogDescription>
              Schedule an appointment with {selectedDoctor?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Select Date</Label>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
                disabled={(date) => date < new Date()}
              />
            </div>
            <div>
              <Label>Consultation Mode</Label>
              <Select defaultValue={selectedDoctor?.consultationModes[0]}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {selectedDoctor?.consultationModes.map(mode => (
                    <SelectItem key={mode} value={mode}>
                      {mode}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowScheduleDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleScheduleAppointment}>
                <CalendarIcon className="mr-2 h-4 w-4" />
                Schedule Appointment
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}