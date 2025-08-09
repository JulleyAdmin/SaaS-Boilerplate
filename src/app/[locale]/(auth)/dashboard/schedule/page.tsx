'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CalendarDays, 
  Clock, 
  Download, 
  Filter, 
  Plus, 
  Users,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';

const scheduleData = {
  today: [
    { time: '09:00 AM', task: 'Morning Briefing', location: 'Conference Room A', status: 'completed' },
    { time: '10:30 AM', task: 'Department Meeting', location: 'Main Office', status: 'completed' },
    { time: '02:00 PM', task: 'Training Session', location: 'Training Room', status: 'upcoming' },
    { time: '04:00 PM', task: 'Patient Records Review', location: 'Records Office', status: 'upcoming' },
  ],
  week: [
    { day: 'Monday', shifts: '9:00 AM - 6:00 PM', type: 'Regular' },
    { day: 'Tuesday', shifts: '9:00 AM - 6:00 PM', type: 'Regular' },
    { day: 'Wednesday', shifts: '9:00 AM - 6:00 PM', type: 'Regular' },
    { day: 'Thursday', shifts: '9:00 AM - 6:00 PM', type: 'Regular' },
    { day: 'Friday', shifts: '9:00 AM - 6:00 PM', type: 'Regular' },
    { day: 'Saturday', shifts: '9:00 AM - 1:00 PM', type: 'Half Day' },
    { day: 'Sunday', shifts: 'Off', type: 'Holiday' },
  ],
  upcoming: [
    { date: '2025-08-10', event: 'Annual Health Checkup', time: '10:00 AM', priority: 'high' },
    { date: '2025-08-12', event: 'Fire Safety Training', time: '3:00 PM', priority: 'medium' },
    { date: '2025-08-15', event: 'Independence Day Celebration', time: '9:00 AM', priority: 'low' },
    { date: '2025-08-20', event: 'Monthly Review Meeting', time: '2:00 PM', priority: 'high' },
  ]
};

export default function SchedulePage() {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [view, setView] = useState('day');

  const handleExportSchedule = () => {
    toast({
      title: "Schedule Exported",
      description: "Your schedule has been downloaded as PDF",
    });
  };

  const handleRequestChange = () => {
    toast({
      title: "Request Submitted",
      description: "Your schedule change request has been sent to HR",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500">Completed</Badge>;
      case 'upcoming':
        return <Badge className="bg-blue-500">Upcoming</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive">High Priority</Badge>;
      case 'medium':
        return <Badge variant="default">Medium</Badge>;
      case 'low':
        return <Badge variant="secondary">Low</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Schedule</h1>
          <p className="text-muted-foreground">View and manage your work schedule and appointments</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRequestChange}>
            <Plus className="mr-2 size-4" />
            Request Change
          </Button>
          <Button onClick={handleExportSchedule}>
            <Download className="mr-2 size-4" />
            Export Schedule
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Tasks</CardTitle>
            <CalendarDays className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">2 completed, 2 pending</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weekly Hours</CardTitle>
            <Clock className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">48</div>
            <p className="text-xs text-muted-foreground">Standard schedule</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Leave Balance</CardTitle>
            <Users className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Days remaining</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Holiday</CardTitle>
            <AlertCircle className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Aug 15</div>
            <p className="text-xs text-muted-foreground">Independence Day</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Calendar */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
            <CardDescription>Select a date to view schedule</CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        {/* Schedule View */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Schedule Details</CardTitle>
            <CardDescription>Your work schedule and appointments</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="today" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="today">Today</TabsTrigger>
                <TabsTrigger value="week">This Week</TabsTrigger>
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              </TabsList>

              <TabsContent value="today" className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground">
                  {new Date().toLocaleDateString('en-IN', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </h3>
                {scheduleData.today.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center size-10 bg-muted rounded-full">
                        <Clock className="size-5" />
                      </div>
                      <div>
                        <p className="font-medium">{item.task}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.time} • {item.location}
                        </p>
                      </div>
                    </div>
                    {getStatusBadge(item.status)}
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="week" className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground">Weekly Schedule</h3>
                {scheduleData.week.map((day, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{day.day}</p>
                      <p className="text-sm text-muted-foreground">{day.shifts}</p>
                    </div>
                    <Badge variant={day.type === 'Holiday' ? 'secondary' : 'outline'}>
                      {day.type}
                    </Badge>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="upcoming" className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground">Upcoming Events</h3>
                {scheduleData.upcoming.map((event, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{event.event}</p>
                      <p className="text-sm text-muted-foreground">
                        {event.date} • {event.time}
                      </p>
                    </div>
                    {getPriorityBadge(event.priority)}
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Additional Info */}
      <Card>
        <CardHeader>
          <CardTitle>Schedule Policies</CardTitle>
          <CardDescription>Important information about scheduling</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-start space-x-2">
                <CheckCircle className="size-5 text-green-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Shift Timing</p>
                  <p className="text-xs text-muted-foreground">
                    Regular shift: 9:00 AM - 6:00 PM (Mon-Fri)
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle className="size-5 text-green-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Break Time</p>
                  <p className="text-xs text-muted-foreground">
                    Lunch: 1:00 PM - 2:00 PM, Tea: 4:00 PM - 4:15 PM
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-start space-x-2">
                <AlertCircle className="size-5 text-orange-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Leave Request</p>
                  <p className="text-xs text-muted-foreground">
                    Submit at least 3 days in advance
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <AlertCircle className="size-5 text-orange-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Shift Exchange</p>
                  <p className="text-xs text-muted-foreground">
                    Requires approval from supervisor
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}