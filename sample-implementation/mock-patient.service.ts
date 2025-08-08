// Sample Implementation: Mock Patient Service
// Location: src/services/mock-patient.service.ts

import { Patient, CreatePatientRequest, PatientSearchParams, PatientSearchResponse } from '@/types/patient';
import { MOCK_PATIENTS_DATASET } from '@/data/mock-patients';

export class MockPatientService {
  private patients: Patient[] = [...MOCK_PATIENTS_DATASET];
  private storageKey = 'hospitalos_demo_patients';

  constructor() {
    this.loadFromStorage();
  }

  // Simulate realistic API delays
  private async simulateDelay(min = 200, max = 800): Promise<void> {
    const delay = Math.random() * (max - min) + min;
    return new Promise(resolve => setTimeout(resolve, delay));
  }

  // Load data from localStorage for session persistence
  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        this.patients = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Failed to load demo data from storage:', error);
    }
  }

  // Save data to localStorage
  private saveToStorage(): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.patients));
    } catch (error) {
      console.warn('Failed to save demo data to storage:', error);
    }
  }

  // CREATE: Add new patient
  async createPatient(patientData: CreatePatientRequest): Promise<Patient> {
    await this.simulateDelay(500, 1200);

    // Simulate validation errors occasionally (10% chance)
    if (Math.random() < 0.1) {
      throw new Error('Phone number already exists in our records');
    }

    // Generate unique patient ID and code
    const newPatient: Patient = {
      ...patientData,
      id: `PAT-${Date.now()}`,
      patientCode: `P-2025-${String(this.patients.length + 1).padStart(4, '0')}`,
      status: 'active',
      registrationDate: new Date().toISOString(),
      lastVisit: null,
      totalVisits: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Add to beginning of array (most recent first)
    this.patients.unshift(newPatient);
    this.saveToStorage();

    return newPatient;
  }

  // READ: Get patient by ID
  async getPatientById(id: string): Promise<Patient | null> {
    await this.simulateDelay(200, 500);

    const patient = this.patients.find(p => p.id === id);
    if (!patient) {
      throw new Error(`Patient with ID ${id} not found`);
    }

    return patient;
  }

  // UPDATE: Update patient information
  async updatePatient(id: string, updates: Partial<Patient>): Promise<Patient> {
    await this.simulateDelay(400, 800);

    const patientIndex = this.patients.findIndex(p => p.id === id);
    if (patientIndex === -1) {
      throw new Error(`Patient with ID ${id} not found`);
    }

    // Update patient data
    const updatedPatient = {
      ...this.patients[patientIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    this.patients[patientIndex] = updatedPatient;
    this.saveToStorage();

    return updatedPatient;
  }

  // DELETE: Remove patient (soft delete by marking inactive)
  async deletePatient(id: string): Promise<void> {
    await this.simulateDelay(300, 600);

    const patientIndex = this.patients.findIndex(p => p.id === id);
    if (patientIndex === -1) {
      throw new Error(`Patient with ID ${id} not found`);
    }

    // Soft delete by marking as inactive
    this.patients[patientIndex] = {
      ...this.patients[patientIndex],
      status: 'inactive',
      updatedAt: new Date().toISOString(),
    };

    this.saveToStorage();
  }

  // SEARCH: Advanced patient search with filters
  async searchPatients(params: PatientSearchParams): Promise<PatientSearchResponse> {
    await this.simulateDelay(300, 700);

    let results = [...this.patients];

    // Apply search query
    if (params.query && params.query.trim()) {
      const query = params.query.toLowerCase().trim();
      results = results.filter(patient => {
        const searchableFields = [
          patient.name,
          patient.patientCode,
          patient.phone,
          patient.email || '',
          patient.aadhaarNumber || '',
          patient.address?.city || '',
          patient.address?.state || '',
        ];
        
        return searchableFields.some(field => 
          field.toLowerCase().includes(query)
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
        results = results.filter(p => p.address?.city?.toLowerCase() === city.toLowerCase());
      }

      if (state) {
        results = results.filter(p => p.address?.state?.toLowerCase() === state.toLowerCase());
      }

      if (ageRange) {
        results = results.filter(p => {
          const age = this.calculateAge(p.dateOfBirth);
          return age >= ageRange.min && age <= ageRange.max;
        });
      }
    }

    // Apply sorting
    if (params.sortBy) {
      results = this.sortPatients(results, params.sortBy, params.sortOrder || 'asc');
    } else {
      // Default sort by registration date (newest first)
      results.sort((a, b) => new Date(b.registrationDate).getTime() - new Date(a.registrationDate).getTime());
    }

    // Calculate pagination
    const totalResults = results.length;
    const page = params.page || 1;
    const pageSize = params.pageSize || 10;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedResults = results.slice(startIndex, endIndex);

    // Return paginated response
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
      filters: {
        applied: params.filters || {},
        available: await this.getAvailableFilters(),
      },
      searchStats: {
        query: params.query || '',
        resultsCount: totalResults,
        searchTime: Math.random() * 100 + 50, // Mock search time in ms
      }
    };
  }

  // Get available filter options from current dataset
  private async getAvailableFilters() {
    const genders = [...new Set(this.patients.map(p => p.gender))].filter(Boolean);
    const bloodGroups = [...new Set(this.patients.map(p => p.bloodGroup))].filter(Boolean);
    const cities = [...new Set(this.patients.map(p => p.address?.city))].filter(Boolean);
    const states = [...new Set(this.patients.map(p => p.address?.state))].filter(Boolean);
    
    return {
      genders,
      bloodGroups,
      cities,
      states,
      ageRanges: [
        { label: '0-18', min: 0, max: 18 },
        { label: '19-30', min: 19, max: 30 },
        { label: '31-50', min: 31, max: 50 },
        { label: '51-70', min: 51, max: 70 },
        { label: '70+', min: 71, max: 120 },
      ],
      statuses: ['active', 'inactive'],
    };
  }

  // Utility: Calculate age from date of birth
  private calculateAge(dateOfBirth: string): number {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }

  // Utility: Sort patients by specified field
  private sortPatients(patients: Patient[], sortBy: string, order: 'asc' | 'desc'): Patient[] {
    return patients.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'age':
          aValue = this.calculateAge(a.dateOfBirth);
          bValue = this.calculateAge(b.dateOfBirth);
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

      if (aValue < bValue) return order === 'asc' ? -1 : 1;
      if (aValue > bValue) return order === 'asc' ? 1 : -1;
      return 0;
    });
  }

  // Utility: Reset demo data to original state
  async resetDemoData(): Promise<void> {
    this.patients = [...MOCK_PATIENTS_DATASET];
    this.saveToStorage();
  }

  // Utility: Get demo statistics
  async getDemoStats() {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    return {
      totalPatients: this.patients.length,
      activePatients: this.patients.filter(p => p.status === 'active').length,
      inactivePatients: this.patients.filter(p => p.status === 'inactive').length,
      newThisWeek: this.patients.filter(p => new Date(p.registrationDate) > oneWeekAgo).length,
      newThisMonth: this.patients.filter(p => new Date(p.registrationDate) > oneMonthAgo).length,
      averageAge: Math.round(
        this.patients.reduce((sum, p) => sum + this.calculateAge(p.dateOfBirth), 0) / this.patients.length
      ),
      genderDistribution: {
        male: this.patients.filter(p => p.gender === 'male').length,
        female: this.patients.filter(p => p.gender === 'female').length,
      },
    };
  }
}