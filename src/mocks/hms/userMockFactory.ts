/**
 * User/Staff Mock Data Factory
 * Generates realistic staff data with 95+ roles for Indian healthcare context
 */

import type {
  Certification,
  CompleteStaffRecord,
  Department,
  DoctorSchedule,
  StaffStatistics,
  User,
  UserRole,
} from '@/types/hms';
import { getRolePermissions, RoleCategoryMap } from '@/types/hms/enums.types';

import {
  calculateAge,
  formatDate,
  generateDateOfBirth,
  generateFutureDate,
  generatePastDate,
  generateSequenceNumber,
  generateUUID,
  pickMultipleRandom,
  pickRandom,
  randomBoolean,
  randomInt,
} from './utils/common';
import {
  generateConsultationFee,
  generateEmployeeCode,
  generateIndianAddress,
  generateIndianMobileNumber,
  generateIndianName,
} from './utils/indian-data-generators';

// Department configurations
const departmentConfigs = [
  { name: 'Emergency', code: 'EMR', type: 'Clinical', emergency: true, operates24x7: true },
  { name: 'General Medicine', code: 'MED', type: 'Clinical', emergency: false, operates24x7: false },
  { name: 'Pediatrics', code: 'PED', type: 'Clinical', emergency: false, operates24x7: false },
  { name: 'Obstetrics & Gynecology', code: 'OBG', type: 'Clinical', emergency: true, operates24x7: true },
  { name: 'Surgery', code: 'SUR', type: 'Clinical', emergency: true, operates24x7: false },
  { name: 'Orthopedics', code: 'ORT', type: 'Clinical', emergency: false, operates24x7: false },
  { name: 'Cardiology', code: 'CAR', type: 'Clinical', emergency: true, operates24x7: true },
  { name: 'Neurology', code: 'NEU', type: 'Clinical', emergency: false, operates24x7: false },
  { name: 'ICU', code: 'ICU', type: 'Clinical', emergency: true, operates24x7: true },
  { name: 'Radiology', code: 'RAD', type: 'Diagnostic', emergency: true, operates24x7: true },
  { name: 'Laboratory', code: 'LAB', type: 'Diagnostic', emergency: true, operates24x7: true },
  { name: 'Pharmacy', code: 'PHR', type: 'Support', emergency: true, operates24x7: true },
  { name: 'Administration', code: 'ADM', type: 'Non-Clinical', emergency: false, operates24x7: false },
  { name: 'Nursing', code: 'NUR', type: 'Clinical', emergency: false, operates24x7: true },
  { name: 'Housekeeping', code: 'HSK', type: 'Support', emergency: false, operates24x7: true },
];

// Medical qualifications
const medicalQualifications = [
  'MBBS',
  'MD',
  'MS',
  'MCh',
  'DM',
  'DNB',
  'FRCS',
  'MRCP',
  'DCH',
  'DO',
  'DGO',
  'DA',
  'DPM',
  'DTM&H',
  'DMRD',
  'DTCD',
];

// Nursing qualifications
const nursingQualifications = [
  'B.Sc Nursing',
  'M.Sc Nursing',
  'GNM',
  'ANM',
  'Post Basic B.Sc Nursing',
];

// Technical qualifications
const technicalQualifications = [
  'DMLT',
  'B.Sc MLT',
  'M.Sc MLT',
  'BMLT',
  'DMRIT',
  'B.Sc Radiology',
];

// Pharmacy qualifications
const pharmacyQualifications = [
  'B.Pharm',
  'M.Pharm',
  'Pharm.D',
  'D.Pharm',
];

// Administrative qualifications
const adminQualifications = [
  'MBA',
  'MHA',
  'BBA',
  'B.Com',
  'M.Com',
  'CA',
  'ICWA',
  'PG Diploma in Hospital Management',
];

