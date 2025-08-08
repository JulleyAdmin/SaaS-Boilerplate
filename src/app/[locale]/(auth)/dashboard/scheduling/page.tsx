'use client';

import { Calendar, Clock, Filter, Plus, Search, User, Users } from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function SchedulingPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  // Mock data for scheduling
  const schedules = [
    {
      scheduleId: 'SCH-2024-001',
      doctorName: 'Dr. Sarah Wilson',
      department: 'Cardiology',
      specialization: 'Interventional Cardiology',
      date: '2024-01-15',
      timeSlots: [
        { time: '09:00', duration: 30, status: 'available', patientName: null },
        { time: '09:30', duration: 30, status: 'booked', patientName: 'Rajesh Kumar', appointmentId: 'APT-001' },
        { time: '10:00', duration: 30, status: 'booked', patientName: 'Priya Sharma', appointmentId: 'APT-002' },
        { time: '10:30', duration: 30, status: 'break', patientName: null },
        { time: '11:00', duration: 30, status: 'available', patientName: null },
        { time: '11:30', duration: 30, status: 'blocked', patientName: null },
        { time: '12:00', duration: 60, status: 'lunch', patientName: null },
        { time: '13:00', duration: 30, status: 'available', patientName: null },
        { time: '13:30', duration: 30, status: 'booked', patientName: 'Amit Patel', appointmentId: 'APT-003' },
        { time: '14:00', duration: 30, status: 'available', patientName: null },
        { time: '14:30', duration: 30, status: 'available', patientName: null },
        { time: '15:00', duration: 30, status: 'booked', patientName: 'Sunita Devi', appointmentId: 'APT-004' },
      ],
      location: 'Block A, Room 301',
      totalSlots: 12,
      bookedSlots: 4,
      availableSlots: 5,
    },
    {
      scheduleId: 'SCH-2024-002',
      doctorName: 'Dr. Michael Brown',
      department: 'Orthopedics',
      specialization: 'Joint Replacement',
      date: '2024-01-15',
      timeSlots: [
        { time: '08:00', duration: 45, status: 'booked', patientName: 'Vikram Singh', appointmentId: 'APT-005' },
        { time: '08:45', duration: 45, status: 'available', patientName: null },
        { time: '09:30', duration: 45, status: 'booked', patientName: 'Kavya Reddy', appointmentId: 'APT-006' },
        { time: '10:15', duration: 30, status: 'break', patientName: null },
        { time: '10:45', duration: 45, status: 'available', patientName: null },
        { time: '11:30', duration: 45, status: 'surgery', patientName: 'Major Surgery Block' },
        { time: '12:15', duration: 60, status: 'lunch', patientName: null },
        { time: '13:15', duration: 45, status: 'available', patientName: null },
        { time: '14:00', duration: 45, status: 'booked', patientName: 'Ravi Kumar', appointmentId: 'APT-007' },
        { time: '14:45', duration: 45, status: 'available', patientName: null },
      ],
      location: 'Block B, OR-2',
      totalSlots: 10,
      bookedSlots: 3,
      availableSlots: 4,
    },
    {
      scheduleId: 'SCH-2024-003',
      doctorName: 'Dr. Priya Sharma',
      department: 'Pediatrics',
      specialization: 'Neonatology',
      date: '2024-01-15',
      timeSlots: [
        { time: '09:00', duration: 20, status: 'booked', patientName: 'Baby Aisha', appointmentId: 'APT-008' },
        { time: '09:20', duration: 20, status: 'booked', patientName: 'Baby Rohit', appointmentId: 'APT-009' },
        { time: '09:40', duration: 20, status: 'available', patientName: null },
        { time: '10:00', duration: 20, status: 'available', patientName: null },
        { time: '10:20', duration: 20, status: 'booked', patientName: 'Baby Ananya', appointmentId: 'APT-010' },
        { time: '10:40', duration: 30, status: 'break', patientName: null },
        { time: '11:10', duration: 20, status: 'available', patientName: null },
        { time: '11:30', duration: 20, status: 'available', patientName: null },
        { time: '11:50', duration: 20, status: 'emergency', patientName: 'Emergency Reserve' },
        { time: '12:10', duration: 60, status: 'lunch', patientName: null },
        { time: '13:10', duration: 20, status: 'available', patientName: null },
        { time: '13:30', duration: 20, status: 'booked', patientName: 'Baby Krishna', appointmentId: 'APT-011' },
      ],
      location: 'Block C, Pediatric Wing',
      totalSlots: 12,
      bookedSlots: 4,
      availableSlots: 5,
    },
  ];

  const getSlotStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'default';
      case 'booked':
        return 'destructive';
      case 'break':
        return 'secondary';
      case 'lunch':
        return 'outline';
      case 'surgery':
        return 'destructive';
      case 'emergency':
        return 'warning';
      case 'blocked':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getSlotStatusText = (status: string) => {
    switch (status) {
      case 'available':
        return 'Available';
      case 'booked':
        return 'Booked';
      case 'break':
        return 'Break';
      case 'lunch':
        return 'Lunch';
      case 'surgery':
        return 'Surgery';
      case 'emergency':
        return 'Emergency';
      case 'blocked':
        return 'Blocked';
      default:
        return status;
    }
  };

  const filteredSchedules = schedules.filter(schedule => {
    const matchesSearch = schedule.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      schedule.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      schedule.specialization.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = selectedDepartment === 'all' || schedule.department === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Doctor Scheduling</h1>
          <p className="text-muted-foreground">
            Manage doctor schedules, appointments, and time slot availability
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="mr-2 size-4" />
            View Calendar
          </Button>
          <Button>
            <Plus className="mr-2 size-4" />
            Create Schedule
          </Button>
        </div>
      </div>

      {/* Schedule Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Doctors</CardTitle>
            <User className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              Scheduled today
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
            <Calendar className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">142</div>
            <p className="text-xs text-muted-foreground">
              Scheduled today
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Slots</CardTitle>
            <Clock className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">38</div>
            <p className="text-xs text-muted-foreground">
              Remaining today
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
            <Users className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78%</div>
            <p className="text-xs text-muted-foreground">
              Current utilization
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Schedule Management */}
      <Card>
        <CardHeader>
          <CardTitle>Doctor Schedules</CardTitle>
          <CardDescription>
            View and manage doctor schedules and appointment slots
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
              <Input
                placeholder="Search doctors, departments, or specializations..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Input
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              className="w-40"
            />
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="Cardiology">Cardiology</SelectItem>
                <SelectItem value="Orthopedics">Orthopedics</SelectItem>
                <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                <SelectItem value="Emergency Medicine">Emergency Medicine</SelectItem>
                <SelectItem value="Pathology">Pathology</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="mr-2 size-4" />
              Advanced Filters
            </Button>
          </div>

          <Tabs defaultValue="daily" className="w-full">
            <TabsList>
              <TabsTrigger value="daily">Daily View</TabsTrigger>
              <TabsTrigger value="weekly">Weekly View</TabsTrigger>
              <TabsTrigger value="monthly">Monthly View</TabsTrigger>
            </TabsList>

            <TabsContent value="daily" className="mt-6">
              <div className="space-y-6">
                {filteredSchedules.map(schedule => (
                  <div key={schedule.scheduleId} className="rounded-lg border p-6">
                    <div className="mb-4 flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-medium">{schedule.doctorName}</h3>
                          <Badge variant="outline">{schedule.department}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {schedule.specialization} • {schedule.location}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">Edit Schedule</Button>
                        <Button size="sm">Add Appointment</Button>
                      </div>
                    </div>

                    {/* Schedule Summary */}
                    <div className="mb-4 grid gap-4 md:grid-cols-3">
                      <div className="rounded-md bg-muted p-3">
                        <p className="mb-1 text-sm font-medium text-muted-foreground">Total Slots</p>
                        <p className="font-bold">{schedule.totalSlots}</p>
                      </div>
                      <div className="rounded-md bg-muted p-3">
                        <p className="mb-1 text-sm font-medium text-muted-foreground">Booked</p>
                        <p className="font-bold text-red-600">{schedule.bookedSlots}</p>
                      </div>
                      <div className="rounded-md bg-muted p-3">
                        <p className="mb-1 text-sm font-medium text-muted-foreground">Available</p>
                        <p className="font-bold text-green-600">{schedule.availableSlots}</p>
                      </div>
                    </div>

                    {/* Time Slots Grid */}
                    <div className="grid gap-2 md:grid-cols-6 lg:grid-cols-8">
                      {schedule.timeSlots.map((slot, index) => (
                        <div
                          key={index}
                          className={`rounded-md border p-2 text-center transition-colors hover:bg-accent ${
                            slot.status === 'available' ? 'cursor-pointer hover:bg-green-50' : ''
                          }`}
                        >
                          <div className="mb-1 text-sm font-medium">{slot.time}</div>
                          <Badge 
                            variant={getSlotStatusColor(slot.status) as any}
                            className="mb-1 text-xs"
                          >
                            {getSlotStatusText(slot.status)}
                          </Badge>
                          {slot.patientName && slot.status === 'booked' && (
                            <div className="text-xs text-muted-foreground truncate">
                              {slot.patientName}
                            </div>
                          )}
                          {slot.status === 'surgery' && (
                            <div className="text-xs text-muted-foreground">
                              Surgery Block
                            </div>
                          )}
                          <div className="text-xs text-muted-foreground">
                            {slot.duration}min
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="weekly" className="mt-6">
              <div className="rounded-lg border p-8 text-center">
                <Calendar className="mx-auto mb-4 size-12 text-muted-foreground" />
                <h3 className="mb-2 text-lg font-medium">Weekly Schedule View</h3>
                <p className="text-muted-foreground">
                  Weekly calendar view with doctor schedules across all departments
                </p>
                <Button className="mt-4" variant="outline">
                  Coming Soon
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="monthly" className="mt-6">
              <div className="rounded-lg border p-8 text-center">
                <Calendar className="mx-auto mb-4 size-12 text-muted-foreground" />
                <h3 className="mb-2 text-lg font-medium">Monthly Schedule View</h3>
                <p className="text-muted-foreground">
                  Monthly calendar overview with department-wise scheduling patterns
                </p>
                <Button className="mt-4" variant="outline">
                  Coming Soon
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common scheduling operations</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            <Button className="justify-start" variant="outline">
              <Plus className="mr-2 size-4" />
              Create New Schedule Template
            </Button>
            <Button className="justify-start" variant="outline">
              <Calendar className="mr-2 size-4" />
              Schedule Recurring Appointments
            </Button>
            <Button className="justify-start" variant="outline">
              <Clock className="mr-2 size-4" />
              Manage Break Times
            </Button>
            <Button className="justify-start" variant="outline">
              <Users className="mr-2 size-4" />
              View Department Coverage
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Schedule Conflicts</CardTitle>
            <CardDescription>Scheduling issues requiring attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Dr. Sarah Wilson - Double Booking</p>
                  <p className="text-xs text-muted-foreground">Today 2:00 PM - Two appointments scheduled</p>
                </div>
                <Button size="sm" variant="destructive">Resolve</Button>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Dr. Michael Brown - No Lunch Break</p>
                  <p className="text-xs text-muted-foreground">Tomorrow - Continuous 8-hour schedule</p>
                </div>
                <Button size="sm" variant="outline">Review</Button>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Orthopedics - Understaffed</p>
                  <p className="text-xs text-muted-foreground">This week - Only 2 doctors scheduled</p>
                </div>
                <Button size="sm" variant="outline">Reassign</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}