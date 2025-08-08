/**
 * HMS Enum Type Definitions
 * Matching database enum types from Schema.ts
 */

// User Role Enums (95+ roles)
export type UserRole =
  // Basic 10 roles
  | 'Doctor'
  | 'Nurse'
  | 'Receptionist'
  | 'Pharmacist'
  | 'Lab-Technician'
  | 'Admin'
  | 'Accountant'
  | 'Manager'
  | 'Support-Staff'
  | 'Billing-Manager'
  // Medical Staff (Senior & Specialized)
  | 'Medical-Superintendent'
  | 'Deputy-Medical-Superintendent'
  | 'Senior-Doctor'
  | 'Junior-Doctor'
  | 'Resident-Medical-Officer'
  | 'House-Officer'
  | 'Visiting-Consultant'
  | 'Specialist-Consultant'
  | 'Surgeon'
  | 'Assistant-Surgeon'
  | 'Anesthesiologist'
  | 'Radiologist'
  | 'Pathologist'
  | 'Microbiologist'
  | 'Emergency-Medicine-Doctor'
  | 'ICU-Specialist'
  | 'Pediatrician'
  | 'Gynecologist'
  | 'Orthopedic-Surgeon'
  | 'Cardiologist'
  | 'Neurologist'
  | 'Dermatologist'
  | 'ENT-Specialist'
  | 'Ophthalmologist'
  | 'Psychiatrist'
  | 'General-Surgeon'
  // Nursing Staff
  | 'Chief-Nursing-Officer'
  | 'Deputy-Nursing-Officer'
  | 'Nursing-Superintendent'
  | 'Nursing-Supervisor'
  | 'Staff-Nurse'
  | 'Senior-Staff-Nurse'
  | 'Nursing-Assistant'
  | 'Nursing-Intern'
  | 'Ward-Sister'
  | 'ICU-Nurse'
  | 'OT-Nurse'
  | 'Emergency-Nurse'
  | 'Midwife'
  // Diagnostic & Technical
  | 'Chief-Lab-Technician'
  | 'Senior-Lab-Technician'
  | 'Radiology-Technician'
  | 'X-Ray-Technician'
  | 'CT-Technician'
  | 'MRI-Technician'
  | 'ECG-Technician'
  | 'Echo-Technician'
  | 'EEG-Technician'
  | 'Dialysis-Technician'
  | 'OT-Technician'
  | 'CSSD-Technician'
  | 'Anesthesia-Technician'
  // Pharmacy
  | 'Chief-Pharmacist'
  | 'Senior-Pharmacist'
  | 'Clinical-Pharmacist'
  | 'Pharmacy-Assistant'
  // Administration
  | 'Hospital-Administrator'
  | 'Assistant-Administrator'
  | 'HR-Manager'
  | 'HR-Executive'
  | 'Finance-Manager'
  | 'Marketing-Manager'
  | 'Quality-Manager'
  | 'IT-Manager'
  | 'IT-Support-Executive'
  | 'Stores-Manager'
  | 'Purchase-Officer'
  | 'Medical-Records-Officer'
  // Support Services
  | 'Ward-Boy'
  | 'Ward-Girl'
  | 'Ward-Attendant'
  | 'Patient-Care-Assistant'
  | 'Housekeeping-Supervisor'
  | 'Housekeeping-Staff'
  | 'Security-Supervisor'
  | 'Security-Guard'
  | 'Ambulance-Driver'
  | 'Ambulance-EMT'
  | 'Transport-Coordinator'
  | 'Front-Office-Executive'
  | 'Admission-Counselor'
  | 'Insurance-Coordinator'
  | 'Patient-Relations-Officer'
  // Allied Health Services
  | 'Physiotherapist'
  | 'Occupational-Therapist'
  | 'Speech-Therapist'
  | 'Dietitian'
  | 'Clinical-Nutritionist'
  | 'Medical-Social-Worker'
  | 'Clinical-Psychologist'
  | 'Counselor'
  // Indian Healthcare Specific
  | 'ASHA-Worker'
  | 'ANM'
  | 'CHO'
  | 'MPW'
  | 'Ayush-Doctor'
  | 'Ayurveda-Practitioner'
  | 'Yoga-Instructor'
  | 'Unani-Practitioner'
  | 'Siddha-Practitioner'
  | 'Homeopathy-Doctor'
  | 'Camp-Coordinator'
  | 'Scheme-Coordinator'
  | 'Field-Health-Worker';

export type UserRoleCategory =
  | 'Medical'
  | 'Nursing'
  | 'Diagnostic'
  | 'Pharmacy'
  | 'Administrative'
  | 'Support-Services'
  | 'Allied-Health'
  | 'Indian-Healthcare'
  | 'Management';

export type EmploymentType =
  | 'Permanent'
  | 'Contract'
  | 'Part-Time'
  | 'Visiting'
  | 'Intern'
  | 'Resident'
  | 'Volunteer'
  | 'Consultant'
  | 'Temporary';