// Specializations by role
const specializationMap: Partial<Record<UserRole, string[]>> = {
  'Cardiologist': ['Interventional Cardiology', 'Electrophysiology', 'Heart Failure', 'Preventive Cardiology'],
  'Neurologist': ['Stroke', 'Epilepsy', 'Movement Disorders', 'Neuromuscular Diseases'],
  'Surgeon': ['General Surgery', 'Laparoscopic Surgery', 'Trauma Surgery', 'Bariatric Surgery'],
  'Orthopedic-Surgeon': ['Joint Replacement', 'Spine Surgery', 'Sports Medicine', 'Pediatric Orthopedics'],
  'Pediatrician': ['Neonatology', 'Pediatric Cardiology', 'Pediatric Neurology', 'Pediatric ICU'],
  'Gynecologist': ['High Risk Pregnancy', 'Infertility', 'Gynecologic Oncology', 'Minimally Invasive Surgery'],
  'Anesthesiologist': ['Cardiac Anesthesia', 'Neuro Anesthesia', 'Pediatric Anesthesia', 'Pain Management'],
  'Radiologist': ['Interventional Radiology', 'Neuroradiology', 'Pediatric Radiology', 'Musculoskeletal Radiology'],
  'Pathologist': ['Clinical Pathology', 'Anatomic Pathology', 'Cytopathology', 'Hematopathology'],
};

/**
 * Generate departments
 */
export function generateDepartments(clinicId: string): Department[] {
  return departmentConfigs.map((config, index) => ({
    departmentId: generateUUID(),
    clinicId,
    departmentName: config.name,
    departmentCode: config.code,
    departmentType: config.type,
    floorNumber: Math.floor(index / 5) + 1,
    wing: pickRandom(['North', 'South', 'East', 'West', 'Central']),
    bedCapacity: config.type === 'Clinical' ? randomInt(20, 100) : 0,
    isRevenueGenerating: config.type !== 'Support',
    isEmergencyService: config.emergency,
    operates24x7: config.operates24x7,
    isActive: true,
    createdAt: formatDate(generatePastDate(730)),
    updatedAt: formatDate(generatePastDate(30)),
  }));
}

/**
 * Get qualification based on role
 */
function getQualificationForRole(role: UserRole): string {
  const category = Object.entries(RoleCategoryMap).find(([_, roles]) =>
    roles.includes(role),
  )?.[0];

  switch (category) {
    case 'Medical':
      return pickRandom(medicalQualifications);
    case 'Nursing':
      return pickRandom(nursingQualifications);
    case 'Diagnostic':
      return pickRandom(technicalQualifications);
    case 'Pharmacy':
      return pickRandom(pharmacyQualifications);
    case 'Administrative':
    case 'Management':
      return pickRandom(adminQualifications);
    default:
      return pickRandom(['High School', 'Diploma', 'Graduate']);
  }
}

/**
 * Generate experience years based on role and age
 */
function generateExperienceYears(role: UserRole, age: number): number {
  const seniorRoles = ['Chief', 'Senior', 'Deputy', 'Superintendent', 'Supervisor', 'Head'];
  const isSenior = seniorRoles.some(prefix => role.includes(prefix));

  const minAge = isSenior ? 35 : 23;
  const workingAge = Math.max(0, age - minAge);

  return isSenior ? randomInt(10, Math.min(workingAge, 30)) : randomInt(0, Math.min(workingAge, 15));
}

/**
 * Generate certifications
 */
function generateCertifications(role: UserRole): Certification[] {
  const certificationOptions: Record<string, string[]> = {
    Medical: ['ACLS', 'BLS', 'PALS', 'ATLS', 'FCPS', 'FICS'],
    Nursing: ['BLS', 'ACLS', 'PALS', 'TNAI Certification', 'Critical Care Nursing'],
    Diagnostic: ['NABL Certification', 'Quality Control', 'Equipment Handling'],
    Pharmacy: ['Drug License', 'Clinical Pharmacy Certification'],
    Administrative: ['Six Sigma', 'ISO Auditor', 'Project Management'],
  };

  const category = Object.entries(RoleCategoryMap).find(([_, roles]) =>
    roles.includes(role),
  )?.[0];

  const options = certificationOptions[category as string] || [];

  if (options.length === 0) {
    return [];
  }

  return pickMultipleRandom(options, randomInt(0, Math.min(3, options.length))).map(cert => ({
    name: cert,
    issuingAuthority: pickRandom(['Indian Medical Association', 'Nursing Council', 'Healthcare Authority', 'International Board']),
    issueDate: formatDate(generatePastDate(randomInt(365, 1825))),
    expiryDate: formatDate(generateFutureDate(randomInt(365, 1095))),
    certificateNumber: `CERT${generateSequenceNumber('cert', 8)}`,
    isVerified: true,
  }));
}

/**
 * Generate a single user
 */
