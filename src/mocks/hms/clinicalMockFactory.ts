/**
 * Clinical Mock Data Factory
 * Generates realistic clinical workflow data (appointments, consultations, prescriptions)
 */

import type {
  Appointment,
  AppointmentStatistics,
  AppointmentStatus,
  ClinicalStatistics,
  ClinicalSummary,
  Consultation,
  ConsultationStatus,
  ConsultationType,
  Diagnosis,
  LabResult,
  Patient,
  PatientType,
  PaymentStatus,
  Prescription,
  PrescriptionItem,
  PrescriptionStatus,
  Priority,
  QueueEntry,
  QueueStatus,
  User,
  Vitals,
} from '@/types/hms';

import {
  createBatch,
  formatDate,
  formatDateTime,
  generateFutureDate,
  generatePastDate,
  generateUUID,
  pickMultipleRandom,
  pickRandom,
  randomBoolean,
  randomDecimal,
  randomInt,
} from './utils/common';
import {
  generatePrescriptionCode,
  generateVitals,
} from './utils/indian-data-generators';

// Common symptoms for different departments
const symptomsMap: Record<string, string[]> = {
  'General Medicine': [
    'Fever',
    'Cough',
    'Cold',
    'Body Pain',
    'Headache',
    'Weakness',
    'Loss of Appetite',
    'Nausea',
    'Vomiting',
    'Diarrhea',
    'Abdominal Pain',
  ],
  'Cardiology': [
    'Chest Pain',
    'Shortness of Breath',
    'Palpitations',
    'Dizziness',
    'Swelling in Legs',
    'Fatigue',
    'Irregular Heartbeat',
  ],
  'Orthopedics': [
    'Joint Pain',
    'Back Pain',
    'Knee Pain',
    'Shoulder Pain',
    'Muscle Strain',
    'Fracture',
    'Sports Injury',
    'Arthritis',
    'Neck Pain',
  ],
  'Pediatrics': [
    'Fever',
    'Cough',
    'Cold',
    'Ear Pain',
    'Stomach Ache',
    'Rash',
    'Poor Feeding',
    'Irritability',
    'Diarrhea',
    'Vomiting',
  ],
  'Gynecology': [
    'Irregular Periods',
    'Abdominal Pain',
    'Heavy Bleeding',
    'PCOD Symptoms',
    'Pregnancy Checkup',
    'Infertility Consultation',
    'Menopause Symptoms',
  ],
  'Neurology': [
    'Severe Headache',
    'Migraine',
    'Seizures',
    'Memory Loss',
    'Numbness',
    'Tingling Sensation',
    'Balance Problems',
    'Vision Problems',
  ],
  'Emergency': [
    'Severe Chest Pain',
    'Difficulty Breathing',
    'High Fever',
    'Severe Injury',
    'Unconsciousness',
    'Severe Bleeding',
    'Poisoning',
    'Accident',
  ],
};

