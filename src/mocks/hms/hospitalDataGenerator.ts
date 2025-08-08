/**
 * Complete Hospital Data Generator
 * Generates comprehensive mock data for entire hospital
 */

import type {
  Appointment,
  Clinic,
  Consultation,
  Diagnosis,
  HMSDashboardStats,
  HMSMasterData,
  LabResult,
  Prescription,
  PrescriptionItem,
  QueueEntry,
  Vitals,
} from '@/types/hms';

import {
  generateAppointmentStatistics,
  generateClinicalStatistics,
  generateCompleteClinicalWorkflow,
} from './clinicalMockFactory';
import {
  generateFamilyGroup,
  generatePatients,
  generatePatientStatistics,
} from './patientMockFactory';
import {
  generateHospitalStaff,
} from './userMockFactory';
import {
  formatDate,
  generateUUID,
  pickRandom,
  randomInt,
} from './utils/common';

/**
 * Configuration for hospital data generation
 */
export type HospitalDataConfig = {
  clinicId?: string;
  patientCount?: number;
  includeCompletedWorkflows?: boolean;
  includeFutureAppointments?: boolean;
  clinicalWorkflowsPerPatient?: number;
  generateFamilies?: boolean;
};

/**
 * Generate complete hospital data
 */
export async function generateCompleteHospitalData(
  config: HospitalDataConfig = {},
): Promise<{
    clinic: Clinic;
    masterData: HMSMasterData;
    dashboardStats: HMSDashboardStats;
    clinicalData: {
      appointments: Appointment[];
      consultations: Consultation[];
      prescriptions: Prescription[];
      vitals: Vitals[];
      diagnoses: Diagnosis[];
      prescriptionItems: PrescriptionItem[];
      labResults: LabResult[];
      queueEntries: QueueEntry[];
    };
  }> {
  // Configuration with defaults
  const {
    clinicId = generateUUID(),
    patientCount = 100,
    includeCompletedWorkflows = true,
    includeFutureAppointments = true,
    clinicalWorkflowsPerPatient = 2,
    generateFamilies = true,
  } = config;

  // Generate clinic
  const clinic: Clinic = {
    clinicId,
    clinicName: 'Apollo Multi-Specialty Hospital',
    clinicCode: 'APOLLO-001',
    clinicType: 'Multi-Specialty Hospital',

    // Indian healthcare registration
    registrationNumber: 'MH/MUM/HSP/2020/001',
    ayushmanBharatId: 'AB-MH-001234',
    cghsEmpanelmentNumber: 'CGHS/MUM/2021/456',
    esicRegistrationNumber: 'ESIC/MH/789',

    // Contact
    address: '123, Hospital Road, Andheri West',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    pincode: '400058',
    phone: '+91-22-12345678',
    email: 'info@apollohospital.com',
    website: 'https://apollohospital.com',

    // Capacity
    totalBeds: 500,
    icuBeds: 50,
    emergencyBeds: 20,

    // Services
    servicesOffered: [
      'Emergency Care',
      'ICU',
      'Surgery',
      'Cardiology',
      'Neurology',
      'Orthopedics',
      'Pediatrics',
      'Obstetrics & Gynecology',
      'Radiology',
      'Laboratory',
      'Pharmacy',
    ],

    specialties: [
      'Cardiology',
      'Neurology',
      'Orthopedics',
      'Pediatrics',
      'Gynecology',
      'General Medicine',
      'Surgery',
    ],

    emergencyServices24x7: true,
    multiTenant: false,
    timezone: 'Asia/Kolkata',
    defaultLanguage: 'en',

    isActive: true,
    createdAt: formatDate(new Date(2020, 0, 1)),
    updatedAt: formatDate(new Date()),
  };

  // Generate hospital staff
  console.log('Generating hospital staff...');
  const { departments, users, statistics: staffStats } = generateHospitalStaff(clinicId);

  // Generate patients
  console.log(`Generating ${patientCount} patients...`);
  const patients = generatePatients(patientCount, clinicId);
  const patientStats = generatePatientStatistics(patients);

  // Generate families if requested
  const families = [];
  if (generateFamilies) {
    console.log('Generating family groups...');
    // Create families for 30% of patients
    const familyCount = Math.floor(patientCount * 0.3);
    for (let i = 0; i < familyCount; i++) {
      const primaryPatient = patients[i];
      const family = generateFamilyGroup(primaryPatient, randomInt(2, 4));
      families.push(family);
    }
  }

  // Clinical data collections
  const appointments: Appointment[] = [];
  const consultations: Consultation[] = [];
  const prescriptions: Prescription[] = [];
  const vitals: Vitals[] = [];
  const diagnoses: Diagnosis[] = [];
  const prescriptionItems: PrescriptionItem[] = [];
  const labResults: LabResult[] = [];
  const queueEntries: QueueEntry[] = [];

  // Get all doctors
  const doctors = users.filter(u =>
    u.role.includes('Doctor')
    || u.role.includes('Surgeon')
    || u.role.includes('Specialist'),
  );

  // Generate clinical workflows
  if (includeCompletedWorkflows) {
    console.log('Generating clinical workflows...');

    patients.forEach((patient, index) => {
      // Generate completed workflows
      for (let i = 0; i < clinicalWorkflowsPerPatient; i++) {
        const doctor = pickRandom(doctors);
        const department = departments.find(d => d.departmentId === doctor.departmentId) || departments[0];

        const workflow = generateCompleteClinicalWorkflow(
          patient,
          doctor,
          department,
          'completed',
        );

        appointments.push(workflow.appointment);
        if (workflow.vitals) {
          vitals.push(workflow.vitals);
        }
        if (workflow.consultation) {
          consultations.push(workflow.consultation);
        }
        if (workflow.diagnosis) {
          diagnoses.push(workflow.diagnosis);
        }
        if (workflow.prescription) {
          prescriptions.push(workflow.prescription);
        }
        if (workflow.prescriptionItems) {
          prescriptionItems.push(...workflow.prescriptionItems);
        }
        if (workflow.labResults) {
          labResults.push(...workflow.labResults);
        }
        if (workflow.queueEntry) {
          queueEntries.push(workflow.queueEntry);
        }
      }

      // Progress indicator
      if ((index + 1) % 10 === 0) {
        console.log(`  Processed ${index + 1}/${patients.length} patients...`);
      }
    });
  }

  // Generate future appointments
  if (includeFutureAppointments) {
    console.log('Generating future appointments...');

    // Generate future appointments for 20% of patients
    const futureAppointmentCount = Math.floor(patientCount * 0.2);
    for (let i = 0; i < futureAppointmentCount; i++) {
      const patient = pickRandom(patients);
      const doctor = pickRandom(doctors);
      const department = departments.find(d => d.departmentId === doctor.departmentId) || departments[0];

      const workflow = generateCompleteClinicalWorkflow(
        patient,
        doctor,
        department,
        'scheduled',
      );

      appointments.push(workflow.appointment);
    }
  }

  // Generate statistics
  const appointmentStats = generateAppointmentStatistics(appointments);
  const clinicalStats = generateClinicalStatistics(appointments, consultations, prescriptions);

  // Create dashboard stats
  const dashboardStats: HMSDashboardStats = {
    patients: patientStats,
    staff: staffStats,
    clinical: clinicalStats,
    icu: {
      totalBeds: 50,
      occupiedBeds: randomInt(30, 45),
      availableBeds: randomInt(5, 20),
      criticalPatients: randomInt(10, 20),
      ventilatorInUse: randomInt(5, 15),
      averageStayDays: randomInt(3, 7),
      admissionsToday: randomInt(2, 8),
      dischargestoday: randomInt(1, 5),
    },
    pharmacy: {
      totalMedicines: randomInt(1000, 2000),
      lowStockItems: randomInt(50, 100),
      expiringSoon: randomInt(20, 50),
      ordersToday: randomInt(100, 200),
      prescriptionsToday: randomInt(80, 150),
      revenueToday: randomInt(50000, 150000),
    },
    billing: {
      totalRevenue: randomInt(1000000, 5000000),
      todayRevenue: randomInt(100000, 300000),
      pendingBills: randomInt(50, 150),
      overdueAmount: randomInt(50000, 200000),
      insuranceClaims: randomInt(100, 300),
      governmentSchemes: randomInt(200, 500),
    },
    communication: {
      messagesSentToday: randomInt(200, 500),
      whatsappMessages: randomInt(150, 400),
      smsMessages: randomInt(50, 100),
      emailsSent: randomInt(20, 50),
      appointmentReminders: randomInt(100, 200),
      campaignsSent: randomInt(1, 5),
    },
    audit: {
      totalLogs: randomInt(10000, 50000),
      todayLogs: randomInt(500, 1500),
      criticalEvents: randomInt(0, 5),
      loginAttempts: randomInt(100, 300),
      dataAccess: randomInt(1000, 3000),
      configChanges: randomInt(0, 10),
    },
  };

  // Create master data
  const masterData: HMSMasterData = {
    clinics: [clinic],
    departments,
    users,
    patients,
  };

  // Return complete data
  return {
    clinic,
    masterData,
    dashboardStats,
    clinicalData: {
      appointments,
      consultations,
      prescriptions,
      vitals,
      diagnoses,
      prescriptionItems,
      labResults,
      queueEntries,
    },
  };
}

/**
 * Generate demo data for UI showcase
 */
export async function generateDemoData(): Promise<HMSMasterData> {
  const result = await generateCompleteHospitalData({
    patientCount: 50,
    includeCompletedWorkflows: true,
    includeFutureAppointments: true,
    clinicalWorkflowsPerPatient: 1,
    generateFamilies: true,
  });

  return result.masterData;
}