export function generateUser(
  clinicId: string,
  departmentId: string,
  role: UserRole,
  overrides: Partial<User> = {},
): User {
  const gender = pickRandom(['Male', 'Female'] as const);
  const { firstName, lastName } = generateIndianName(gender);
  const dateOfBirth = generateDateOfBirth(22, 65);
  const age = calculateAge(dateOfBirth);
  const address = generateIndianAddress();

  // Role-specific configurations
  const isDoctor = role.includes('Doctor') || role.includes('Surgeon') || role.includes('Specialist');
  const isNurse = role.includes('Nurse') || role === 'Midwife';
  const isICURole = role === 'ICU-Specialist' || role === 'ICU-Nurse';
  const isEmergencyRole = role === 'Emergency-Medicine-Doctor' || role === 'Emergency-Nurse';
  const isSenior = role.includes('Chief') || role.includes('Senior') || role.includes('Superintendent');

  const user: User = {
    userId: generateUUID(),
    clinicId,
    username: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${randomInt(100, 999)}`,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@hospital.com`,
    firstName,
    lastName,
    dateOfBirth: formatDate(dateOfBirth),
    gender,

    // Role management
    role,
    roleCategory: Object.entries(RoleCategoryMap).find(([_, roles]) =>
      roles.includes(role),
    )?.[0] as any,

    // Employment
    employmentType: isSenior ? 'Permanent' : pickRandom(['Permanent', 'Contract'] as const),
    employeeCode: generateEmployeeCode(departmentId.substr(0, 3).toUpperCase()),
    departmentId,

    // Scheduling
    shiftType: isEmergencyRole || isICURole
      ? pickRandom(['Rotating', 'Night', 'Day-Shift'] as const)
      : 'Day-Shift',
    weeklyOffDays: [0], // Sunday
    joiningDate: formatDate(generatePastDate(randomInt(365, 3650))),

    // Visiting consultant
    isVisiting: role === 'Visiting-Consultant',
    visitingDays: role === 'Visiting-Consultant' ? [1, 3, 5] : undefined, // Mon, Wed, Fri
    visitingTimeStart: role === 'Visiting-Consultant' ? '14:00' : undefined,
    visitingTimeEnd: role === 'Visiting-Consultant' ? '18:00' : undefined,
    consultationFee: isDoctor
      ? generateConsultationFee(
        isSenior ? 'Super-Specialist' : 'Specialist',
      )
      : undefined,

    // Capabilities
    canWorkInEmergency: isEmergencyRole || (isDoctor && randomBoolean(0.7)) || (isNurse && randomBoolean(0.5)),
    canWorkInIcu: isICURole || (isDoctor && randomBoolean(0.5)) || (isNurse && randomBoolean(0.4)),
    canWorkInOt: role.includes('Surgeon') || role === 'OT-Nurse' || role === 'Anesthesiologist',

    // Professional details
    licenseNumber: (isDoctor || isNurse) ? `LIC${generateSequenceNumber('lic', 10)}` : undefined,
    licenseExpiryDate: (isDoctor || isNurse) ? formatDate(generateFutureDate(randomInt(365, 1825))) : undefined,
    qualification: getQualificationForRole(role),
    specialization: specializationMap[role] ? pickRandom(specializationMap[role]) : undefined,
    experienceYears: generateExperienceYears(role, age),
    certifications: generateCertifications(role),

    // Contact
    phone: generateIndianMobileNumber(),
    ...address,

    // Emergency contact
    emergencyContactName: `${pickRandom(['Mr.', 'Mrs.'])} ${generateIndianName().firstName} ${lastName}`,
    emergencyContactPhone: generateIndianMobileNumber(),
    bloodGroup: pickRandom(['A+', 'B+', 'O+', 'AB+', 'A-', 'B-', 'O-', 'AB-'] as const),

    // Permissions
    isAdmin: role === 'Admin' || role === 'Hospital-Administrator',
    canLogin: true,

    // Status
    status: 'Active',
    isActive: true,
    lastLogin: randomBoolean(0.8) ? formatDate(generatePastDate(7)) : undefined,

    // Metadata
    createdAt: formatDate(generatePastDate(730)),
    updatedAt: formatDate(generatePastDate(30)),
    version: 1,

    ...overrides,
  };

  return user;
}

/**
 * Generate doctor schedule
 */