// Common diagnoses with ICD-10 codes
const diagnosisMap: Record<string, Array<{ name: string; icd10: string }>> = {
  'General Medicine': [
    { name: 'Upper Respiratory Tract Infection', icd10: 'J06.9' },
    { name: 'Viral Fever', icd10: 'B34.9' },
    { name: 'Gastroenteritis', icd10: 'K52.9' },
    { name: 'Typhoid Fever', icd10: 'A01.0' },
    { name: 'Dengue Fever', icd10: 'A90' },
    { name: 'Malaria', icd10: 'B54' },
    { name: 'Diabetes Mellitus Type 2', icd10: 'E11.9' },
    { name: 'Hypertension', icd10: 'I10' },
  ],
  'Cardiology': [
    { name: 'Coronary Artery Disease', icd10: 'I25.1' },
    { name: 'Acute Myocardial Infarction', icd10: 'I21.9' },
    { name: 'Congestive Heart Failure', icd10: 'I50.0' },
    { name: 'Atrial Fibrillation', icd10: 'I48.0' },
    { name: 'Angina Pectoris', icd10: 'I20.9' },
  ],
  'Orthopedics': [
    { name: 'Osteoarthritis of Knee', icd10: 'M17.0' },
    { name: 'Lower Back Pain', icd10: 'M54.5' },
    { name: 'Fracture of Radius', icd10: 'S52.5' },
    { name: 'Cervical Spondylosis', icd10: 'M47.8' },
    { name: 'Rotator Cuff Syndrome', icd10: 'M75.3' },
  ],
  'Pediatrics': [
    { name: 'Acute Bronchitis', icd10: 'J20.9' },
    { name: 'Otitis Media', icd10: 'H66.9' },
    { name: 'Gastroenteritis', icd10: 'K52.9' },
    { name: 'Pneumonia', icd10: 'J18.9' },
    { name: 'Asthma', icd10: 'J45.9' },
  ],
  'Gynecology': [
    { name: 'Polycystic Ovarian Syndrome', icd10: 'E28.2' },
    { name: 'Menstrual Irregularities', icd10: 'N92.6' },
    { name: 'Pregnancy Supervision', icd10: 'Z34.0' },
    { name: 'Endometriosis', icd10: 'N80.9' },
    { name: 'Urinary Tract Infection', icd10: 'N39.0' },
  ],
  'Neurology': [
    { name: 'Migraine', icd10: 'G43.9' },
    { name: 'Epilepsy', icd10: 'G40.9' },
    { name: 'Parkinson Disease', icd10: 'G20' },
    { name: 'Stroke', icd10: 'I64' },
    { name: 'Peripheral Neuropathy', icd10: 'G62.9' },
  ],
};

// Common medicines prescribed
const medicineList = [
  // Antibiotics
  { name: 'Amoxicillin 500mg', category: 'Antibiotic', dosageForm: 'Tablet' },
  { name: 'Azithromycin 500mg', category: 'Antibiotic', dosageForm: 'Tablet' },
  { name: 'Cefixime 200mg', category: 'Antibiotic', dosageForm: 'Tablet' },
  { name: 'Ciprofloxacin 500mg', category: 'Antibiotic', dosageForm: 'Tablet' },

  // Analgesics
  { name: 'Paracetamol 500mg', category: 'Analgesic', dosageForm: 'Tablet' },
  { name: 'Diclofenac 50mg', category: 'NSAID', dosageForm: 'Tablet' },
  { name: 'Ibuprofen 400mg', category: 'NSAID', dosageForm: 'Tablet' },

  // Antacids
  { name: 'Pantoprazole 40mg', category: 'PPI', dosageForm: 'Tablet' },
  { name: 'Ranitidine 150mg', category: 'H2 Blocker', dosageForm: 'Tablet' },

  // Vitamins
  { name: 'Vitamin D3 60000 IU', category: 'Vitamin', dosageForm: 'Capsule' },
  { name: 'B-Complex', category: 'Vitamin', dosageForm: 'Tablet' },
  { name: 'Vitamin C 500mg', category: 'Vitamin', dosageForm: 'Tablet' },

  // Diabetes
  { name: 'Metformin 500mg', category: 'Antidiabetic', dosageForm: 'Tablet' },
  { name: 'Glimepiride 2mg', category: 'Antidiabetic', dosageForm: 'Tablet' },

  // Hypertension
  { name: 'Amlodipine 5mg', category: 'Antihypertensive', dosageForm: 'Tablet' },
  { name: 'Telmisartan 40mg', category: 'Antihypertensive', dosageForm: 'Tablet' },
  { name: 'Atenolol 50mg', category: 'Beta Blocker', dosageForm: 'Tablet' },

  // Syrups
  { name: 'Cough Syrup', category: 'Cough Suppressant', dosageForm: 'Syrup' },
  { name: 'Paracetamol Syrup 125mg/5ml', category: 'Analgesic', dosageForm: 'Syrup' },
];

