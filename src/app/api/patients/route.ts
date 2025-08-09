import { auth } from '@clerk/nextjs/server';
import type { NextRequest } from 'next/server';
import { z } from 'zod';

import { searchPatients, createPatient, type PatientSearchParams } from '@/models/patient';
import { logApiRequest, PatientApiLogger, logPerformance } from '@/utils/api-logger';
import { getDemoClinicId, checkDemoData, initializeDemoData } from '@/libs/init-demo-data';
import { ensureDemoData } from '@/middleware/demo-middleware';



// Validation schemas
const searchParamsSchema = z.object({
  query: z.string().optional(),
  page: z.string().optional().transform(val => val ? parseInt(val, 10) : 1),
  pageSize: z.string().optional().transform(val => val ? Math.min(parseInt(val, 10), 100) : 10),
  gender: z.enum(['Male', 'Female', 'Other']).optional(),
  status: z.enum(['admitted', 'outpatient', 'discharged', 'emergency', 'inactive', 'deceased']).optional(),
  bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).optional(),
  admissionDateFrom: z.string().optional(),
  admissionDateTo: z.string().optional(),
  departmentId: z.string().uuid().optional(),
  isActive: z.string().optional().transform(val => val ? val === 'true' : undefined),
});

const createPatientSchema = z.object({
  patientCode: z.string().optional(),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  middleName: z.string().optional(),
  dateOfBirth: z.string().refine(val => !isNaN(Date.parse(val)), 'Invalid date format'),
  gender: z.enum(['Male', 'Female', 'Other']),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().optional(),
  bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).optional(),
  allergies: z.array(z.string()).optional(),
  chronicConditions: z.array(z.string()).optional(),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
  emergencyContactRelation: z.string().optional(),
  aadhaarNumber: z.string().optional(),
  abhaNumber: z.string().optional(),
  insuranceDetails: z.any().optional(),
  governmentSchemeNumber: z.string().optional(),
});

// GET /api/patients - Search and list patients
export async function GET(request: NextRequest) {
  let userId: string | null = null;
  let orgId: string | null = null;
  
  console.log('[PATIENTS API] Demo mode:', process.env.DEMO_MODE);
  
  // In demo mode, bypass authentication
  if (process.env.DEMO_MODE === 'true') {
    userId = 'demo-user';
    orgId = getDemoClinicId(null);
    console.log('[PATIENTS API] Using demo credentials:', { userId, orgId });
  } else {
    const authResult = await auth();
    userId = authResult.userId;
    orgId = authResult.orgId;
    console.log('[PATIENTS API] Auth result:', { userId, orgId });
  }
  
  const apiLogger = logApiRequest(request, { userId, orgId });
  
  try {
    if (!process.env.DEMO_MODE && !userId) {
      apiLogger.end(401, null, new Error('Unauthorized'));
      return Response.json({ error: { code: 'UNAUTHORIZED', message: 'Authentication required' } }, { status: 401 });
    }

    if (!process.env.DEMO_MODE && !orgId) {
      apiLogger.end(400, null, new Error('Organization context required'));
      return Response.json({ error: { code: 'ORG_REQUIRED', message: 'Organization context required' } }, { status: 400 });
    }

    // Ensure demo data exists in demo mode
    if (process.env.DEMO_MODE === 'true') {
      await ensureDemoData();
    }

    // Parse search parameters
    const { searchParams } = new URL(request.url);
    const params = Object.fromEntries(searchParams.entries());
    
    const validatedParams = searchParamsSchema.parse(params);
    
    // Log search parameters
    PatientApiLogger.search(validatedParams, 0, 0);

    // Search patients with performance monitoring
    const searchStart = Date.now();
    const clinicId = process.env.DEMO_MODE === 'true' ? getDemoClinicId(null) : getDemoClinicId(orgId);
    console.log('[PATIENTS API] Searching with clinicId:', clinicId);
    console.log('[PATIENTS API] Search params:', validatedParams);
    const result = await logPerformance('searchPatients', async () => 
      searchPatients(clinicId, validatedParams as PatientSearchParams)
    )();
    console.log('[PATIENTS API] Search result:', result);
    const searchDuration = Date.now() - searchStart;
    
    // Log search results
    PatientApiLogger.search(validatedParams, result.data.length, searchDuration);
    
    apiLogger.end(200, result);
    return Response.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      apiLogger.end(400, null, error);
      return Response.json(
        { error: 'Invalid search parameters', details: error.errors },
        { status: 400 }
      );
    }

    PatientApiLogger.error('search', error as Error, { userId, orgId });
    apiLogger.end(500, null, error as Error);
    
    return Response.json(
      { error: 'Failed to search patients' },
      { status: 500 }
    );
  }
}

// POST /api/patients - Create new patient
export async function POST(request: NextRequest) {
  let userId: string | null = null;
  let orgId: string | null = null;
  
  // In demo mode, bypass authentication
  if (process.env.DEMO_MODE === 'true') {
    userId = 'demo-user';
    orgId = getDemoClinicId(null);
  } else {
    const authResult = await auth();
    userId = authResult.userId;
    orgId = authResult.orgId;
  }
  
  const apiLogger = logApiRequest(request, { userId, orgId });
  
  try {
    if (!process.env.DEMO_MODE && !userId) {
      apiLogger.end(401, null, new Error('Unauthorized'));
      return Response.json({ error: { code: 'UNAUTHORIZED', message: 'Authentication required' } }, { status: 401 });
    }

    if (!process.env.DEMO_MODE && !orgId) {
      apiLogger.end(400, null, new Error('Organization context required'));
      return Response.json({ error: { code: 'ORG_REQUIRED', message: 'Organization context required' } }, { status: 400 });
    }

    const body = await request.json();
    apiLogger.params = { body };
    
    const validatedData = createPatientSchema.parse(body);

    // Create patient with performance monitoring
    const clinicId = process.env.DEMO_MODE === 'true' ? getDemoClinicId(null) : getDemoClinicId(orgId);
    const patient = await logPerformance('createPatient', async () =>
      createPatient(clinicId, {
        ...validatedData,
        dateOfBirth: new Date(validatedData.dateOfBirth),
        createdBy: process.env.DEMO_MODE === 'true' ? null : userId,
        updatedBy: process.env.DEMO_MODE === 'true' ? null : userId,
      })
    )();
    
    // Log successful creation
    PatientApiLogger.create(validatedData, patient.patientId);
    
    apiLogger.end(201, { data: patient });
    return Response.json({ data: patient }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      apiLogger.end(400, null, error);
      return Response.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    PatientApiLogger.error('create', error as Error, { userId, orgId });
    
    // Handle unique constraint violations
    if (error instanceof Error && error.message.includes('unique')) {
      apiLogger.end(409, null, error);
      return Response.json(
        { error: 'Patient code already exists' },
        { status: 409 }
      );
    }

    apiLogger.end(500, null, error as Error);
    return Response.json(
      { error: 'Failed to create patient' },
      { status: 500 }
    );
  }
}