export function generateDoctorSchedule(
  doctor: User,
  departmentId: string,
): DoctorSchedule[] {
  if (!doctor.role.includes('Doctor') && !doctor.role.includes('Surgeon') && !doctor.role.includes('Specialist')) {
    return [];
  }

  const schedules: DoctorSchedule[] = [];
  const workingDays = doctor.isVisiting ? doctor.visitingDays || [] : [1, 2, 3, 4, 5]; // Mon-Fri

  for (const day of workingDays) {
    const morningShift = randomBoolean(0.8);
    const eveningShift = doctor.isVisiting ? true : randomBoolean(0.5);

    if (morningShift) {
      schedules.push({
        scheduleId: generateUUID(),
        doctorId: doctor.userId,
        clinicId: doctor.clinicId,
        departmentId,
        dayOfWeek: day,
        startTime: pickRandom(['09:00', '09:30', '10:00']),
        endTime: pickRandom(['12:00', '12:30', '13:00']),
        consultationDuration: pickRandom([15, 20, 30]),
        maxAppointments: randomInt(15, 30),
        bufferTime: 5,
        scheduleType: 'Regular',
        isActive: true,
        effectiveFrom: doctor.joiningDate || formatDate(new Date()),
        createdAt: formatDate(generatePastDate(90)),
        updatedAt: formatDate(generatePastDate(7)),
      });
    }

    if (eveningShift) {
      schedules.push({
        scheduleId: generateUUID(),
        doctorId: doctor.userId,
        clinicId: doctor.clinicId,
        departmentId,
        dayOfWeek: day,
        startTime: doctor.visitingTimeStart || pickRandom(['14:00', '15:00', '16:00']),
        endTime: doctor.visitingTimeEnd || pickRandom(['18:00', '19:00', '20:00']),
        consultationDuration: pickRandom([15, 20, 30]),
        maxAppointments: randomInt(15, 25),
        bufferTime: 5,
        scheduleType: 'Regular',
        isActive: true,
        effectiveFrom: doctor.joiningDate || formatDate(new Date()),
        createdAt: formatDate(generatePastDate(90)),
        updatedAt: formatDate(generatePastDate(7)),
      });
    }
  }

  return schedules;
}

/**
 * Generate staff for a department
 */
export function generateDepartmentStaff(
  clinicId: string,
  department: Department,
): User[] {
  const staff: User[] = [];

  // Define roles needed for each department type
  const departmentRoles: Record<string, UserRole[]> = {
    'Emergency': [
      'Emergency-Medicine-Doctor',
      'Emergency-Nurse',
      'Nursing-Supervisor',
      'Ward-Boy',
      'Ward-Girl',
    ],
    'ICU': [
      'ICU-Specialist',
      'ICU-Nurse',
      'Nursing-Supervisor',
      'Respiratory-Therapist' as any,
    ],
    'General Medicine': [
      'Senior-Doctor',
      'Junior-Doctor',
      'Staff-Nurse',
      'Ward-Sister',
    ],
    'Surgery': [
      'Surgeon',
      'Assistant-Surgeon',
      'Anesthesiologist',
      'OT-Nurse',
      'OT-Technician',
    ],
    'Pediatrics': [
      'Pediatrician',
      'Junior-Doctor',
      'Staff-Nurse',
      'Nursing-Assistant',
    ],
    'Cardiology': [
      'Cardiologist',
      'Junior-Doctor',
      'Staff-Nurse',
      'ECG-Technician',
      'Echo-Technician',
    ],
    'Laboratory': [
      'Pathologist',
      'Microbiologist',
      'Chief-Lab-Technician',
      'Senior-Lab-Technician',
      'Lab-Technician',
    ],
    'Radiology': [
      'Radiologist',
      'Radiology-Technician',
      'X-Ray-Technician',
      'CT-Technician',
      'MRI-Technician',
    ],
    'Pharmacy': [
      'Chief-Pharmacist',
      'Senior-Pharmacist',
      'Pharmacist',
      'Pharmacy-Assistant',
    ],
    'Administration': [
      'Hospital-Administrator',
      'Assistant-Administrator',
      'HR-Manager',
      'Finance-Manager',
      'IT-Manager',
    ],
  };

  const roles = departmentRoles[department.departmentName] || ['Support-Staff'];

  // Generate staff based on department needs
  roles.forEach((role, index) => {
    const count = index === 0 ? 1 : randomInt(2, 5); // One head, multiple others

    for (let i = 0; i < count; i++) {
      const user = generateUser(clinicId, department.departmentId, role);

      // Make the first one the HOD if it's a senior role
      if (i === 0 && index === 0 && role.includes('Chief') || role.includes('Senior')) {
        department.hodId = user.userId;
      }

      staff.push(user);
    }
  });

  department.totalStaff = staff.length;

  return staff;
}

