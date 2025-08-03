import { useAuth } from '@clerk/nextjs';
import { useQuery } from '@tanstack/react-query';

// Types
export type Patient = {
  patientId: string;
  patientCode: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  email?: string;
  address?: string;
  emergencyContactName?: string;
  status?: 'admitted' | 'outpatient' | 'discharged' | 'emergency';
  bloodGroup?: string;
  admissionDate?: string;
  currentDepartmentId?: string;
  createdAt: string;
  updatedAt: string;
};

export type PatientSearchParams = {
  query?: string;
  page?: number;
  pageSize?: number;
  gender?: 'Male' | 'Female' | 'Other';
  status?: 'admitted' | 'outpatient' | 'discharged' | 'emergency';
  bloodGroup?: string;
  admissionDateFrom?: string;
  admissionDateTo?: string;
  departmentId?: string;
};

export type PatientSearchResponse = {
  data: Patient[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
};

// API Functions
async function searchPatients(params: PatientSearchParams = {}): Promise<PatientSearchResponse> {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value));
    }
  });

  const response = await fetch(`/api/patients?${searchParams.toString()}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Failed to search patients');
  }

  return response.json();
}

async function fetchPatient(patientId: string): Promise<Patient> {
  const response = await fetch(`/api/patients/${patientId}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Failed to fetch patient');
  }

  const data = await response.json();
  return data.data || data;
}

// React Query Hooks
export function usePatients(params: PatientSearchParams = {}) {
  const { isSignedIn } = useAuth();

  return useQuery({
    queryKey: ['patients', params],
    queryFn: () => searchPatients(params),
    enabled: isSignedIn,
    staleTime: 30 * 1000, // 30 seconds
    cacheTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function usePatientSearch(searchQuery: string, options: Omit<PatientSearchParams, 'query'> = {}) {
  return usePatients({
    ...options,
    query: searchQuery || undefined,
    pageSize: options.pageSize || 10,
  });
}

export function usePatient(patientId: string) {
  const { isSignedIn } = useAuth();

  return useQuery({
    queryKey: ['patient', patientId],
    queryFn: () => fetchPatient(patientId),
    enabled: isSignedIn && !!patientId,
    staleTime: 60 * 1000, // 1 minute
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function usePatientHistory(patientId: string) {
  const { isSignedIn } = useAuth();

  return useQuery({
    queryKey: ['patient-history', patientId],
    queryFn: async () => {
      const response = await fetch(`/api/patients/${patientId}/history`);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to fetch patient history');
      }

      return response.json();
    },
    enabled: isSignedIn && !!patientId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Helper functions
export function formatPatientName(patient: Patient): string {
  const parts = [patient.firstName];
  if (patient.middleName) {
    parts.push(patient.middleName);
  }
  parts.push(patient.lastName);
  return parts.join(' ');
}

export function calculateAge(dateOfBirth: string): number {
  if (!dateOfBirth) {
    return 0;
  }
  const today = new Date();
  const birth = new Date(dateOfBirth);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

// Format patient for display in UI
export function formatPatientForDisplay(patient: Patient) {
  return {
    id: patient.patientId,
    name: formatPatientName(patient),
    age: calculateAge(patient.dateOfBirth),
    gender: patient.gender,
    mrn: patient.patientCode,
    phone: patient.phone,
    email: patient.email,
    status: patient.status,
    bloodGroup: patient.bloodGroup,
  };
}

// Real-time statistics types
export type PatientStatistics = {
  totalPatients: number;
  admitted: number;
  outpatient: number;
  discharged: number;
  emergency: number;
  todayRegistrations: number;
  todayAppointments: number;
  todayConsultations: number;
};

export type TodayActivity = {
  appointments: number;
  consultations: number;
  registrations: number;
  emergencies: number;
};

// API functions for statistics
async function fetchPatientStatistics(): Promise<PatientStatistics> {
  const response = await fetch('/api/patients/statistics');
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Failed to fetch patient statistics');
  }
  
  const data = await response.json();
  return data.data || data;
}

async function fetchTodayActivity(): Promise<TodayActivity> {
  const response = await fetch('/api/analytics/today');
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Failed to fetch today\'s activity');
  }
  
  const data = await response.json();
  return data.data || data;
}

// Real-time statistics hooks
export function usePatientStatistics() {
  const { isSignedIn } = useAuth();

  return useQuery({
    queryKey: ['patient-statistics'],
    queryFn: fetchPatientStatistics,
    enabled: isSignedIn,
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Refetch every minute
    refetchIntervalInBackground: true,
  });
}

export function useTodayActivity() {
  const { isSignedIn } = useAuth();

  return useQuery({
    queryKey: ['today-activity'],
    queryFn: fetchTodayActivity,
    enabled: isSignedIn,
    staleTime: 15 * 1000, // 15 seconds (more frequent for real-time feel)
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
    refetchIntervalInBackground: true,
  });
}
