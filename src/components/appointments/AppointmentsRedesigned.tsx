'use client';

import React, { useState } from 'react';
import {
  DashboardLayout,
  MetricsRow,
  ContentGrid,
  DashboardSection,
} from '@/components/dashboard/DashboardLayout';
import {
  StandardMetricCard,
  ActionCard,
  AlertCard,
  QueueCard,
  StatsCard,
} from '@/components/dashboard/StandardCards';
import {
  StandardButton,
  ButtonGroup,
  StandardTabs,
  StandardBadge,
  EmptyState,
  StandardSearch,
  StandardSelect,
} from '@/components/dashboard/StandardUI';
import {
  Calendar,
  Clock,
  Users,
  UserPlus,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  Activity,
  Phone,
  Video,
  FileText,
  Filter,
  CalendarDays,
  Timer,
  UserCheck,
} from 'lucide-react';

const AppointmentsRedesigned: React.FC = () => {
  const [activeTab, setActiveTab] = useState('today');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock appointment statistics
  const stats = {
    todayTotal: 45,
    completed: 28,
    inProgress: 3,
    upcoming: 14,
    cancelled: 2,
    noShow: 1,
    averageWaitTime: 12,
    onTimePercentage: 87,
  };

  // Mock appointments data
  const todayAppointments = [
    {
      id: 'APT-2024-001',
      patientName: 'Rajesh Kumar',
      patientId: 'P-12345',
      age: 45,
      gender: 'M',
      time: '9:00 AM - 9:30 AM',
      type: 'Follow-up',
      department: 'Cardiology',
      doctor: 'Dr. Sarah Wilson',
      status: 'completed',
      roomNumber: '204',
      notes: 'Routine BP check',
      paymentStatus: 'paid',
    },
    {
      id: 'APT-2024-002',
      patientName: 'Priya Sharma',
      patientId: 'P-12346',
      age: 32,
      gender: 'F',
      time: '10:00 AM - 10:30 AM',
      type: 'Consultation',
      department: 'General Medicine',
      doctor: 'Dr. Michael Brown',
      status: 'in-progress',
      roomNumber: '102',
      notes: 'First consultation for migraine',
      paymentStatus: 'pending',
    },
    {
      id: 'APT-2024-003',
      patientName: 'Mohammed Ali',
      patientId: 'P-12347',
      age: 28,
      gender: 'M',
      time: '11:00 AM - 11:30 AM',
      type: 'Teleconsult',
      department: 'Dermatology',
      doctor: 'Dr. Priya Patel',
      status: 'upcoming',
      roomNumber: 'Virtual',
      notes: 'Skin condition follow-up',
      paymentStatus: 'paid',
    },
    {
      id: 'APT-2024-004',
      patientName: 'Sunita Rao',
      patientId: 'P-12348',
      age: 55,
      gender: 'F',
      time: '2:00 PM - 2:45 PM',
      type: 'Procedure',
      department: 'Orthopedics',
      doctor: 'Dr. Ahmed Khan',
      status: 'scheduled',
      roomNumber: 'OT-3',
      notes: 'Knee injection procedure',
      paymentStatus: 'insurance',
    },
  ];

  const upcomingAppointments = [
    {
      id: 'APT-2024-101',
      patientName: 'Vikram Singh',
      date: 'Tomorrow',
      time: '10:00 AM',
      department: 'Neurology',
      doctor: 'Dr. Raj Khanna',
      type: 'Consultation',
    },
    {
      id: 'APT-2024-102',
      patientName: 'Meera Patel',
      date: 'Dec 28, 2024',
      time: '3:00 PM',
      department: 'Gynecology',
      doctor: 'Dr. Anjali Mehta',
      type: 'Follow-up',
    },
    {
      id: 'APT-2024-103',
      patientName: 'Amit Verma',
      date: 'Dec 29, 2024',
      time: '11:30 AM',
      department: 'Cardiology',
      doctor: 'Dr. Sarah Wilson',
      type: 'Annual Checkup',
    },
  ];

  const systemAlerts = [
    {
      id: '1',
      label: 'Overbooking Alert',
      description: 'Dr. Wilson has 3 overlapping appointments at 2 PM',
      type: 'error' as const,
      action: () => console.log('Reschedule'),
      actionLabel: 'Reschedule',
    },
    {
      id: '2',
      label: 'Cancellation',
      description: '2 appointments cancelled for tomorrow',
      type: 'warning' as const,
      action: () => console.log('View'),
      actionLabel: 'View Details',
    },
    {
      id: '3',
      label: 'Reminder Sent',
      description: 'SMS reminders sent to 14 patients for tomorrow',
      type: 'info' as const,
      action: () => console.log('View log'),
      actionLabel: 'View Log',
    },
  ];

  const tabs = [
    { id: 'today', label: "Today's Schedule", badge: stats.todayTotal, icon: Calendar },
    { id: 'upcoming', label: 'Upcoming', badge: 23, icon: CalendarDays },
    { id: 'waitlist', label: 'Wait List', badge: 5, icon: Clock },
    { id: 'history', label: 'History', icon: FileText },
  ];

  const quickActions = [
    {
      label: 'New Appointment',
      icon: UserPlus,
      onClick: () => console.log('New appointment'),
      variant: 'primary' as const,
    },
    {
      label: 'Check-In Patient',
      icon: UserCheck,
      onClick: () => console.log('Check-in'),
      variant: 'secondary' as const,
    },
    {
      label: 'Reschedule',
      icon: Calendar,
      onClick: () => console.log('Reschedule'),
      variant: 'secondary' as const,
    },
    {
      label: 'Send Reminders',
      icon: Phone,
      onClick: () => console.log('Send reminders'),
      variant: 'secondary' as const,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'in-progress':
        return 'warning';
      case 'upcoming':
      case 'scheduled':
        return 'info';
      case 'cancelled':
        return 'danger';
      case 'no-show':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  const getPaymentBadge = (paymentStatus: string) => {
    switch (paymentStatus) {
      case 'paid':
        return <StandardBadge variant="success" size="sm">Paid</StandardBadge>;
      case 'pending':
        return <StandardBadge variant="warning" size="sm">Payment Pending</StandardBadge>;
      case 'insurance':
        return <StandardBadge variant="info" size="sm">Insurance</StandardBadge>;
      default:
        return null;
    }
  };

  return (
    <DashboardLayout
      title="Appointment Management"
      subtitle="Schedule and manage patient appointments"
      breadcrumbs={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Appointments' },
      ]}
      actions={
        <ButtonGroup>
          <StandardButton
            variant="secondary"
            icon={FileText}
            onClick={() => console.log('Export')}
          >
            Export Schedule
          </StandardButton>
          <StandardButton
            variant="primary"
            icon={UserPlus}
            onClick={() => console.log('New appointment')}
          >
            New Appointment
          </StandardButton>
        </ButtonGroup>
      }
    >
      {/* Appointment Metrics */}
      <DashboardSection fullWidth>
        <MetricsRow columns={4}>
          <StandardMetricCard
            label="Today's Appointments"
            value={stats.todayTotal}
            icon={Calendar}
            color="primary"
            subtitle={`${stats.completed} completed`}
          />
          <StandardMetricCard
            label="In Progress"
            value={stats.inProgress}
            icon={Activity}
            color="warning"
            subtitle="Currently active"
          />
          <StandardMetricCard
            label="Upcoming Today"
            value={stats.upcoming}
            icon={Clock}
            color="info"
            subtitle="Scheduled"
          />
          <StandardMetricCard
            label="On-Time Rate"
            value={`${stats.onTimePercentage}%`}
            icon={CheckCircle}
            color="success"
            trend={{ value: 5, direction: 'up' }}
          />
        </MetricsRow>
      </DashboardSection>

      {/* Secondary Metrics */}
      <DashboardSection fullWidth>
        <MetricsRow columns={4}>
          <StandardMetricCard
            label="Avg Wait Time"
            value={`${stats.averageWaitTime} min`}
            icon={Timer}
            color="secondary"
            trend={{ value: 3, direction: 'down' }}
          />
          <StandardMetricCard
            label="Cancellations"
            value={stats.cancelled}
            icon={XCircle}
            color="error"
            subtitle="Today"
          />
          <StandardMetricCard
            label="No Shows"
            value={stats.noShow}
            icon={AlertCircle}
            color="warning"
            subtitle="Today"
          />
          <StandardMetricCard
            label="Tomorrow's Schedule"
            value={23}
            icon={CalendarDays}
            color="secondary"
            subtitle="Appointments"
          />
        </MetricsRow>
      </DashboardSection>

      {/* Main Content */}
      <ContentGrid
        sidebar={
          <div className="space-y-6">
            {/* Quick Actions */}
            <ActionCard
              title="Quick Actions"
              icon={Activity}
              actions={quickActions}
            />

            {/* System Alerts */}
            <AlertCard title="Schedule Alerts" items={systemAlerts} />

            {/* Department Load */}
            <StatsCard
              title="Department Load"
              value={15}
              total={20}
              unit="slots filled"
              icon={Users}
              color="primary"
            />
          </div>
        }
      >
        {/* Appointments Card */}
        <div className="card-base">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Appointment Schedule</h2>
                <p className="text-sm text-gray-600">Manage daily appointments and scheduling</p>
              </div>
              <StandardButton variant="primary" icon={UserPlus} size="sm">
                Quick Book
              </StandardButton>
            </div>

            {/* Filters */}
            <div className="flex gap-3">
              <StandardSearch
                placeholder="Search patient name, ID, or doctor..."
                value={searchQuery}
                onChange={setSearchQuery}
                className="flex-1"
              />
              <StandardSelect
                options={[
                  { value: 'all', label: 'All Departments' },
                  { value: 'cardiology', label: 'Cardiology' },
                  { value: 'general', label: 'General Medicine' },
                  { value: 'orthopedics', label: 'Orthopedics' },
                  { value: 'neurology', label: 'Neurology' },
                ]}
                value={filterDepartment}
                onChange={setFilterDepartment}
                placeholder="Department"
              />
              <StandardSelect
                options={[
                  { value: 'all', label: 'All Status' },
                  { value: 'scheduled', label: 'Scheduled' },
                  { value: 'in-progress', label: 'In Progress' },
                  { value: 'completed', label: 'Completed' },
                  { value: 'cancelled', label: 'Cancelled' },
                ]}
                value={filterStatus}
                onChange={setFilterStatus}
                placeholder="Status"
              />
            </div>
          </div>

          {/* Tabs */}
          <StandardTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'today' && (
              <div className="space-y-4">
                {todayAppointments.map((apt) => (
                  <div key={apt.id} className="relative">
                    {apt.status === 'in-progress' && (
                      <div className="absolute -left-1 top-0 bottom-0 w-1 bg-yellow-500 rounded-full" />
                    )}
                    <QueueCard
                      id={apt.id}
                      patientName={`${apt.patientName} (${apt.age}${apt.gender})`}
                      doctorName={apt.doctor}
                      details={`${apt.department} • ${apt.time} • Room ${apt.roomNumber}`}
                      time={apt.notes}
                      status={apt.status === 'completed' ? 'completed' : 
                              apt.status === 'in-progress' ? 'in-progress' : 'pending'}
                      badge={
                        <div className="flex gap-2">
                          <StandardBadge variant={getStatusColor(apt.status) as any}>
                            {apt.status.replace('-', ' ').charAt(0).toUpperCase() + 
                             apt.status.slice(1).replace('-', ' ')}
                          </StandardBadge>
                          {apt.type === 'Teleconsult' && (
                            <StandardBadge variant="info" size="sm">
                              <Video className="w-3 h-3 mr-1" />
                              Virtual
                            </StandardBadge>
                          )}
                          {getPaymentBadge(apt.paymentStatus)}
                        </div>
                      }
                      actions={[
                        apt.status === 'upcoming' || apt.status === 'scheduled' ? {
                          label: 'Check In',
                          onClick: () => console.log('Check in', apt.id),
                          variant: 'primary',
                        } : {
                          label: 'View Details',
                          onClick: () => console.log('View', apt.id),
                          variant: 'secondary',
                        },
                        {
                          label: apt.status === 'completed' ? 'View Summary' : 'Reschedule',
                          onClick: () => console.log('Action', apt.id),
                          variant: 'secondary',
                        },
                      ]}
                    />
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'upcoming' && (
              <div className="space-y-4">
                {upcomingAppointments.map((apt) => (
                  <QueueCard
                    key={apt.id}
                    id={apt.id}
                    patientName={apt.patientName}
                    doctorName={apt.doctor}
                    details={`${apt.department} • ${apt.type}`}
                    time={`${apt.date} at ${apt.time}`}
                    status="pending"
                    badge={<StandardBadge variant="info">Scheduled</StandardBadge>}
                    actions={[
                      { label: 'Send Reminder', onClick: () => console.log('Remind', apt.id), variant: 'secondary' },
                      { label: 'Reschedule', onClick: () => console.log('Reschedule', apt.id), variant: 'secondary' },
                    ]}
                  />
                ))}
              </div>
            )}

            {activeTab === 'waitlist' && (
              <div className="space-y-4">
                <QueueCard
                  id="WL-001"
                  patientName="Arjun Nair"
                  details="Cardiology • Preferred: Dr. Wilson"
                  time="Added 2 days ago • Flexible timing"
                  status="pending"
                  badge={<StandardBadge variant="warning">Priority</StandardBadge>}
                  actions={[
                    { label: 'Schedule Now', onClick: () => console.log('Schedule'), variant: 'primary' },
                    { label: 'Contact', onClick: () => console.log('Contact'), variant: 'secondary' },
                  ]}
                />
                <QueueCard
                  id="WL-002"
                  patientName="Kavita Reddy"
                  details="General Medicine • Any doctor"
                  time="Added today • Morning preferred"
                  status="pending"
                  badge={<StandardBadge variant="secondary">Regular</StandardBadge>}
                  actions={[
                    { label: 'Find Slot', onClick: () => console.log('Find'), variant: 'primary' },
                    { label: 'Contact', onClick: () => console.log('Contact'), variant: 'secondary' },
                  ]}
                />
              </div>
            )}

            {activeTab === 'history' && (
              <EmptyState
                icon={FileText}
                title="Appointment History"
                description="View past appointments and generate reports"
                action={{
                  label: 'Generate Report',
                  onClick: () => console.log('Generate report'),
                }}
              />
            )}
          </div>
        </div>
      </ContentGrid>
    </DashboardLayout>
  );
};

export default AppointmentsRedesigned;