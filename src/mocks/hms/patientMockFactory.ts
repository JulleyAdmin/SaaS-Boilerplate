/**
 * Patient Mock Data Factory
 * Generates realistic patient data for Indian healthcare context
 */

import type {
  CompletePatientRecord,
  FamilyGroup,
  FamilyMedicalHistory,
  FamilyMember,
  Patient,
  PatientStatistics,
} from '@/types/hms';

import {
  calculateAge,
  createBatch,
  formatDate,
  generateDateOfBirth,
  generatePastDate,
  generateUUID,
  pickMultipleRandom,
  pickRandom,
  randomBoolean,
  weightedRandom,
} from './utils/common';
import {
  generateAadhaarNumber,
  generateABHANumber,
  generateGovernmentSchemeNumber,
  generateIndianAddress,
  generateIndianMobileNumber,
  generateIndianName,
  generatePANNumber,
  generatePatientCode,
  getRandomAllergies,
  getRandomMedicalConditions,
} from './utils/indian-data-generators';

// Blood group distribution in India
const bloodGroupDistribution = [
  { value: 'O+' as const, weight: 35 },
  { value: 'B+' as const, weight: 30 },
  { value: 'A+' as const, weight: 20 },
  { value: 'AB+' as const, weight: 7 },
  { value: 'O-' as const, weight: 3 },
  { value: 'B-' as const, weight: 2 },
  { value: 'A-' as const, weight: 2 },
  { value: 'AB-' as const, weight: 1 },
];

// Patient status distribution
const patientStatusDistribution = [
  { value: 'outpatient' as const, weight: 70 },
  { value: 'admitted' as const, weight: 15 },
  { value: 'discharged' as const, weight: 10 },
  { value: 'emergency' as const, weight: 3 },
  { value: 'inactive' as const, weight: 2 },
];

// Government scheme distribution
const governmentSchemes = [
  'Ayushman-Bharat',
  'CGHS',
  'ESIC',
  'State-Scheme',
  'Railway-Medical',
];

// Insurance providers in India
const insuranceProviders = [
  'Star Health Insurance',
  'HDFC ERGO',
  'ICICI Lombard',
  'Bajaj Allianz',
  'Max Bupa',
  'Apollo Munich',
  'Religare Health',
  'United India Insurance',
  'National Insurance',
  'Oriental Insurance',
];

/**
 * Generate a single patient
 */
export function generatePatient(
  clinicId: string = generateUUID(),
  overrides: Partial<Patient> = {},
): Patient {
  const gender = pickRandom(['Male', 'Female', 'Other'] as const);
  const { firstName, lastName } = generateIndianName(gender === 'Other' ? undefined : gender);
  const dateOfBirth = generateDateOfBirth(1, 90);
  const age = calculateAge(dateOfBirth);
  const address = generateIndianAddress();

  // Age-based chronic conditions probability
  const hasChronicConditions = age > 40 ? randomBoolean(0.6) : randomBoolean(0.2);
  const hasAllergies = randomBoolean(0.3);

  // Insurance probability based on age and conditions
  const hasInsurance = hasChronicConditions ? randomBoolean(0.8) : randomBoolean(0.5);
  const hasGovernmentScheme = !hasInsurance && randomBoolean(0.4);

  const patient: Patient = {
    patientId: generateUUID(),
    clinicId,
    patientCode: generatePatientCode(),
    firstName,
    lastName,
    middleName: randomBoolean(0.3) ? pickRandom(['Kumar', 'Devi', 'Prasad', 'Singh']) : undefined,
    dateOfBirth: formatDate(dateOfBirth),
    age,
    gender,

    // Contact
    phone: generateIndianMobileNumber(),
    alternatePhone: randomBoolean(0.5) ? generateIndianMobileNumber() : undefined,
    email: randomBoolean(0.7) ? `${firstName.toLowerCase()}.${lastName.toLowerCase()}@gmail.com` : undefined,

    // Address
    ...address,
    country: 'India',

    // Identity documents
    aadhaarNumber: randomBoolean(0.95) ? generateAadhaarNumber() : undefined,
    panNumber: age > 18 && randomBoolean(0.7) ? generatePANNumber() : undefined,
    voterId: age > 18 && randomBoolean(0.6) ? `VOT${Math.random().toString(36).substr(2, 9).toUpperCase()}` : undefined,

    // Medical
    bloodGroup: weightedRandom(bloodGroupDistribution),
    allergies: hasAllergies ? getRandomAllergies(pickRandom([1, 2])) : [],
    chronicConditions: hasChronicConditions ? getRandomMedicalConditions(pickRandom([1, 2, 3])) : [],

    // Emergency contact
    emergencyContactName: `${pickRandom(['Mr.', 'Mrs.', 'Ms.'])} ${generateIndianName().firstName} ${lastName}`,
    emergencyContactPhone: generateIndianMobileNumber(),
    emergencyContactRelation: pickRandom(['Spouse', 'Father', 'Mother', 'Son', 'Daughter', 'Brother', 'Sister']),

    // Insurance
    insuranceDetails: hasInsurance
      ? {
          provider: pickRandom(insuranceProviders),
          policyNumber: `POL${Math.random().toString().substr(2, 10)}`,
          validFrom: formatDate(generatePastDate(365)),
          validTill: formatDate(generateDateOfBirth(-2, -1)),
          coverageAmount: pickRandom([300000, 500000, 1000000, 1500000, 2000000]),
          coverageType: pickRandom(['Individual', 'Family Floater']),
        }
      : undefined,

    // Government scheme
    governmentSchemeNumber: hasGovernmentScheme
      ? generateGovernmentSchemeNumber(pickRandom(governmentSchemes))
      : undefined,

    // ABHA
    abhaNumber: randomBoolean(0.4) ? generateABHANumber() : undefined,
    abhaAddress: randomBoolean(0.4) ? `${firstName.toLowerCase()}${age}@abdm` : undefined,

    // Statistics
    totalVisits: age > 50 ? pickRandom([5, 10, 15, 20, 30]) : pickRandom([1, 2, 3, 5, 8]),
    lastVisitDate: randomBoolean(0.8) ? formatDate(generatePastDate(180)) : undefined,

    // Status
    isActive: true,
    isVip: randomBoolean(0.05),
    status: weightedRandom(patientStatusDistribution),

    // Metadata
    createdAt: formatDate(generatePastDate(730)),
    updatedAt: formatDate(generatePastDate(30)),

    ...overrides,
  };

  // Add admission details if admitted
  if (patient.status === 'admitted') {
    patient.admissionDate = formatDate(generatePastDate(7));
    patient.admissionReason = pickRandom([
      'Chest Pain - Cardiac Evaluation',
      'Acute Gastroenteritis',
      'Pneumonia',
      'Dengue Fever',
      'Post-Surgical Care',
      'Diabetic Ketoacidosis',
      'Road Traffic Accident',
    ]);
  }

  return patient;
}