export type ShiftType =
  | 'Morning'
  | 'Evening'
  | 'Night'
  | 'Rotating'
  | 'On-Call'
  | 'Day-Shift'
  | 'Split-Shift'
  | 'Flexible';

export type Gender = 'Male' | 'Female' | 'Other';

export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export type UserStatus = 'Active' | 'Inactive' | 'Suspended' | 'Terminated';

export type PatientStatus = 'admitted' | 'outpatient' | 'discharged' | 'emergency' | 'inactive' | 'deceased';

export type AppointmentStatus = 'Scheduled' | 'Confirmed' | 'In-Progress' | 'Completed' | 'Cancelled' | 'No-Show' | 'Rescheduled';

export type QueueStatus = 'Waiting' | 'Called' | 'In-Progress' | 'Completed' | 'Skipped';

export type BedStatus = 'Available' | 'Occupied' | 'Under-Maintenance' | 'Blocked' | 'Dirty';

export type BillStatus = 'Draft' | 'Pending' | 'Partially-Paid' | 'Paid' | 'Overdue' | 'Cancelled';

export type PaymentMethod = 'Cash' | 'Card' | 'UPI' | 'Net-Banking' | 'Cheque' | 'DD' | 'Insurance';

export type MedicationRoute =
  | 'Oral'
  | 'IV'
  | 'IM'
  | 'SC'
  | 'Topical'
  | 'Inhalation'
  | 'Rectal'
  | 'Sublingual'
  | 'Buccal'
  | 'Nasal'
  | 'Ophthalmic'
  | 'Otic';

export type NursingNoteType =
  | 'Admission'
  | 'Routine'
  | 'Procedure'
  | 'Education'
  | 'Discharge'
  | 'Incident'
  | 'Handover'
  | 'Assessment'
  | 'Medication'
  | 'Progress';

export type AuditAction = 'create' | 'read' | 'update' | 'delete' | 'emergency_access';

export type AuditResource =
  | 'patient'
  | 'medical_record'
  | 'prescription'
  | 'appointment'
  | 'admission'
  | 'consultation'
  | 'lab_test'
  | 'imaging'
  | 'billing'
  | 'user'
  | 'role'
  | 'department'
  | 'audit_log'
  | 'system_setting'
  | 'sso_connection';

export type Severity = 'low' | 'medium' | 'high' | 'critical';

export type MessageStatus = 'pending' | 'sent' | 'delivered' | 'failed' | 'read';

export type CommunicationType = 'sms' | 'whatsapp' | 'email' | 'voice_call' | 'push_notification';

export type GovernmentScheme =
  | 'Ayushman-Bharat'
  | 'CGHS'
  | 'ESIC'
  | 'State-Scheme'
  | 'ECHS'
  | 'Railway-Medical'
  | 'Jan-Aushadhi'
  | 'Pradhan-Mantri-Suraksha-Bima'
  | 'Rashtriya-Swasthya-Bima';

export type FamilyRelationship =
  | 'SELF'
  | 'SPOUSE'
  | 'FATHER'
  | 'MOTHER'
  | 'SON'
  | 'DAUGHTER'
  | 'BROTHER'
  | 'SISTER'
  | 'GRANDFATHER'
  | 'GRANDMOTHER'
  | 'GRANDSON'
  | 'GRANDDAUGHTER'
  | 'UNCLE'
  | 'AUNT'
  | 'NEPHEW'
  | 'NIECE'
  | 'COUSIN'
  | 'FATHER_IN_LAW'
  | 'MOTHER_IN_LAW'
  | 'SON_IN_LAW'
  | 'DAUGHTER_IN_LAW'
  | 'BROTHER_IN_LAW'
  | 'SISTER_IN_LAW'
  | 'GUARDIAN'
  | 'CARETAKER'
  | 'FRIEND'
  | 'OTHER';

export type RelationshipCategory = 'Immediate' | 'Extended' | 'Guardian' | 'Other';

export type FamilyMemberStatus = 'Active' | 'Inactive' | 'Deceased';

export type FamilyIncomeCategory = 'BPL' | 'APL' | 'AAY' | 'Others';

export type FamilyAppointmentType = 'Family-Checkup' | 'Vaccination' | 'Consultation' | 'Health-Camp' | 'Other';

export type LegalDocumentType = 'Birth-Certificate' | 'Court-Order' | 'Notarized-Letter' | 'Other';

export type PolicyType = 'Family-Floater' | 'Individual-Sum-Insured' | 'Group-Cover';

export type ConditionSeverity = 'Mild' | 'Moderate' | 'Severe' | 'Fatal';

// ICU Management Enums
export type ICUBedType = 'General' | 'Isolation' | 'Cardiac' | 'Neurological' | 'Pediatric' | 'Neonatal';

export type ICUBedStatus = 'Available' | 'Occupied' | 'Maintenance' | 'Isolation' | 'Reserved' | 'Out-of-Service';

export type ICUAlertType =
  | 'Vital-Critical'
  | 'Equipment-Failure'
  | 'Medication-Due'
  | 'Protocol-Violation'
  | 'Emergency-Response'
  | 'Staff-Required';

