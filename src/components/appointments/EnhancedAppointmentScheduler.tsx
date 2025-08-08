'use client';

import { useState, useMemo } from 'react';
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, setHours, isSameDay, isToday, addMinutes, isWithinInterval, parseISO } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar, Clock, User, Stethoscope, Building2, Filter, Plus, IndianRupee, AlertCircle, Users, Activity, Hash, Phone, Mail, CreditCard, Timer, UserCheck } from 'lucide-react';
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
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

// Enhanced Types based on HMS Schema
interface TimeSlot {
  time: Date;
  available: boolean;
  appointment?: Appointment;
  scheduleId?: string;
  doctorSchedule?: DoctorSchedule;
  isBreak?: boolean;
  isBlocked?: boolean;
  blockReason?: string;
}

interface Appointment {
  appointmentId: string;
  appointmentCode: string;
  clinicId: string;
  // Patient and doctor
  patientId: string;
  patientName: string;
  patientPhone?: string;
  patientEmail?: string;
  doctorId: string;
  doctorName: string;
  departmentId: string;
  departmentName: string;
  // Appointment details
  appointmentDate: Date;
  appointmentTime: string;
  appointmentEndTime?: string;
  appointmentType: 'Consultation' | 'Follow-up' | 'Emergency' | 'Routine-Checkup' | 'Vaccination' | 'Health-Checkup';
  visitType: 'First-Visit' | 'Follow-Up' | 'Emergency';
  // Status tracking
  status: 'Scheduled' | 'Confirmed' | 'In-Progress' | 'Completed' | 'Cancelled' | 'No-Show' | 'Rescheduled';
  checkedInAt?: Date;
  consultationStartAt?: Date;
  consultationEndAt?: Date;
  // Queue management
  tokenNumber?: number;
  queuePriority: number;
  estimatedWaitTime?: number; // in minutes
  // Fees
  consultationFee: number;
  discountAmount?: number;
  discountReason?: string;
  paymentStatus: 'Pending' | 'Paid' | 'Partial';
  // Notes
  chiefComplaint?: string;
  appointmentNotes?: string;
  // Metadata
  scheduledBy?: string;
  scheduledAt: Date;
  rescheduledFrom?: string;
  cancellationReason?: string;
}

interface DoctorSchedule {
  scheduleId: string;
  doctorId: string;
  doctorName: string;
  departmentId: string;
  departmentName: string;
  dayOfWeek?: number;
  scheduleDate?: Date;
  startTime: string;
  endTime: string;
  consultationDuration: number; // minutes
  maxAppointments?: number;
  bufferTime: number; // minutes between appointments
  scheduleType: 'Regular' | 'Special' | 'Emergency';
  appointmentsBooked?: number;
  breakTime?: { start: string; end: string };
}

interface Patient {
  patientId: string;
  patientCode: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  email?: string;
  aadhaarNumber?: string;
  abhaId?: string;
  bloodGroup?: string;
  allergies?: string[];
  chronicConditions?: string[];
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  insuranceDetails?: {
    provider: string;
    policyNumber: string;
    validTill: Date;
  };
}

interface Doctor {
  userId: string;
  firstName: string;
  lastName: string;
  specialization: string;
  qualification: string;
  registrationNumber: string;
  departmentId: string;
  departmentName: string;
  consultationFee: number;
  followUpFee: number;
  emergencyFee: number;
  rating?: number;
  experience?: number; // years
  languages?: string[];
  availability: 'Available' | 'Busy' | 'On-Leave' | 'Emergency-Only';
}

interface Department {
  departmentId: string;
  departmentName: string;
  departmentCode: string;
  headOfDepartment?: string;
  location?: string;
  operatingHours?: { start: string; end: string };
  services?: string[];
}

// Enhanced mock data based on HMS schema
const mockDoctorSchedules: DoctorSchedule[] = [
  {
    scheduleId: 'SCH001',
    doctorId: 'DOC001',
    doctorName: 'Dr. Rajesh Sharma',
    departmentId: 'DEPT001',
    departmentName: 'General Medicine',
    // Remove dayOfWeek to make available all weekdays
    startTime: '09:00',
    endTime: '13:00',
    consultationDuration: 15,
    maxAppointments: 16,
    bufferTime: 5,
    scheduleType: 'Regular',
    appointmentsBooked: 2,
    breakTime: { start: '11:00', end: '11:15' },
  },
  {
    scheduleId: 'SCH002',
    doctorId: 'DOC002',
    doctorName: 'Dr. Priya Patel',
    departmentId: 'DEPT002',
    departmentName: 'Cardiology',
    // Remove dayOfWeek to make available all weekdays
    startTime: '14:00',
    endTime: '18:00',
    consultationDuration: 20,
    maxAppointments: 12,
    bufferTime: 5,
    scheduleType: 'Regular',
    appointmentsBooked: 1,
  },
  {
    scheduleId: 'SCH003',
    doctorId: 'DOC003',
    doctorName: 'Dr. Amit Singh',
    departmentId: 'DEPT003',
    departmentName: 'Orthopedics',
    // Remove dayOfWeek to make available all weekdays
    startTime: '10:00',
    endTime: '16:00',
    consultationDuration: 30,
    maxAppointments: 12,
    bufferTime: 10,
    scheduleType: 'Regular',
    appointmentsBooked: 3,
  },
];

const mockAppointments: Appointment[] = [
  {
    appointmentId: 'APT001',
    appointmentCode: 'APT-2024-001',
    clinicId: 'CLINIC001',
    patientId: 'PAT001',
    patientName: 'Rajesh Kumar',
    patientPhone: '9876543210',
    patientEmail: 'rajesh@example.com',
    doctorId: 'DOC001',
    doctorName: 'Dr. Rajesh Sharma',
    departmentId: 'DEPT001',
    departmentName: 'General Medicine',
    appointmentDate: new Date(),
    appointmentTime: '10:00',
    appointmentEndTime: '10:15',
    appointmentType: 'Consultation',
    visitType: 'First-Visit',
    status: 'Scheduled',
    tokenNumber: 5,
    queuePriority: 0,
    estimatedWaitTime: 30,
    consultationFee: 500,
    paymentStatus: 'Pending',
    scheduledAt: new Date(),
  },
  {
    appointmentId: 'APT002',
    appointmentCode: 'APT-2024-002',
    clinicId: 'CLINIC001',
    patientId: 'PAT002',
    patientName: 'Sunita Sharma',
    patientPhone: '9876543220',
    doctorId: 'DOC002',
    doctorName: 'Dr. Priya Patel',
    departmentId: 'DEPT002',
    departmentName: 'Cardiology',
    appointmentDate: new Date(),
    appointmentTime: '14:20',
    appointmentEndTime: '14:40',
    appointmentType: 'Follow-up',
    visitType: 'Follow-Up',
    status: 'Confirmed',
    tokenNumber: 2,
    queuePriority: 0,
    estimatedWaitTime: 10,
    consultationFee: 800,
    discountAmount: 100,
    discountReason: 'Senior Citizen',
    paymentStatus: 'Paid',
    scheduledAt: new Date(),
  },
];

