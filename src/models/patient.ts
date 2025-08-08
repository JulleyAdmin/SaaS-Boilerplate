import { and, asc, count, desc, eq, ilike, or, sql } from 'drizzle-orm';

import { getDb } from '@/libs/DB';
import { patients, type patients as PatientsTable } from '@/models/Schema';

export type Patient = typeof patients.$inferSelect;
export type NewPatient = typeof patients.$inferInsert;

export type PatientSearchParams = {
  query?: string;
  page?: number;
  pageSize?: number;
  gender?: 'Male' | 'Female' | 'Other';
  status?: 'admitted' | 'outpatient' | 'discharged' | 'emergency' | 'inactive' | 'deceased';
  bloodGroup?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  admissionDateFrom?: string;
  admissionDateTo?: string;
  departmentId?: string;
  isActive?: boolean;
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

export type PatientStatistics = {
  totalPatients: number;
  admitted: number;
  outpatient: number;
  discharged: number;
  emergency: number;
  inactive: number;
  deceased: number;
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

// Search patients with pagination and filters
export const searchPatients = async (
  clinicId: string,
  params: PatientSearchParams = {}
): Promise<PatientSearchResponse> => {
  const {
    query,
    page = 1,
    pageSize = 10,
    gender,
    status,
    bloodGroup,
    admissionDateFrom,
    admissionDateTo,
    departmentId,
    isActive,
  } = params;

  // Build WHERE conditions
  const conditions: any[] = [
    eq(patients.clinicId, clinicId),
  ];
  
  // Only add isActive filter if explicitly provided
  if (isActive !== undefined) {
    conditions.push(eq(patients.isActive, isActive));
  }

  // Text search across name, email, phone, patient code
  if (query) {
    conditions.push(
      or(
        ilike(patients.firstName, `%${query}%`),
        ilike(patients.lastName, `%${query}%`),
        ilike(patients.patientCode, `%${query}%`),
        ilike(patients.phone, `%${query}%`),
        ilike(patients.email, `%${query}%`)
      )
    );
  }

  // Filter by gender
  if (gender) {
    conditions.push(eq(patients.gender, gender));
  }

  // Filter by status
  if (status) {
    conditions.push(eq(patients.status, status));
  }

  // Filter by blood group
  if (bloodGroup) {
    conditions.push(eq(patients.bloodGroup, bloodGroup));
  }

  // Filter by department
  if (departmentId) {
    conditions.push(eq(patients.currentDepartmentId, departmentId));
  }

  // Date range filters
  if (admissionDateFrom) {
    conditions.push(sql`${patients.admissionDate} >= ${admissionDateFrom}`);
  }
  if (admissionDateTo) {
    conditions.push(sql`${patients.admissionDate} <= ${admissionDateTo}`);
  }

  // Get total count
  const db = await getDb();
  const [totalResult] = await db
    .select({ count: count() })
    .from(patients)
    .where(and(...conditions));

  const total = totalResult.count;
  const totalPages = Math.ceil(total / pageSize);
  const offset = (page - 1) * pageSize;

  // Get paginated results
  const data = await db
    .select()
    .from(patients)
    .where(and(...conditions))
    .orderBy(desc(patients.createdAt))
    .limit(pageSize)
    .offset(offset);

  return {
    data,
    pagination: {
      page,
      pageSize,
      total,
      totalPages,
    },
  };
};

// Get patient by ID
export const getPatientById = async (
  clinicId: string,
  patientId: string
): Promise<Patient | null> => {
  const db = await getDb();
  const [patient] = await db
    .select()
    .from(patients)
    .where(
      and(
        eq(patients.clinicId, clinicId),
        eq(patients.patientId, patientId),
        eq(patients.isActive, true)
      )
    )
    .limit(1);

  return patient || null;
};

// Create new patient
export const createPatient = async (
  clinicId: string,
  patientData: Omit<NewPatient, 'patientId' | 'clinicId' | 'createdAt' | 'updatedAt'>
): Promise<Patient> => {
  // Generate patient code if not provided
  const db = await getDb();
  let patientCode = patientData.patientCode;
  if (!patientCode) {
    const year = new Date().getFullYear();
    const [countResult] = await db
      .select({ count: count() })
      .from(patients)
      .where(eq(patients.clinicId, clinicId));
    
    const patientNumber = (countResult.count + 1).toString().padStart(4, '0');
    patientCode = `P-${year}-${patientNumber}`;
  }

  const [patient] = await db
    .insert(patients)
    .values({
      ...patientData,
      clinicId,
      patientCode,
      age: patientData.age || calculateAge(patientData.dateOfBirth),
    })
    .returning();

  return patient;
};

// Update patient
export const updatePatient = async (
  clinicId: string,
  patientId: string,
  updates: Partial<Omit<Patient, 'patientId' | 'clinicId' | 'createdAt'>>
): Promise<Patient | null> => {
  const db = await getDb();
  const [updated] = await db
    .update(patients)
    .set({
      ...updates,
      age: updates.dateOfBirth ? calculateAge(updates.dateOfBirth) : undefined,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(patients.clinicId, clinicId),
        eq(patients.patientId, patientId)
      )
    )
    .returning();

  return updated || null;
};

// Soft delete patient
export const deletePatient = async (
  clinicId: string,
  patientId: string
): Promise<boolean> => {
  const db = await getDb();
  const [updated] = await db
    .update(patients)
    .set({
      isActive: false,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(patients.clinicId, clinicId),
        eq(patients.patientId, patientId)
      )
    )
    .returning();

  return !!updated;
};

// Get patient statistics
export const getPatientStatistics = async (
  clinicId: string
): Promise<PatientStatistics> => {
  // Get total counts by status
  const db = await getDb();
  const statusCounts = await db
    .select({
      status: patients.status,
      count: count(),
    })
    .from(patients)
    .where(
      and(
        eq(patients.clinicId, clinicId),
        eq(patients.isActive, true)
      )
    )
    .groupBy(patients.status);

  // Get today's registrations
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [todayRegistrationsResult] = await db
    .select({ count: count() })
    .from(patients)
    .where(
      and(
        eq(patients.clinicId, clinicId),
        eq(patients.isActive, true),
        sql`${patients.createdAt} >= ${today}`,
        sql`${patients.createdAt} < ${tomorrow}`
      )
    );

  // Initialize statistics
  const stats: PatientStatistics = {
    totalPatients: 0,
    admitted: 0,
    outpatient: 0,
    discharged: 0,
    emergency: 0,
    inactive: 0,
    deceased: 0,
    todayRegistrations: todayRegistrationsResult.count,
    todayAppointments: 0, // TODO: Implement when appointments table is linked
    todayConsultations: 0, // TODO: Implement when consultations table is linked
  };

  // Aggregate status counts
  statusCounts.forEach(({ status, count }) => {
    stats.totalPatients += count;
    switch (status) {
      case 'admitted':
        stats.admitted = count;
        break;
      case 'outpatient':
        stats.outpatient = count;
        break;
      case 'discharged':
        stats.discharged = count;
        break;
      case 'emergency':
        stats.emergency = count;
        break;
      case 'inactive':
        stats.inactive = count;
        break;
      case 'deceased':
        stats.deceased = count;
        break;
    }
  });

  return stats;
};

// Get today's activity
export const getTodayActivity = async (
  clinicId: string
): Promise<TodayActivity> => {
  const db = await getDb();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Get today's registrations
  const [registrationsResult] = await db
    .select({ count: count() })
    .from(patients)
    .where(
      and(
        eq(patients.clinicId, clinicId),
        eq(patients.isActive, true),
        sql`${patients.createdAt} >= ${today}`,
        sql`${patients.createdAt} < ${tomorrow}`
      )
    );

  // Get today's emergencies
  const [emergenciesResult] = await db
    .select({ count: count() })
    .from(patients)
    .where(
      and(
        eq(patients.clinicId, clinicId),
        eq(patients.status, 'emergency'),
        eq(patients.isActive, true),
        sql`${patients.admissionDate} >= ${today}`,
        sql`${patients.admissionDate} < ${tomorrow}`
      )
    );

  return {
    appointments: 0, // TODO: Implement when appointments table is available
    consultations: 0, // TODO: Implement when consultations table is available
    registrations: registrationsResult.count,
    emergencies: emergenciesResult.count,
  };
};

// Get patient history (placeholder - would need consultation/appointment data)
export const getPatientHistory = async (
  clinicId: string,
  patientId: string
): Promise<any[]> => {
  // Verify patient exists and belongs to clinic
  const patient = await getPatientById(clinicId, patientId);
  if (!patient) {
    return [];
  }

  // TODO: Implement when consultations, appointments, prescriptions tables are integrated
  // For now, return basic patient audit history
  return [
    {
      id: '1',
      type: 'registration',
      date: patient.createdAt,
      description: 'Patient registered',
      details: {
        patientCode: patient.patientCode,
        registeredBy: patient.createdBy,
      },
    },
  ];
};

// Utility function to calculate age from date of birth
export const calculateAge = (dateOfBirth: Date | string): number => {
  const birth = typeof dateOfBirth === 'string' ? new Date(dateOfBirth) : dateOfBirth;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return Math.max(0, age);
};

// Format patient name for display
export const formatPatientName = (patient: Patient): string => {
  const parts = [patient.firstName];
  if (patient.middleName) {
    parts.push(patient.middleName);
  }
  parts.push(patient.lastName);
  return parts.join(' ');
};

// Check if patient code is unique in clinic
export const isPatientCodeUnique = async (
  clinicId: string,
  patientCode: string,
  excludePatientId?: string
): Promise<boolean> => {
  const db = await getDb();
  const conditions = [
    eq(patients.clinicId, clinicId),
    eq(patients.patientCode, patientCode),
  ];

  if (excludePatientId) {
    conditions.push(sql`${patients.patientId} != ${excludePatientId}`);
  }

  const [existing] = await db
    .select()
    .from(patients)
    .where(and(...conditions))
    .limit(1);

  return !existing;
};