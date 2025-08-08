// Sample Implementation: Demo-Enhanced Patient List Component
// Location: src/components/patients/PatientList.tsx (modified)

'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, Filter, Plus, Download, Trash2, Edit, Eye } from 'lucide-react';
import { useDemoMode, useDemoServices } from '@/context/DemoModeContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/use-toast';

// Types
interface PatientSearchParams {
  query?: string;
  page?: number;
  pageSize?: number;
  filters?: {
    gender?: 'male' | 'female';
    ageRange?: { min: number; max: number };
    status?: 'active' | 'inactive';
    bloodGroup?: string;
    city?: string;
    state?: string;
  };
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

interface Patient {
  id: string;
  patientCode: string;
  name: string;
  gender: 'male' | 'female';
  dateOfBirth: string;
  age?: number;
  phone: string;
  email?: string;
  bloodGroup?: string;
  status: 'active' | 'inactive';
  address?: {
    city?: string;
    state?: string;
  };
  registrationDate: string;
  lastVisit?: string;
  totalVisits: number;
  avatar?: string;
}

export const PatientList: React.FC = () => {
  // Demo mode integration
  const { isDemoMode, showDemoTips } = useDemoMode();
  const { patientService } = useDemoServices();
  
  // State management
  const [searchParams, setSearchParams] = useState<PatientSearchParams>({
    page: 1,
    pageSize: 10,
    sortBy: 'registrationDate',
    sortOrder: 'desc',
  });
  const [selectedPatients, setSelectedPatients] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const queryClient = useQueryClient();

  // Patient search query with demo support
  const {
    data: patientsData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['patients', 'search', searchParams],
    queryFn: async () => {
      if (isDemoMode && patientService) {
        // Use demo service
        return patientService.searchPatients(searchParams);
      }
      
      // Real API call would go here
      throw new Error('Real patient service not implemented yet');
    },
    staleTime: isDemoMode ? 0 : 5 * 60 * 1000, // Keep fresh in demo mode
    retry: isDemoMode ? 1 : 3, // Less retries in demo mode
  });

  // Create patient mutation with demo support
  const createPatientMutation = useMutation({
    mutationFn: async (patientData: any) => {
      if (isDemoMode && patientService) {
        return patientService.createPatient(patientData);
      }
      throw new Error('Real patient service not implemented yet');
    },
    onMutate: async (newPatient) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: ['patients', 'search'] });
      
      const previousData = queryClient.getQueryData(['patients', 'search', searchParams]);
      
      // Add optimistic patient to the list
      queryClient.setQueryData(['patients', 'search', searchParams], (old: any) => {
        if (!old) return old;
        
        const optimisticPatient = {
          ...newPatient,
          id: `temp-${Date.now()}`,
          patientCode: `TEMP-${Date.now()}`,
          status: 'active',
          registrationDate: new Date().toISOString(),
        };
        
        return {
          ...old,
          data: [optimisticPatient, ...old.data],
          pagination: {
            ...old.pagination,
            total: old.pagination.total + 1,
          },
        };
      });
      