/**
 * Generate multiple patients
 */
export function generatePatients(
  count: number,
  clinicId: string = generateUUID(),
): Patient[] {
  return createBatch(() => generatePatient(clinicId), count);
}

/**
 * Generate a family group
 */
export function generateFamilyGroup(
  primaryPatient: Patient,
  memberCount: number = 4,
): { familyGroup: FamilyGroup; members: FamilyMember[] } {
  const familyGroup: FamilyGroup = {
    familyId: generateUUID(),
    familyCode: `FAM${Math.random().toString().substr(2, 6)}`,
    familyName: `${primaryPatient.lastName} Family`,
    primaryMemberId: primaryPatient.patientId,

    // Use primary patient's address
    addressLine1: primaryPatient.address || '',
    city: primaryPatient.city || '',
    state: primaryPatient.state || '',
    pincode: primaryPatient.pincode || '',

    primaryPhone: primaryPatient.phone || '',
    email: primaryPatient.email,

    // Indian specific
    rationCardNumber: randomBoolean(0.7) ? `RC${generateAadhaarNumber().substr(0, 10)}` : undefined,
    familyIncomeCategory: pickRandom(['APL', 'BPL', 'AAY'] as const),

    createdAt: formatDate(generatePastDate(365)),
    isActive: true,
  };

  // Generate family members
  const members: FamilyMember[] = [{
    memberId: generateUUID(),
    familyId: familyGroup.familyId,
    patientId: primaryPatient.patientId,
    relationshipToPrimary: 'SELF',
    isPrimaryMember: true,
    isEarningMember: primaryPatient.age ? primaryPatient.age >= 18 && primaryPatient.age <= 65 : false,
    isDependent: false,
    shareMedicalHistory: true,
    shareInsurance: true,
    shareBilling: true,
    status: 'Active',
    joinDate: familyGroup.createdAt,
    createdAt: familyGroup.createdAt,
  }];

  // Add other family members
  const relationships = ['SPOUSE', 'SON', 'DAUGHTER', 'FATHER', 'MOTHER'];
  for (let i = 1; i < memberCount && i < relationships.length; i++) {
    const relationship = relationships[i - 1];
    let memberAge: [number, number];
    let memberGender: 'Male' | 'Female';

    // Determine age and gender based on relationship
    switch (relationship) {
      case 'SPOUSE':
        memberAge = [(primaryPatient.age || 30) - 5, (primaryPatient.age || 30) + 5];
        memberGender = primaryPatient.gender === 'Male' ? 'Female' : 'Male';
        break;
      case 'SON':
        memberAge = [1, Math.min(30, (primaryPatient.age || 30) - 20)];
        memberGender = 'Male';
        break;
      case 'DAUGHTER':
        memberAge = [1, Math.min(30, (primaryPatient.age || 30) - 20)];
        memberGender = 'Female';
        break;
      case 'FATHER':
        memberAge = [(primaryPatient.age || 30) + 20, (primaryPatient.age || 30) + 40];
        memberGender = 'Male';
        break;
      case 'MOTHER':
        memberAge = [(primaryPatient.age || 30) + 20, (primaryPatient.age || 30) + 40];
        memberGender = 'Female';
        break;
      default:
        memberAge = [1, 90];
        memberGender = pickRandom(['Male', 'Female'] as const);
    }

    const memberPatient = generatePatient(primaryPatient.clinicId, {
      lastName: primaryPatient.lastName,
      address: primaryPatient.address,
      city: primaryPatient.city,
      state: primaryPatient.state,
      pincode: primaryPatient.pincode,
      gender: memberGender,
      dateOfBirth: formatDate(generateDateOfBirth(...memberAge)),
    });

    members.push({
      memberId: generateUUID(),
      familyId: familyGroup.familyId,
      patientId: memberPatient.patientId,
      relationshipToPrimary: relationship as any,
      isPrimaryMember: false,
      isEarningMember: memberPatient.age ? memberPatient.age >= 18 && memberPatient.age <= 65 : false,
      isDependent: memberPatient.age ? memberPatient.age < 18 || memberPatient.age > 65 : true,
      shareMedicalHistory: randomBoolean(0.8),
      shareInsurance: true,
      shareBilling: true,
      status: 'Active',
      joinDate: familyGroup.createdAt,
      createdAt: familyGroup.createdAt,
      patient: memberPatient,
    });
  }

  return { familyGroup, members };
}