const mockPatients: Patient[] = [
  {
    patientId: 'PAT001',
    patientCode: 'PAT-2024-001',
    firstName: 'Rajesh',
    lastName: 'Kumar',
    dateOfBirth: new Date('1985-06-15'),
    gender: 'Male',
    phone: '9876543210',
    email: 'rajesh@example.com',
    bloodGroup: 'A+',
    aadhaarNumber: '123456789012',
    abhaId: 'ABHA123456',
    allergies: ['Penicillin'],
    chronicConditions: ['Diabetes Type 2'],
  },
  {
    patientId: 'PAT002',
    patientCode: 'PAT-2024-002',
    firstName: 'Sunita',
    lastName: 'Sharma',
    dateOfBirth: new Date('1960-03-20'),
    gender: 'Female',
    phone: '9876543220',
    bloodGroup: 'B+',
    aadhaarNumber: '234567890123',
    insuranceDetails: {
      provider: 'Star Health',
      policyNumber: 'POL123456',
      validTill: new Date('2025-12-31'),
    },
  },
  {
    patientId: 'PAT003',
    patientCode: 'PAT-2024-003',
    firstName: 'Amit',
    lastName: 'Verma',
    dateOfBirth: new Date('1995-09-10'),
    gender: 'Male',
    phone: '9876543230',
    bloodGroup: 'O+',
    emergencyContact: {
      name: 'Priya Verma',
      phone: '9876543231',
      relationship: 'Spouse',
    },
  },
];

const mockDoctors: Doctor[] = [
  {
    userId: 'DOC001',
    firstName: 'Rajesh',
    lastName: 'Sharma',
    specialization: 'General Medicine',
    qualification: 'MBBS, MD',
    registrationNumber: 'MCI-12345',
    departmentId: 'DEPT001',
    departmentName: 'General Medicine',
    consultationFee: 500,
    followUpFee: 300,
    emergencyFee: 1000,
    rating: 4.8,
    experience: 15,
    languages: ['Hindi', 'English', 'Punjabi'],
    availability: 'Available',
  },
  {
    userId: 'DOC002',
    firstName: 'Priya',
    lastName: 'Patel',
    specialization: 'Cardiology',
    qualification: 'MBBS, MD, DM (Cardiology)',
    registrationNumber: 'MCI-23456',
    departmentId: 'DEPT002',
    departmentName: 'Cardiology',
    consultationFee: 800,
    followUpFee: 500,
    emergencyFee: 1500,
    rating: 4.9,
    experience: 20,
    languages: ['Hindi', 'English', 'Gujarati'],
    availability: 'Available',
  },
  {
    userId: 'DOC003',
    firstName: 'Amit',
    lastName: 'Singh',
    specialization: 'Orthopedics',
    qualification: 'MBBS, MS (Ortho)',
    registrationNumber: 'MCI-34567',
    departmentId: 'DEPT003',
    departmentName: 'Orthopedics',
    consultationFee: 700,
    followUpFee: 400,
    emergencyFee: 1200,
    rating: 4.7,
    experience: 12,
    languages: ['Hindi', 'English'],
    availability: 'Busy',
  },
];

const departments: Department[] = [
  {
    departmentId: 'DEPT001',
    departmentName: 'General Medicine',
    departmentCode: 'GM',
    location: 'Building A, Floor 1',
    operatingHours: { start: '08:00', end: '20:00' },
    services: ['OPD Consultation', 'Health Checkup', 'Vaccination'],
  },
  {
    departmentId: 'DEPT002',
    departmentName: 'Cardiology',
    departmentCode: 'CARD',
    location: 'Building B, Floor 2',
    operatingHours: { start: '09:00', end: '18:00' },
    services: ['ECG', 'Echo', '2D Echo', 'Stress Test'],
  },
  {
    departmentId: 'DEPT003',
    departmentName: 'Orthopedics',
    departmentCode: 'ORTHO',
    location: 'Building A, Floor 2',
    operatingHours: { start: '09:00', end: '17:00' },
    services: ['X-Ray', 'Physiotherapy', 'Joint Replacement'],
  },
  {
    departmentId: 'DEPT004',
    departmentName: 'Pediatrics',
    departmentCode: 'PED',
    location: 'Building C, Floor 1',
    operatingHours: { start: '08:00', end: '20:00' },
    services: ['Child Care', 'Vaccination', 'Growth Monitoring'],
  },
  {
    departmentId: 'DEPT005',
    departmentName: 'Emergency',
    departmentCode: 'ER',
    location: 'Emergency Block',
    operatingHours: { start: '00:00', end: '23:59' },
    services: ['24x7 Emergency Care', 'Trauma Care', 'Ambulance'],
  },
];

