'use client';

import { useState } from 'react';
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, eachHourOfInterval, setHours, isSameDay, isToday } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar, Clock, User, Stethoscope, Building2, Filter, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';

// Types
interface TimeSlot {
  time: Date;
  available: boolean;
  appointment?: Appointment;
}

interface Appointment {
  id: string;
  patientName: string;
  patientId: string;
  doctorName: string;
  doctorId: string;
  department: string;
  type: 'Consultation' | 'Follow-up' | 'Emergency' | 'Routine Checkup';
  time: Date;
  duration: number; // in minutes
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
}

// Mock data - In production, this would come from API
const mockAppointments: Appointment[] = [
  {
    id: 'APT001',
    patientName: 'Rajesh Kumar',
    patientId: 'PAT001',
    doctorName: 'Dr. Sharma',
    doctorId: 'DOC001',
    department: 'General Medicine',
    type: 'Consultation',
    time: setHours(new Date(), 10),
    duration: 30,
    status: 'confirmed',
  },
  {
    id: 'APT002',
    patientName: 'Sunita Sharma',
    patientId: 'PAT002',
    doctorName: 'Dr. Patel',
    doctorId: 'DOC002',
    department: 'Cardiology',
    type: 'Follow-up',
    time: setHours(new Date(), 11),
    duration: 30,
    status: 'confirmed',
  },
];

const departments = [
  'All Departments',
  'General Medicine',
  'Cardiology',
  'Orthopedics',
  'Pediatrics',
  'Gynecology',
  'Neurology',
  'Dermatology',
  'ENT',
];

const doctors = [
  { id: 'DOC001', name: 'Dr. Sharma', department: 'General Medicine' },
  { id: 'DOC002', name: 'Dr. Patel', department: 'Cardiology' },
  { id: 'DOC003', name: 'Dr. Singh', department: 'Orthopedics' },
  { id: 'DOC004', name: 'Dr. Gupta', department: 'Pediatrics' },
];

const patients = [
  { id: 'PAT001', name: 'Rajesh Kumar', phone: '9876543210' },
  { id: 'PAT002', name: 'Sunita Sharma', phone: '9876543220' },
  { id: 'PAT003', name: 'Amit Verma', phone: '9876543230' },
];

