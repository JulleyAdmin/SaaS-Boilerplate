// Sample Implementation: Demo Mode Context
// Location: src/context/DemoModeContext.tsx

'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { MockPatientService } from '@/services/mock-patient.service';

// Demo scenario types
export interface DemoScenario {
  id: string;
  name: string;
  description: string;
  icon: string;
  steps: DemoStep[];
  estimatedTime: string;
  difficulty: 'easy' | 'medium' | 'advanced';
}

export interface DemoStep {
  id: string;
  title: string;
  description: string;
  action: string;
  path?: string;
  data?: Record<string, any>;
  expectedResult: string;
}

export interface DemoStats {
  totalPatients: number;
  activePatients: number;
  newThisWeek: number;
  averageAge: number;
  lastResetDate: string;
  demoSessionTime: number; // in minutes
}

// Context interface
interface DemoModeContextType {
  // Demo mode state
  isDemoMode: boolean;
  toggleDemoMode: () => void;
  
  // Demo scenarios
  currentScenario: DemoScenario | null;
  availableScenarios: DemoScenario[];
  setDemoScenario: (scenario: DemoScenario | null) => void;
  
  // Demo data management
  resetDemoData: () => Promise<void>;
  demoStats: DemoStats | null;
  refreshStats: () => Promise<void>;
  
  // Demo session management
  startDemoSession: (scenario?: DemoScenario) => void;
  endDemoSession: () => void;
  isInDemoSession: boolean;
  
  // Demo services
  mockPatientService: MockPatientService;
  
  // Demo UI controls
  showDemoTips: boolean;
  toggleDemoTips: () => void;
  demoSpeed: 'slow' | 'normal' | 'fast';
  setDemoSpeed: (speed: 'slow' | 'normal' | 'fast') => void;
}

// Pre-defined demo scenarios
const DEMO_SCENARIOS: DemoScenario[] = [
  {
    id: 'new-patient-registration',
    name: 'New Patient Registration',
    description: 'Complete workflow for registering a new patient with medical history',
    icon: '👤',
    estimatedTime: '5 minutes',
    difficulty: 'easy',
    steps: [
      {
        id: 'step-1',
        title: 'Navigate to Patient List',
        description: 'Go to the patient management section',
        action: 'navigate',
        path: '/en/dashboard/patients',
        expectedResult: 'Patient list page loads with existing patients'
      },
      {
        id: 'step-2',
        title: 'Start Registration',
        description: 'Click the "Add New Patient" button',
        action: 'click',
        expectedResult: 'Patient registration modal opens'
      },
      {
        id: 'step-3',
        title: 'Fill Personal Information',
        description: 'Enter patient demographics and contact details',
        action: 'fill-form',
        data: {
          name: 'Dr. Priya Sharma',
          dateOfBirth: '1988-03-15',
          gender: 'female',
          phone: '+91-9876543210',
          email: 'priya.sharma@example.com',
          bloodGroup: 'A+'
        },
        expectedResult: 'Form validates successfully and enables next step'
      },
      {
        id: 'step-4',
        title: 'Add Address Information',
        description: 'Complete address and location details',
        action: 'fill-form',
        data: {
          street: '123 MG Road',
          city: 'Bangalore',
          state: 'Karnataka',
          pincode: '560001'
        },
        expectedResult: 'Address section completed'
      },
      {
        id: 'step-5',
        title: 'Emergency Contact',
        description: 'Add emergency contact information',
        action: 'fill-form',
        data: {
          emergencyName: 'Raj Sharma',
          relationship: 'Husband',
          emergencyPhone: '+91-9876543211'
        },
        expectedResult: 'Emergency contact added successfully'
      },
      {
        id: 'step-6',
        title: 'Medical Information',
        description: 'Add initial medical history and allergies',
        action: 'fill-form',
        data: {
          allergies: ['Penicillin', 'Dust'],
          medicalHistory: ['Hypertension'],
          currentMedications: ['Lisinopril 10mg']
        },
        expectedResult: 'Medical information recorded'
      },
      {
        id: 'step-7',
        title: 'Submit Registration',
        description: 'Complete the patient registration process',
        action: 'submit',
        expectedResult: 'Patient registered successfully and appears in patient list'
      }
    ]
  },
  {
    id: 'patient-search-filters',
    name: 'Advanced Patient Search',
    description: 'Demonstrate powerful search and filtering capabilities',
    icon: '🔍',
    estimatedTime: '3 minutes',
    difficulty: 'medium',
    steps: [
      {
        id: 'search-1',
        title: 'Basic Search',
        description: 'Search for patients by name',
        action: 'search',
        data: { query: 'Priya' },
        expectedResult: 'All patients with "Priya" in their name are displayed'
      },
      {
        id: 'search-2',
        title: 'Filter by Gender',
        description: 'Apply gender filter to narrow results',
        action: 'filter',
        data: { gender: 'female' },
        expectedResult: 'Only female patients are shown'
      },
      {
        id: 'search-3',
        title: 'Age Range Filter',
        description: 'Filter patients by age group',
        action: 'filter',
        data: { ageRange: { min: 25, max: 45 } },
        expectedResult: 'Patients aged 25-45 are displayed'
      },
      {
        id: 'search-4',
        title: 'Location Filter',
        description: 'Filter by city or state',
        action: 'filter',
        data: { city: 'Bangalore' },
        expectedResult: 'Only patients from Bangalore are shown'
      },
      {
        id: 'search-5',
        title: 'Sort Results',
        description: 'Sort by registration date',
        action: 'sort',
        data: { sortBy: 'registrationDate', order: 'desc' },
        expectedResult: 'Most recently registered patients appear first'
      }
    ]
  },
  {
    id: 'patient-profile-management',
    name: 'Patient Profile Management',
    description: 'View and edit comprehensive patient information',
    icon: '📋',
    estimatedTime: '4 minutes',
    difficulty: 'medium',
    steps: [
      {
        id: 'profile-1',
        title: 'Open Patient Profile',
        description: 'Click on a patient to view their complete profile',
        action: 'click',
        expectedResult: 'Patient profile page opens with all details'
      },
      {
        id: 'profile-2',
        title: 'View Medical History',
        description: 'Explore the medical history timeline',
        action: 'navigate',
        expectedResult: 'Medical history displays with dates and conditions'
      },
      {
        id: 'profile-3',
        title: 'Edit Patient Information',
        description: 'Update patient contact details',
        action: 'edit',
        data: { phone: '+91-9876543299', email: 'new.email@example.com' },
        expectedResult: 'Patient information updated successfully'
      },
      {
        id: 'profile-4',
        title: 'Add Medical Note',
        description: 'Add a new medical history entry',
        action: 'add',
        data: { 
          condition: 'Annual Checkup',
          notes: 'Patient is in good health. Blood pressure normal.',
          date: new Date().toISOString().split('T')[0]
        },
        expectedResult: 'Medical note added to patient timeline'
      }
    ]
  },
  {
    id: 'bulk-operations',
    name: 'Bulk Patient Operations',
    description: 'Demonstrate bulk actions and data export features',
    icon: '📊',
    estimatedTime: '3 minutes',
    difficulty: 'advanced',
    steps: [
      {
        id: 'bulk-1',
        title: 'Select Multiple Patients',
        description: 'Use checkboxes to select several patients',
        action: 'select-multiple',
        expectedResult: 'Multiple patients selected, bulk action menu appears'
      },
      {
        id: 'bulk-2',
        title: 'Export Patient Data',
        description: 'Export selected patients to CSV/Excel',
        action: 'export',
        data: { format: 'excel' },
        expectedResult: 'Patient data exported successfully'
      },
      {
        id: 'bulk-3',
        title: 'Generate Reports',
        description: 'Create patient summary reports',
        action: 'generate-report',
        data: { reportType: 'demographics' },
        expectedResult: 'Demographics report generated and displayed'
      }
    ]
  }
];

