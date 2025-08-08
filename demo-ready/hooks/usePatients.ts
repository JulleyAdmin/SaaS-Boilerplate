// Ready-to-use Patient Hooks with Demo Support
// Drop this into: src/hooks/api/usePatients.ts (replace existing)

'use client';

import { useState, useCallback } from 'react';
import { MOCK_PATIENTS, MockPatient, searchPatients, getPatientById } from '@/data/mock-patients';

// Types
export interface PatientSearchParams {
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

export interface PatientSearchResponse {
  data: MockPatient[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  searchStats?: {
    query: string;
    resultsCount: number;
    searchTime: number;
  };
}

export interface CreatePatientRequest {
  name: string;
  gender: 'male' | 'female';
  dateOfBirth: string;
  phone: string;
  email?: string;
  bloodGroup?: string;
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    country?: string;
  };
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  aadhaarNumber: string;
  allergies?: string[];
  currentMedications?: string[];
  medicalHistory?: string[];
  insurance?: {
    provider: string;
    policyNumber?: string;
    validUntil?: string;
  };
}

// Demo Mode Detection
const isDemoMode = () => {
  if (typeof window === 'undefined') return true; // Default to demo mode on server
  return process.env.NODE_ENV === 'development' || 
         localStorage.getItem('hospitalos_demo_mode') === 'true' ||
         process.env.NEXT_PUBLIC_DEMO_MODE === 'true';
};

// Mock API delay simulation
const simulateDelay = (min = 200, max = 800) => {
  const delay = Math.random() * (max - min) + min;
  return new Promise(resolve => setTimeout(resolve, delay));
};

// Calculate age utility
const calculateAge = (dateOfBirth: string): number => {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

// Local storage for demo persistence
const getDemoPatients = (): MockPatient[] => {
  if (typeof window === 'undefined') return MOCK_PATIENTS;
  
  try {
    const stored = localStorage.getItem('demo_patients');
    return stored ? JSON.parse(stored) : MOCK_PATIENTS;
  } catch {
    return MOCK_PATIENTS;
  }
};

const saveDemoPatients = (patients: MockPatient[]) => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem('demo_patients', JSON.stringify(patients));
  } catch (error) {
    console.warn('Failed to save demo patients:', error);
  }
};