export function EnhancedAppointmentScheduler() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewType, setViewType] = useState<'day' | 'week'>('day');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedDoctor, setSelectedDoctor] = useState('all');
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [selectedSlot, setSelectedSlot] = useState<Date | null>(null);
  const [selectedDoctorSchedule, setSelectedDoctorSchedule] = useState<DoctorSchedule | null>(null);
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [rescheduleDialogOpen, setRescheduleDialogOpen] = useState(false);
  const [draggedAppointment, setDraggedAppointment] = useState<Appointment | null>(null);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [appointmentDetailsOpen, setAppointmentDetailsOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'schedule' | 'queue'>('schedule');

  // Enhanced form state for booking
  const [bookingForm, setBookingForm] = useState({
    patientId: '',
    patientSearch: '',
    isNewPatient: false,
    // New patient fields
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    dateOfBirth: '',
    gender: 'Male' as 'Male' | 'Female' | 'Other',
    aadhaarNumber: '',
    // Appointment details
    departmentId: '',
    doctorId: '',
    appointmentType: 'Consultation' as Appointment['appointmentType'],
    visitType: 'First-Visit' as Appointment['visitType'],
    chiefComplaint: '',
    // Payment
    paymentMethod: 'Cash',
    applyDiscount: false,
    discountAmount: 0,
    discountReason: '',
    // Notifications
    sendSMS: false,
    sendWhatsApp: false,
    sendEmail: false,
  });

  // Generate enhanced time slots with doctor schedules
  const generateTimeSlots = (date: Date, doctorId?: string): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    const dayOfWeek = date.getDay();
    
    // Get doctor schedules for the day
    // For demo purposes, make schedules available on all weekdays (Mon-Fri)
    const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5;
    if (!isWeekday) return slots; // No slots on weekends
    
    const daySchedules = mockDoctorSchedules.filter(schedule => {
      if (doctorId && doctorId !== 'all' && schedule.doctorId !== doctorId) return false;
      // Make schedules available on all weekdays for demo
      return true;
    });

    // Generate slots for each doctor schedule
    daySchedules.forEach(schedule => {
      const [startHour, startMinute] = schedule.startTime.split(':').map(Number);
      const [endHour, endMinute] = schedule.endTime.split(':').map(Number);
      
      let currentTime = setHours(date, startHour);
      currentTime.setMinutes(startMinute);
      const endTime = setHours(date, endHour);
      endTime.setMinutes(endMinute);

      while (currentTime < endTime) {
        const slotTime = new Date(currentTime);
        
        // Check if it's break time
        const isBreak = schedule.breakTime && 
          format(currentTime, 'HH:mm') >= schedule.breakTime.start &&
          format(currentTime, 'HH:mm') < schedule.breakTime.end;

        // Check for existing appointment
        const appointment = appointments.find(apt => 
          isSameDay(apt.appointmentDate, slotTime) && 
          apt.appointmentTime === format(slotTime, 'HH:mm') &&
          apt.doctorId === schedule.doctorId
        );

        // Calculate if slot is available
        const isAvailable = !appointment && !isBreak && 
          (!schedule.maxAppointments || (schedule.appointmentsBooked || 0) < schedule.maxAppointments);

        slots.push({
          time: slotTime,
          available: isAvailable,
          appointment,
          scheduleId: schedule.scheduleId,
          doctorSchedule: schedule,
          isBreak,
        });

        // Add consultation duration + buffer time
        currentTime = addMinutes(currentTime, schedule.consultationDuration + schedule.bufferTime);
      }
    });

    return slots.sort((a, b) => a.time.getTime() - b.time.getTime());
  };

  // Get week days
  const getWeekDays = () => {
    const start = startOfWeek(currentDate, { weekStartsOn: 1 });
    const end = endOfWeek(currentDate, { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  };

  // Calculate statistics
  const calculateStats = useMemo(() => {
    const today = new Date();
    const todayAppointments = appointments.filter(apt => 
      isSameDay(apt.appointmentDate, today)
    );
    
    const weekStart = startOfWeek(today, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(today, { weekStartsOn: 1 });
    const weekAppointments = appointments.filter(apt => 
      isWithinInterval(apt.appointmentDate, { start: weekStart, end: weekEnd })
    );

    const completedToday = todayAppointments.filter(apt => apt.status === 'Completed').length;
    const cancelledThisWeek = weekAppointments.filter(apt => apt.status === 'Cancelled').length;
    const revenue = weekAppointments
      .filter(apt => apt.paymentStatus === 'Paid')
      .reduce((sum, apt) => sum + (apt.consultationFee - (apt.discountAmount || 0)), 0);

    return {
      todayTotal: todayAppointments.length,
      todayCompleted: completedToday,
      weekTotal: weekAppointments.length,
      cancelledCount: cancelledThisWeek,
      revenue,
      avgWaitTime: 15, // Mock average wait time
    };
  }, [appointments]);

  // Filter doctors by department
  const filteredDoctors = useMemo(() => {
    if (selectedDepartment === 'all') return mockDoctors;
    return mockDoctors.filter(doc => doc.departmentId === selectedDepartment);
  }, [selectedDepartment]);

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

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, appointment: Appointment) => {
    e.dataTransfer.effectAllowed = 'move';
    setDraggedAppointment(appointment);
    // Add visual feedback
    e.currentTarget.classList.add('opacity-50');
  };

  const handleDragEnd = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('opacity-50');
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    // Add visual feedback
    e.currentTarget.classList.add('ring-2', 'ring-blue-400', 'bg-blue-50');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('ring-2', 'ring-blue-400', 'bg-blue-50');
  };

  const handleDrop = (e: React.DragEvent, slot: TimeSlot) => {
    e.preventDefault();
    
    if (draggedAppointment && slot.available && slot.doctorSchedule) {
      setSelectedSlot(slot.time);
      setSelectedDoctorSchedule(slot.doctorSchedule);
      setRescheduleDialogOpen(true);
    }
  };

  const handleConfirmReschedule = () => {
    if (draggedAppointment && selectedSlot && selectedDoctorSchedule) {
      const updatedAppointments = appointments.map(apt => 
        apt.appointmentId === draggedAppointment.appointmentId 
          ? { 
              ...apt, 
              appointmentDate: selectedSlot,
              appointmentTime: format(selectedSlot, 'HH:mm'),
              appointmentEndTime: format(
                addMinutes(selectedSlot, selectedDoctorSchedule.consultationDuration),
                'HH:mm'
              ),
              doctorId: selectedDoctorSchedule.doctorId,
              doctorName: selectedDoctorSchedule.doctorName,
              departmentId: selectedDoctorSchedule.departmentId,
              departmentName: selectedDoctorSchedule.departmentName,
              status: 'Rescheduled' as const,
            }
          : apt
      );
      setAppointments(updatedAppointments);
      setRescheduleDialogOpen(false);
      setDraggedAppointment(null);
      setSelectedSlot(null);
      setSelectedDoctorSchedule(null);
      
      toast({
        title: 'Success',
        description: 'Appointment rescheduled successfully',
      });
    }
  };

  // Handle appointment click for editing
  const handleAppointmentClick = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    setAppointmentDetailsOpen(true);
  };

  // Handle appointment update
  const handleUpdateAppointment = (field: keyof Appointment, value: any) => {
    if (editingAppointment) {
      const updatedAppointment = { ...editingAppointment, [field]: value };
      setEditingAppointment(updatedAppointment);
    }
  };

  // Save appointment changes
  const handleSaveAppointment = () => {
    if (editingAppointment) {
      const updatedAppointments = appointments.map(apt => 
        apt.appointmentId === editingAppointment.appointmentId 
          ? editingAppointment
          : apt
      );
      setAppointments(updatedAppointments);
      setAppointmentDetailsOpen(false);
      
      toast({
        title: 'Success',
        description: 'Appointment updated successfully',
      });
    }
  };

  // Cancel appointment
  const handleCancelAppointment = () => {
    if (editingAppointment) {
      const updatedAppointments = appointments.map(apt => 
        apt.appointmentId === editingAppointment.appointmentId 
          ? { ...apt, status: 'Cancelled' as const }
          : apt
      );
      setAppointments(updatedAppointments);
      setAppointmentDetailsOpen(false);
      
      toast({
        title: 'Success',
        description: 'Appointment cancelled',
      });
    }
  };

  // Enhanced booking handler
  const handleSlotClick = (slot: TimeSlot) => {
    if (slot.available && slot.doctorSchedule) {
      setSelectedSlot(slot.time);
      setSelectedDoctorSchedule(slot.doctorSchedule);
      setBookingForm(prev => ({
        ...prev,
        doctorId: slot.doctorSchedule!.doctorId,
        departmentId: slot.doctorSchedule!.departmentId,
      }));
      setBookingDialogOpen(true);
    }
  };

  // Calculate consultation fee
  const calculateFee = () => {
    if (!selectedDoctorSchedule) return 0;
    
    const doctor = mockDoctors.find(d => d.userId === selectedDoctorSchedule.doctorId);
    if (!doctor) return 0;

    let fee = 0;
    switch (bookingForm.appointmentType) {
      case 'Emergency':
        fee = doctor.emergencyFee;
        break;
      case 'Follow-up':
        fee = bookingForm.visitType === 'Follow-Up' ? doctor.followUpFee : doctor.consultationFee;
        break;
      default:
        fee = doctor.consultationFee;
    }

    return fee - (bookingForm.applyDiscount ? bookingForm.discountAmount : 0);
  };

  // Enhanced booking appointment handler
  const handleBookAppointment = () => {
    if (!selectedSlot) {
      toast({
        title: 'Error',
        description: 'Please select a valid time slot',
        variant: 'destructive',
      });
      return;
    }

    // For walk-in appointments, ensure doctor is selected
    if (!selectedDoctorSchedule && !bookingForm.doctorId) {
      toast({
        title: 'Error',
        description: 'Please select a doctor for the appointment',
        variant: 'destructive',
      });
      return;
    }

    // Validate patient information
    if (bookingForm.isNewPatient) {
      if (!bookingForm.firstName || !bookingForm.lastName || !bookingForm.phone) {
        toast({
          title: 'Error',
          description: 'Please fill all required patient details',
          variant: 'destructive',
        });
        return;
      }
    } else if (!bookingForm.patientId) {
      toast({
        title: 'Error',
        description: 'Please select a patient',
        variant: 'destructive',
      });
      return;
    }

    // Get doctor schedule (either from selected slot or walk-in selection)
    const doctorSchedule = selectedDoctorSchedule || 
      mockDoctorSchedules.find(s => s.doctorId === bookingForm.doctorId);
    
    if (!doctorSchedule) {
      toast({
        title: 'Error',
        description: 'Doctor schedule not found',
        variant: 'destructive',
      });
      return;
    }

    // Generate token number
    const departmentAppointments = appointments.filter(apt => 
      apt.departmentId === doctorSchedule.departmentId &&
      isSameDay(apt.appointmentDate, selectedSlot)
    );
    const tokenNumber = departmentAppointments.length + 1;

    // Create new appointment
    const newAppointment: Appointment = {
      appointmentId: `APT${String(appointments.length + 1).padStart(3, '0')}`,
      appointmentCode: `APT-2024-${String(appointments.length + 1).padStart(3, '0')}`,
      clinicId: 'CLINIC001',
      patientId: bookingForm.isNewPatient ? `PAT${String(mockPatients.length + 1).padStart(3, '0')}` : bookingForm.patientId,
      patientName: bookingForm.isNewPatient 
        ? `${bookingForm.firstName} ${bookingForm.lastName}`
        : mockPatients.find(p => p.patientId === bookingForm.patientId)?.firstName + ' ' + 
          mockPatients.find(p => p.patientId === bookingForm.patientId)?.lastName || '',
      patientPhone: bookingForm.phone,
      patientEmail: bookingForm.email,
      doctorId: doctorSchedule.doctorId,
      doctorName: doctorSchedule.doctorName,
      departmentId: doctorSchedule.departmentId,
      departmentName: doctorSchedule.departmentName,
      appointmentDate: selectedSlot,
      appointmentTime: format(selectedSlot, 'HH:mm'),
      appointmentEndTime: format(
        addMinutes(selectedSlot, doctorSchedule.consultationDuration),
        'HH:mm'
      ),
      appointmentType: bookingForm.appointmentType,
      visitType: bookingForm.visitType,
      status: 'Scheduled',
      tokenNumber,
      queuePriority: bookingForm.appointmentType === 'Emergency' ? 1 : 0,
      estimatedWaitTime: tokenNumber * doctorSchedule.consultationDuration,
      consultationFee: calculateFee(),
      discountAmount: bookingForm.applyDiscount ? bookingForm.discountAmount : undefined,
      discountReason: bookingForm.discountReason || undefined,
      paymentStatus: 'Pending',
      chiefComplaint: bookingForm.chiefComplaint,
      scheduledAt: new Date(),
    };

    setAppointments([...appointments, newAppointment]);
    setBookingDialogOpen(false);
    
    // Show success message with details
    const notifications = [];
    if (bookingForm.sendSMS) notifications.push('SMS');
    if (bookingForm.sendWhatsApp) notifications.push('WhatsApp');
    if (bookingForm.sendEmail) notifications.push('Email');
    
    toast({
      title: 'Appointment Booked Successfully',
      description: (
        <div className="space-y-1">
          <p>Token Number: <strong>{tokenNumber}</strong></p>
          <p>Estimated Wait Time: <strong>{newAppointment.estimatedWaitTime} minutes</strong></p>
          <p>Consultation Fee: <strong>₹{newAppointment.consultationFee}</strong></p>
          {notifications.length > 0 && (
            <p>Notifications sent via: {notifications.join(', ')}</p>
          )}
        </div>
      ),
    });

    // Reset form
    setBookingForm({
      patientId: '',
      patientSearch: '',
      isNewPatient: false,
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      dateOfBirth: '',
      gender: 'Male',
      aadhaarNumber: '',
      departmentId: '',
      doctorId: '',
      appointmentType: 'Consultation',
      visitType: 'First-Visit',
      chiefComplaint: '',
      paymentMethod: 'Cash',
      applyDiscount: false,
      discountAmount: 0,
      discountReason: '',
      sendSMS: false,
      sendWhatsApp: false,
      sendEmail: false,
    });
    setSelectedSlot(null);
    setSelectedDoctorSchedule(null);
  };

  const weekDays = viewType === 'week' ? getWeekDays() : [currentDate];

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Enhanced Statistics */}
        <div className="grid gap-4 md:grid-cols-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{calculateStats.todayTotal}</div>
              <p className="text-xs text-muted-foreground">
                {calculateStats.todayCompleted} completed
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Week</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{calculateStats.weekTotal}</div>
              <p className="text-xs text-muted-foreground">
                {calculateStats.cancelledCount} cancelled
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Wait Time</CardTitle>
              <Timer className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{calculateStats.avgWaitTime} min</div>
              <p className="text-xs text-muted-foreground">Current queue</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue Today</CardTitle>
              <IndianRupee className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{calculateStats.revenue.toLocaleString('en-IN')}</div>
              <p className="text-xs text-muted-foreground">This week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Doctors Available</CardTitle>
              <Stethoscope className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mockDoctors.filter(d => d.availability === 'Available').length}
              </div>
              <p className="text-xs text-muted-foreground">
                {mockDoctors.filter(d => d.availability === 'Busy').length} busy
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Departments</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{departments.length}</div>
              <p className="text-xs text-muted-foreground">Active today</p>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Filters and View Mode Toggle */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Appointment Management</CardTitle>
              <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'schedule' | 'queue')}>
                <TabsList>
                  <TabsTrigger value="schedule">Schedule View</TabsTrigger>
                  <TabsTrigger value="queue">Queue Management</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <Select 
                value={selectedDepartment} 
                onValueChange={setSelectedDepartment}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map(dept => (
                    <SelectItem key={dept.departmentId} value={dept.departmentId}>
                      {dept.departmentName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select 
                value={selectedDoctor} 
                onValueChange={setSelectedDoctor}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="All Doctors" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Doctors</SelectItem>
                  {filteredDoctors.map(doc => (
                    <SelectItem key={doc.userId} value={doc.userId}>
                      {doc.firstName} {doc.lastName} - {doc.specialization}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input 
                type="date" 
                className="w-[200px]"
                value={format(currentDate, 'yyyy-MM-dd')}
                onChange={(e) => setCurrentDate(new Date(e.target.value))}
              />

              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>

              <Button 
                variant="default" 
                size="sm" 
                className="ml-auto"
                onClick={() => {
                  // Set current time as the slot and open booking dialog
                  const now = new Date();
                  const roundedTime = new Date(now);
                  roundedTime.setMinutes(Math.ceil(now.getMinutes() / 15) * 15);
                  roundedTime.setSeconds(0);
                  roundedTime.setMilliseconds(0);
                  
                  setSelectedSlot(roundedTime);
                  setBookingForm(prev => ({
                    ...prev,
                    appointmentType: 'Consultation',
                    visitType: 'First-Visit',
                  }));
                  setBookingDialogOpen(true);
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Walk-in Appointment
              </Button>
            </div>

            {/* Doctor availability info */}
            {selectedDoctor !== 'all' && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {(() => {
                    const doctor = mockDoctors.find(d => d.userId === selectedDoctor);
                    const schedule = mockDoctorSchedules.find(s => s.doctorId === selectedDoctor);
                    if (doctor && schedule) {
                      return (
                        <div className="space-y-1">
                          <p><strong>{doctor.firstName} {doctor.lastName}</strong> - {doctor.specialization}</p>
                          <p>Schedule: {schedule.startTime} - {schedule.endTime} | 
                            Consultation Duration: {schedule.consultationDuration} min</p>
                          <p>Fee: ₹{doctor.consultationFee} (Follow-up: ₹{doctor.followUpFee})</p>
                          <p>Status: <Badge variant={doctor.availability === 'Available' ? 'default' : 'secondary'}>
                            {doctor.availability}
                          </Badge></p>
                        </div>
                      );
                    }
                    return 'Doctor information not available';
                  })()}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Calendar/Queue View */}
        {viewMode === 'schedule' ? (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>
                    Appointment Calendar
                    {selectedDepartment !== 'all' && 
                      ` - ${departments.find(d => d.departmentId === selectedDepartment)?.departmentName}`}
                  </CardTitle>
                  <CardDescription>
                    • Click green slots to book new appointments
                    • Click appointments to view/edit details
                    • Drag appointments to reschedule
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Tabs value={viewType} onValueChange={(v) => setViewType(v as 'day' | 'week')}>
                    <TabsList>
                      <TabsTrigger value="day">Day</TabsTrigger>
                      <TabsTrigger value="week">Week</TabsTrigger>
                    </TabsList>
                  </Tabs>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handlePrevious}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleToday}
                  >
                    Today
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleNext}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <div className="min-w-[800px]">
                  {/* Header with dates */}
                  <div className="grid grid-cols-8 gap-1 mb-2">
                    <div className="text-sm font-medium p-2">Doctor / Time</div>
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

                  {/* Time slots by doctor */}
                  {filteredDoctors
                    .filter(doc => selectedDoctor === 'all' || doc.userId === selectedDoctor)
                    .map(doctor => {
                      const doctorSchedule = mockDoctorSchedules.find(s => s.doctorId === doctor.userId);
                      if (!doctorSchedule) return null;

                      return (
                        <div key={doctor.userId} className="mb-4">
                          <div className="grid grid-cols-8 gap-1">
                            <div className="text-sm p-2 font-medium">
                              <div>{doctor.firstName} {doctor.lastName}</div>
                              <div className="text-xs text-muted-foreground">{doctor.specialization}</div>
                              <Badge variant="outline" className="text-xs mt-1">
                                {doctorSchedule.startTime} - {doctorSchedule.endTime}
                              </Badge>
                            </div>
                            {weekDays.map(day => {
                              const slots = generateTimeSlots(day, doctor.userId);
                              
                              return (
                                <div 
                                  key={`${doctor.userId}-${day.toISOString()}`}
                                  className="space-y-1"
                                >
                                  {slots.slice(0, 5).map((slot, idx) => (
                                    <Tooltip key={idx}>
                                      <TooltipTrigger asChild>
                                        <div
                                          className={cn(
                                            "p-1 border rounded text-xs cursor-pointer transition-colors min-h-[40px]",
                                            slot.available 
                                              ? "bg-green-50 hover:bg-green-100 border-green-200" 
                                              : slot.isBreak
                                              ? "bg-gray-100 border-gray-200 cursor-not-allowed"
                                              : slot.appointment?.status === 'Cancelled'
                                              ? "bg-orange-50 hover:bg-orange-100 border-orange-200"
                                              : "bg-red-50 hover:bg-red-100 border-red-200",
                                            "relative",
                                            draggedAppointment && slot.available && "ring-2 ring-blue-400"
                                          )}
                                          onClick={() => {
                                            if (slot.appointment) {
                                              handleAppointmentClick(slot.appointment);
                                            } else if (slot.available) {
                                              handleSlotClick(slot);
                                            }
                                          }}
                                          onDragOver={handleDragOver}
                                          onDragLeave={handleDragLeave}
                                          onDrop={(e) => {
                                            handleDrop(e, slot);
                                            e.currentTarget.classList.remove('ring-2', 'ring-blue-400', 'bg-blue-50');
                                          }}
                                        >
                                          {slot.appointment ? (
                                            <div 
                                              className="space-y-0.5 cursor-move"
                                              draggable
                                              onDragStart={(e) => handleDragStart(e, slot.appointment!)}
                                              onDragEnd={handleDragEnd}
                                            >
                                              <div className="font-medium truncate">
                                                {slot.appointment.patientName}
                                              </div>
                                              <div className="flex items-center justify-between">
                                                <Badge 
                                                  variant={
                                                    slot.appointment.status === 'Cancelled' ? 'destructive' :
                                                    slot.appointment.status === 'Completed' ? 'default' :
                                                    slot.appointment.status === 'In-Progress' ? 'secondary' :
                                                    'outline'
                                                  } 
                                                  className="text-[10px] px-1 py-0"
                                                >
                                                  #{slot.appointment.tokenNumber}
                                                </Badge>
                                                {slot.appointment.status === 'Cancelled' && (
                                                  <span className="text-[10px] text-red-600">✕</span>
                                                )}
                                              </div>
                                            </div>
                                          ) : slot.isBreak ? (
                                            <div className="text-center text-gray-500">Break</div>
                                          ) : (
                                            <div className="text-center">
                                              {format(slot.time, 'HH:mm')}
                                            </div>
                                          )}
                                        </div>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        {slot.appointment ? (
                                          <div className="space-y-1">
                                            <p className="font-medium">Patient: {slot.appointment.patientName}</p>
                                            <p>Type: {slot.appointment.appointmentType}</p>
                                            <p>Token: #{slot.appointment.tokenNumber}</p>
                                            <p>Status: {slot.appointment.status}</p>
                                            <p>Fee: ₹{slot.appointment.consultationFee}</p>
                                            <Separator className="my-2" />
                                            <p className="text-xs text-muted-foreground">
                                              • Click to view/edit details
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                              • Drag to reschedule
                                            </p>
                                          </div>
                                        ) : slot.isBreak ? (
                                          <div>
                                            <p>Break Time</p>
                                            <p className="text-xs text-muted-foreground">Doctor unavailable</p>
                                          </div>
                                        ) : (
                                          <div>
                                            <p className="font-medium">Available Slot</p>
                                            <p className="text-xs text-muted-foreground">Click to book appointment</p>
                                          </div>
                                        )}
                                      </TooltipContent>
                                    </Tooltip>
                                  ))}
                                  {slots.length > 5 && (
                                    <div className="text-center text-xs text-muted-foreground">
                                      +{slots.length - 5} more
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Legend */}
              <div className="flex flex-wrap gap-4 mt-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-50 border border-green-200 rounded"></div>
                  <span>Available (Click to book)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-50 border border-red-200 rounded"></div>
                  <span>Booked (Click to edit, Drag to reschedule)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-100 border border-gray-200 rounded"></div>
                  <span>Break/Blocked</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          // Queue Management View
          <Card>
            <CardHeader>
              <CardTitle>Queue Management</CardTitle>
              <CardDescription>
                Real-time queue status and patient flow management
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {departments.map(dept => {
                  const deptAppointments = appointments.filter(apt => 
                    apt.departmentId === dept.departmentId &&
                    isSameDay(apt.appointmentDate, currentDate)
                  ).sort((a, b) => (a.tokenNumber || 0) - (b.tokenNumber || 0));

                  if (deptAppointments.length === 0) return null;

                  return (
                    <div key={dept.departmentId} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold">{dept.departmentName}</h3>
                        <Badge variant="outline">
                          {deptAppointments.length} patients
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        {deptAppointments.map(apt => (
                          <div key={apt.appointmentId} className="flex items-center justify-between p-2 border rounded">
                            <div className="flex items-center gap-3">
                              <Badge variant={apt.status === 'In-Progress' ? 'default' : 'secondary'}>
                                #{apt.tokenNumber}
                              </Badge>
                              <div>
                                <p className="font-medium">{apt.patientName}</p>
                                <p className="text-sm text-muted-foreground">
                                  {apt.doctorName} • {apt.appointmentTime}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant={
                                apt.status === 'Completed' ? 'success' :
                                apt.status === 'In-Progress' ? 'default' :
                                apt.status === 'Cancelled' ? 'destructive' :
                                'secondary'
                              }>
                                {apt.status}
                              </Badge>
                              {apt.estimatedWaitTime && apt.status === 'Scheduled' && (
                                <span className="text-sm text-muted-foreground">
                                  ~{apt.estimatedWaitTime} min wait
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Reschedule Confirmation Dialog */}
        <Dialog open={rescheduleDialogOpen} onOpenChange={setRescheduleDialogOpen}>
          <DialogContent data-testid="reschedule-confirm-dialog">
            <DialogHeader>
              <DialogTitle>Confirm Reschedule</DialogTitle>
              <DialogDescription>
                Are you sure you want to reschedule this appointment?
              </DialogDescription>
            </DialogHeader>
            
            {draggedAppointment && selectedSlot && selectedDoctorSchedule && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Current Appointment</Label>
                    <div className="text-sm space-y-1 mt-1">
                      <p><strong>Patient:</strong> {draggedAppointment.patientName}</p>
                      <p><strong>Doctor:</strong> {draggedAppointment.doctorName}</p>
                      <p><strong>Time:</strong> {format(draggedAppointment.appointmentDate, 'PPp')}</p>
                      <p><strong>Token:</strong> #{draggedAppointment.tokenNumber}</p>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">New Appointment</Label>
                    <div className="text-sm space-y-1 mt-1">
                      <p><strong>Doctor:</strong> {selectedDoctorSchedule.doctorName}</p>
                      <p><strong>Time:</strong> {format(selectedSlot, 'PPp')}</p>
                      <p><strong>Duration:</strong> {selectedDoctorSchedule.consultationDuration} min</p>
                      <p><strong>Department:</strong> {selectedDoctorSchedule.departmentName}</p>
                    </div>
                  </div>
                </div>
                
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    The patient will be notified about the schedule change via their preferred communication method.
                  </AlertDescription>
                </Alert>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setRescheduleDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleConfirmReschedule}>
                Confirm Reschedule
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Appointment Details/Edit Dialog */}
        <Dialog open={appointmentDetailsOpen} onOpenChange={setAppointmentDetailsOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Appointment Details</DialogTitle>
              <DialogDescription>
                View and edit appointment information
              </DialogDescription>
            </DialogHeader>
            
            {editingAppointment && (
              <div className="space-y-6">
                {/* Appointment Status */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={
                        editingAppointment.status === 'Completed' ? 'default' :
                        editingAppointment.status === 'Cancelled' ? 'destructive' :
                        editingAppointment.status === 'In-Progress' ? 'secondary' :
                        'outline'
                      }
                    >
                      {editingAppointment.status}
                    </Badge>
                    <Badge variant="outline">
                      Token #{editingAppointment.tokenNumber}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {editingAppointment.appointmentCode}
                  </div>
                </div>

                {/* Patient Information */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="font-semibold">Patient Information</Label>
                    <div className="space-y-1 text-sm">
                      <p><strong>Name:</strong> {editingAppointment.patientName}</p>
                      <p><strong>Phone:</strong> {editingAppointment.patientPhone}</p>
                      <p><strong>Email:</strong> {editingAppointment.patientEmail || 'Not provided'}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="font-semibold">Appointment Details</Label>
                    <div className="space-y-1 text-sm">
                      <p><strong>Doctor:</strong> {editingAppointment.doctorName}</p>
                      <p><strong>Department:</strong> {editingAppointment.departmentName}</p>
                      <p><strong>Date:</strong> {format(editingAppointment.appointmentDate, 'PP')}</p>
                      <p><strong>Time:</strong> {editingAppointment.appointmentTime} - {editingAppointment.appointmentEndTime}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Editable Fields */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Appointment Status</Label>
                      <Select
                        value={editingAppointment.status}
                        onValueChange={(value) => handleUpdateAppointment('status', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Scheduled">Scheduled</SelectItem>
                          <SelectItem value="Confirmed">Confirmed</SelectItem>
                          <SelectItem value="In-Progress">In Progress</SelectItem>
                          <SelectItem value="Completed">Completed</SelectItem>
                          <SelectItem value="No-Show">No Show</SelectItem>
                          <SelectItem value="Cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Payment Status</Label>
                      <Select
                        value={editingAppointment.paymentStatus}
                        onValueChange={(value) => handleUpdateAppointment('paymentStatus', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="Paid">Paid</SelectItem>
                          <SelectItem value="Partial">Partial</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {editingAppointment.chiefComplaint && (
                    <div className="space-y-2">
                      <Label>Chief Complaint</Label>
                      <Textarea
                        value={editingAppointment.chiefComplaint}
                        onChange={(e) => handleUpdateAppointment('chiefComplaint', e.target.value)}
                        rows={3}
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label>Notes</Label>
                    <Textarea
                      value={editingAppointment.appointmentNotes || ''}
                      onChange={(e) => handleUpdateAppointment('appointmentNotes', e.target.value)}
                      placeholder="Add notes about the appointment..."
                      rows={3}
                    />
                  </div>
                </div>

                <Separator />

                {/* Payment Information */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Consultation Fee</Label>
                    <div className="flex items-center gap-1">
                      <IndianRupee className="h-4 w-4" />
                      <span className="font-medium">{editingAppointment.consultationFee}</span>
                    </div>
                  </div>
                  {editingAppointment.discountAmount && (
                    <div className="space-y-2">
                      <Label>Discount</Label>
                      <div className="flex items-center gap-1">
                        <IndianRupee className="h-4 w-4" />
                        <span className="font-medium">{editingAppointment.discountAmount}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {editingAppointment.discountReason}
                      </p>
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label>Final Amount</Label>
                    <div className="flex items-center gap-1">
                      <IndianRupee className="h-4 w-4" />
                      <span className="font-semibold">
                        {editingAppointment.consultationFee - (editingAppointment.discountAmount || 0)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setAppointmentDetailsOpen(false)}>
                Close
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleCancelAppointment}
                disabled={editingAppointment?.status === 'Cancelled'}
              >
                Cancel Appointment
              </Button>
              <Button onClick={handleSaveAppointment}>
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Enhanced Booking Dialog */}
        <Dialog open={bookingDialogOpen} onOpenChange={setBookingDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Schedule Appointment</DialogTitle>
              <DialogDescription>
                {selectedSlot && selectedDoctorSchedule ? (
                  <div className="mt-2 space-y-1">
                    <p>Doctor: <strong>{selectedDoctorSchedule.doctorName}</strong></p>
                    <p>Department: <strong>{selectedDoctorSchedule.departmentName}</strong></p>
                    <p>Date & Time: <strong>{format(selectedSlot, 'PPpp')}</strong></p>
                    <p>Duration: <strong>{selectedDoctorSchedule.consultationDuration} minutes</strong></p>
                  </div>
                ) : selectedSlot ? (
                  <div className="mt-2">
                    <p>Walk-in Appointment</p>
                    <p>Date & Time: <strong>{format(selectedSlot, 'PPpp')}</strong></p>
                    <p className="text-sm text-muted-foreground">Please select a doctor and department</p>
                  </div>
                ) : null}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Patient Selection/Registration */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Label className="font-semibold">Patient Details</Label>
                  <RadioGroup 
                    value={bookingForm.isNewPatient ? 'new' : 'existing'}
                    onValueChange={(v) => setBookingForm({...bookingForm, isNewPatient: v === 'new'})}
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="existing" id="existing" />
                      <Label htmlFor="existing">Existing Patient</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="new" id="new" />
                      <Label htmlFor="new">Quick Registration</Label>
                    </div>
                  </RadioGroup>
                </div>

                {bookingForm.isNewPatient && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      This is quick registration for walk-in patients. For complete patient registration with medical history, insurance, and emergency contacts, use the <strong>Patients → Register Patient</strong> page.
                    </AlertDescription>
                  </Alert>
                )}

                {!bookingForm.isNewPatient ? (
                  <div className="space-y-2">
                    <Label>Search Patient</Label>
                    <Select 
                      value={bookingForm.patientId} 
                      onValueChange={(value) => setBookingForm({...bookingForm, patientId: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Search by name, phone, or ID" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockPatients.map(patient => (
                          <SelectItem key={patient.patientId} value={patient.patientId}>
                            <div className="flex items-center justify-between w-full">
                              <span>{patient.firstName} {patient.lastName}</span>
                              <span className="text-sm text-muted-foreground ml-2">
                                {patient.phone} • {patient.patientCode}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    {bookingForm.patientId && (() => {
                      const patient = mockPatients.find(p => p.patientId === bookingForm.patientId);
                      if (!patient) return null;
                      return (
                        <Alert>
                          <AlertDescription>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <p>DOB: {format(patient.dateOfBirth, 'dd/MM/yyyy')}</p>
                              <p>Blood Group: {patient.bloodGroup}</p>
                              {patient.abhaId && <p>ABHA: {patient.abhaId}</p>}
                              {patient.insuranceDetails && (
                                <p>Insurance: {patient.insuranceDetails.provider}</p>
                              )}
                            </div>
                          </AlertDescription>
                        </Alert>
                      );
                    })()}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>First Name *</Label>
                      <Input
                        value={bookingForm.firstName}
                        onChange={(e) => setBookingForm({...bookingForm, firstName: e.target.value})}
                        placeholder="Enter first name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Last Name *</Label>
                      <Input
                        value={bookingForm.lastName}
                        onChange={(e) => setBookingForm({...bookingForm, lastName: e.target.value})}
                        placeholder="Enter last name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Phone Number *</Label>
                      <Input
                        value={bookingForm.phone}
                        onChange={(e) => setBookingForm({...bookingForm, phone: e.target.value})}
                        placeholder="10-digit mobile number"
                        maxLength={10}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input
                        type="email"
                        value={bookingForm.email}
                        onChange={(e) => setBookingForm({...bookingForm, email: e.target.value})}
                        placeholder="email@example.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Date of Birth</Label>
                      <Input
                        type="date"
                        value={bookingForm.dateOfBirth}
                        onChange={(e) => setBookingForm({...bookingForm, dateOfBirth: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Gender</Label>
                      <Select 
                        value={bookingForm.gender} 
                        onValueChange={(v: 'Male' | 'Female' | 'Other') => 
                          setBookingForm({...bookingForm, gender: v})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2 col-span-2">
                      <Label>Aadhaar Number</Label>
                      <Input
                        value={bookingForm.aadhaarNumber}
                        onChange={(e) => setBookingForm({...bookingForm, aadhaarNumber: e.target.value})}
                        placeholder="12-digit Aadhaar number"
                        maxLength={12}
                      />
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              {/* Appointment Details */}
              <div className="space-y-4">
                <Label className="font-semibold">Appointment Details</Label>
                
                {/* Show doctor/department selection for walk-in appointments */}
                {!selectedDoctorSchedule && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Department *</Label>
                      <Select 
                        value={bookingForm.departmentId} 
                        onValueChange={(value) => {
                          setBookingForm({...bookingForm, departmentId: value, doctorId: ''});
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Department" />
                        </SelectTrigger>
                        <SelectContent>
                          {departments.map(dept => (
                            <SelectItem key={dept.departmentId} value={dept.departmentId}>
                              {dept.departmentName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Doctor *</Label>
                      <Select 
                        value={bookingForm.doctorId} 
                        onValueChange={(value) => {
                          setBookingForm({...bookingForm, doctorId: value});
                          const doctor = mockDoctors.find(d => d.userId === value);
                          if (doctor) {
                            const schedule = mockDoctorSchedules.find(s => s.doctorId === value);
                            if (schedule) {
                              setSelectedDoctorSchedule(schedule);
                            }
                          }
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Doctor" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockDoctors
                            .filter(doc => !bookingForm.departmentId || doc.departmentId === bookingForm.departmentId)
                            .map(doc => (
                              <SelectItem key={doc.userId} value={doc.userId}>
                                {doc.firstName} {doc.lastName} - {doc.specialization}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Appointment Type</Label>
                    <Select 
                      value={bookingForm.appointmentType} 
                      onValueChange={(v: Appointment['appointmentType']) => 
                        setBookingForm({...bookingForm, appointmentType: v})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Consultation">Consultation</SelectItem>
                        <SelectItem value="Follow-up">Follow-up</SelectItem>
                        <SelectItem value="Emergency">Emergency</SelectItem>
                        <SelectItem value="Routine-Checkup">Routine Checkup</SelectItem>
                        <SelectItem value="Vaccination">Vaccination</SelectItem>
                        <SelectItem value="Health-Checkup">Health Checkup</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Visit Type</Label>
                    <Select 
                      value={bookingForm.visitType} 
                      onValueChange={(v: Appointment['visitType']) => 
                        setBookingForm({...bookingForm, visitType: v})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="First-Visit">First Visit</SelectItem>
                        <SelectItem value="Follow-Up">Follow-up</SelectItem>
                        <SelectItem value="Emergency">Emergency</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Chief Complaint / Reason for Visit</Label>
                  <Textarea
                    value={bookingForm.chiefComplaint}
                    onChange={(e) => setBookingForm({...bookingForm, chiefComplaint: e.target.value})}
                    placeholder="Describe symptoms or reason for consultation"
                    rows={3}
                  />
                </div>
              </div>

              <Separator />

              {/* Payment Details */}
              <div className="space-y-4">
                <Label className="font-semibold">Payment Details</Label>
                <Alert>
                  <IndianRupee className="h-4 w-4" />
                  <AlertDescription>
                    <div className="flex items-center justify-between">
                      <span>Consultation Fee:</span>
                      <span className="font-semibold">₹{calculateFee()}</span>
                    </div>
                  </AlertDescription>
                </Alert>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Payment Method</Label>
                    <Select 
                      value={bookingForm.paymentMethod} 
                      onValueChange={(v) => setBookingForm({...bookingForm, paymentMethod: v})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Cash">Cash</SelectItem>
                        <SelectItem value="Card">Card</SelectItem>
                        <SelectItem value="UPI">UPI</SelectItem>
                        <SelectItem value="Net-Banking">Net Banking</SelectItem>
                        <SelectItem value="Insurance">Insurance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="applyDiscount"
                        checked={bookingForm.applyDiscount}
                        onCheckedChange={(checked) => 
                          setBookingForm({...bookingForm, applyDiscount: checked as boolean})
                        }
                      />
                      <Label htmlFor="applyDiscount">Apply Discount</Label>
                    </div>
                    {bookingForm.applyDiscount && (
                      <>
                        <Input
                          type="number"
                          placeholder="Discount amount"
                          value={bookingForm.discountAmount}
                          onChange={(e) => setBookingForm({
                            ...bookingForm, 
                            discountAmount: Number(e.target.value)
                          })}
                        />
                        <Input
                          placeholder="Discount reason"
                          value={bookingForm.discountReason}
                          onChange={(e) => setBookingForm({
                            ...bookingForm, 
                            discountReason: e.target.value
                          })}
                        />
                      </>
                    )}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Notification Preferences */}
              <div className="space-y-4">
                <Label className="font-semibold">Notification Preferences</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="sendSMS"
                      checked={bookingForm.sendSMS}
                      onCheckedChange={(checked) => 
                        setBookingForm({...bookingForm, sendSMS: checked as boolean})
                      }
                    />
                    <Label htmlFor="sendSMS" className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Send SMS Confirmation
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="sendWhatsApp"
                      checked={bookingForm.sendWhatsApp}
                      onCheckedChange={(checked) => 
                        setBookingForm({...bookingForm, sendWhatsApp: checked as boolean})
                      }
                    />
                    <Label htmlFor="sendWhatsApp" className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Send WhatsApp Confirmation
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="sendEmail"
                      checked={bookingForm.sendEmail}
                      onCheckedChange={(checked) => 
                        setBookingForm({...bookingForm, sendEmail: checked as boolean})
                      }
                    />
                    <Label htmlFor="sendEmail" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Send Email Confirmation
                    </Label>
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
      </div>
    </TooltipProvider>
  );
}