export function AppointmentScheduler() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewType, setViewType] = useState<'day' | 'week'>('week');
  const [selectedDepartment, setSelectedDepartment] = useState('All Departments');
  const [selectedDoctor, setSelectedDoctor] = useState('all');
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [selectedSlot, setSelectedSlot] = useState<Date | null>(null);
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [rescheduleDialogOpen, setRescheduleDialogOpen] = useState(false);
  const [draggedAppointment, setDraggedAppointment] = useState<Appointment | null>(null);

  // Form state for booking
  const [bookingForm, setBookingForm] = useState({
    patientId: '',
    department: '',
    doctorId: '',
    appointmentType: 'Consultation',
    sendSMS: false,
    sendWhatsApp: false,
  });

  // Generate time slots from 9 AM to 5 PM with 30-minute intervals
  const generateTimeSlots = (date: Date): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    const startHour = 9;
    const endHour = 17; // 5 PM
    const intervalMinutes = 30;

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += intervalMinutes) {
        const slotTime = setHours(date, hour);
        slotTime.setMinutes(minute);
        slotTime.setSeconds(0);
        slotTime.setMilliseconds(0);
        
        const appointment = appointments.find(apt => 
          isSameDay(apt.time, slotTime) && 
          apt.time.getHours() === hour && 
          apt.time.getMinutes() === minute
        );

        slots.push({
          time: slotTime,
          available: !appointment,
          appointment,
        });
      }
    }

    return slots;
  };

  // Get week days
  const getWeekDays = () => {
    const start = startOfWeek(currentDate, { weekStartsOn: 1 });
    const end = endOfWeek(currentDate, { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  };

  // Navigation handlers
  const handlePrevious = () => {
    setCurrentDate(prev => addDays(prev, viewType === 'day' ? -1 : -7));
  };

  const handleNext = () => {
    setCurrentDate(prev => addDays(prev, viewType === 'day' ? 1 : 7));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Booking handlers
  const handleSlotClick = (slot: TimeSlot) => {
    if (slot.available) {
      setSelectedSlot(slot.time);
      setBookingDialogOpen(true);
    }
  };

  const handleBookAppointment = () => {
    if (!bookingForm.patientId || !bookingForm.doctorId || !selectedSlot) {
      toast({
        title: 'Error',
        description: 'Please fill all required fields',
        variant: 'destructive',
      });
      return;
    }

    const patient = patients.find(p => p.id === bookingForm.patientId);
    const doctor = doctors.find(d => d.id === bookingForm.doctorId);

    if (!patient || !doctor) return;

    const newAppointment: Appointment = {
      id: `APT${String(appointments.length + 1).padStart(3, '0')}`,
      patientName: patient.name,
      patientId: patient.id,
      doctorName: doctor.name,
      doctorId: doctor.id,
      department: doctor.department,
      type: bookingForm.appointmentType as Appointment['type'],
      time: selectedSlot,
      duration: 30,
      status: 'confirmed',
    };

    setAppointments([...appointments, newAppointment]);
    setBookingDialogOpen(false);
    
    // Show success message with notification status
    const notifications = [];
    if (bookingForm.sendSMS) notifications.push('SMS');
    if (bookingForm.sendWhatsApp) notifications.push('WhatsApp');
    
    const notificationMessage = notifications.length > 0
      ? `Appointment booked successfully. Confirmation sent via ${notifications.join(' and ')}`
      : 'Appointment booked successfully';

    toast({
      title: 'Success',
      description: notificationMessage,
    });

    // Reset form
    setBookingForm({
      patientId: '',
      department: '',
      doctorId: '',
      appointmentType: 'Consultation',
      sendSMS: false,
      sendWhatsApp: false,
    });
    setSelectedSlot(null);
  };

  // Drag and drop handlers
  const handleDragStart = (appointment: Appointment) => {
    setDraggedAppointment(appointment);
  };

  const handleDrop = (slot: TimeSlot) => {
    if (draggedAppointment && slot.available) {
      setSelectedSlot(slot.time);
      setRescheduleDialogOpen(true);
    }
  };

  const handleConfirmReschedule = () => {
    if (draggedAppointment && selectedSlot) {
      const updatedAppointments = appointments.map(apt => 
        apt.id === draggedAppointment.id 
          ? { ...apt, time: selectedSlot }
          : apt
      );
      setAppointments(updatedAppointments);
      setRescheduleDialogOpen(false);
      setDraggedAppointment(null);
      setSelectedSlot(null);
      
      toast({
        title: 'Success',
        description: 'Appointment rescheduled successfully',
      });
    }
  };

  // Calculate display data
  const weekDays = viewType === 'week' ? getWeekDays() : [currentDate];
  const timeSlots = [
    '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
    '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM'
  ];

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-4" data-testid="appointment-stats">
        <Card data-testid="stat-today-appointments">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Scheduled for today</p>
          </CardContent>
        </Card>
        <Card data-testid="stat-week-appointments">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68</div>
            <p className="text-xs text-muted-foreground">Total appointments</p>
          </CardContent>
        </Card>
        <Card data-testid="stat-available-slots">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Slots</CardTitle>
            <Plus className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">Open for booking</p>
          </CardContent>
        </Card>
        <Card data-testid="stat-cancellation-rate">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cancellation Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5%</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card data-testid="appointment-filters">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4">
          <Select 
            value={selectedDepartment} 
            onValueChange={setSelectedDepartment}
            data-testid="filter-department"
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select Department" />
            </SelectTrigger>
            <SelectContent>
              {departments.map(dept => (
                <SelectItem key={dept} value={dept}>{dept}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select 
            value={selectedDoctor} 
            onValueChange={setSelectedDoctor}
            data-testid="filter-doctor"
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="All Doctors" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Doctors</SelectItem>
              {doctors
                .filter(doc => selectedDepartment === 'All Departments' || doc.department === selectedDepartment)
                .map(doc => (
                  <SelectItem key={doc.id} value={doc.id}>{doc.name}</SelectItem>
                ))}
            </SelectContent>
          </Select>

          <Input 
            type="date" 
            className="w-[200px]"
            value={format(currentDate, 'yyyy-MM-dd')}
            onChange={(e) => setCurrentDate(new Date(e.target.value))}
            data-testid="filter-date-range"
          />
        </CardContent>
      </Card>

      {/* Calendar View */}
      <Card data-testid="appointment-calendar">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle data-testid="calendar-title">
                Appointment Calendar 
                {selectedDepartment !== 'All Departments' && ` - ${selectedDepartment}`}
              </CardTitle>
              <CardDescription>
                Click on available slots to book appointments
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div data-testid="calendar-view-toggle">
                <Tabs value={viewType} onValueChange={(v) => setViewType(v as 'day' | 'week')}>
                  <TabsList>
                    <TabsTrigger value="day">Day</TabsTrigger>
                    <TabsTrigger value="week">Week</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={handlePrevious}
                aria-label="Previous week"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                onClick={handleToday}
                aria-label="Today"
              >
                Today
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleNext}
                aria-label="Next week"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto" data-testid="time-slots-grid">
            <div className="min-w-[800px]">
              {/* Header with dates */}
              <div className="grid grid-cols-8 gap-1 mb-2">
                <div className="text-sm font-medium p-2">Time</div>
                {weekDays.map(day => (
                  <div 
                    key={day.toISOString()} 
                    className={cn(
                      "text-sm font-medium p-2 text-center",
                      isToday(day) && "bg-primary/10 rounded"
                    )}
                  >
                    <div>{format(day, 'EEE')}</div>
                    <div className="text-lg">{format(day, 'd')}</div>
                  </div>
                ))}
              </div>

              {/* Time slots */}
              {timeSlots.map((timeLabel, timeIndex) => (
                <div key={timeLabel} className="grid grid-cols-8 gap-1 mb-1">
                  <div className="text-sm p-2 text-muted-foreground">
                    {timeLabel}
                  </div>
                  {weekDays.map(day => {
                    const daySlots = generateTimeSlots(day);
                    const slot = daySlots[timeIndex];
                    
                    if (!slot) return null;

                    return (
                      <div
                        key={`${day.toISOString()}-${timeIndex}`}
                        className={cn(
                          "p-2 border rounded cursor-pointer transition-colors min-h-[60px]",
                          slot.available 
                            ? "slot-available bg-green-50 hover:bg-green-100 border-green-200" 
                            : "slot-booked bg-gray-50 border-gray-200",
                          "relative"
                        )}
                        onClick={() => handleSlotClick(slot)}
                        onDrop={() => handleDrop(slot)}
                        onDragOver={(e) => e.preventDefault()}
                      >
                        {slot.appointment && (
                          <div 
                            className="text-xs space-y-1"
                            draggable
                            onDragStart={() => handleDragStart(slot.appointment!)}
                          >
                            <div className="patient-name font-medium">
                              {slot.appointment.patientName}
                            </div>
                            <div className="appointment-time text-muted-foreground">
                              {slot.appointment.doctorName}
                            </div>
                            <Badge variant="outline" className="text-[10px] px-1 py-0">
                              {slot.appointment.type}
                            </Badge>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Booking Dialog */}
      <Dialog open={bookingDialogOpen} onOpenChange={setBookingDialogOpen}>
        <DialogContent data-testid="appointment-booking-dialog">
          <DialogHeader>
            <DialogTitle>Schedule Appointment</DialogTitle>
            <DialogDescription>
              Book an appointment for the selected time slot
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div data-testid="selected-time" className="text-sm text-muted-foreground">
              Selected Time: {selectedSlot && format(selectedSlot, 'PPpp')}
            </div>

            <div className="space-y-2">
              <Label htmlFor="patient">Patient</Label>
              <Select 
                value={bookingForm.patientId} 
                onValueChange={(value) => setBookingForm({...bookingForm, patientId: value})}
                data-testid="patient-select"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Patient" />
                </SelectTrigger>
                <SelectContent>
                  {patients.map(patient => (
                    <SelectItem key={patient.id} value={patient.id}>
                      {patient.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Select 
                value={bookingForm.department} 
                onValueChange={(value) => setBookingForm({...bookingForm, department: value})}
                data-testid="department-select"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.slice(1).map(dept => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="doctor">Doctor</Label>
              <Select 
                value={bookingForm.doctorId} 
                onValueChange={(value) => setBookingForm({...bookingForm, doctorId: value})}
                data-testid="doctor-select"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Doctor" />
                </SelectTrigger>
                <SelectContent>
                  {doctors
                    .filter(doc => !bookingForm.department || doc.department === bookingForm.department)
                    .map(doc => (
                      <SelectItem key={doc.id} value={doc.id}>{doc.name}</SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Appointment Type</Label>
              <Select 
                value={bookingForm.appointmentType} 
                onValueChange={(value) => setBookingForm({...bookingForm, appointmentType: value})}
                data-testid="appointment-type-select"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Consultation">Consultation</SelectItem>
                  <SelectItem value="Follow-up">Follow-up</SelectItem>
                  <SelectItem value="Emergency">Emergency</SelectItem>
                  <SelectItem value="Routine Checkup">Routine Checkup</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2" data-testid="notification-preferences">
              <Label>Notification Preferences</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="sendSMS"
                    name="sendSMS"
                    checked={bookingForm.sendSMS}
                    onCheckedChange={(checked) => 
                      setBookingForm({...bookingForm, sendSMS: checked as boolean})
                    }
                  />
                  <Label htmlFor="sendSMS">Send SMS Confirmation</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="sendWhatsApp"
                    name="sendWhatsApp"
                    checked={bookingForm.sendWhatsApp}
                    onCheckedChange={(checked) => 
                      setBookingForm({...bookingForm, sendWhatsApp: checked as boolean})
                    }
                  />
                  <Label htmlFor="sendWhatsApp">Send WhatsApp Confirmation</Label>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setBookingDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleBookAppointment}>
              Book Appointment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reschedule Confirmation Dialog */}
      <Dialog open={rescheduleDialogOpen} onOpenChange={setRescheduleDialogOpen}>
        <DialogContent data-testid="reschedule-confirm-dialog">
          <DialogHeader>
            <DialogTitle>Confirm Reschedule</DialogTitle>
            <DialogDescription>
              Are you sure you want to reschedule this appointment to the new time slot?
            </DialogDescription>
          </DialogHeader>
          
          {draggedAppointment && selectedSlot && (
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium">Patient:</span> {draggedAppointment.patientName}
              </div>
              <div>
                <span className="font-medium">From:</span> {format(draggedAppointment.time, 'PPpp')}
              </div>
              <div>
                <span className="font-medium">To:</span> {format(selectedSlot, 'PPpp')}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setRescheduleDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmReschedule}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}