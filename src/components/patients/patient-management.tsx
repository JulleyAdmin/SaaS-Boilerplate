'use client';

import {
  Calendar,
  Filter,
  MoreHorizontal,
  Search,
  Stethoscope,
  TestTube,
  User,
  UserPlus,
  Users,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PatientLogger, UILogger, logger } from '@/utils/client-logger';

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
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  usePatients, 
  usePatientStatistics, 
  useTodayActivity,
  formatPatientName, 
  calculateAge,
  type Patient,
  type PatientSearchParams
} from '@/hooks/api/usePatients';

export function PatientManagement() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Component lifecycle logging
  useEffect(() => {
    const endTimer = logger.startTimer('PatientManagement.mount');
    logger.componentMounted('PatientManagement', { 
      searchQuery, 
      selectedStatus, 
      currentPage 
    });
    
    return () => {
      endTimer();
      logger.debug('COMPONENT', 'PatientManagement unmounted');
    };
  }, []);

  // Prepare search parameters
  const searchParams = useMemo((): PatientSearchParams => {
    const params: PatientSearchParams = {
      page: currentPage,
      pageSize,
      isActive: true,
    };

    if (searchQuery.trim()) {
      params.query = searchQuery.trim();
    }

    if (selectedStatus !== 'all') {
      params.status = selectedStatus as any;
    }

    return params;
  }, [searchQuery, selectedStatus, currentPage]);

  // Fetch data using hooks
  const { data: patientsResponse, isLoading: patientsLoading, error: patientsError } = usePatients(searchParams);
  const { data: statisticsResponse, isLoading: statsLoading } = usePatientStatistics();
  const { data: todayActivityResponse } = useTodayActivity();

  const patients = patientsResponse?.data || [];
  const pagination = patientsResponse?.pagination;
  const statistics = statisticsResponse?.data;
  const todayActivity = todayActivityResponse?.data;

  // Log search results
  useEffect(() => {
    if (patientsResponse) {
      PatientLogger.search(searchParams, patients.length);
      logger.info('PATIENT_DATA', `Loaded ${patients.length} patients`, {
        totalCount: pagination?.total,
        currentPage: pagination?.page,
        pageSize: pagination?.pageSize,
      });
    }
  }, [patientsResponse, searchParams, patients.length, pagination]);

  // Log errors
  useEffect(() => {
    if (patientsError) {
      PatientLogger.error('search', patientsError);
      logger.error('PATIENT_MANAGEMENT', 'Failed to load patients', {
        error: patientsError,
        searchParams,
      });
    }
  }, [patientsError, searchParams]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'outpatient':
        return 'default';
      case 'admitted':
        return 'default';
      case 'emergency':
        return 'destructive';
      case 'discharged':
        return 'secondary';
      case 'inactive':
        return 'secondary';
      case 'deceased':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  // Loading state
  if (patientsLoading && !patients.length) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading patients...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (patientsError) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Patient Management</h1>
            <p className="text-muted-foreground">
              Manage patient records, appointments, and medical history
            </p>
          </div>
        </div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load patients. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Patient Management</h1>
          <p className="text-muted-foreground">
            Manage patient records, appointments, and medical history
          </p>
        </div>
        <Button>
          <UserPlus className="mr-2 size-4" />
          Register New Patient
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <Users className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                (statistics?.totalPatients || 0).toLocaleString()
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Registered patients
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Outpatients</CardTitle>
            <User className="size-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                (statistics?.outpatient || 0).toLocaleString()
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Outpatient visits
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Today</CardTitle>
            <UserPlus className="size-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                (statistics?.todayRegistrations || 0)
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              New registrations
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Emergency Cases</CardTitle>
            <Stethoscope className="size-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                (statistics?.emergency || 0)
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Emergency patients
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Patient Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Patient Directory</CardTitle>
              <CardDescription>
                Search and manage patient information, medical records, and appointments
              </CardDescription>
            </div>
            <Button onClick={() => router.push('/dashboard/patients/new')}>
              <UserPlus className="mr-2 size-4" />
              Register Patient
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
              <Input
                placeholder="Search patients..."
                value={searchQuery}
                onChange={e => {
                  const newValue = e.target.value;
                  setSearchQuery(newValue);
                  UILogger.interaction('PatientSearch', 'type', { searchQuery: newValue });
                }}
                className="pl-10"
              />
            </div>
            <Select value={selectedStatus} onValueChange={(value) => {
              setSelectedStatus(value);
              UILogger.interaction('PatientFilter', 'select', { status: value });
            }}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Patients</SelectItem>
                <SelectItem value="outpatient">Outpatient</SelectItem>
                <SelectItem value="admitted">Admitted</SelectItem>
                <SelectItem value="emergency">Emergency</SelectItem>
                <SelectItem value="discharged">Discharged</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="mr-2 size-4" />
              More Filters
            </Button>
          </div>

          <Tabs defaultValue="list" className="w-full">
            <TabsList>
              <TabsTrigger value="list">Patient List</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="appointments">Today's Appointments</TabsTrigger>
            </TabsList>

            <TabsContent value="list" className="mt-6">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Age/Gender</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Blood Group</TableHead>
                      <TableHead>Last Visit</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {patientsLoading && patients.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="h-24 text-center">
                          <div className="flex items-center justify-center">
                            <Loader2 className="h-6 w-6 animate-spin mr-2" />
                            Loading patients...
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : patients.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="h-24 text-center">
                          <div data-testid="patient-list">
                            No patients found
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      patients.map(patient => (
                        <TableRow 
                          key={patient.patientId} 
                          data-testid="patient-row"
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => router.push(`/dashboard/patients/${patient.patientId}`)}
                        >
                          <TableCell className="font-medium">{patient.patientCode}</TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{formatPatientName(patient)}</p>
                              <p className="text-sm text-muted-foreground">
                                {patient.abhaNumber || 'No ABHA ID'}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            {patient.age || calculateAge(patient.dateOfBirth)}
                            {' '}
                            years • {patient.gender}
                          </TableCell>
                          <TableCell>
                            <div>
                              <p>{patient.phone || 'No phone'}</p>
                              <p className="text-sm text-muted-foreground">
                                Emergency: {patient.emergencyContactName ? 
                                  `${patient.emergencyContactName} - ${patient.emergencyContactPhone}` : 
                                  'Not provided'
                                }
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            {patient.bloodGroup ? (
                              <Badge variant="outline">{patient.bloodGroup}</Badge>
                            ) : (
                              <span className="text-muted-foreground text-sm">Unknown</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {patient.lastVisitDate ? 
                              new Date(patient.lastVisitDate).toLocaleDateString() : 
                              'No visits'
                            }
                          </TableCell>
                          <TableCell>
                            <Badge variant={getStatusColor(patient.status) as any}>
                              {patient.status.charAt(0).toUpperCase() + patient.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="size-8 p-0">
                                  <span className="sr-only">Open menu</span>
                                  <MoreHorizontal className="size-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => {
                                  PatientLogger.select(patient.patientId, formatPatientName(patient));
                                  UILogger.interaction('PatientAction', 'view-details', { patientId: patient.patientId });
                                }}>View Details</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => {
                                  UILogger.interaction('PatientAction', 'edit', { patientId: patient.patientId });
                                }}>Edit Patient</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => {
                                  UILogger.interaction('PatientAction', 'medical-history', { patientId: patient.patientId });
                                }}>Medical History</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => {
                                  UILogger.interaction('PatientAction', 'schedule-appointment', { patientId: patient.patientId });
                                }}>
                                  <Calendar className="mr-2 size-4" />
                                  Schedule Appointment
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => {
                                  UILogger.interaction('PatientAction', 'order-lab-test', { patientId: patient.patientId });
                                }}>
                                  <TestTube className="mr-2 size-4" />
                                  Order Lab Test
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => {
                                  UILogger.interaction('PatientAction', 'quick-consultation', { patientId: patient.patientId });
                                }}>
                                  <Stethoscope className="mr-2 size-4" />
                                  Quick Consultation
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
              
              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-between pt-4">
                  <div className="text-sm text-muted-foreground">
                    Showing {((pagination.page - 1) * pagination.pageSize) + 1} to{' '}
                    {Math.min(pagination.page * pagination.pageSize, pagination.total)} of{' '}
                    {pagination.total} patients
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={pagination.page <= 1}
                    >
                      Previous
                    </Button>
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                        const pageNum = pagination.page > 3 
                          ? pagination.page - 2 + i 
                          : i + 1;
                        
                        if (pageNum > pagination.totalPages) return null;
                        
                        return (
                          <Button
                            key={pageNum}
                            variant={pageNum === pagination.page ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCurrentPage(pageNum)}
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
                      disabled={pagination.page >= pagination.totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="analytics" className="mt-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Patient Status Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {statsLoading ? (
                        <div className="flex items-center justify-center py-4">
                          <Loader2 className="h-4 w-4 animate-spin" />
                        </div>
                      ) : (
                        <>
                          <div className="flex justify-between">
                            <span className="text-sm">Outpatients</span>
                            <span className="text-sm font-medium">
                              {statistics?.outpatient || 0} ({statistics?.totalPatients ? 
                                ((statistics.outpatient / statistics.totalPatients) * 100).toFixed(1) : 0}%)
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Admitted</span>
                            <span className="text-sm font-medium">
                              {statistics?.admitted || 0} ({statistics?.totalPatients ? 
                                ((statistics.admitted / statistics.totalPatients) * 100).toFixed(1) : 0}%)
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Emergency</span>
                            <span className="text-sm font-medium">
                              {statistics?.emergency || 0} ({statistics?.totalPatients ? 
                                ((statistics.emergency / statistics.totalPatients) * 100).toFixed(1) : 0}%)
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Discharged</span>
                            <span className="text-sm font-medium">
                              {statistics?.discharged || 0} ({statistics?.totalPatients ? 
                                ((statistics.discharged / statistics.totalPatients) * 100).toFixed(1) : 0}%)
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Today's Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">New Registrations</span>
                        <span className="text-sm font-medium">{todayActivity?.registrations || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Appointments</span>
                        <span className="text-sm font-medium">{todayActivity?.appointments || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Consultations</span>
                        <span className="text-sm font-medium">{todayActivity?.consultations || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Emergencies</span>
                        <span className="text-sm font-medium">{todayActivity?.emergencies || 0}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">System Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Total Patients</span>
                        <span className="text-sm font-medium">{statistics?.totalPatients || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Active Patients</span>
                        <span className="text-sm font-medium">
                          {((statistics?.outpatient || 0) + (statistics?.admitted || 0) + (statistics?.emergency || 0))}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Inactive</span>
                        <span className="text-sm font-medium">{statistics?.inactive || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Today's Registrations</span>
                        <span className="text-sm font-medium">{statistics?.todayRegistrations || 0}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="appointments" className="mt-6">
              <div className="space-y-4">
                <div className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">John Doe (P-12345)</h3>
                      <p className="text-sm text-muted-foreground">
                        9:00 AM - 9:30 AM • Dr. Sarah Wilson • Cardiology
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="default">Confirmed</Badge>
                      <Button size="sm" variant="outline">Check In</Button>
                    </div>
                  </div>
                </div>
                <div className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Priya Sharma (P-12346)</h3>
                      <p className="text-sm text-muted-foreground">
                        10:30 AM - 11:00 AM • Dr. Michael Brown • General Medicine
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="secondary">Waiting</Badge>
                      <Button size="sm" variant="outline">View Details</Button>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
