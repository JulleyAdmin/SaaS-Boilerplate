'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Calendar,
  Clock,
  Users,
  Plus,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  Download,
  Filter,
  Search,
  Briefcase,
  Home,
  Heart,
  Stethoscope,
} from 'lucide-react';

const StaffLeaveManagementPage: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');

  // Mock leave requests data
  const leaveRequests = [
    {
      id: 1,
      employeeName: 'Dr. Rajesh Kumar',
      employeeId: 'EMP001',
      department: 'Cardiology',
      leaveType: 'Medical Leave',
      startDate: '2024-12-28',
      endDate: '2024-12-30',
      days: 3,
      reason: 'Personal medical appointment and recovery',
      status: 'pending',
      appliedOn: '2024-12-20',
      coverageArranged: true,
      coveringStaff: 'Dr. Amit Shah',
    },
    {
      id: 2,
      employeeName: 'Nurse Priya Sharma',
      employeeId: 'EMP045',
      department: 'ICU',
      leaveType: 'Annual Leave',
      startDate: '2025-01-02',
      endDate: '2025-01-05',
      days: 4,
      reason: 'Family vacation',
      status: 'pending',
      appliedOn: '2024-12-18',
      coverageArranged: false,
      coveringStaff: null,
    },
    {
      id: 3,
      employeeName: 'Dr. Mohammed Ali',
      employeeId: 'EMP023',
      department: 'Emergency',
      leaveType: 'Emergency Leave',
      startDate: '2024-12-26',
      endDate: '2024-12-26',
      days: 1,
      reason: 'Family emergency',
      status: 'approved',
      appliedOn: '2024-12-25',
      approvedBy: 'Dr. Sanjay Gupta',
      approvedOn: '2024-12-25',
      coverageArranged: true,
      coveringStaff: 'Dr. Vikram Singh',
    },
    {
      id: 4,
      employeeName: 'Technician Suresh Patel',
      employeeId: 'EMP078',
      department: 'Laboratory',
      leaveType: 'Casual Leave',
      startDate: '2024-12-24',
      endDate: '2024-12-24',
      days: 1,
      reason: 'Personal work',
      status: 'rejected',
      appliedOn: '2024-12-22',
      rejectedBy: 'Lab Manager',
      rejectedOn: '2024-12-22',
      rejectionReason: 'Insufficient staff coverage during peak period',
    },
    {
      id: 5,
      employeeName: 'Nurse Fatima Khan',
      employeeId: 'EMP056',
      department: 'Pediatrics',
      leaveType: 'Maternity Leave',
      startDate: '2025-01-15',
      endDate: '2025-04-15',
      days: 90,
      reason: 'Maternity leave as per policy',
      status: 'approved',
      appliedOn: '2024-12-01',
      approvedBy: 'HR Manager',
      approvedOn: '2024-12-02',
      coverageArranged: true,
      coveringStaff: 'Temporary staff arrangement',
    },
  ];

  // Leave balance data
  const leaveBalances = [
    { type: 'Annual Leave', total: 21, used: 8, remaining: 13 },
    { type: 'Medical Leave', total: 10, used: 3, remaining: 7 },
    { type: 'Casual Leave', total: 7, used: 5, remaining: 2 },
    { type: 'Emergency Leave', total: 5, used: 1, remaining: 4 },
  ];

  // Statistics
  const stats = {
    pendingRequests: 2,
    approvedThisMonth: 12,
    rejectedThisMonth: 3,
    onLeaveToday: 5,
    upcomingLeaves: 8,
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getLeaveTypeIcon = (type: string) => {
    switch(type) {
      case 'Medical Leave':
        return <Stethoscope className="w-4 h-4" />;
      case 'Annual Leave':
        return <Briefcase className="w-4 h-4" />;
      case 'Emergency Leave':
        return <AlertCircle className="w-4 h-4" />;
      case 'Maternity Leave':
        return <Heart className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  const filteredRequests = leaveRequests.filter(request => {
    const matchesSearch = request.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = filterDepartment === 'all' || request.department === filterDepartment;
    const matchesTab = selectedTab === 'all' || request.status === selectedTab;
    return matchesSearch && matchesDepartment && matchesTab;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Leave Management</h1>
          <p className="text-gray-600 mt-1">Manage staff leave requests and balances</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Apply Leave
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Requests</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pendingRequests}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Approved (Month)</p>
                <p className="text-2xl font-bold text-green-600">{stats.approvedThisMonth}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Rejected (Month)</p>
                <p className="text-2xl font-bold text-red-600">{stats.rejectedThisMonth}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">On Leave Today</p>
                <p className="text-2xl font-bold">{stats.onLeaveToday}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Upcoming Leaves</p>
                <p className="text-2xl font-bold">{stats.upcomingLeaves}</p>
              </div>
              <Calendar className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Leave Balance Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Leave Balance Overview</CardTitle>
          <CardDescription>Organization-wide leave balance summary</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {leaveBalances.map((balance, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{balance.type}</span>
                  <span className="text-sm text-gray-600">{balance.remaining}/{balance.total}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-cyan-500 h-2 rounded-full"
                    style={{ width: `${(balance.used / balance.total) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between mt-2 text-xs text-gray-600">
                  <span>Used: {balance.used}</span>
                  <span>Available: {balance.remaining}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by name or employee ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
              />
            </div>
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="px-4 py-2 border rounded-lg"
            >
              <option value="all">All Departments</option>
              <option value="Emergency">Emergency</option>
              <option value="ICU">ICU</option>
              <option value="Cardiology">Cardiology</option>
              <option value="Pediatrics">Pediatrics</option>
              <option value="Laboratory">Laboratory</option>
            </select>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Leave Requests Table */}
      <Card>
        <CardHeader>
          <CardTitle>Leave Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="pending">Pending ({leaveRequests.filter(r => r.status === 'pending').length})</TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
              <TabsTrigger value="all">All Requests</TabsTrigger>
            </TabsList>

            <TabsContent value={selectedTab} className="mt-4">
              <div className="space-y-4">
                {filteredRequests.map((request) => (
                  <div key={request.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div>
                            <p className="font-semibold">{request.employeeName}</p>
                            <p className="text-sm text-gray-600">{request.employeeId} • {request.department}</p>
                          </div>
                          {getStatusBadge(request.status)}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-3">
                          <div className="flex items-center gap-2">
                            {getLeaveTypeIcon(request.leaveType)}
                            <div>
                              <p className="text-xs text-gray-600">Leave Type</p>
                              <p className="text-sm font-medium">{request.leaveType}</p>
                            </div>
                          </div>
                          
                          <div>
                            <p className="text-xs text-gray-600">Duration</p>
                            <p className="text-sm font-medium">
                              {request.startDate} to {request.endDate} ({request.days} days)
                            </p>
                          </div>
                          
                          <div>
                            <p className="text-xs text-gray-600">Reason</p>
                            <p className="text-sm">{request.reason}</p>
                          </div>
                          
                          <div>
                            <p className="text-xs text-gray-600">Coverage</p>
                            <p className="text-sm">
                              {request.coverageArranged ? (
                                <span className="text-green-600">✓ {request.coveringStaff}</span>
                              ) : (
                                <span className="text-red-600">✗ Not arranged</span>
                              )}
                            </p>
                          </div>
                        </div>

                        {request.status === 'approved' && (
                          <p className="text-xs text-gray-500 mt-2">
                            Approved by {request.approvedBy} on {request.approvedOn}
                          </p>
                        )}
                        
                        {request.status === 'rejected' && (
                          <p className="text-xs text-red-600 mt-2">
                            Rejected: {request.rejectionReason}
                          </p>
                        )}
                      </div>
                      
                      {request.status === 'pending' && (
                        <div className="flex gap-2">
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                          <Button size="sm" variant="outline" className="text-red-600 hover:bg-red-50">
                            <XCircle className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {filteredRequests.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>No leave requests found</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default StaffLeaveManagementPage;