// Common dosage instructions
const dosageInstructions = [
  '1-0-1 (Before Food)',
  '1-1-1 (After Food)',
  '0-0-1 (After Food)',
  '1-0-0 (Before Breakfast)',
  '0-1-0 (After Lunch)',
  '1 tablespoon twice daily',
  '2 tablets stat then 1 tablet after 6 hours',
  'Once daily at bedtime',
  'Twice daily for 5 days',
  'Three times daily for 7 days',
];

// Lab test names
const labTests = [
  'Complete Blood Count (CBC)',
  'Blood Sugar Fasting',
  'Blood Sugar PP',
  'HbA1c',
  'Lipid Profile',
  'Liver Function Test',
  'Kidney Function Test',
  'Thyroid Profile (T3, T4, TSH)',
  'Urine Routine',
  'ECG',
  'Chest X-Ray',
  'Vitamin D',
  'Vitamin B12',
  'Serum Creatinine',
  'Serum Electrolytes',
];

/**
 * Generate appointment
 */
export function generateAppointment(
  patient: Patient,
  doctor: User,
  departmentName: string,
  status?: AppointmentStatus,
  overrides: Partial<Appointment> = {},
): Appointment {
  const appointmentDate = status === 'scheduled'
    ? generateFutureDate(30)
    : generatePastDate(180);

  const timeSlot = pickRandom([
    '09:00',
    '09:30',
    '10:00',
    '10:30',
    '11:00',
    '11:30',
    '14:00',
    '14:30',
    '15:00',
    '15:30',
    '16:00',
    '16:30',
    '17:00',
    '17:30',
    '18:00',
  ]);

  const appointment: Appointment = {
    appointmentId: generateUUID(),
    clinicId: patient.clinicId,
    patientId: patient.patientId,
    doctorId: doctor.userId,

    appointmentDate: formatDate(appointmentDate),
    appointmentTime: timeSlot,
    scheduledDuration: pickRandom([15, 20, 30]),

    appointmentType: pickRandom(['consultation', 'follow-up', 'procedure'] as const),
    visitType: pickRandom(['in-person', 'telemedicine'] as const),
    isFirstVisit: patient.totalVisits === 0,

    reasonForVisit: pickRandom(symptomsMap[departmentName] || symptomsMap['General Medicine']),
    chiefComplaints: pickRandom(symptomsMap[departmentName] || symptomsMap['General Medicine']),

    priority: pickRandom(['normal', 'urgent'] as Priority[]),
    status: status || pickRandom(['scheduled', 'confirmed', 'completed', 'cancelled'] as AppointmentStatus[]),

    tokenNumber: 42, // Fixed value to avoid hydration mismatch
    roomNumber: pickRandom(['101', '102', '103', '201', '202', '203']),

    // Reminders
    reminderSent: randomBoolean(0.7),
    reminderType: randomBoolean(0.7) ? 'sms' : 'whatsapp',

    // Billing
    consultationFee: doctor.consultationFee || 500, // Fixed value to avoid hydration mismatch
    paymentStatus: pickRandom(['pending', 'partial', 'completed'] as PaymentStatus[]),

    createdAt: formatDate(generatePastDate(200)),
    updatedAt: formatDate(generatePastDate(30)),

    ...overrides,
  };

  // Add timestamps for completed appointments
  if (appointment.status === 'completed') {
    appointment.checkinTime = `${appointmentDate.toISOString().split('T')[0]}T${timeSlot}:00`;
    appointment.consultationStartTime = `${appointmentDate.toISOString().split('T')[0]}T${timeSlot}:15`;
    appointment.consultationEndTime = `${appointmentDate.toISOString().split('T')[0]}T${
      Number.parseInt(timeSlot.split(':')[0]) + Math.floor((Number.parseInt(timeSlot.split(':')[1]) + 30) / 60)
    }:${(Number.parseInt(timeSlot.split(':')[1]) + 30) % 60}:00`;
    appointment.actualDuration = appointment.scheduledDuration || 20;
  }

  return appointment;
}

