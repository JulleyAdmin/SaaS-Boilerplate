import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { z } from 'zod';
import { db } from '@/libs/DB';
import { 
  referralManagement, 
  patients, 
  users, 
  clinics,
  consultations 
} from '@/models/Schema';
import { eq, and, or, desc, sql, inArray } from 'drizzle-orm';



// Validation schemas
const createReferralSchema = z.object({
  patientId: z.string().uuid(),
  consultationId: z.string().uuid().optional(),
  referredToDoctorId: z.string().uuid().optional(),
  referredToClinicId: z.string().uuid().optional(),
  referredToDepartment: z.string().optional(),
  referralType: z.enum(['Internal', 'External', 'Emergency', 'Second-Opinion']),
  referralPriority: z.enum(['Urgent', 'High', 'Normal', 'Low']).default('Normal'),
  referralReason: z.string().min(10),
  clinicalNotes: z.string().optional(),
  provisionalDiagnosis: z.array(z.string()).optional(),
  icd10Codes: z.array(z.string()).optional(),
  investigationsDone: z.any().optional(),
  investigationsPending: z.any().optional(),
  currentMedications: z.any().optional(),
  expiryDate: z.string().optional(),
  referralLetterUrl: z.string().optional(),
  supportingDocuments: z.any().optional(),
});

const updateReferralStatusSchema = z.object({
  referralStatus: z.enum(['Sent', 'Acknowledged', 'Accepted', 'Rejected', 'Completed', 'Expired']),
  statusReason: z.string().optional(),
  responseNotes: z.string().optional(),
  treatmentProvided: z.string().optional(),
  followUpRequired: z.boolean().optional(),
  followUpWith: z.enum(['Referring', 'Referred', 'Both']).optional(),
  appointmentDate: z.string().optional(),
  responseLetterUrl: z.string().optional(),
  outcomeStatus: z.enum(['Improved', 'Stable', 'Deteriorated']).optional(),
  patientFeedbackScore: z.number().min(1).max(5).optional(),
});