      return { previousData };
    },
    onSuccess: (newPatient) => {
      // Replace optimistic update with real data
      queryClient.setQueryData(['patients', 'search', searchParams], (old: any) => {
        if (!old) return old;
        
        return {
          ...old,
          data: old.data.map((patient: Patient) =>
            patient.id.startsWith('temp-') ? newPatient : patient
          ),
        };
      });
      
      // Show success message
      toast({
        title: "Patient Registered",
        description: `${newPatient.name} has been successfully registered.`,
        variant: "default",
      });
      
      // Clear selection
      setSelectedPatients([]);
    },
    onError: (error, newPatient, context) => {
      // Revert optimistic update
      if (context?.previousData) {
        queryClient.setQueryData(['patients', 'search', searchParams], context.previousData);
      }
      
      toast({
        title: "Registration Failed",
        description: error.message || "Failed to register patient. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Search handler with debouncing
  const handleSearch = useCallback((query: string) => {
    setSearchParams(prev => ({
      ...prev,
      query: query.trim() || undefined,
      page: 1, // Reset to first page on new search
    }));
  }, []);

  // Filter handler
  const handleFilter = useCallback((filters: PatientSearchParams['filters']) => {
    setSearchParams(prev => ({
      ...prev,
      filters,
      page: 1, // Reset to first page on filter change
    }));
    setIsFilterOpen(false);
  }, []);

  // Pagination handler
  const handlePageChange = useCallback((page: number) => {
    setSearchParams(prev => ({ ...prev, page }));
  }, []);

  // Sort handler
  const handleSort = useCallback((sortBy: string, sortOrder: 'asc' | 'desc') => {
    setSearchParams(prev => ({ ...prev, sortBy, sortOrder }));
  }, []);

  // Selection handlers
  const handleSelectPatient = useCallback((patientId: string, selected: boolean) => {
    setSelectedPatients(prev => 
      selected 
        ? [...prev, patientId]
        : prev.filter(id => id !== patientId)
    );
  }, []);

  const handleSelectAll = useCallback((selected: boolean) => {
    if (selected && patientsData?.data) {
      setSelectedPatients(patientsData.data.map(patient => patient.id));
    } else {
      setSelectedPatients([]);
    }
  }, [patientsData?.data]);

  // Demo tip component
  const DemoTip: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    if (!isDemoMode || !showDemoTips) return null;
    
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
        <div className="flex items-start space-x-2">
          <div className="text-blue-500 mt-0.5">💡</div>
          <div className="text-sm text-blue-700">{children}</div>
        </div>
      </div>
    );
  };

  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, index) => (
        <Card key={index}>
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-3 w-[150px]" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-3 w-[100px]" />
                <Skeleton className="h-3 w-[80px]" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  // Error state
  if (isError) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="text-red-500 mb-2">⚠️</div>
          <h3 className="font-semibold text-lg mb-2">Unable to Load Patients</h3>
          <p className="text-gray-600 mb-4">
            {isDemoMode 
              ? "Demo data temporarily unavailable"
              : (error as Error)?.message || "An error occurred while loading patients"
            }
          </p>
          <Button onClick={() => refetch()} variant="outline">
            Try Again
          </Button>
          {isDemoMode && (
            <p className="text-sm text-gray-500 mt-2">
              This is demo mode. In production, this would show real patient data.
            </p>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Demo Tips */}
      <DemoTip>
        <strong>Demo Mode Active:</strong> This patient list shows realistic demo data. 
        All interactions work fully - try searching, filtering, or creating new patients!
      </DemoTip>

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Patient Management</h1>
          <p className="text-gray-600">
            {isDemoMode 
              ? `Showing ${patientsData?.pagination?.total || 0} demo patients`
              : "Manage your hospital's patient records"
            }
          </p>
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={() => {
              // In demo mode, this would open a modal
              // In real mode, this would navigate to creation page
              if (isDemoMode) {
                toast({
                  title: "Demo Mode",
                  description: "Patient registration modal would open here",
                });
              }
            }}
            className="flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Patient</span>
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search patients by name, ID, phone..."
                className="pl-10"
                onChange={(e) => handleSearch(e.target.value)}
                defaultValue={searchParams.query || ''}
              />
            </div>
            
            {/* Filter Button */}
            <Button
              variant="outline"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center space-x-2"
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
              {Object.keys(searchParams.filters || {}).length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {Object.keys(searchParams.filters || {}).length}
                </Badge>
              )}
            </Button>

            {/* Bulk Actions */}
            {selectedPatients.length > 0 && (
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-1" />
                  Export ({selectedPatients.length})
                </Button>
                <Button variant="outline" size="sm">
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete ({selectedPatients.length})
                </Button>
              </div>
            )}
          </div>

          {/* Advanced Filters (Collapsible) */}
          {isFilterOpen && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Gender Filter */}
                <div>
                  <label className="block text-sm font-medium mb-1">Gender</label>
                  <select 
                    className="w-full p-2 border rounded-md"
                    onChange={(e) => handleFilter({
                      ...searchParams.filters,
                      gender: e.target.value as 'male' | 'female' | undefined
                    })}
                  >
                    <option value="">All Genders</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>

                {/* Age Range Filter */}
                <div>
                  <label className="block text-sm font-medium mb-1">Age Range</label>
                  <select 
                    className="w-full p-2 border rounded-md"
                    onChange={(e) => {
                      const range = e.target.value;
                      let ageRange;
                      switch (range) {
                        case '0-18': ageRange = { min: 0, max: 18 }; break;
                        case '19-30': ageRange = { min: 19, max: 30 }; break;
                        case '31-50': ageRange = { min: 31, max: 50 }; break;
                        case '51-70': ageRange = { min: 51, max: 70 }; break;
                        case '70+': ageRange = { min: 71, max: 120 }; break;
                        default: ageRange = undefined;
                      }
                      handleFilter({
                        ...searchParams.filters,
                        ageRange
                      });
                    }}
                  >
                    <option value="">All Ages</option>
                    <option value="0-18">0-18 years</option>
                    <option value="19-30">19-30 years</option>
                    <option value="31-50">31-50 years</option>
                    <option value="51-70">51-70 years</option>
                    <option value="70+">70+ years</option>
                  </select>
                </div>

                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <select 
                    className="w-full p-2 border rounded-md"
                    onChange={(e) => handleFilter({
                      ...searchParams.filters,
                      status: e.target.value as 'active' | 'inactive' | undefined
                    })}
                  >
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                {/* Clear Filters */}
                <div className="flex items-end">
                  <Button
                    variant="outline"
                    onClick={() => handleFilter({})}
                    className="w-full"
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Patient List */}
      {isLoading ? (
        <LoadingSkeleton />
      ) : (
        <div className="space-y-4">
          {patientsData?.data?.map((patient) => (
            <Card key={patient.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  {/* Selection Checkbox */}
                  <input
                    type="checkbox"
                    checked={selectedPatients.includes(patient.id)}
                    onChange={(e) => handleSelectPatient(patient.id, e.target.checked)}
                    className="h-4 w-4 text-blue-600 rounded"
                  />

                  {/* Patient Avatar */}
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={patient.avatar} alt={patient.name} />
                    <AvatarFallback>
                      {patient.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  {/* Patient Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-lg">{patient.name}</h3>
                      <Badge variant={patient.status === 'active' ? 'default' : 'secondary'}>
                        {patient.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>ID: {patient.patientCode} • {patient.gender} • Age {patient.age}</div>
                      <div>📞 {patient.phone} {patient.email && `• ✉️ ${patient.email}`}</div>
                      <div>
                        🩸 {patient.bloodGroup} • 📍 {patient.address?.city}, {patient.address?.state}
                      </div>
                    </div>
                  </div>

                  {/* Patient Stats */}
                  <div className="text-right text-sm">
                    <div className="font-medium">{patient.totalVisits} visits</div>
                    <div className="text-gray-500">
                      Registered: {new Date(patient.registrationDate).toLocaleDateString()}
                    </div>
                    {patient.lastVisit && (
                      <div className="text-gray-500">
                        Last visit: {new Date(patient.lastVisit).toLocaleDateString()}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="sm" title="View Patient">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" title="Edit Patient">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Empty State */}
          {patientsData?.data?.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="text-gray-400 mb-4">
                  <Search className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="font-semibold text-lg mb-2">No Patients Found</h3>
                <p className="text-gray-600 mb-4">
                  {searchParams.query 
                    ? `No patients match your search for "${searchParams.query}"`
                    : "No patients registered yet"
                  }
                </p>
                {isDemoMode && !searchParams.query && (
                  <p className="text-sm text-blue-600">
                    This is demo mode - try refreshing or resetting demo data.
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Pagination */}
      {patientsData?.pagination && patientsData.pagination.totalPages > 1 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                Showing {((patientsData.pagination.page - 1) * patientsData.pagination.pageSize) + 1} to{' '}
                {Math.min(patientsData.pagination.page * patientsData.pagination.pageSize, patientsData.pagination.total)} of{' '}
                {patientsData.pagination.total} patients
              </div>
              
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(patientsData.pagination.page - 1)}
                  disabled={!patientsData.pagination.hasPreviousPage}
                >
                  Previous
                </Button>
                
                {/* Page Numbers */}
                <div className="flex space-x-1">
                  {Array.from({ length: Math.min(5, patientsData.pagination.totalPages) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <Button
                        key={page}
                        variant={page === patientsData.pagination.page ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </Button>
                    );
                  })}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(patientsData.pagination.page + 1)}
                  disabled={!patientsData.pagination.hasNextPage}
                >
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Demo Footer */}
      {isDemoMode && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="text-blue-600">🎭</div>
                <div className="text-sm">
                  <strong>Demo Mode:</strong> All data is simulated. 
                  {patientsData?.searchStats && (
                    <span className="ml-2">
                      Search completed in {Math.round(patientsData.searchStats.searchTime)}ms
                    </span>
                  )}
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => {
                  toast({
                    title: "Demo Features",
                    description: "Try searching, filtering, selecting patients, or adding new ones!",
                  });
                }}
              >
                Show Demo Features
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};