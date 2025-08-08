/**
 * HMS Mock Data Factory Index
 * Central export for all mock data generation functions
 */

// Export utility functions
export * from './utils/common';
export * from './utils/indian-data-generators';

// Export patient mock factory
export {
  generateCompletePatientRecord,
  generateFamilyGroup,
  generateFamilyMedicalHistory,
  generatePatient,
  generatePatients,
  generatePatientStatistics,
} from './patientMockFactory';

// Export user/staff mock factory
export {
  generateCompleteStaffRecord,
  generateDepartments,
  generateDepartmentStaff,
  generateDoctorSchedule,
  generateHospitalStaff,
  generateStaffStatistics,
  generateUser,
} from './userMockFactory';

// Export clinical mock factory
export {
  generateAppointment,
  generateAppointmentStatistics,
  generateClinicalStatistics,
  generateClinicalSummary,
  generateCompleteClinicalWorkflow,
  generateConsultation,
  generateDiagnosis,
  generateLabResult,
  generatePrescription,
  generatePrescriptionItems,
  generateQueueEntry,
  generateVitalsRecord,
} from './clinicalMockFactory';

// Export complete hospital data generator
export { generateCompleteHospitalData } from './hospitalDataGenerator';

// Re-export key types for convenience
export type {
  Appointment,
  ClinicalStatistics,
  CompletePatientRecord,
  CompleteStaffRecord,
  Consultation,
  Department,
  Patient,
  PatientStatistics,
  Prescription,
  StaffStatistics,
  User,
} from '@/types/hms';