// Create context
const DemoModeContext = createContext<DemoModeContextType | undefined>(undefined);

// Provider component
export const DemoModeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // State management
  const [isDemoMode, setIsDemoMode] = useState<boolean>(() => {
    // Check environment variable and localStorage
    if (typeof window !== 'undefined') {
      const envDemo = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';
      const storedDemo = localStorage.getItem('hospitalos_demo_mode') === 'true';
      return envDemo || storedDemo;
    }
    return process.env.NEXT_PUBLIC_DEMO_MODE === 'true';
  });

  const [currentScenario, setCurrentScenario] = useState<DemoScenario | null>(null);
  const [demoStats, setDemoStats] = useState<DemoStats | null>(null);
  const [isInDemoSession, setIsInDemoSession] = useState(false);
  const [showDemoTips, setShowDemoTips] = useState(true);
  const [demoSpeed, setDemoSpeed] = useState<'slow' | 'normal' | 'fast'>('normal');
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);

  // Initialize mock service
  const [mockPatientService] = useState(() => new MockPatientService());

  // Toggle demo mode
  const toggleDemoMode = useCallback(() => {
    const newMode = !isDemoMode;
    setIsDemoMode(newMode);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('hospitalos_demo_mode', String(newMode));
    }
    
    // End demo session if switching off demo mode
    if (!newMode && isInDemoSession) {
      endDemoSession();
    }
    
    // Refresh stats if entering demo mode
    if (newMode) {
      refreshStats();
    }
  }, [isDemoMode, isInDemoSession]);

  // Set demo scenario
  const setDemoScenario = useCallback((scenario: DemoScenario | null) => {
    setCurrentScenario(scenario);
  }, []);

  // Reset demo data
  const resetDemoData = useCallback(async () => {
    try {
      await mockPatientService.resetDemoData();
      await refreshStats();
      
      // Show success notification
      if (typeof window !== 'undefined' && 'notification' in window) {
        // You would use your toast/notification system here
        console.log('Demo data reset successfully');
      }
    } catch (error) {
      console.error('Failed to reset demo data:', error);
    }
  }, [mockPatientService]);

  // Refresh demo statistics
  const refreshStats = useCallback(async () => {
    if (!isDemoMode) return;
    
    try {
      const stats = await mockPatientService.getDemoStats();
      const sessionTime = sessionStartTime 
        ? Math.floor((Date.now() - sessionStartTime.getTime()) / 60000)
        : 0;
      
      setDemoStats({
        totalPatients: stats.totalPatients,
        activePatients: stats.activePatients,
        newThisWeek: stats.newThisWeek,
        averageAge: stats.averageAge,
        lastResetDate: localStorage.getItem('hospitalos_demo_reset_date') || 'Never',
        demoSessionTime: sessionTime,
      });
    } catch (error) {
      console.error('Failed to refresh demo stats:', error);
    }
  }, [isDemoMode, mockPatientService, sessionStartTime]);

  // Start demo session
  const startDemoSession = useCallback((scenario?: DemoScenario) => {
    setIsInDemoSession(true);
    setSessionStartTime(new Date());
    
    if (scenario) {
      setCurrentScenario(scenario);
    }
    
    // Track demo session start
    if (typeof window !== 'undefined') {
      localStorage.setItem('hospitalos_demo_session_start', new Date().toISOString());
    }
  }, []);

  // End demo session
  const endDemoSession = useCallback(() => {
    setIsInDemoSession(false);
    setCurrentScenario(null);
    setSessionStartTime(null);
    
    // Track demo session end
    if (typeof window !== 'undefined') {
      localStorage.removeItem('hospitalos_demo_session_start');
    }
  }, []);

  // Toggle demo tips
  const toggleDemoTips = useCallback(() => {
    const newValue = !showDemoTips;
    setShowDemoTips(newValue);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('hospitalos_demo_tips', String(newValue));
    }
  }, [showDemoTips]);

  // Load initial settings
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Load demo tips preference
      const savedTips = localStorage.getItem('hospitalos_demo_tips');
      if (savedTips !== null) {
        setShowDemoTips(savedTips === 'true');
      }

      // Load demo speed preference
      const savedSpeed = localStorage.getItem('hospitalos_demo_speed') as 'slow' | 'normal' | 'fast';
      if (savedSpeed) {
        setDemoSpeed(savedSpeed);
      }

      // Check if there was an active demo session
      const sessionStart = localStorage.getItem('hospitalos_demo_session_start');
      if (sessionStart) {
        setIsInDemoSession(true);
        setSessionStartTime(new Date(sessionStart));
      }
    }
  }, []);

  // Refresh stats when demo mode is enabled
  useEffect(() => {
    if (isDemoMode) {
      refreshStats();
      
      // Set up periodic stats refresh
      const interval = setInterval(refreshStats, 30000); // Every 30 seconds
      return () => clearInterval(interval);
    }
  }, [isDemoMode, refreshStats]);

  // Save demo speed preference
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('hospitalos_demo_speed', demoSpeed);
    }
  }, [demoSpeed]);

  // Context value
  const contextValue: DemoModeContextType = {
    // Demo mode state
    isDemoMode,
    toggleDemoMode,

    // Demo scenarios
    currentScenario,
    availableScenarios: DEMO_SCENARIOS,
    setDemoScenario,

    // Demo data management
    resetDemoData,
    demoStats,
    refreshStats,

    // Demo session management
    startDemoSession,
    endDemoSession,
    isInDemoSession,

    // Demo services
    mockPatientService,

    // Demo UI controls
    showDemoTips,
    toggleDemoTips,
    demoSpeed,
    setDemoSpeed,
  };

  return (
    <DemoModeContext.Provider value={contextValue}>
      {children}
    </DemoModeContext.Provider>
  );
};

// Hook to use demo mode context
export const useDemoMode = (): DemoModeContextType => {
  const context = useContext(DemoModeContext);
  if (context === undefined) {
    throw new Error('useDemoMode must be used within a DemoModeProvider');
  }
  return context;
};

// Hook for demo-aware services
export const useDemoServices = () => {
  const { isDemoMode, mockPatientService } = useDemoMode();
  
  return {
    patientService: isDemoMode ? mockPatientService : null, // Replace with real service
    isDemoMode,
  };
};

// Hook for demo scenarios
export const useDemoScenarios = () => {
  const { 
    currentScenario, 
    availableScenarios, 
    setDemoScenario,
    startDemoSession,
    endDemoSession,
    isInDemoSession 
  } = useDemoMode();
  
  const startScenario = useCallback((scenario: DemoScenario) => {
    setDemoScenario(scenario);
    startDemoSession(scenario);
  }, [setDemoScenario, startDemoSession]);
  
  const stopScenario = useCallback(() => {
    setDemoScenario(null);
    endDemoSession();
  }, [setDemoScenario, endDemoSession]);
  
  return {
    currentScenario,
    availableScenarios,
    startScenario,
    stopScenario,
    isInDemoSession,
  };
};