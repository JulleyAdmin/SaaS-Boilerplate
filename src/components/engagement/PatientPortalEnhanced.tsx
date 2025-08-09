'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Calendar,
  FileText,
  Heart,
  Activity,
  Pill,
  Users,
  Video,
  Download,
  ChevronRight,
  Bell,
  Shield,
  Target,
  TrendingUp,
  Award,
  Clock,
  AlertCircle,
  Phone,
  MessageSquare,
  User,
  CreditCard,
  Home,
  Stethoscope,
  CheckCircle,
  Edit,
  Plus,
  Upload,
  RefreshCw,
} from 'lucide-react';
import { 
  mockPatientDatabase, 
  generatePatientJourney,
  getUpcomingAppointments,
  getPatientGoals,
  getPreventiveCareSchedule,
} from '@/data/mock-patient-engagement';
import { toast } from 'sonner';

interface PatientPortalEnhancedProps {
  patientId?: string;
}

const PatientPortalEnhanced: React.FC<PatientPortalEnhancedProps> = ({
  patientId = 'PAT001',
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [patient, setPatient] = useState<any>(null);
  const [journeyData, setJourneyData] = useState<any>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [goals, setGoals] = useState<any[]>([]);
  const [preventiveCare, setPreventiveCare] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Dialog states
  const [appointmentDialog, setAppointmentDialog] = useState(false);
  const [medicineDialog, setMedicineDialog] = useState(false);
  const [goalDialog, setGoalDialog] = useState(false);
  const [reportDialog, setReportDialog] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<any>(null);
  
  // Form states
  const [appointmentForm, setAppointmentForm] = useState({
    department: '',
    doctor: '',
    date: '',
    time: '',
    mode: 'in-person',
    reason: '',
  });

  useEffect(() => {
    loadPatientData();
  }, [patientId]);

  const loadPatientData = () => {
    setLoading(true);
    
    // Load patient data
    const patientData = mockPatientDatabase.patients.find(p => p.id === patientId);
    setPatient(patientData);
    
    // Load journey data
    const journey = generatePatientJourney(patientId);
    setJourneyData(journey);
    
    // Load appointments
    const apts = getUpcomingAppointments(patientId);
    setAppointments(apts);
    
    // Load health goals
    const patientGoals = getPatientGoals(patientId);
    setGoals(patientGoals);
    
    // Load preventive care
    const schedule = getPreventiveCareSchedule(patientId);
    setPreventiveCare(schedule);
    
    setLoading(false);
  };

  const handleBookAppointment = () => {
    toast.success('Appointment booked successfully!', {
      description: `Your appointment with ${appointmentForm.doctor || 'Dr. Sharma'} is confirmed for ${appointmentForm.date}`,
    });
    setAppointmentDialog(false);
    setAppointmentForm({
      department: '',
      doctor: '',
      date: '',
      time: '',
      mode: 'in-person',
      reason: '',
    });
  };

  const handleOrderMedicine = () => {
    toast.success('Medicine order placed!', {
      description: 'Your prescription has been sent to the pharmacy. Delivery expected in 2-3 hours.',
    });
    setMedicineDialog(false);
  };

  const handleUpdateGoal = (goalId: string, newValue: string) => {
    const goal = goals.find(g => g.id === goalId);
    if (goal) {
      const updatedGoal = {
        ...goal,
        current: newValue,
        progress: Math.min(100, (parseFloat(newValue) / parseFloat(goal.target)) * 100),
      };
      setGoals(goals.map(g => g.id === goalId ? updatedGoal : g));
      toast.success('Goal progress updated!');
    }
    setGoalDialog(false);
  };

  const handleSchedulePreventiveCare = (careType: string) => {
    toast.success(`${careType} scheduled!`, {
      description: 'You will receive a reminder 24 hours before your appointment.',
    });
  };

  const handleDownloadReport = (reportType: string) => {
    toast.success(`Downloading ${reportType}...`);
  };

  if (loading || !patient) {
    return (
      <div className="flex items-center justify-center h-96">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Welcome Header with Real Patient Data */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, {patient.name}!</h1>
            <p className="text-blue-100">Your personalized health dashboard</p>
            <div className="flex gap-4 mt-4">
              <Badge className="bg-white/20 text-white">
                ABHA: {patient.abhaNumber}
              </Badge>
              <Badge className="bg-white/20 text-white">
                Blood Group: {patient.bloodGroup}
              </Badge>
              <Badge className="bg-white/20 text-white">
                Engagement Score: {patient.engagementScore}%
              </Badge>
              {patient.insurance?.governmentScheme && (
                <Badge className="bg-green-500/20 text-white">
                  {patient.insurance.governmentScheme}
                </Badge>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={() => window.open('tel:108')}>
              <Phone className="h-4 w-4 mr-1" />
              Emergency
            </Button>
            <Button variant="secondary" size="sm" onClick={() => setActiveTab('messages')}>
              <MessageSquare className="h-4 w-4 mr-1" />
              Chat Support
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Actions - Interactive */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Button 
          variant="outline" 
          className="h-auto flex-col p-4 hover:bg-blue-50"
          onClick={() => setAppointmentDialog(true)}
        >
          <Calendar className="h-6 w-6 mb-2 text-blue-600" />
          <span>Book Appointment</span>
        </Button>
        <Button 
          variant="outline" 
          className="h-auto flex-col p-4 hover:bg-green-50"
          onClick={() => {
            toast.info('Starting video consultation...');
            setTimeout(() => {
              toast.success('Connected to Dr. Sharma');
            }, 2000);
          }}
        >
          <Video className="h-6 w-6 mb-2 text-green-600" />
          <span>Video Consult</span>
        </Button>
        <Button 
          variant="outline" 
          className="h-auto flex-col p-4 hover:bg-purple-50"
          onClick={() => setMedicineDialog(true)}
        >
          <Pill className="h-6 w-6 mb-2 text-purple-600" />
          <span>Order Medicine</span>
        </Button>
        <Button 
          variant="outline" 
          className="h-auto flex-col p-4 hover:bg-orange-50"
          onClick={() => setReportDialog(true)}
        >
          <FileText className="h-6 w-6 mb-2 text-orange-600" />
          <span>View Reports</span>
        </Button>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-6 w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="health">My Health</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="records">Records</TabsTrigger>
          <TabsTrigger value="family">Family</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Upcoming Appointments */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Upcoming Appointments
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {appointments.slice(0, 2).map((apt) => (
                  <div key={apt.id} className="border-l-2 border-blue-500 pl-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{apt.doctorName}</p>
                        <p className="text-sm text-gray-600">{apt.specialty}</p>
                        <div className="flex gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {apt.date}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {apt.time}
                          </Badge>
                        </div>
                      </div>
                      {apt.mode === 'Video' && <Video className="h-4 w-4 text-blue-600" />}
                    </div>
                    <div className="mt-2 flex gap-2">
                      <Button size="sm" variant="ghost" onClick={() => {
                        toast.success('Appointment rescheduled to next week');
                      }}>
                        Reschedule
                      </Button>
                      <Button size="sm" variant="ghost" className="text-red-600" onClick={() => {
                        toast.info('Appointment cancelled');
                      }}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ))}
                <Button 
                  variant="outline" 
                  className="w-full" 
                  size="sm"
                  onClick={() => setActiveTab('appointments')}
                >
                  View All Appointments
                </Button>
              </CardContent>
            </Card>

            {/* Health Goals - Interactive */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Health Goals
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {goals.slice(0, 3).map((goal) => (
                  <div key={goal.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{goal.type}</span>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => {
                          setSelectedGoal(goal);
                          setGoalDialog(true);
                        }}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                    </div>
                    <Progress value={goal.progress} className="h-2" />
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>Current: {goal.current}</span>
                      <span>Target: {goal.target}</span>
                    </div>
                  </div>
                ))}
                <Button 
                  variant="outline" 
                  className="w-full" 
                  size="sm"
                  onClick={() => setGoalDialog(true)}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add New Goal
                </Button>
              </CardContent>
            </Card>

            {/* Preventive Care - Interactive */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Preventive Care
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {preventiveCare.slice(0, 3).map((care, idx) => (
                  <Alert 
                    key={idx}
                    className={care.status === 'overdue' ? 'border-red-300' : 'border-blue-300'}
                  >
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{care.type}</span>
                        <Badge 
                          variant={care.status === 'due' ? 'destructive' : 'outline'}
                          className="text-xs"
                        >
                          {care.nextDue || care.status}
                        </Badge>
                      </div>
                      <Button 
                        size="sm" 
                        variant="link" 
                        className="p-0 h-auto mt-1"
                        onClick={() => handleSchedulePreventiveCare(care.type)}
                      >
                        Schedule Now →
                      </Button>
                    </AlertDescription>
                  </Alert>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Health Journey Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Your Health Journey
              </CardTitle>
              <CardDescription>
                Recent interactions and engagement metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              {journeyData && (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {patient.engagementScore}%
                      </div>
                      <p className="text-sm text-gray-600">Engagement Score</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {patient.appointmentCompliance}%
                      </div>
                      <p className="text-sm text-gray-600">Appointment Compliance</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {patient.medicationAdherence}%
                      </div>
                      <p className="text-sm text-gray-600">Medicine Adherence</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        {patient.totalVisits}
                      </div>
                      <p className="text-sm text-gray-600">Total Visits</p>
                    </div>
                  </div>
                  
                  {/* Recent Touchpoints */}
                  <div className="space-y-3">
                    <h4 className="font-medium">Recent Interactions</h4>
                    {journeyData.touchpoints.slice(0, 3).map((tp: any, idx: number) => (
                      <div key={idx} className="flex items-center gap-3 text-sm">
                        <div className="w-2 h-2 bg-blue-600 rounded-full" />
                        <span className="text-gray-600">{tp.date}</span>
                        <span className="font-medium">{tp.action}</span>
                        <Badge variant="outline" className="text-xs">
                          {tp.response}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="health" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Health Summary</CardTitle>
              <CardDescription>Your comprehensive health overview</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {patient.chronicConditions && patient.chronicConditions.length > 0 && (
                  <Alert>
                    <Heart className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Chronic Conditions:</strong> {patient.chronicConditions.join(', ')}
                    </AlertDescription>
                  </Alert>
                )}
                
                {patient.currentMedications && patient.currentMedications.length > 0 && (
                  <Alert>
                    <Pill className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Current Medications:</strong>
                      <ul className="mt-2">
                        {patient.currentMedications.map((med: any, idx: number) => (
                          <li key={idx} className="ml-4">
                            • {med.name} - {med.dosage} ({med.frequency})
                          </li>
                        ))}
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}
                
                {patient.allergies && patient.allergies.length > 0 && (
                  <Alert className="border-red-300">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription>
                      <strong>Allergies:</strong> {patient.allergies.join(', ')}
                    </AlertDescription>
                  </Alert>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" onClick={() => handleDownloadReport('Health Summary')}>
                    <Download className="h-4 w-4 mr-2" />
                    Download Summary
                  </Button>
                  <Button variant="outline" onClick={() => toast.info('Sharing with family...')}>
                    <Users className="h-4 w-4 mr-2" />
                    Share with Family
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appointments">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Appointment Management</CardTitle>
                <Button onClick={() => setAppointmentDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Book New
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {appointments.map((apt) => (
                  <div key={apt.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">{apt.doctorName}</h4>
                        <p className="text-sm text-gray-600">{apt.specialty} - {apt.department}</p>
                        <p className="text-sm mt-2">{apt.reason}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant={apt.mode === 'Video' ? 'secondary' : 'default'}>
                          {apt.mode}
                        </Badge>
                        <p className="text-sm mt-2">{apt.date}</p>
                        <p className="text-sm">{apt.time}</p>
                      </div>
                    </div>
                    {apt.preparations && (
                      <Alert className="mt-3">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          <strong>Preparation Required:</strong> {apt.preparations}
                        </AlertDescription>
                      </Alert>
                    )}
                    <div className="flex gap-2 mt-4">
                      <Button size="sm" variant="outline">
                        Reschedule
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-600">
                        Cancel
                      </Button>
                      {apt.mode === 'Video' && (
                        <Button size="sm" variant="outline" className="ml-auto">
                          <Video className="h-4 w-4 mr-1" />
                          Join Call
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="records">
          <Card>
            <CardHeader>
              <CardTitle>Medical Records</CardTitle>
              <CardDescription>Access your reports, prescriptions, and medical history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button variant="outline" className="h-24 flex-col">
                  <FileText className="h-6 w-6 mb-2" />
                  Lab Reports
                </Button>
                <Button variant="outline" className="h-24 flex-col">
                  <Pill className="h-6 w-6 mb-2" />
                  Prescriptions
                </Button>
                <Button variant="outline" className="h-24 flex-col">
                  <Activity className="h-6 w-6 mb-2" />
                  Vitals History
                </Button>
                <Button variant="outline" className="h-24 flex-col">
                  <Shield className="h-6 w-6 mb-2" />
                  Vaccination Records
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="family">
          <Card>
            <CardHeader>
              <CardTitle>Family Members</CardTitle>
              <CardDescription>Manage health records for your family</CardDescription>
            </CardHeader>
            <CardContent>
              {patient.familyMembers && (
                <div className="space-y-3">
                  {patient.familyMembers.map((member: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-sm text-gray-600">{member.relation} • {member.age} years</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        View Records
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="messages">
          <Card>
            <CardHeader>
              <CardTitle>Messages & Support</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert>
                  <MessageSquare className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Dr. Sharma:</strong> Your latest test results look good. Continue with the current medication.
                  </AlertDescription>
                </Alert>
                <Alert>
                  <Bell className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Pharmacy:</strong> Your prescription is ready for pickup.
                  </AlertDescription>
                </Alert>
                <Textarea 
                  placeholder="Type your message..." 
                  className="min-h-[100px]"
                />
                <Button className="w-full">
                  Send Message
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      
      {/* Book Appointment Dialog */}
      <Dialog open={appointmentDialog} onOpenChange={setAppointmentDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Book Appointment</DialogTitle>
            <DialogDescription>
              Schedule your next consultation
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Department</Label>
              <Select 
                value={appointmentForm.department}
                onValueChange={(v) => setAppointmentForm({...appointmentForm, department: v})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cardiology">Cardiology</SelectItem>
                  <SelectItem value="endocrinology">Endocrinology</SelectItem>
                  <SelectItem value="general">General Medicine</SelectItem>
                  <SelectItem value="orthopedics">Orthopedics</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Preferred Date</Label>
              <Input 
                type="date" 
                value={appointmentForm.date}
                onChange={(e) => setAppointmentForm({...appointmentForm, date: e.target.value})}
              />
            </div>
            <div>
              <Label>Consultation Mode</Label>
              <Select 
                value={appointmentForm.mode}
                onValueChange={(v) => setAppointmentForm({...appointmentForm, mode: v})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="in-person">In-Person</SelectItem>
                  <SelectItem value="video">Video Consultation</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Reason for Visit</Label>
              <Textarea 
                placeholder="Describe your symptoms or reason for consultation..."
                value={appointmentForm.reason}
                onChange={(e) => setAppointmentForm({...appointmentForm, reason: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAppointmentDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleBookAppointment}>
              Confirm Booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Order Medicine Dialog */}
      <Dialog open={medicineDialog} onOpenChange={setMedicineDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Order Medicines</DialogTitle>
            <DialogDescription>
              Select prescription to refill
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {patient.currentMedications?.map((med: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{med.name}</p>
                  <p className="text-sm text-gray-600">{med.dosage} - {med.frequency}</p>
                </div>
                <input type="checkbox" className="h-4 w-4" defaultChecked />
              </div>
            ))}
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Medicines will be delivered to your registered address within 2-3 hours
              </AlertDescription>
            </Alert>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMedicineDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleOrderMedicine}>
              Place Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Goal Dialog */}
      <Dialog open={goalDialog} onOpenChange={setGoalDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedGoal ? 'Update Goal Progress' : 'Add New Health Goal'}
            </DialogTitle>
          </DialogHeader>
          {selectedGoal ? (
            <div className="space-y-4">
              <div>
                <Label>Goal: {selectedGoal.type}</Label>
                <p className="text-sm text-gray-600 mt-1">Target: {selectedGoal.target}</p>
              </div>
              <div>
                <Label>Current Value</Label>
                <Input 
                  placeholder="Enter current value"
                  defaultValue={selectedGoal.current}
                  onChange={(e) => setSelectedGoal({...selectedGoal, current: e.target.value})}
                />
              </div>
              <div>
                <Label>Notes (Optional)</Label>
                <Textarea placeholder="Any notes about your progress..." />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <Label>Goal Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select goal type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weight">Weight Management</SelectItem>
                    <SelectItem value="bp">Blood Pressure Control</SelectItem>
                    <SelectItem value="steps">Daily Steps</SelectItem>
                    <SelectItem value="sleep">Sleep Quality</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Target Value</Label>
                <Input placeholder="e.g., 70 kg, 10000 steps" />
              </div>
              <div>
                <Label>Timeline</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select timeline" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1month">1 Month</SelectItem>
                    <SelectItem value="3months">3 Months</SelectItem>
                    <SelectItem value="6months">6 Months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setGoalDialog(false);
              setSelectedGoal(null);
            }}>
              Cancel
            </Button>
            <Button onClick={() => {
              if (selectedGoal) {
                handleUpdateGoal(selectedGoal.id, selectedGoal.current);
              } else {
                toast.success('New goal added successfully!');
                setGoalDialog(false);
              }
            }}>
              {selectedGoal ? 'Update Progress' : 'Add Goal'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reports Dialog */}
      <Dialog open={reportDialog} onOpenChange={setReportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Medical Reports</DialogTitle>
            <DialogDescription>
              View and download your medical reports
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Complete Blood Count</p>
                <p className="text-sm text-gray-600">15 Jan 2025</p>
              </div>
              <Button size="sm" variant="outline" onClick={() => handleDownloadReport('CBC Report')}>
                <Download className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">HbA1c Test</p>
                <p className="text-sm text-gray-600">10 Jan 2025</p>
              </div>
              <Button size="sm" variant="outline" onClick={() => handleDownloadReport('HbA1c Report')}>
                <Download className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Lipid Profile</p>
                <p className="text-sm text-gray-600">5 Jan 2025</p>
              </div>
              <Button size="sm" variant="outline" onClick={() => handleDownloadReport('Lipid Profile')}>
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReportDialog(false)}>
              Close
            </Button>
            <Button onClick={() => {
              toast.success('All reports downloaded');
              setReportDialog(false);
            }}>
              Download All
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PatientPortalEnhanced;