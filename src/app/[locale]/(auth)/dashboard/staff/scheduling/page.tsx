'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  Clock,
  Users,
  Plus,
  Edit,
  Copy,
  Download,
  Filter,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  UserCheck,
  Settings,
} from 'lucide-react';

const StaffSchedulingPage: React.FC = () => {
  const [selectedWeek, setSelectedWeek] = useState(new Date());
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [viewMode, setViewMode] = useState('week');

  // Mock staff schedule data
  const scheduleData = [
    {
      id: 1,
      name: 'Dr. Rajesh Kumar',
      role: 'Senior Doctor',
      department: 'Emergency',
      shifts: {
        Mon: { start: '08:00', end: '16:00', type: 'day' },
        Tue: { start: '08:00', end: '16:00', type: 'day' },
        Wed: { start: '16:00', end: '00:00', type: 'evening' },
        Thu: { start: '16:00', end: '00:00', type: 'evening' },
        Fri: { start: '08:00', end: '16:00', type: 'day' },
        Sat: null,
        Sun: null,
      }
    },
    {
      id: 2,
      name: 'Dr. Priya Sharma',
      role: 'Doctor',
      department: 'ICU',
      shifts: {
        Mon: { start: '00:00', end: '08:00', type: 'night' },
        Tue: { start: '00:00', end: '08:00', type: 'night' },
        Wed: null,
        Thu: { start: '08:00', end: '16:00', type: 'day' },
        Fri: { start: '08:00', end: '16:00', type: 'day' },
        Sat: { start: '08:00', end: '16:00', type: 'day' },
        Sun: null,
      }
    },
    {
      id: 3,
      name: 'Nurse Fatima Khan',
      role: 'Head Nurse',
      department: 'General Ward',
      shifts: {
        Mon: { start: '08:00', end: '20:00', type: 'long' },
        Tue: null,
        Wed: { start: '08:00', end: '20:00', type: 'long' },
        Thu: null,
        Fri: { start: '08:00', end: '20:00', type: 'long' },
        Sat: null,
        Sun: { start: '08:00', end: '16:00', type: 'day' },
      }
    },
    {
      id: 4,
      name: 'Dr. Amit Verma',
      role: 'Surgeon',
      department: 'Surgery',
      shifts: {
        Mon: { start: '06:00', end: '14:00', type: 'morning' },
        Tue: { start: '06:00', end: '14:00', type: 'morning' },
        Wed: { start: '06:00', end: '14:00', type: 'morning' },
        Thu: { start: '06:00', end: '14:00', type: 'morning' },
        Fri: { start: '06:00', end: '14:00', type: 'morning' },
        Sat: null,
        Sun: null,
      }
    },
    {
      id: 5,
      name: 'Nurse Geeta Patel',
      role: 'Staff Nurse',
      department: 'Pediatrics',
      shifts: {
        Mon: { start: '14:00', end: '22:00', type: 'afternoon' },
        Tue: { start: '14:00', end: '22:00', type: 'afternoon' },
        Wed: { start: '14:00', end: '22:00', type: 'afternoon' },
        Thu: null,
        Fri: null,
        Sat: { start: '08:00', end: '16:00', type: 'day' },
        Sun: { start: '08:00', end: '16:00', type: 'day' },
      }
    },
  ];

  const departments = ['All Departments', 'Emergency', 'ICU', 'General Ward', 'Surgery', 'Pediatrics', 'OPD'];
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const getShiftColor = (type: string) => {
    switch(type) {
      case 'day': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'evening': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'night': return 'bg-indigo-100 text-indigo-800 border-indigo-300';
      case 'morning': return 'bg-green-100 text-green-800 border-green-300';
      case 'afternoon': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'long': return 'bg-purple-100 text-purple-800 border-purple-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const stats = {
    totalStaff: 156,
    onDuty: 48,
    onLeave: 8,
    overtime: 12,
    understaffed: 3,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Staff Scheduling</h1>
          <p className="text-gray-600 mt-1">Manage staff shifts and duty rosters</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Copy className="w-4 h-4 mr-2" />
            Copy Week
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Shift
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Staff</p>
                <p className="text-2xl font-bold">{stats.totalStaff}</p>
              </div>
              <Users className="w-8 h-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">On Duty</p>
                <p className="text-2xl font-bold text-green-600">{stats.onDuty}</p>
              </div>
              <UserCheck className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">On Leave</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.onLeave}</p>
              </div>
              <Calendar className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Overtime</p>
                <p className="text-2xl font-bold text-orange-600">{stats.overtime}</p>
              </div>
              <Clock className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Understaffed</p>
                <p className="text-2xl font-bold text-red-600">{stats.understaffed}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex gap-4 items-center">
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="px-3 py-2 border rounded-lg"
              >
                {departments.map(dept => (
                  <option key={dept} value={dept.toLowerCase().replace(' ', '-')}>
                    {dept}
                  </option>
                ))}
              </select>
              
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="px-4 py-2 font-medium">
                  Dec 23 - Dec 29, 2024
                </span>
                <Button variant="outline" size="sm">
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex gap-2">
                <Button 
                  variant={viewMode === 'week' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setViewMode('week')}
                >
                  Week
                </Button>
                <Button 
                  variant={viewMode === 'month' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setViewMode('month')}
                >
                  Month
                </Button>
              </div>
            </div>

            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Schedule Settings
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Schedule Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Schedule</CardTitle>
          <CardDescription>Staff shift assignments for the current week</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium">Staff Member</th>
                  <th className="text-left p-3 font-medium">Role</th>
                  <th className="text-left p-3 font-medium">Dept</th>
                  {days.map(day => (
                    <th key={day} className="text-center p-3 font-medium min-w-[100px]">
                      {day}
                    </th>
                  ))}
                  <th className="text-center p-3 font-medium">Hours</th>
                </tr>
              </thead>
              <tbody>
                {scheduleData.map((staff) => {
                  const totalHours = Object.values(staff.shifts).reduce((sum, shift) => {
                    if (!shift) return sum;
                    const start = parseInt(shift.start.split(':')[0]);
                    const end = parseInt(shift.end.split(':')[0]);
                    return sum + (end > start ? end - start : 24 - start + end);
                  }, 0);

                  return (
                    <tr key={staff.id} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium">{staff.name}</td>
                      <td className="p-3">
                        <Badge variant="outline">{staff.role}</Badge>
                      </td>
                      <td className="p-3 text-sm text-gray-600">{staff.department}</td>
                      {days.map(day => {
                        const shift = staff.shifts[day as keyof typeof staff.shifts];
                        return (
                          <td key={day} className="p-2">
                            {shift ? (
                              <div className={`text-center p-2 rounded-lg border ${getShiftColor(shift.type)}`}>
                                <div className="text-xs font-medium">
                                  {shift.start} - {shift.end}
                                </div>
                              </div>
                            ) : (
                              <div className="text-center p-2 text-gray-400">-</div>
                            )}
                          </td>
                        );
                      })}
                      <td className="p-3 text-center">
                        <span className={`font-semibold ${totalHours > 48 ? 'text-red-600' : 'text-gray-700'}`}>
                          {totalHours}h
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Shift Legend */}
          <div className="mt-6 flex gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-blue-100 border border-blue-300"></div>
              <span className="text-sm">Day Shift (8AM-4PM)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-orange-100 border border-orange-300"></div>
              <span className="text-sm">Evening Shift (4PM-12AM)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-indigo-100 border border-indigo-300"></div>
              <span className="text-sm">Night Shift (12AM-8AM)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-purple-100 border border-purple-300"></div>
              <span className="text-sm">Long Shift (12 hours)</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Department Coverage Alert */}
      <Card className="border-yellow-200 bg-yellow-50">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600" />
            <div>
              <p className="font-medium text-yellow-900">Staffing Alert</p>
              <p className="text-sm text-yellow-700">
                Emergency department is understaffed on Wednesday night shift. Consider reassigning staff or approving overtime.
              </p>
            </div>
            <Button size="sm" variant="outline" className="ml-auto">
              View Details
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StaffSchedulingPage;