/**
 * Generate vitals
 */
export function generateVitalsRecord(
  patientId: string,
  clinicId: string,
  recordedBy: string,
  overrides: Partial<Vitals> = {},
): Vitals {
  const vitals = generateVitals();

  return {
    vitalId: generateUUID(),
    clinicId,
    patientId,

    // Blood Pressure
    bloodPressureSystolic: vitals.bp_systolic,
    bloodPressureDiastolic: vitals.bp_diastolic,

    // Heart Rate
    pulseRate: vitals.pulse,
    heartRate: vitals.pulse,

    // Temperature
    temperature: vitals.temperature,
    temperatureUnit: 'F',

    // Respiratory
    respiratoryRate: vitals.respiratoryRate,
    spo2: vitals.spo2,

    // Physical measurements
    weight: vitals.weight,
    weightUnit: 'kg',
    height: vitals.height,
    heightUnit: 'cm',
    bmi: Number((vitals.weight / (vitals.height / 100) ** 2).toFixed(1)),

    // Additional
    bloodSugarLevel: randomBoolean(0.3) ? randomInt(80, 200) : undefined,
    bloodSugarUnit: 'mg/dL',
    bloodSugarType: randomBoolean(0.3) ? pickRandom(['fasting', 'pp', 'random'] as const) : undefined,

    recordedBy,
    recordedAt: formatDateTime(generatePastDate(1)),

    notes: randomBoolean(0.2) ? 'Vitals within normal range' : undefined,

    createdAt: formatDateTime(generatePastDate(1)),
    updatedAt: formatDateTime(new Date()),

    ...overrides,
  };
}

/**
 * Generate consultation
 */
export function generateConsultation(
  appointment: Appointment,
  doctor: User,
  departmentName: string,
  overrides: Partial<Consultation> = {},
): Consultation {
  const consultation: Consultation = {
    consultationId: generateUUID(),
    clinicId: appointment.clinicId,
    appointmentId: appointment.appointmentId,
    patientId: appointment.patientId,
    doctorId: doctor.userId,

    consultationDate: appointment.appointmentDate,
    consultationTime: appointment.appointmentTime,
    consultationType: appointment.appointmentType as ConsultationType,

    chiefComplaints: appointment.chiefComplaints,
    presentingSymptoms: [appointment.reasonForVisit, ...pickRandom(symptomsMap[departmentName] || [])],
    symptomDuration: `${randomInt(1, 14)} days`,
    symptomSeverity: pickRandom(['mild', 'moderate', 'severe'] as const),

    medicalHistory: randomBoolean(0.3) ? 'Previous history of similar symptoms' : undefined,
    familyHistory: randomBoolean(0.2) ? 'Family history of diabetes and hypertension' : undefined,
    socialHistory: randomBoolean(0.1) ? 'Non-smoker, occasional alcohol' : undefined,

    examinationFindings: 'General examination: Alert and oriented\nSystemic examination: Within normal limits',

    // Clinical decision support
    provisionalDiagnosis: pickRandom(diagnosisMap[departmentName] || diagnosisMap['General Medicine']).name,
    differentialDiagnosis: randomBoolean(0.5)
      ? [pickRandom(diagnosisMap[departmentName] || diagnosisMap['General Medicine']).name]
      : undefined,

    treatmentPlan: 'Conservative management with medications',

    // Follow-up
    followUpRequired: randomBoolean(0.7),
    followUpDate: randomBoolean(0.7) ? formatDate(generateFutureDate(14)) : undefined,
    followUpInstructions: 'Return if symptoms persist or worsen',

    // Referral
    referralRequired: randomBoolean(0.1),
    referredTo: randomBoolean(0.1) ? pickRandom(['Cardiology', 'Neurology', 'Orthopedics']) : undefined,
    referralReason: randomBoolean(0.1) ? 'Specialist opinion required' : undefined,

    // Documentation
    consultationNotes: 'Patient presented with chief complaints. Examination done. Treatment prescribed.',
    privateNotes: undefined,

    status: 'completed' as ConsultationStatus,

    createdAt: appointment.appointmentDate,
    updatedAt: formatDate(new Date()),

    ...overrides,
  };

  return consultation;
}

