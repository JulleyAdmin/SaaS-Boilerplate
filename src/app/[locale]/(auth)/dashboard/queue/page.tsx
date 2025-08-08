'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarInitials } from '@/components/ui/avatar';
import { Clock, Users, Search, RefreshCw, Play, Pause, AlertCircle } from 'lucide-react';
import { useState } from 'react';

// Mock queue data
const queueData = {
  currentlyServing: 'A15',
  totalWaiting: 24,
  averageWaitTime: '15 mins',
  todayTokens: 142,
};

const departments = [
  { id: 'general', name: 'General Medicine', queue: 8, serving: 'A15' },
  { id: 'pediatrics', name: 'Pediatrics', queue: 5, serving: 'P12' },
  { id: 'cardiology', name: 'Cardiology', queue: 3, serving: 'C08' },
  { id: 'orthopedics', name: 'Orthopedics', queue: 6, serving: 'O21' },
  { id: 'dermatology', name: 'Dermatology', queue: 2, serving: 'D05' },
];

const waitingPatients = [
  { tokenNumber: 'A16', name: 'Rajesh Kumar', department: 'General Medicine', waitTime: '12 mins', status: 'waiting' },
  { tokenNumber: 'A17', name: 'Sunita Devi', department: 'General Medicine', waitTime: '25 mins', status: 'waiting' },
  { tokenNumber: 'P13', name: 'Baby Sharma', department: 'Pediatrics', waitTime: '8 mins', status: 'waiting' },
  { tokenNumber: 'C09', name: 'Amit Singh', department: 'Cardiology', waitTime: '18 mins', status: 'waiting' },
  { tokenNumber: 'A18', name: 'Priya Verma', department: 'General Medicine', waitTime: '30 mins', status: 'waiting' },
  { tokenNumber: 'O22', name: 'Mohammed Ali', department: 'Orthopedics', waitTime: '15 mins', status: 'waiting' },
];

const recentlyCompleted = [
  { tokenNumber: 'A14', name: 'Geeta Patel', department: 'General Medicine', completedAt: '2:45 PM' },
  { tokenNumber: 'P11', name: 'Ravi Kumar', department: 'Pediatrics', completedAt: '2:40 PM' },
  { tokenNumber: 'C07', name: 'Sita Sharma', department: 'Cardiology', completedAt: '2:35 PM' },
];

export default function QueueManagementPage() {
  const [searchToken, setSearchToken] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  const filteredPatients = waitingPatients.filter(patient => 
    (selectedDepartment === 'all' || patient.department.toLowerCase().includes(selectedDepartment)) &&
    (patient.tokenNumber.toLowerCase().includes(searchToken.toLowerCase()) || 
     patient.name.toLowerCase().includes(searchToken.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Queue Management</h1>
          <p className="text-muted-foreground">Manage patient queues and token systems</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <RefreshCw className="mr-2 size-4" />
            Refresh
          </Button>
          <Button>
            <Play className="mr-2 size-4" />
            Call Next
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Currently Serving</CardTitle>
            <Play className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{queueData.currentlyServing}</div>
            <p className="text-xs text-muted-foreground">General Medicine</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Waiting</CardTitle>
            <Users className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{queueData.totalWaiting}</div>
            <p className="text-xs text-muted-foreground">Across all departments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Wait Time</CardTitle>
            <Clock className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{queueData.averageWaitTime}</div>
            <p className="text-xs text-muted-foreground">Current estimate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Tokens</CardTitle>
            <AlertCircle className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{queueData.todayTokens}</div>
            <p className="text-xs text-muted-foreground">Generated today</p>
          </CardContent>
        </Card>
      </div>

      {/* Department Status */}
      <Card>
        <CardHeader>
          <CardTitle>Department Queue Status</CardTitle>
          <CardDescription>Real-time queue status across all departments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {departments.map(dept => (
              <div key={dept.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">{dept.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    Serving: {dept.serving}
                  </p>
                </div>
                <div className="text-right">
                  <Badge variant="secondary">{dept.queue} waiting</Badge>
                  <div className="flex gap-2 mt-2">
                    <Button size="sm" variant="outline">Call Next</Button>
                    <Button size="sm" variant="ghost">
                      <Pause className="size-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                <Input
                  placeholder="Search by token number or patient name..."
                  value={searchToken}
                  onChange={(e) => setSearchToken(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="general">General Medicine</SelectItem>
                <SelectItem value="pediatrics">Pediatrics</SelectItem>
                <SelectItem value="cardiology">Cardiology</SelectItem>
                <SelectItem value="orthopedics">Orthopedics</SelectItem>
                <SelectItem value="dermatology">Dermatology</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Queue Tables */}
      <Tabs defaultValue="waiting" className="space-y-4">
        <TabsList>
          <TabsTrigger value="waiting">Waiting Queue</TabsTrigger>
          <TabsTrigger value="completed">Recently Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="waiting">
          <Card>
            <CardHeader>
              <CardTitle>Waiting Patients</CardTitle>
              <CardDescription>Patients currently waiting in the queue</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredPatients.map(patient => (
                  <div key={patient.tokenNumber} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Avatar className="size-10">
                        <AvatarFallback>
                          <AvatarInitials name={patient.name} />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium">{patient.tokenNumber}</h4>
                          <Badge variant="outline">{patient.status}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {patient.name} • {patient.department}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">Waiting: {patient.waitTime}</p>
                      <div className="flex gap-2 mt-2">
                        <Button size="sm" variant="default">Call Now</Button>
                        <Button size="sm" variant="outline">Skip</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed">
          <Card>
            <CardHeader>
              <CardTitle>Recently Completed</CardTitle>
              <CardDescription>Patients who have been served recently</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentlyCompleted.map(patient => (
                  <div key={patient.tokenNumber} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Avatar className="size-10">
                        <AvatarFallback>
                          <AvatarInitials name={patient.name} />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium">{patient.tokenNumber}</h4>
                          <Badge variant="default">Completed</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {patient.name} • {patient.department}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">Completed: {patient.completedAt}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}