// Main Patient Hooks
export const usePatients = () => {
  const [patients, setPatients] = useState<MockPatient[]>(getDemoPatients);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Search patients
  const searchPatientsAsync = useCallback(async (params: PatientSearchParams = {}): Promise<PatientSearchResponse> => {
    if (!isDemoMode()) {
      throw new Error('Real API not implemented yet');
    }

    setLoading(true);
    setError(null);

    try {
      // Simulate API delay
      await simulateDelay(300, 700);

      let results = [...patients];

      // Apply search query
      if (params.query?.trim()) {
        const query = params.query.toLowerCase().trim();
        results = results.filter(patient => {
          return (
            patient.name.toLowerCase().includes(query) ||
            patient.patientCode.toLowerCase().includes(query) ||
            patient.phone.includes(query) ||
            patient.email.toLowerCase().includes(query) ||
            patient.aadhaarNumber.includes(query)
          );
        });
      }

      // Apply filters
      if (params.filters) {
        const { gender, ageRange, status, bloodGroup, city, state } = params.filters;

        if (gender) {
          results = results.filter(p => p.gender === gender);
        }

        if (status) {
          results = results.filter(p => p.status === status);
        }

        if (bloodGroup) {
          results = results.filter(p => p.bloodGroup === bloodGroup);
        }

        if (city) {
          results = results.filter(p => p.address.city.toLowerCase() === city.toLowerCase());
        }

        if (state) {
          results = results.filter(p => p.address.state.toLowerCase() === state.toLowerCase());
        }

        if (ageRange) {
          results = results.filter(p => {
            const age = calculateAge(p.dateOfBirth);
            return age >= ageRange.min && age <= ageRange.max;
          });
        }
      }

      // Apply sorting
      if (params.sortBy) {
        results.sort((a, b) => {
          let aValue: any, bValue: any;

          switch (params.sortBy) {
            case 'name':
              aValue = a.name.toLowerCase();
              bValue = b.name.toLowerCase();
              break;
            case 'age':
              aValue = calculateAge(a.dateOfBirth);
              bValue = calculateAge(b.dateOfBirth);
              break;
            case 'registrationDate':
              aValue = new Date(a.registrationDate);
              bValue = new Date(b.registrationDate);
              break;
            case 'lastVisit':
              aValue = a.lastVisit ? new Date(a.lastVisit) : new Date(0);
              bValue = b.lastVisit ? new Date(b.lastVisit) : new Date(0);
              break;
            default:
              return 0;
          }

          if (aValue < bValue) return params.sortOrder === 'asc' ? -1 : 1;
          if (aValue > bValue) return params.sortOrder === 'asc' ? 1 : -1;
          return 0;
        });
      } else {
        // Default sort by registration date (newest first)
        results.sort((a, b) => new Date(b.registrationDate).getTime() - new Date(a.registrationDate).getTime());
      }

      // Pagination
      const totalResults = results.length;
      const page = params.page || 1;
      const pageSize = params.pageSize || 10;
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedResults = results.slice(startIndex, endIndex);

      return {
        data: paginatedResults,
        pagination: {
          page,
          pageSize,
          total: totalResults,
          totalPages: Math.ceil(totalResults / pageSize),
          hasNextPage: endIndex < totalResults,
          hasPreviousPage: page > 1,
        },
        searchStats: {
          query: params.query || '',
          resultsCount: totalResults,
          searchTime: Math.random() * 100 + 50,
        },
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to search patients';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [patients]);

  // Get patient by ID
  const getPatient = useCallback(async (id: string): Promise<MockPatient> => {
    if (!isDemoMode()) {
      throw new Error('Real API not implemented yet');
    }

    setLoading(true);
    setError(null);

    try {
      await simulateDelay(200, 500);

      const patient = patients.find(p => p.id === id);
      if (!patient) {
        throw new Error(`Patient with ID ${id} not found`);
      }

      return patient;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get patient';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [patients]);

  // Create patient
  const createPatient = useCallback(async (patientData: CreatePatientRequest): Promise<MockPatient> => {
    if (!isDemoMode()) {
      throw new Error('Real API not implemented yet');
    }

    setLoading(true);
    setError(null);

    try {
      await simulateDelay(500, 1200);

      // Simulate validation errors occasionally (10% chance)
      if (Math.random() < 0.1) {
        throw new Error('Phone number already exists in our records');
      }

      // Generate new patient
      const newPatient: MockPatient = {
        ...patientData,
        id: `PAT-${Date.now()}`,
        patientCode: `P-2025-${String(patients.length + 1).padStart(4, '0')}`,
        age: calculateAge(patientData.dateOfBirth),
        status: 'active',
        registrationDate: new Date().toISOString(),
        lastVisit: undefined,
        totalVisits: 0,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(patientData.name)}&backgroundColor=b6e3f4`,
        _isDemoData: true,
        address: {
          ...patientData.address,
          country: patientData.address.country || 'India',
        },
        allergies: patientData.allergies || [],
        currentMedications: patientData.currentMedications || [],
        medicalHistory: patientData.medicalHistory || [],
        insurance: patientData.insurance || { provider: 'Self Pay' },
      };

      // Add to patients list
      const updatedPatients = [newPatient, ...patients];
      setPatients(updatedPatients);
      saveDemoPatients(updatedPatients);

      return newPatient;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create patient';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [patients]);

  // Update patient
  const updatePatient = useCallback(async (id: string, updates: Partial<MockPatient>): Promise<MockPatient> => {
    if (!isDemoMode()) {
      throw new Error('Real API not implemented yet');
    }

    setLoading(true);
    setError(null);

    try {
      await simulateDelay(400, 800);

      const patientIndex = patients.findIndex(p => p.id === id);
      if (patientIndex === -1) {
        throw new Error(`Patient with ID ${id} not found`);
      }

      // Update patient
      const updatedPatient = {
        ...patients[patientIndex],
        ...updates,
        age: updates.dateOfBirth ? calculateAge(updates.dateOfBirth) : patients[patientIndex].age,
      };

      // Update patients list
      const updatedPatients = [...patients];
      updatedPatients[patientIndex] = updatedPatient;
      setPatients(updatedPatients);
      saveDemoPatients(updatedPatients);

      return updatedPatient;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update patient';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [patients]);

  // Delete patient (soft delete)
  const deletePatient = useCallback(async (id: string): Promise<void> => {
    if (!isDemoMode()) {
      throw new Error('Real API not implemented yet');
    }

    setLoading(true);
    setError(null);

    try {
      await simulateDelay(300, 600);

      const patientIndex = patients.findIndex(p => p.id === id);
      if (patientIndex === -1) {
        throw new Error(`Patient with ID ${id} not found`);
      }

      // Soft delete by marking as inactive
      const updatedPatients = [...patients];
      updatedPatients[patientIndex] = {
        ...updatedPatients[patientIndex],
        status: 'inactive',
      };

      setPatients(updatedPatients);
      saveDemoPatients(updatedPatients);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete patient';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [patients]);

  // Reset demo data
  const resetDemoData = useCallback(() => {
    const freshPatients = [...MOCK_PATIENTS];
    setPatients(freshPatients);
    saveDemoPatients(freshPatients);
  }, []);

  // Get stats
  const getStats = useCallback(() => {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    return {
      totalPatients: patients.length,
      activePatients: patients.filter(p => p.status === 'active').length,
      inactivePatients: patients.filter(p => p.status === 'inactive').length,
      newThisWeek: patients.filter(p => new Date(p.registrationDate) > oneWeekAgo).length,
      averageAge: Math.round(
        patients.reduce((sum, p) => sum + calculateAge(p.dateOfBirth), 0) / patients.length
      ),
      genderDistribution: {
        male: patients.filter(p => p.gender === 'male').length,
        female: patients.filter(p => p.gender === 'female').length,
      },
    };
  }, [patients]);

  return {
    // Data
    patients,
    loading,
    error,
    
    // Methods
    searchPatients: searchPatientsAsync,
    getPatient,
    createPatient,
    updatePatient,
    deletePatient,
    
    // Demo utilities
    resetDemoData,
    getStats,
    isDemoMode: isDemoMode(),
  };
};