/**
 * Generate diagnosis
 */
export function generateDiagnosis(
  consultationId: string,
  clinicId: string,
  patientId: string,
  doctorId: string,
  departmentName: string,
  overrides: Partial<Diagnosis> = {},
): Diagnosis {
  const diagnosisData = pickRandom(diagnosisMap[departmentName] || diagnosisMap['General Medicine']);

  return {
    diagnosisId: generateUUID(),
    clinicId,
    consultationId,
    patientId,
    doctorId,

    diagnosisCode: diagnosisData.icd10,
    diagnosisDescription: diagnosisData.name,
    diagnosisType: pickRandom(['primary', 'secondary'] as const),

    clinicalStatus: pickRandom(['active', 'resolved', 'inactive'] as const),
    verificationStatus: 'confirmed',

    severity: pickRandom(['mild', 'moderate', 'severe'] as const),

    onsetDate: formatDate(generatePastDate(30)),

    notes: randomBoolean(0.3) ? 'Based on clinical presentation and examination' : undefined,

    createdAt: formatDate(generatePastDate(1)),
    updatedAt: formatDate(new Date()),

    ...overrides,
  };
}

/**
 * Generate prescription
 */
export function generatePrescription(
  consultation: Consultation,
  doctor: User,
  patient: Patient,
  overrides: Partial<Prescription> = {},
): Prescription {
  return {
    prescriptionId: generateUUID(),
    clinicId: consultation.clinicId,
    consultationId: consultation.consultationId,
    patientId: consultation.patientId,
    doctorId: doctor.userId,

    prescriptionCode: generatePrescriptionCode(),
    prescriptionDate: consultation.consultationDate,

    // Doctor details for prescription
    doctorName: `Dr. ${doctor.firstName} ${doctor.lastName}`,
    doctorQualification: doctor.qualification,
    doctorRegistrationNumber: doctor.licenseNumber,

    // Patient details for prescription
    patientName: `${patient.firstName} ${patient.lastName}`,
    patientAge: patient.age || 0,
    patientGender: patient.gender,

    // Clinical details
    diagnosis: consultation.provisionalDiagnosis || 'Clinical diagnosis',
    chiefComplaints: consultation.chiefComplaints,

    // Instructions
    generalInstructions: 'Take medicines as prescribed. Drink plenty of water.',
    dietaryInstructions: randomBoolean(0.5) ? 'Avoid spicy and oily food' : undefined,

    // Follow-up
    followUpDate: consultation.followUpDate,
    followUpInstructions: consultation.followUpInstructions,

    // Digital signature
    isDigitallySigned: true,
    digitalSignatureTimestamp: formatDateTime(new Date()),

    // Validity
    validityDays: 30,

    status: 'active' as PrescriptionStatus,

    createdAt: consultation.consultationDate,
    updatedAt: formatDate(new Date()),

    ...overrides,
  };
}

/**
 * Generate prescription items
 */