/**
 * Generate family medical history
 */
export function generateFamilyMedicalHistory(
  familyId: string,
  reportedBy: string,
): FamilyMedicalHistory[] {
  const conditions = [
    { name: 'Diabetes Type 2', icd10: 'E11', hereditary: true },
    { name: 'Hypertension', icd10: 'I10', hereditary: true },
    { name: 'Coronary Artery Disease', icd10: 'I25', hereditary: true },
    { name: 'Asthma', icd10: 'J45', hereditary: true },
    { name: 'Thyroid Disorder', icd10: 'E03', hereditary: true },
    { name: 'Cancer', icd10: 'C80', hereditary: true },
  ];

  return pickMultipleRandom(conditions, pickRandom([1, 2, 3])).map(condition => ({
    historyId: generateUUID(),
    familyId,
    conditionName: condition.name,
    icd10Code: condition.icd10,
    affectedRelationship: pickRandom(['FATHER', 'MOTHER', 'GRANDFATHER', 'GRANDMOTHER'] as const),
    affectedCount: pickRandom([1, 2]),
    ageOfOnset: pickRandom([40, 45, 50, 55, 60]),
    severity: pickRandom(['Mild', 'Moderate', 'Severe'] as const),
    isHereditary: condition.hereditary,
    reportedBy,
    reportedDate: formatDate(generatePastDate(90)),
    createdAt: formatDate(generatePastDate(90)),
  }));
}

/**
 * Generate patient statistics
 */
export function generatePatientStatistics(patients: Patient[]): PatientStatistics {
  const stats: PatientStatistics = {
    totalPatients: patients.length,
    activePatients: patients.filter(p => p.isActive).length,
    admittedPatients: patients.filter(p => p.status === 'admitted').length,
    outpatients: patients.filter(p => p.status === 'outpatient').length,
    emergencyPatients: patients.filter(p => p.status === 'emergency').length,
    todayRegistrations: patients.filter((p) => {
      const createdDate = new Date(p.createdAt || '');
      const today = new Date();
      return createdDate.toDateString() === today.toDateString();
    }).length,
    todayVisits: Math.floor(patients.length * 0.1),
    averageAge: Math.round(
      patients.reduce((sum, p) => sum + (p.age || 0), 0) / patients.length,
    ),
    genderDistribution: {
      male: patients.filter(p => p.gender === 'Male').length,
      female: patients.filter(p => p.gender === 'Female').length,
      other: patients.filter(p => p.gender === 'Other').length,
    },
    insuranceCoverage: {
      withInsurance: patients.filter(p => p.insuranceDetails).length,
      withGovernmentScheme: patients.filter(p => p.governmentSchemeNumber).length,
      selfPay: patients.filter(p => !p.insuranceDetails && !p.governmentSchemeNumber).length,
    },
  };

  return stats;
}

/**
 * Generate a complete patient record with all relations
 */
export function generateCompletePatientRecord(
  clinicId: string = generateUUID(),
): CompletePatientRecord {
  const patient = generatePatient(clinicId);
  const { familyGroup, members } = generateFamilyGroup(patient, 4);

  return {
    patient,
    familyGroup,
    familyMembers: members,
    medicalHistory: {
      patientId: patient.patientId,
      lastVisit: patient.lastVisitDate,
      totalVisits: patient.totalVisits || 0,
      chronicConditions: patient.chronicConditions || [],
      allergies: patient.allergies || [],
      currentMedications: [],
      recentConsultations: [],
      recentPrescriptions: [],
      upcomingAppointments: [],
      vitalsHistory: [],
    },
  };
}
