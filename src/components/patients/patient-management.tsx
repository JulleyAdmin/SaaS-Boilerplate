'use client';

import {
  Calendar,
  Filter,
  MoreHorizontal,
  Plus,
  Search,
  Stethoscope,
  TestTube,
  User,
  UserPlus,
  Users,
} from 'lucide-react';
import { useState } from 'react';

import { RoleGuard } from '@/components/dashboard/role-guard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePatients, usePatientStatistics, useTodayActivity } from '@/hooks/api/usePatients';

import { PatientDetailModal } from './patient-detail-modal';
import { PatientEditModal } from './patient-edit-modal';
import { PatientRegistrationModal } from './patient-registration-modal';
import { PatientStatusModal } from './patient-status-modal';
import {
  QuickAppointmentModal,
  QuickConsultationModal,
  QuickLabOrderModal,
} from './quick-actions';

type PatientFilter = {
  status?: 'admitted' | 'outpatient' | 'discharged' | 'emergency';
  department?: string;
  dateRange?: string;
  bloodGroup?: string;
};

export function PatientManagement() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<PatientFilter>({});
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  const [editingPatient, setEditingPatient] = useState<any | null>(null);
  const [statusChangePatient, setStatusChangePatient] = useState<{
    patient: any;
    targetStatus: 'admitted' | 'outpatient' | 'discharged' | 'emergency';
  } | null>(null);
  const [showRegistration, setShowRegistration] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Quick action modal states
  const [quickAppointmentPatient, setQuickAppointmentPatient] = useState<any | null>(null);
  const [quickConsultationPatient, setQuickConsultationPatient] = useState<any | null>(null);
  const [quickLabOrderPatient, setQuickLabOrderPatient] = useState<any | null>(null);

  // API hooks
  const { data: patientsData, loading, error, refetch } = usePatients({
    search: searchQuery,
    ...filters,
    pageSize: 50,
  });

  // Real-time statistics hooks
  const { data: patientStats, isLoading: statsLoading } = usePatientStatistics();
  const { data: todayActivity, isLoading: activityLoading } = useTodayActivity();

  const patients = patientsData?.data || [];
  const totalPatients = patientsData?.pagination?.total || patientStats?.totalPatients || 0;

  // Debug log only in development
  if (process.env.NODE_ENV === 'development' && patients.length > 0) {
    // eslint-disable-next-line no-console
    console.log(`Loaded ${patients.length} patients`);
  }

  // Filter patients by status for tabs
  const getFilteredPatients = (status?: string) => {
    if (!status || status === 'all') {
      return patients;
    }
    return patients.filter(patient => patient.status === status);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'admitted':
        return 'bg-blue-100 text-blue-800';
      case 'outpatient':
        return 'bg-green-100 text-green-800';
      case 'discharged':
        return 'bg-gray-100 text-gray-800';
      case 'emergency':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (key: keyof PatientFilter, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value === 'all' ? undefined : value || undefined,
    }));
  };

  const clearFilters = () => {
    setFilters({});
    setSearchQuery('');
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return <ErrorBoundary />;
  }

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Patient Management</h1>
            <p className="text-muted-foreground">
              Manage patient records, admissions, and medical information
            </p>
          </div>

          <RoleGuard allowedRoles={['admin', 'doctor', 'nurse', 'receptionist']}>
            <Button onClick={() => setShowRegistration(true)}>
              <UserPlus className="mr-2 size-4" />
              Register Patient
            </Button>
          </RoleGuard>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
              <Users className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statsLoading
                  ? (
                      <div className="h-8 w-16 animate-pulse rounded bg-muted" />
                    )
                  : (
                      totalPatients
                    )}
              </div>
              <p className="text-xs text-muted-foreground">
                All registered patients
                {todayActivity?.registrations
                  ? (
                      <span className="ml-1 text-green-600">
                        (+
                        {todayActivity.registrations}
                        {' '}
                        today)
                      </span>
                    )
                  : null}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Admitted</CardTitle>
              <User className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statsLoading
                  ? (
                      <div className="h-8 w-12 animate-pulse rounded bg-muted" />
                    )
                  : (
                      patientStats?.admitted || patients.filter(p => p.status === 'admitted').length
                    )}
              </div>
              <p className="text-xs text-muted-foreground">
                Currently admitted
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
              <Calendar className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {activityLoading
                  ? (
                      <div className="h-8 w-12 animate-pulse rounded bg-muted" />
                    )
                  : (
                      todayActivity?.appointments || 0
                    )}
              </div>
              <p className="text-xs text-muted-foreground">
                Scheduled for today
                {todayActivity?.consultations
                  ? (
                      <span className="ml-1 text-blue-600">
                        (
                        {todayActivity.consultations}
                        {' '}
                        completed)
                      </span>
                    )
                  : null}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Emergency</CardTitle>
              <div className="size-4 rounded-full bg-red-500"></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statsLoading
                  ? (
                      <div className="size-8 animate-pulse rounded bg-muted" />
                    )
                  : (
                      patientStats?.emergency || patients.filter(p => p.status === 'emergency').length
                    )}
              </div>
              <p className="text-xs text-red-600">
                Requires attention
                {todayActivity?.emergencies
                  ? (
                      <span className="ml-1">
                        (
                        {todayActivity.emergencies}
                        {' '}
                        today)
                      </span>
                    )
                  : null}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
                  <Input
                    placeholder="Search patients by name, MRN, or phone..."
                    value={searchQuery}
                    onChange={e => handleSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="mr-2 size-4" />
                  Filters
                </Button>

                {(Object.keys(filters).length > 0 || searchQuery) && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Clear All
                  </Button>
                )}
              </div>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <>
                <Separator />
                <div className="grid gap-4 md:grid-cols-4">
                  <div>
                    <label htmlFor="status-filter" className="text-sm font-medium">Status</label>
                    <Select
                      value={filters.status || 'all'}
                      onValueChange={value => handleFilterChange('status', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All statuses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All statuses</SelectItem>
                        <SelectItem value="admitted">Admitted</SelectItem>
                        <SelectItem value="outpatient">Outpatient</SelectItem>
                        <SelectItem value="discharged">Discharged</SelectItem>
                        <SelectItem value="emergency">Emergency</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label htmlFor="department-filter" className="text-sm font-medium">Department</label>
                    <Select
                      value={filters.department || 'all'}
                      onValueChange={value => handleFilterChange('department', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All departments" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All departments</SelectItem>
                        <SelectItem value="cardiology">Cardiology</SelectItem>
                        <SelectItem value="emergency">Emergency</SelectItem>
                        <SelectItem value="pediatrics">Pediatrics</SelectItem>
                        <SelectItem value="surgery">Surgery</SelectItem>
                        <SelectItem value="oncology">Oncology</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label htmlFor="blood-group-filter" className="text-sm font-medium">Blood Group</label>
                    <Select
                      value={filters.bloodGroup || 'all'}
                      onValueChange={value => handleFilterChange('bloodGroup', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All blood groups" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All blood groups</SelectItem>
                        <SelectItem value="A+">A+</SelectItem>
                        <SelectItem value="A-">A-</SelectItem>
                        <SelectItem value="B+">B+</SelectItem>
                        <SelectItem value="B-">B-</SelectItem>
                        <SelectItem value="AB+">AB+</SelectItem>
                        <SelectItem value="AB-">AB-</SelectItem>
                        <SelectItem value="O+">O+</SelectItem>
                        <SelectItem value="O-">O-</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label htmlFor="date-range-filter" className="text-sm font-medium">Date Range</label>
                    <Select
                      value={filters.dateRange || 'all'}
                      onValueChange={value => handleFilterChange('dateRange', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All dates" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All dates</SelectItem>
                        <SelectItem value="today">Today</SelectItem>
                        <SelectItem value="week">This week</SelectItem>
                        <SelectItem value="month">This month</SelectItem>
                        <SelectItem value="quarter">This quarter</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </>
            )}
          </CardHeader>
        </Card>

        {/* Patient List */}
        <Card>
          <CardHeader>
            <CardTitle>Patient List</CardTitle>
            <CardDescription>
              {totalPatients}
              {' '}
              patients found
              {searchQuery && ` matching "${searchQuery}"`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="all">
                  All (
                  {patients.length}
                  )
                </TabsTrigger>
                <TabsTrigger value="admitted">
                  Admitted (
                  {getFilteredPatients('admitted').length}
                  )
                </TabsTrigger>
                <TabsTrigger value="outpatient">
                  Outpatient (
                  {getFilteredPatients('outpatient').length}
                  )
                </TabsTrigger>
                <TabsTrigger value="emergency">
                  Emergency (
                  {getFilteredPatients('emergency').length}
                  )
                </TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="mt-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient</TableHead>
                      <TableHead>MRN</TableHead>
                      <TableHead>Age/Gender</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Last Visit</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getFilteredPatients(activeTab).map(patient => (
                      <TableRow key={patient.patientId}>
                        <TableCell>
                          <div className="font-medium">
                            {patient.firstName}
                            {' '}
                            {patient.lastName}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {patient.email}
                          </div>
                        </TableCell>

                        <TableCell className="font-mono text-sm">
                          {patient.patientCode}
                        </TableCell>

                        <TableCell>
                          <div className="text-sm">
                            {patient.dateOfBirth
                              ? new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear()
                              : 'N/A'}
                            {' '}
                            /
                            {' '}
                            {patient.gender}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {patient.bloodGroup && `${patient.bloodGroup} blood`}
                          </div>
                        </TableCell>

                        <TableCell>
                          <Badge className={getStatusColor(patient.status || 'outpatient')}>
                            {patient.status || 'outpatient'}
                          </Badge>
                        </TableCell>

                        <TableCell>
                          {patient.currentDepartmentId || 'General'}
                        </TableCell>

                        <TableCell>
                          {patient.admissionDate
                            ? new Date(patient.admissionDate).toLocaleDateString()
                            : 'N/A'}
                        </TableCell>

                        <TableCell>
                          <div className="text-sm">
                            {patient.phone}
                          </div>
                        </TableCell>

                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="size-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem
                                onClick={() => setSelectedPatient(patient.patientId)}
                              >
                                View Details
                              </DropdownMenuItem>
                              <RoleGuard allowedRoles={['admin', 'doctor', 'nurse']} showFallback={false}>
                                <DropdownMenuItem
                                  onClick={() => setEditingPatient(patient)}
                                >
                                  Edit Patient
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  Medical History
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />

                                {/* Quick Actions */}
                                <DropdownMenuItem
                                  onClick={() => setQuickAppointmentPatient(patient)}
                                >
                                  <Calendar className="mr-2 size-4" />
                                  Schedule Appointment
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => setQuickConsultationPatient(patient)}
                                >
                                  <Stethoscope className="mr-2 size-4" />
                                  Start Consultation
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => setQuickLabOrderPatient(patient)}
                                >
                                  <TestTube className="mr-2 size-4" />
                                  Order Lab Tests
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />

                                {/* Status Management Options */}
                                {patient.status !== 'admitted' && (
                                  <DropdownMenuItem
                                    onClick={() => setStatusChangePatient({
                                      patient,
                                      targetStatus: 'admitted',
                                    })}
                                  >
                                    Admit Patient
                                  </DropdownMenuItem>
                                )}
                                {patient.status === 'admitted' && (
                                  <DropdownMenuItem
                                    onClick={() => setStatusChangePatient({
                                      patient,
                                      targetStatus: 'discharged',
                                    })}
                                  >
                                    Discharge Patient
                                  </DropdownMenuItem>
                                )}
                                {patient.status !== 'emergency' && (
                                  <DropdownMenuItem
                                    onClick={() => setStatusChangePatient({
                                      patient,
                                      targetStatus: 'emergency',
                                    })}
                                    className="text-red-600"
                                  >
                                    Transfer to Emergency
                                  </DropdownMenuItem>
                                )}
                                {patient.status !== 'outpatient' && patient.status !== 'discharged' && (
                                  <DropdownMenuItem
                                    onClick={() => setStatusChangePatient({
                                      patient,
                                      targetStatus: 'outpatient',
                                    })}
                                  >
                                    Set as Outpatient
                                  </DropdownMenuItem>
                                )}
                              </RoleGuard>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {getFilteredPatients(activeTab).length === 0 && (
                  <div className="py-12 text-center">
                    <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-muted">
                      <Users className="size-6 text-muted-foreground" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold">No patients found</h3>
                    <p className="mb-4 text-muted-foreground">
                      {searchQuery || Object.keys(filters).length > 0
                        ? 'Try adjusting your search or filters'
                        : 'Get started by registering your first patient'}
                    </p>
                    {!searchQuery && Object.keys(filters).length === 0 && (
                      <RoleGuard allowedRoles={['admin', 'doctor', 'nurse', 'receptionist']} showFallback={false}>
                        <Button onClick={() => setShowRegistration(true)}>
                          <Plus className="mr-2 size-4" />
                          Register First Patient
                        </Button>
                      </RoleGuard>
                    )}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Modals */}
        {showRegistration && (
          <PatientRegistrationModal
            open={showRegistration}
            onClose={() => setShowRegistration(false)}
            onSuccess={() => {
              setShowRegistration(false);
              refetch();
            }}
          />
        )}

        {selectedPatient && (
          <PatientDetailModal
            patientId={selectedPatient}
            open={!!selectedPatient}
            onClose={() => setSelectedPatient(null)}
          />
        )}

        {editingPatient && (
          <PatientEditModal
            patient={editingPatient}
            open={!!editingPatient}
            onClose={() => setEditingPatient(null)}
            onSuccess={() => {
              setEditingPatient(null);
              refetch();
            }}
          />
        )}

        {statusChangePatient && (
          <PatientStatusModal
            patient={statusChangePatient.patient}
            targetStatus={statusChangePatient.targetStatus}
            open={!!statusChangePatient}
            onClose={() => setStatusChangePatient(null)}
            onSuccess={() => {
              setStatusChangePatient(null);
              refetch();
            }}
          />
        )}

        {/* Quick Action Modals */}
        {quickAppointmentPatient && (
          <QuickAppointmentModal
            patient={quickAppointmentPatient}
            open={!!quickAppointmentPatient}
            onClose={() => setQuickAppointmentPatient(null)}
            onSuccess={() => {
              setQuickAppointmentPatient(null);
              refetch();
            }}
          />
        )}

        {quickConsultationPatient && (
          <QuickConsultationModal
            patient={quickConsultationPatient}
            open={!!quickConsultationPatient}
            onClose={() => setQuickConsultationPatient(null)}
            onSuccess={() => {
              setQuickConsultationPatient(null);
              refetch();
            }}
          />
        )}

        {quickLabOrderPatient && (
          <QuickLabOrderModal
            patient={quickLabOrderPatient}
            open={!!quickLabOrderPatient}
            onClose={() => setQuickLabOrderPatient(null)}
            onSuccess={() => {
              setQuickLabOrderPatient(null);
              refetch();
            }}
          />
        )}
      </div>
    </ErrorBoundary>
  );
}