/**
 * Generate staff statistics
 */
export function generateStaffStatistics(users: User[]): StaffStatistics {
  const today = new Date();
  const todayDay = today.getDay();

  return {
    totalStaff: users.length,
    activeStaff: users.filter(u => u.status === 'Active').length,
    onDutyToday: users.filter((u) => {
      if (u.weeklyOffDays?.includes(todayDay)) {
        return false;
      }
      return u.status === 'Active';
    }).length,
    onLeaveToday: users.filter(u => u.weeklyOffDays?.includes(todayDay)).length,

    byCategory: {
      medical: users.filter(u => u.roleCategory === 'Medical').length,
      nursing: users.filter(u => u.roleCategory === 'Nursing').length,
      diagnostic: users.filter(u => u.roleCategory === 'Diagnostic').length,
      pharmacy: users.filter(u => u.roleCategory === 'Pharmacy').length,
      administrative: users.filter(u => u.roleCategory === 'Administrative').length,
      supportServices: users.filter(u => u.roleCategory === 'Support-Services').length,
      alliedHealth: users.filter(u => u.roleCategory === 'Allied-Health').length,
      indianHealthcare: users.filter(u => u.roleCategory === 'Indian-Healthcare').length,
      management: users.filter(u => u.roleCategory === 'Management').length,
    },

    byDepartment: {},

    byShiftType: {
      morning: users.filter(u => u.shiftType === 'Morning').length,
      evening: users.filter(u => u.shiftType === 'Evening').length,
      night: users.filter(u => u.shiftType === 'Night').length,
      rotating: users.filter(u => u.shiftType === 'Rotating').length,
      onCall: users.filter(u => u.shiftType === 'On-Call').length,
      dayShift: users.filter(u => u.shiftType === 'Day-Shift').length,
      splitShift: users.filter(u => u.shiftType === 'Split-Shift').length,
      flexible: users.filter(u => u.shiftType === 'Flexible').length,
    },

    certificationExpiring: users.filter((u) => {
      if (!u.certifications || u.certifications.length === 0) {
        return false;
      }
      return u.certifications.some((cert) => {
        if (!cert.expiryDate) {
          return false;
        }
        const expiry = new Date(cert.expiryDate);
        const daysUntilExpiry = (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
        return daysUntilExpiry <= 90 && daysUntilExpiry > 0;
      });
    }).length,

    licenseExpiring: users.filter((u) => {
      if (!u.licenseExpiryDate) {
        return false;
      }
      const expiry = new Date(u.licenseExpiryDate);
      const daysUntilExpiry = (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
      return daysUntilExpiry <= 90 && daysUntilExpiry > 0;
    }).length,
  };
}

/**
 * Generate complete staff record
 */
export function generateCompleteStaffRecord(
  clinicId: string,
  department: Department,
  role: UserRole,
): CompleteStaffRecord {
  const user = generateUser(clinicId, department.departmentId, role);
  const schedules = generateDoctorSchedule(user, department.departmentId);
  const permissions = getRolePermissions(role);

  return {
    user,
    department,
    schedules,
    certifications: user.certifications,
    permissions,
  };
}

/**
 * Generate complete hospital staff
 */
export function generateHospitalStaff(clinicId: string): {
  departments: Department[];
  users: User[];
  statistics: StaffStatistics;
} {
  const departments = generateDepartments(clinicId);
  const users: User[] = [];

  // Generate staff for each department
  departments.forEach((dept) => {
    const deptStaff = generateDepartmentStaff(clinicId, dept);
    users.push(...deptStaff);
  });

  // Add some additional specialized roles
  const specializedRoles: UserRole[] = [
    'Medical-Superintendent',
    'Deputy-Medical-Superintendent',
    'Chief-Nursing-Officer',
    'ASHA-Worker',
    'ANM',
    'Camp-Coordinator',
    'Scheme-Coordinator',
  ];

  specializedRoles.forEach((role) => {
    const dept = departments.find(d => d.departmentName === 'Administration') || departments[0];
    users.push(generateUser(clinicId, dept.departmentId, role));
  });

  const statistics = generateStaffStatistics(users);

  return {
    departments,
    users,
    statistics,
  };
}