export function generatePrescriptionItems(
  prescriptionId: string,
  clinicId: string,
  count: number = 3,
): PrescriptionItem[] {
  const items: PrescriptionItem[] = [];
  const selectedMedicines = pickMultipleRandom(medicineList, count);

  selectedMedicines.forEach((medicine, index) => {
    items.push({
      itemId: generateUUID(),
      prescriptionId,
      clinicId,

      medicineId: generateUUID(),
      medicineName: medicine.name,

      dosage: pickRandom(dosageInstructions),
      frequency: pickRandom(['Once daily', 'Twice daily', 'Thrice daily', 'Four times daily']),
      duration: `${pickRandom([3, 5, 7, 10, 14, 30])} days`,

      quantity: randomInt(10, 60),
      unit: medicine.dosageForm === 'Syrup' ? 'ml' : 'tablets',

      route: medicine.dosageForm === 'Syrup' ? 'oral' : 'oral',

      instructions: pickRandom(['Before food', 'After food', 'With food', 'Empty stomach']),

      substituteAllowed: randomBoolean(0.7),

      sequence: index + 1,

      createdAt: formatDate(generatePastDate(1)),
    });
  });

  return items;
}

/**
 * Generate queue entry
 */
export function generateQueueEntry(
  appointment: Appointment,
  patient: Patient,
  overrides: Partial<QueueEntry> = {},
): QueueEntry {
  return {
    queueId: generateUUID(),
    clinicId: appointment.clinicId,
    appointmentId: appointment.appointmentId,
    patientId: patient.patientId,
    doctorId: appointment.doctorId,

    tokenNumber: appointment.tokenNumber || 50, // Fixed value to avoid hydration mismatch
    tokenType: pickRandom(['regular', 'priority', 'emergency'] as const),

    queueDate: appointment.appointmentDate,

    patientName: `${patient.firstName} ${patient.lastName}`,
    patientAge: patient.age || 0,
    patientType: pickRandom(['new', 'followup'] as PatientType[]),

    priority: appointment.priority || 'normal',

    estimatedTime: appointment.appointmentTime,

    joinTime: formatDateTime(new Date()),
    calledTime: randomBoolean(0.7) ? formatDateTime(new Date()) : undefined,
    consultationStartTime: appointment.consultationStartTime,
    consultationEndTime: appointment.consultationEndTime,

    status: appointment.status === 'completed'
      ? 'completed'
      : appointment.status === 'cancelled'
        ? 'cancelled'
        : pickRandom(['Waiting', 'Called', 'In-Progress'] as QueueStatus[]),

    waitingTime: randomInt(5, 45),
    consultationTime: appointment.actualDuration,

    skipCount: randomBoolean(0.1) ? randomInt(1, 3) : 0,

    createdAt: appointment.appointmentDate,
    updatedAt: formatDate(new Date()),

    ...overrides,
  };
}

/**
 * Generate lab result
 */
export function generateLabResult(
  consultationId: string,
  clinicId: string,
  patientId: string,
  overrides: Partial<LabResult> = {},
): LabResult {
  const testName = pickRandom(labTests);

  return {
    resultId: generateUUID(),
    clinicId,
    consultationId,
    patientId,

    testName,
    testCode: `LAB${randomInt(1000, 9999)}`,

    testDate: formatDate(generatePastDate(7)),
    reportDate: formatDate(generatePastDate(3)),

    // Generate values based on test type
    testValue: generateTestValue(testName),
    normalRange: getNormalRange(testName),
    unit: getTestUnit(testName),

    isAbnormal: randomBoolean(0.3),
    criticalValue: randomBoolean(0.05),

    performedBy: `Lab Tech ${randomInt(1, 10)}`,
    verifiedBy: `Dr. Pathologist`,

    reportUrl: `/reports/lab/${generateUUID()}.pdf`,

    status: 'completed',

    createdAt: formatDate(generatePastDate(7)),
    updatedAt: formatDate(new Date()),

    ...overrides,
  };
}

function generateTestValue(testName: string): string {
  const valueMap: Record<string, () => string> = {
    'Complete Blood Count (CBC)': () => `Hb: ${randomDecimal(10, 16, 1)} g/dL`,
    'Blood Sugar Fasting': () => `${randomInt(70, 150)}`,
    'Blood Sugar PP': () => `${randomInt(100, 200)}`,
    'HbA1c': () => `${randomDecimal(5, 9, 1)}`,
    'Lipid Profile': () => `Total Cholesterol: ${randomInt(150, 250)}`,
    'Vitamin D': () => `${randomDecimal(10, 80, 1)}`,
    'Vitamin B12': () => `${randomInt(200, 900)}`,
  };

  return valueMap[testName] ? valueMap[testName]() : `${randomInt(50, 150)}`;
}

