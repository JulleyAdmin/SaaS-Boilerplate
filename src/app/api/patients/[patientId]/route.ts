import { auth } from '@clerk/nextjs/server';
import type { NextRequest } from 'next/server';
import { z } from 'zod';

import { getPatientById, updatePatient, deletePatient } from '@/models/patient';
import { getDemoClinicId } from '@/libs/init-demo-data';
import { ensureDemoData } from '@/middleware/demo-middleware';



const updatePatientSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  middleName: z.string().optional(),
  dateOfBirth: z.string().refine(val => !isNaN(Date.parse(val))).optional(),
  gender: z.enum(['Male', 'Female', 'Other']).optional(),
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
  status: z.enum(['admitted', 'outpatient', 'discharged', 'emergency', 'inactive', 'deceased']).optional(),
  currentDepartmentId: z.string().uuid().optional(),
  admissionDate: z.string().refine(val => !isNaN(Date.parse(val))).optional(),
  dischargeDate: z.string().refine(val => !isNaN(Date.parse(val))).optional(),
  admissionReason: z.string().optional(),
  dischargeReason: z.string().optional(),
  aadhaarNumber: z.string().optional(),
  abhaNumber: z.string().optional(),
  insuranceDetails: z.any().optional(),
  governmentSchemeNumber: z.string().optional(),
  isVip: z.boolean().optional(),
});

// GET /api/patients/[patientId] - Get patient by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { patientId: string } }
) {
  try {
    const { userId, orgId } = await auth();

    if (!userId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!orgId) {
      return Response.json({ error: 'Organization context required' }, { status: 400 });
    }

    const clinicId = getDemoClinicId(orgId);
    const patient = await getPatientById(clinicId, params.patientId);

    if (!patient) {
      return Response.json({ error: 'Patient not found' }, { status: 404 });
    }

    return Response.json({ data: patient });
  } catch (error) {
    console.error('Error fetching patient:', error);
    return Response.json(
      { error: 'Failed to fetch patient' },
      { status: 500 }
    );
  }
}

// PUT /api/patients/[patientId] - Update patient
export async function PUT(
  request: NextRequest,
  { params }: { params: { patientId: string } }
) {
  try {
    const { userId, orgId } = await auth();

    if (!userId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!orgId) {
      return Response.json({ error: 'Organization context required' }, { status: 400 });
    }

    // Check if patient exists
    const clinicId = getDemoClinicId(orgId);
    const existingPatient = await getPatientById(clinicId, params.patientId);
    if (!existingPatient) {
      return Response.json({ error: 'Patient not found' }, { status: 404 });
    }

    const body = await request.json();
    const validatedData = updatePatientSchema.parse(body);

    // Prepare update data with date conversions
    const updateData: any = { ...validatedData };
    if (validatedData.dateOfBirth) {
      updateData.dateOfBirth = new Date(validatedData.dateOfBirth);
    }
    if (validatedData.admissionDate) {
      updateData.admissionDate = new Date(validatedData.admissionDate);
    }
    if (validatedData.dischargeDate) {
      updateData.dischargeDate = new Date(validatedData.dischargeDate);
    }
    updateData.updatedBy = userId;

    const updatedPatient = await updatePatient(clinicId, params.patientId, updateData);

    if (!updatedPatient) {
      return Response.json({ error: 'Failed to update patient' }, { status: 500 });
    }

    return Response.json({ data: updatedPatient });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error updating patient:', error);
    return Response.json(
      { error: 'Failed to update patient' },
      { status: 500 }
    );
  }
}

// DELETE /api/patients/[patientId] - Soft delete patient
export async function DELETE(
  request: NextRequest,
  { params }: { params: { patientId: string } }
) {
  try {
    const { userId, orgId } = await auth();

    if (!userId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!orgId) {
      return Response.json({ error: 'Organization context required' }, { status: 400 });
    }

    // Check if patient exists
    const clinicId = getDemoClinicId(orgId);
    const existingPatient = await getPatientById(clinicId, params.patientId);
    if (!existingPatient) {
      return Response.json({ error: 'Patient not found' }, { status: 404 });
    }

    const success = await deletePatient(clinicId, params.patientId);

    if (!success) {
      return Response.json({ error: 'Failed to delete patient' }, { status: 500 });
    }

    return Response.json({ message: 'Patient deleted successfully' });
  } catch (error) {
    console.error('Error deleting patient:', error);
    return Response.json(
      { error: 'Failed to delete patient' },
      { status: 500 }
    );
  }
}