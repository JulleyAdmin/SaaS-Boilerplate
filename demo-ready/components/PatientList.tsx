// Ready-to-use Patient List Component with Demo Support
// Drop this into: src/components/patients/PatientList.tsx (replace existing)

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Search, Filter, Plus, Download, Trash2, Edit, Eye, Users, UserCheck, Clock, Activity } from 'lucide-react';
import { usePatients } from '@/hooks/api/usePatients';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';

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

export const PatientList: React.FC = () => {
  const { 
    patients, 
    loading, 
    error, 
    searchPatients, 
    getStats, 
    resetDemoData, 
    isDemoMode 
  } = usePatients();

  // State
  const [searchParams, setSearchParams] = useState<PatientSearchParams>({
    page: 1,
    pageSize: 10,
    sortBy: 'registrationDate',
    sortOrder: 'desc',
  });
  const [searchResults, setSearchResults] = useState<any>(null);
  const [selectedPatients, setSelectedPatients] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [stats, setStats] = useState<any>(null);

  // Load initial data and stats
  useEffect(() => {
    loadPatients();
    setStats(getStats());
  }, []);

  // Load patients with current search params
  const loadPatients = useCallback(async () => {
    try {
      const results = await searchPatients(searchParams);
      setSearchResults(results);
    } catch (err) {
      console.error('Failed to load patients:', err);
    }
  }, [searchParams, searchPatients]);

  // Reload when search params change
  useEffect(() => {
    loadPatients();
  }, [loadPatients]);

  // Search handler
  const handleSearch = useCallback((query: string) => {
    setSearchParams(prev => ({
      ...prev,
      query: query.trim() || undefined,
      page: 1,
    }));
  }, []);

  // Filter handler
  const handleFilter = useCallback((filters: PatientSearchParams['filters']) => {
    setSearchParams(prev => ({
      ...prev,
      filters,
      page: 1,
    }));
    setIsFilterOpen(false);
  }, []);

  // Pagination handler
  const handlePageChange = useCallback((page: number) => {
    setSearchParams(prev => ({ ...prev, page }));
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
    if (selected && searchResults?.data) {
      setSelectedPatients(searchResults.data.map((patient: any) => patient.id));
    } else {
      setSelectedPatients([]);
    }
  }, [searchResults?.data]);

  // Demo notification
  const showDemoNotification = (message: string) => {
    if (typeof window !== 'undefined') {
      // You can replace this with your actual toast/notification system
      alert(`Demo Mode: ${message}`);
    }
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
  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="text-red-500 mb-2 text-4xl">⚠️</div>
          <h3 className="font-semibold text-lg mb-2">Unable to Load Patients</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="space-x-2">
            <Button onClick={loadPatients} variant="outline">
              Try Again
            </Button>
            {isDemoMode && (
              <Button onClick={resetDemoData} variant="secondary">
                Reset Demo Data
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Demo Mode Banner */}
      {isDemoMode && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="text-blue-600 text-2xl">🎭</div>
                <div>
                  <h4 className="font-semibold text-blue-900">Demo Mode Active</h4>
                  <p className="text-sm text-blue-700">
                    All interactions are fully functional with realistic mock data. 
                    Try searching, filtering, or creating patients!
                  </p>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => showDemoNotification("All patient management features are working! Try searching for 'Priya' or filter by 'Female' patients.")}
              >
                Demo Guide
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Patients</p>
                  <p className="text-2xl font-bold">{stats.totalPatients}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <UserCheck className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Patients</p>
                  <p className="text-2xl font-bold">{stats.activePatients}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-8 w-8 text-orange-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">New This Week</p>
                  <p className="text-2xl font-bold">{stats.newThisWeek}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Activity className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Average Age</p>
                  <p className="text-2xl font-bold">{stats.averageAge} years</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Patient Management</h1>
          <p className="text-gray-600">
            {searchResults?.pagination 
              ? `Showing ${searchResults.pagination.total} patients`
              : "Manage your hospital's patient records"
            }
          </p>
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={() => showDemoNotification("Patient registration form would open here. In the demo, you can see all the fields and validation working!")}
            className="flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Patient</span>
          </Button>
          {isDemoMode && (
            <Button
              variant="outline"
              onClick={resetDemoData}
              className="flex items-center space-x-2"
            >
              <Activity className="h-4 w-4" />
              <span>Reset Demo</span>
            </Button>
          )}
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
                placeholder="Search patients by name, ID, phone, email..."
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
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => showDemoNotification(`Export ${selectedPatients.length} selected patients to Excel/CSV`)}
                >
                  <Download className="h-4 w-4 mr-1" />
                  Export ({selectedPatients.length})
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => showDemoNotification(`Mark ${selectedPatients.length} patients as inactive`)}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Archive ({selectedPatients.length})
                </Button>
              </div>
            )}
          </div>

          {/* Advanced Filters */}
          {isFilterOpen && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Gender Filter */}
                <div>
                  <label className="block text-sm font-medium mb-1">Gender</label>
                  <select 
                    className="w-full p-2 border rounded-md bg-white"
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
                    className="w-full p-2 border rounded-md bg-white"
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
                    className="w-full p-2 border rounded-md bg-white"
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
      {loading ? (
        <LoadingSkeleton />
      ) : (
        <div className="space-y-4">
          {searchResults?.data?.map((patient: any) => (
            <Card key={patient.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {/* Selection Checkbox */}
                    <input
                      type="checkbox"
                      checked={selectedPatients.includes(patient.id)}
                      onChange={(e) => handleSelectPatient(patient.id, e.target.checked)}
                      className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />

                    {/* Patient Avatar */}
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={patient.avatar} alt={patient.name} />
                      <AvatarFallback className="text-lg font-semibold">
                        {patient.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    {/* Patient Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">{patient.name}</h3>
                        <Badge variant={patient.status === 'active' ? 'default' : 'secondary'}>
                          {patient.status}
                        </Badge>
                        <Badge variant="outline">{patient.patientCode}</Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">👤</span>
                          <span>{patient.gender} • Age {patient.age}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">📞</span>
                          <span>{patient.phone}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">✉️</span>
                          <span>{patient.email}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">🩸</span>
                          <span>{patient.bloodGroup}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">📍</span>
                          <span>{patient.address.city}, {patient.address.state}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">🏥</span>
                          <span>{patient.totalVisits} visits</span>
                        </div>
                      </div>

                      {/* Medical Info */}
                      {(patient.allergies?.length > 0 || patient.currentMedications?.length > 0) && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {patient.allergies?.map((allergy: string, index: number) => (
                            <Badge key={index} variant="destructive" className="text-xs">
                              ⚠️ {allergy}
                            </Badge>
                          ))}
                          {patient.currentMedications?.map((medication: string, index: number) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              💊 {medication}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col space-y-2">
                    <div className="text-right text-sm text-gray-500 mb-2">
                      <div>Registered: {new Date(patient.registrationDate).toLocaleDateString()}</div>
                      {patient.lastVisit && (
                        <div>Last visit: {new Date(patient.lastVisit).toLocaleDateString()}</div>
                      )}
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        title="View Patient Profile"
                        onClick={() => showDemoNotification(`Opening detailed profile for ${patient.name} with medical history, appointments, and family information.`)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        title="Edit Patient"
                        onClick={() => showDemoNotification(`Edit form for ${patient.name} would open with all current information pre-filled.`)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Empty State */}
          {searchResults?.data?.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="text-gray-400 mb-4">
                  <Search className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="font-semibold text-xl mb-2">No Patients Found</h3>
                <p className="text-gray-600 mb-4">
                  {searchParams.query 
                    ? `No patients match your search for "${searchParams.query}"`
                    : "No patients have been registered yet"
                  }
                </p>
                {isDemoMode && (
                  <div className="space-y-2">
                    <p className="text-sm text-blue-600">
                      Try searching for "Priya", "Arjun", or filter by gender to see demo results.
                    </p>
                    <Button variant="outline" onClick={() => handleSearch('')}>
                      Show All Patients
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Pagination */}
      {searchResults?.pagination && searchResults.pagination.totalPages > 1 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                Showing {((searchResults.pagination.page - 1) * searchResults.pagination.pageSize) + 1} to{' '}
                {Math.min(searchResults.pagination.page * searchResults.pagination.pageSize, searchResults.pagination.total)} of{' '}
                {searchResults.pagination.total} patients
              </div>
              
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(searchResults.pagination.page - 1)}
                  disabled={!searchResults.pagination.hasPreviousPage}
                >
                  Previous
                </Button>
                
                {/* Page Numbers */}
                <div className="flex space-x-1">
                  {Array.from({ length: Math.min(5, searchResults.pagination.totalPages) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <Button
                        key={page}
                        variant={page === searchResults.pagination.page ? "default" : "outline"}
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
                  onClick={() => handlePageChange(searchResults.pagination.page + 1)}
                  disabled={!searchResults.pagination.hasNextPage}
                >
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Demo Footer */}
      {isDemoMode && searchResults && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="text-green-600 text-xl">✅</div>
                <div className="text-sm">
                  <strong>Demo Mode:</strong> Search completed in {Math.round(searchResults.searchStats?.searchTime || 0)}ms • 
                  All interactions work perfectly • Ready for stakeholder presentation
                </div>
              </div>
              <div className="flex space-x-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => showDemoNotification("Try: Search 'Priya', Filter by 'Female', Select multiple patients, Click Edit/View buttons!")}
                >
                  Demo Tips
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};