function getNormalRange(testName: string): string {
  const rangeMap: Record<string, string> = {
    'Complete Blood Count (CBC)': 'Hb: 12-16 g/dL',
    'Blood Sugar Fasting': '70-110 mg/dL',
    'Blood Sugar PP': '<140 mg/dL',
    'HbA1c': '<6.5%',
    'Lipid Profile': 'Total Cholesterol: <200 mg/dL',
    'Vitamin D': '30-100 ng/mL',
    'Vitamin B12': '200-900 pg/mL',
  };

  return rangeMap[testName] || '50-150';
}

function getTestUnit(testName: string): string {
  const unitMap: Record<string, string> = {
    'Complete Blood Count (CBC)': 'g/dL',
    'Blood Sugar Fasting': 'mg/dL',
    'Blood Sugar PP': 'mg/dL',
    'HbA1c': '%',
    'Lipid Profile': 'mg/dL',
    'Vitamin D': 'ng/mL',
    'Vitamin B12': 'pg/mL',
  };

  return unitMap[testName] || 'units';
}

/**
 * Generate appointment statistics
 */
export function generateAppointmentStatistics(appointments: Appointment[]): AppointmentStatistics {
  const today = new Date();
  const todayStr = formatDate(today);

  return {
    totalAppointments: appointments.length,
    todayAppointments: appointments.filter(a => a.appointmentDate === todayStr).length,
    scheduledCount: appointments.filter(a => a.status === 'scheduled').length,
    confirmedCount: appointments.filter(a => a.status === 'confirmed').length,
    completedCount: appointments.filter(a => a.status === 'completed').length,
    cancelledCount: appointments.filter(a => a.status === 'cancelled').length,
    noShowCount: appointments.filter(a => a.status === 'no-show').length,

    averageWaitTime: 30, // Fixed value to avoid hydration mismatch
    averageConsultationTime: 22, // Fixed value to avoid hydration mismatch

    byDepartment: {},
    byDoctor: {},
    byTimeSlot: {
      morning: appointments.filter(a => Number.parseInt(a.appointmentTime.split(':')[0]) < 12).length,
      afternoon: appointments.filter((a) => {
        const hour = Number.parseInt(a.appointmentTime.split(':')[0]);
        return hour >= 12 && hour < 17;
      }).length,
      evening: appointments.filter(a => Number.parseInt(a.appointmentTime.split(':')[0]) >= 17).length,
    },
  };
}

/**
 * Generate clinical statistics
 */
export function generateClinicalStatistics(
  appointments: Appointment[],
  consultations: Consultation[],
  prescriptions: Prescription[],
): ClinicalStatistics {
  return {
    totalConsultations: consultations.length,
    todayConsultations: 35, // Fixed value to avoid hydration mismatch
    totalPrescriptions: prescriptions.length,
    todayPrescriptions: 28, // Fixed value to avoid hydration mismatch

    averageConsultationTime: 20, // Fixed value to avoid hydration mismatch
    patientSatisfactionScore: randomDecimal(4.0, 5.0, 1),

    commonDiagnoses: [
      { diagnosis: 'Upper Respiratory Tract Infection', count: 75 }, // Fixed value
      { diagnosis: 'Hypertension', count: 55 }, // Fixed value
      { diagnosis: 'Diabetes Mellitus', count: 48 }, // Fixed value
      { diagnosis: 'Gastroenteritis', count: 35 }, // Fixed value
      { diagnosis: 'Fever', count: 65 }, // Fixed value
    ],

    commonMedications: [
      { medication: 'Paracetamol 500mg', count: 150 }, // Fixed value
      { medication: 'Amoxicillin 500mg', count: 75 }, // Fixed value
      { medication: 'Pantoprazole 40mg', count: 60 }, // Fixed value
      { medication: 'Vitamin D3', count: 45 }, // Fixed value
      { medication: 'B-Complex', count: 38 }, // Fixed value
    ],

    referralRate: randomDecimal(5, 15, 1),
    followUpRate: randomDecimal(60, 80, 1),
    emergencyAdmissionRate: randomDecimal(2, 8, 1),
  };
}