export type ICUAlertSeverity = 'Low' | 'Medium' | 'High' | 'Critical' | 'Emergency';

export type ICUShiftType = 'Morning' | 'Evening' | 'Night' | 'Extended';

export type ICUShiftStatus = 'Scheduled' | 'Active' | 'Completed' | 'Missed' | 'Cancelled';

export type CarePlanStatus = 'Active' | 'Completed' | 'Overdue' | 'Cancelled' | 'On-Hold';

export type EquipmentStatus =
  | 'Functional'
  | 'Maintenance-Required'
  | 'Critical-Failure'
  | 'Calibration-Due'
  | 'Out-of-Service';

export type EquipmentType =
  | 'Ventilator'
  | 'Cardiac-Monitor'
  | 'Infusion-Pump'
  | 'Defibrillator'
  | 'Oxygen-Concentrator'
  | 'IABP'
  | 'ECMO'
  | 'Dialysis-Machine';

// Helper type for role categories
export const RoleCategoryMap: Record<UserRoleCategory, UserRole[]> = {
  'Medical': [
    'Doctor',
    'Medical-Superintendent',
    'Deputy-Medical-Superintendent',
    'Senior-Doctor',
    'Junior-Doctor',
    'Resident-Medical-Officer',
    'House-Officer',
    'Visiting-Consultant',
    'Specialist-Consultant',
    'Surgeon',
    'Assistant-Surgeon',
    'Anesthesiologist',
    'Radiologist',
    'Pathologist',
    'Microbiologist',
    'Emergency-Medicine-Doctor',
    'ICU-Specialist',
    'Pediatrician',
    'Gynecologist',
    'Orthopedic-Surgeon',
    'Cardiologist',
    'Neurologist',
    'Dermatologist',
    'ENT-Specialist',
    'Ophthalmologist',
    'Psychiatrist',
    'General-Surgeon',
  ],
  'Nursing': [
    'Nurse',
    'Chief-Nursing-Officer',
    'Deputy-Nursing-Officer',
    'Nursing-Superintendent',
    'Nursing-Supervisor',
    'Staff-Nurse',
    'Senior-Staff-Nurse',
    'Nursing-Assistant',
    'Nursing-Intern',
    'Ward-Sister',
    'ICU-Nurse',
    'OT-Nurse',
    'Emergency-Nurse',
    'Midwife',
  ],
  'Diagnostic': [
    'Lab-Technician',
    'Chief-Lab-Technician',
    'Senior-Lab-Technician',
    'Radiology-Technician',
    'X-Ray-Technician',
    'CT-Technician',
    'MRI-Technician',
    'ECG-Technician',
    'Echo-Technician',
    'EEG-Technician',
    'Dialysis-Technician',
    'OT-Technician',
    'CSSD-Technician',
    'Anesthesia-Technician',
  ],
  'Pharmacy': [
    'Pharmacist',
    'Chief-Pharmacist',
    'Senior-Pharmacist',
    'Clinical-Pharmacist',
    'Pharmacy-Assistant',
  ],
  'Administrative': [
    'Admin',
    'Hospital-Administrator',
    'Assistant-Administrator',
    'HR-Manager',
    'HR-Executive',
    'Finance-Manager',
    'Marketing-Manager',
    'Quality-Manager',
    'IT-Manager',
    'IT-Support-Executive',
    'Stores-Manager',
    'Purchase-Officer',
    'Medical-Records-Officer',
  ],
  'Support-Services': [
    'Support-Staff',
    'Ward-Boy',
    'Ward-Girl',
    'Ward-Attendant',
    'Patient-Care-Assistant',
    'Housekeeping-Supervisor',
    'Housekeeping-Staff',
    'Security-Supervisor',
    'Security-Guard',
    'Ambulance-Driver',
    'Ambulance-EMT',
    'Transport-Coordinator',
    'Front-Office-Executive',
    'Admission-Counselor',
    'Insurance-Coordinator',
    'Patient-Relations-Officer',
  ],
  'Allied-Health': [
    'Physiotherapist',
    'Occupational-Therapist',
    'Speech-Therapist',
    'Dietitian',
    'Clinical-Nutritionist',
    'Medical-Social-Worker',
    'Clinical-Psychologist',
    'Counselor',
  ],
  'Indian-Healthcare': [
    'ASHA-Worker',
    'ANM',
    'CHO',
    'MPW',
    'Ayush-Doctor',
    'Ayurveda-Practitioner',
    'Yoga-Instructor',
    'Unani-Practitioner',
    'Siddha-Practitioner',
    'Homeopathy-Doctor',
    'Camp-Coordinator',
    'Scheme-Coordinator',
    'Field-Health-Worker',
  ],
  'Management': [
    'Manager',
    'Accountant',
    'Billing-Manager',
    'Receptionist',
  ],
};

// Re-export User Types and Functions
export type { RolePermissions } from './user.types';
export { getRolePermissions } from './user.types';