// GET /api/network/referrals - List referrals
export async function GET(request: NextRequest) {
  try {
    const { userId, orgId } = await auth();
    if (!userId || !orgId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type'); // 'incoming' | 'outgoing'
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    // Get current user details
    const currentUser = await db
      .select()
      .from(users)
      .where(eq(users.userId, userId))
      .limit(1);

    if (!currentUser.length) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userClinicId = currentUser[0].clinicId;

    // Build query conditions
    const conditions = [];
    
    if (type === 'incoming') {
      conditions.push(
        or(
          eq(referralManagement.referredToClinicId, userClinicId),
          eq(referralManagement.referredToDoctorId, userId)
        )
      );
    } else if (type === 'outgoing') {
      conditions.push(
        or(
          eq(referralManagement.referringClinicId, userClinicId),
          eq(referralManagement.referringDoctorId, userId)
        )
      );
    } else {
      // Show both incoming and outgoing
      conditions.push(
        or(
          eq(referralManagement.referringClinicId, userClinicId),
          eq(referralManagement.referredToClinicId, userClinicId),
          eq(referralManagement.referringDoctorId, userId),
          eq(referralManagement.referredToDoctorId, userId)
        )
      );
    }

    if (status) {
      conditions.push(eq(referralManagement.referralStatus, status));
    }

    if (priority) {
      conditions.push(eq(referralManagement.referralPriority, priority));
    }

    // Get referrals with patient and doctor details
    const referrals = await db
      .select({
        referral: referralManagement,
        patient: {
          patientId: patients.patientId,
          firstName: patients.firstName,
          lastName: patients.lastName,
          abhaNumber: patients.abhaNumber,
        },
        referringDoctor: {
          userId: users.userId,
          name: users.name,
          email: users.email,
        },
        referringClinic: {
          clinicId: clinics.clinicId,
          clinicName: clinics.clinicName,
        },
      })
      .from(referralManagement)
      .leftJoin(patients, eq(referralManagement.patientId, patients.patientId))
      .leftJoin(users, eq(referralManagement.referringDoctorId, users.userId))
      .leftJoin(clinics, eq(referralManagement.referringClinicId, clinics.clinicId))
      .where(and(...conditions))
      .orderBy(
        desc(referralManagement.referralPriority === 'Urgent'),
        desc(referralManagement.referralPriority === 'High'),
        desc(referralManagement.initiatedAt)
      )
      .limit(limit)
      .offset(offset);

    // Get total count
    const totalCount = await db
      .select({ count: sql`count(*)` })
      .from(referralManagement)
      .where(and(...conditions));

    return NextResponse.json({
      data: referrals,
      pagination: {
        page,
        limit,
        total: Number(totalCount[0]?.count || 0),
        totalPages: Math.ceil(Number(totalCount[0]?.count || 0) / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching referrals:', error);
    return NextResponse.json(
      { error: 'Failed to fetch referrals' },
      { status: 500 }
    );
  }
}

// POST /api/network/referrals - Create a new referral
export async function POST(request: NextRequest) {
  try {
    const { userId, orgId } = await auth();
    if (!userId || !orgId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createReferralSchema.parse(body);

    // Get current user and clinic details
    const currentUser = await db
      .select()
      .from(users)
      .where(eq(users.userId, userId))
      .limit(1);

    if (!currentUser.length) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Verify patient exists and belongs to the same organization
    const patient = await db
      .select()
      .from(patients)
      .where(eq(patients.patientId, validatedData.patientId))
      .limit(1);

    if (!patient.length) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }

    // Create the referral
    const newReferral = await db
      .insert(referralManagement)
      .values({
        ...validatedData,
        referringDoctorId: userId,
        referringClinicId: currentUser[0].clinicId,
        referralStatus: 'Initiated',
        initiatedAt: new Date(),
        createdBy: userId,
        updatedBy: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    // Send notification to referred doctor/clinic (implement notification system)
    // await sendReferralNotification(newReferral[0]);

    return NextResponse.json({
      data: newReferral[0],
      message: 'Referral created successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error creating referral:', error);
    return NextResponse.json(
      { error: 'Failed to create referral' },
      { status: 500 }
    );
  }
}

// PATCH /api/network/referrals - Update referral status
export async function PATCH(request: NextRequest) {
  try {
    const { userId, orgId } = await auth();
    if (!userId || !orgId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const referralId = searchParams.get('id');
    
    if (!referralId) {
      return NextResponse.json({ error: 'Referral ID required' }, { status: 400 });
    }

    const body = await request.json();
    const validatedData = updateReferralStatusSchema.parse(body);

    // Get the referral
    const existingReferral = await db
      .select()
      .from(referralManagement)
      .where(eq(referralManagement.referralId, referralId))
      .limit(1);

    if (!existingReferral.length) {
      return NextResponse.json({ error: 'Referral not found' }, { status: 404 });
    }

    // Check if user has permission to update (either referring or referred doctor)
    const referral = existingReferral[0];
    if (
      referral.referringDoctorId !== userId &&
      referral.referredToDoctorId !== userId
    ) {
      return NextResponse.json({ error: 'Unauthorized to update this referral' }, { status: 403 });
    }

    // Prepare update data with timestamps
    const updateData: any = {
      ...validatedData,
      updatedBy: userId,
      updatedAt: new Date(),
    };

    // Add status-specific timestamps
    if (validatedData.referralStatus === 'Sent') {
      updateData.sentAt = new Date();
    } else if (validatedData.referralStatus === 'Acknowledged') {
      updateData.acknowledgedAt = new Date();
    } else if (validatedData.referralStatus === 'Accepted') {
      updateData.acceptedAt = new Date();
    } else if (validatedData.referralStatus === 'Completed') {
      updateData.completedAt = new Date();
    }

    // Update the referral
    const updatedReferral = await db
      .update(referralManagement)
      .set(updateData)
      .where(eq(referralManagement.referralId, referralId))
      .returning();

    return NextResponse.json({
      data: updatedReferral[0],
      message: 'Referral updated successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error updating referral:', error);
    return NextResponse.json(
      { error: 'Failed to update referral' },
      { status: 500 }
    );
  }
}