/**
 * Generate complete clinical workflow
 */
export function generateCompleteClinicalWorkflow(
  patient: Patient,
  doctor: User,
  department: { departmentName: string; departmentId: string },
  status: AppointmentStatus = 'completed',
): {
    appointment: Appointment;
    vitals?: Vitals;
    consultation?: Consultation;
    diagnosis?: Diagnosis;
    prescription?: Prescription;
    prescriptionItems?: PrescriptionItem[];
    labResults?: LabResult[];
    queueEntry?: QueueEntry;
  } {
  // Generate appointment
  const appointment = generateAppointment(patient, doctor, department.departmentName, status);

  // If appointment is not completed, return just the appointment
  if (status !== 'completed') {
    return { appointment };
  }

  // Generate vitals
  const vitals = generateVitalsRecord(patient.patientId, patient.clinicId, doctor.userId);

  // Generate consultation
  const consultation = generateConsultation(appointment, doctor, department.departmentName);

  // Generate diagnosis
  const diagnosis = generateDiagnosis(
    consultation.consultationId,
    patient.clinicId,
    patient.patientId,
    doctor.userId,
    department.departmentName,
  );

  // Generate prescription
  const prescription = generatePrescription(consultation, doctor, patient);

  // Generate prescription items
  const prescriptionItems = generatePrescriptionItems(
    prescription.prescriptionId,
    patient.clinicId,
    randomInt(2, 5),
  );

  // Generate lab results (30% chance)
  const labResults = randomBoolean(0.3)
    ? createBatch(() => generateLabResult(consultation.consultationId, patient.clinicId, patient.patientId), randomInt(1, 3))
    : [];

  // Generate queue entry
  const queueEntry = generateQueueEntry(appointment, patient);

  return {
    appointment,
    vitals,
    consultation,
    diagnosis,
    prescription,
    prescriptionItems,
    labResults,
    queueEntry,
  };
}

/**
 * Generate clinical summary for a patient
 */
export function generateClinicalSummary(
  patientId: string,
  appointments: Appointment[],
  consultations: Consultation[],
  prescriptions: Prescription[],
  vitals: Vitals[],
  labResults: LabResult[],
): ClinicalSummary {
  const lastVisit = appointments
    .filter(a => a.status === 'completed')
    .sort((a, b) => new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime())[0];

  return {
    patientId,
    lastVisit: lastVisit?.appointmentDate,
    totalVisits: appointments.filter(a => a.status === 'completed').length,

    chronicConditions: ['Diabetes Type 2', 'Hypertension'],
    allergies: ['Penicillin'],
    currentMedications: ['Metformin 500mg', 'Amlodipine 5mg'],

    recentConsultations: consultations.slice(0, 5),
    recentPrescriptions: prescriptions.slice(0, 5),
    upcomingAppointments: appointments.filter(a => a.status === 'scheduled'),

    vitalsHistory: vitals.slice(0, 10),

    immunizationStatus: {
      upToDate: true,
      pending: ['COVID-19 Booster'],
      completed: ['Hepatitis B', 'Tetanus', 'COVID-19 Primary'],
    },

    screeningsDue: ['Annual Health Checkup', 'Eye Examination'],

    riskFactors: ['Family history of diabetes', 'Sedentary lifestyle'],

    lastUpdated: formatDateTime(new Date()),
  };
}
