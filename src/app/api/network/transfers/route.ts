import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { z } from 'zod';
import { db } from '@/libs/DB';
import { 
  patientTransfers, 
  patients, 
  users, 
  clinics,
  departments 
} from '@/models/Schema';
import { eq, and, or, desc, sql } from 'drizzle-orm';

// Validation schemas
const createTransferSchema = z.object({
  patientId: z.string().uuid(),
  destinationClinicId: z.string().uuid(),
  transferType: z.enum(['Emergency', 'Planned', 'Specialist']),
  transferReason: z.string().min(10),
  clinicalSummary: z.string().min(20),
  diagnosisAtTransfer: z.array(z.string()).optional(),
  vitalSignsAtTransfer: z.object({
    bloodPressure: z.string().optional(),
    heartRate: z.number().optional(),
    temperature: z.number().optional(),
    spO2: z.number().optional(),
    respiratoryRate: z.number().optional(),
  }).optional(),
  medicationsOnTransfer: z.array(z.object({
    name: z.string(),
    dosage: z.string(),
    frequency: z.string(),
  })).optional(),
  transportMode: z.enum(['Ambulance', 'Air', 'Private']).optional(),
  transportProvider: z.string().optional(),
  estimatedArrival: z.string().optional(),
  requestedDepartment: z.string().optional(),
  transferDocuments: z.array(z.object({
    name: z.string(),
    url: z.string(),
    type: z.string(),
  })).optional(),
});

const updateTransferStatusSchema = z.object({
  transferStatus: z.enum(['Accepted', 'In-Transit', 'Completed', 'Cancelled']),
  acceptedBy: z.string().uuid().optional(),
  receivingDoctorId: z.string().uuid().optional(),
  allocatedBedId: z.string().uuid().optional(),
  actualArrival: z.string().optional(),
  handoverNotes: z.string().optional(),
  transferCharges: z.number().optional(),
  billingStatus: z.enum(['Pending', 'Processed', 'Settled']).optional(),
});

// GET /api/network/transfers - List transfers
export async function GET(request: NextRequest) {
  try {
    const { userId, orgId } = await auth();
    if (!userId || !orgId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type'); // 'incoming' | 'outgoing' | 'in-transit'
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    // Get current user's clinic
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
      conditions.push(eq(patientTransfers.destinationClinicId, userClinicId));
    } else if (type === 'outgoing') {
      conditions.push(eq(patientTransfers.sourceClinicId, userClinicId));
    } else if (type === 'in-transit') {
      conditions.push(
        and(
          or(
            eq(patientTransfers.sourceClinicId, userClinicId),
            eq(patientTransfers.destinationClinicId, userClinicId)
          ),
          eq(patientTransfers.transferStatus, 'In-Transit')
        )
      );
    } else {
      // Show all transfers related to this clinic
      conditions.push(
        or(
          eq(patientTransfers.sourceClinicId, userClinicId),
          eq(patientTransfers.destinationClinicId, userClinicId)
        )
      );
    }

    if (status) {
      conditions.push(eq(patientTransfers.transferStatus, status));
    }

    // Get transfers with patient and clinic details
    const transfers = await db
      .select({
        transfer: patientTransfers,
        patient: {
          patientId: patients.patientId,
          firstName: patients.firstName,
          lastName: patients.lastName,
          abhaNumber: patients.abhaNumber,
          age: patients.age,
          gender: patients.gender,
        },
        sourceClinic: {
          clinicId: clinics.clinicId,
          clinicName: clinics.clinicName,
        },
      })
      .from(patientTransfers)
      .leftJoin(patients, eq(patientTransfers.patientId, patients.patientId))
      .leftJoin(clinics, eq(patientTransfers.sourceClinicId, clinics.clinicId))
      .where(and(...conditions))
      .orderBy(
        desc(patientTransfers.transferType === 'Emergency'),
        desc(patientTransfers.initiatedAt)
      )
      .limit(limit)
      .offset(offset);

    // Get destination clinic details
    const transfersWithDestination = await Promise.all(
      transfers.map(async (transfer) => {
        const destClinic = await db
          .select({
            clinicId: clinics.clinicId,
            clinicName: clinics.clinicName,
          })
          .from(clinics)
          .where(eq(clinics.clinicId, transfer.transfer.destinationClinicId))
          .limit(1);

        return {
          ...transfer,
          destinationClinic: destClinic[0] || null,
        };
      })
    );

    // Get total count
    const totalCount = await db
      .select({ count: sql`count(*)` })
      .from(patientTransfers)
      .where(and(...conditions));

    return NextResponse.json({
      data: transfersWithDestination,
      pagination: {
        page,
        limit,
        total: Number(totalCount[0]?.count || 0),
        totalPages: Math.ceil(Number(totalCount[0]?.count || 0) / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching transfers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transfers' },
      { status: 500 }
    );
  }
}

// POST /api/network/transfers - Create a new transfer
export async function POST(request: NextRequest) {
  try {
    const { userId, orgId } = await auth();
    if (!userId || !orgId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createTransferSchema.parse(body);

    // Get current user and clinic details
    const currentUser = await db
      .select()
      .from(users)
      .where(eq(users.userId, userId))
      .limit(1);

    if (!currentUser.length) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Verify patient exists
    const patient = await db
      .select()
      .from(patients)
      .where(eq(patients.patientId, validatedData.patientId))
      .limit(1);

    if (!patient.length) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }

    // Verify destination clinic exists
    const destClinic = await db
      .select()
      .from(clinics)
      .where(eq(clinics.clinicId, validatedData.destinationClinicId))
      .limit(1);

    if (!destClinic.length) {
      return NextResponse.json({ error: 'Destination clinic not found' }, { status: 404 });
    }

    // Create the transfer
    const newTransfer = await db
      .insert(patientTransfers)
      .values({
        ...validatedData,
        sourceClinicId: currentUser[0].clinicId,
        transferStatus: 'Initiated',
        initiatedBy: userId,
        initiatedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    // Send notification to destination clinic (implement notification system)
    // await sendTransferNotification(newTransfer[0]);

    return NextResponse.json({
      data: newTransfer[0],
      message: 'Transfer initiated successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error creating transfer:', error);
    return NextResponse.json(
      { error: 'Failed to create transfer' },
      { status: 500 }
    );
  }
}

// PATCH /api/network/transfers - Update transfer status
export async function PATCH(request: NextRequest) {
  try {
    const { userId, orgId } = await auth();
    if (!userId || !orgId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const transferId = searchParams.get('id');
    
    if (!transferId) {
      return NextResponse.json({ error: 'Transfer ID required' }, { status: 400 });
    }

    const body = await request.json();
    const validatedData = updateTransferStatusSchema.parse(body);

    // Get the transfer
    const existingTransfer = await db
      .select()
      .from(patientTransfers)
      .where(eq(patientTransfers.transferId, transferId))
      .limit(1);

    if (!existingTransfer.length) {
      return NextResponse.json({ error: 'Transfer not found' }, { status: 404 });
    }

    // Get user's clinic
    const currentUser = await db
      .select()
      .from(users)
      .where(eq(users.userId, userId))
      .limit(1);

    if (!currentUser.length) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const transfer = existingTransfer[0];
    const userClinicId = currentUser[0].clinicId;

    // Check permissions based on status update
    if (validatedData.transferStatus === 'Accepted') {
      // Only destination clinic can accept
      if (transfer.destinationClinicId !== userClinicId) {
        return NextResponse.json({ error: 'Only destination clinic can accept transfer' }, { status: 403 });
      }
    }

    // Prepare update data with timestamps
    const updateData: any = {
      ...validatedData,
      updatedAt: new Date(),
    };

    // Add status-specific timestamps
    if (validatedData.transferStatus === 'Accepted') {
      updateData.acceptedBy = userId;
      updateData.acceptedAt = new Date();
    } else if (validatedData.transferStatus === 'Completed') {
      updateData.completedAt = new Date();
    }

    // Update the transfer
    const updatedTransfer = await db
      .update(patientTransfers)
      .set(updateData)
      .where(eq(patientTransfers.transferId, transferId))
      .returning();

    return NextResponse.json({
      data: updatedTransfer[0],
      message: 'Transfer updated successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error updating transfer:', error);
    return NextResponse.json(
      { error: 'Failed to update transfer' },
      { status: 500 }
    );
  }
}

// GET /api/network/transfers/bed-availability - Check bed availability at destination
export async function getBedAvailability(request: NextRequest) {
  try {
    const { userId, orgId } = await auth();
    if (!userId || !orgId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const clinicId = searchParams.get('clinicId');
    const departmentName = searchParams.get('department');

    if (!clinicId) {
      return NextResponse.json({ error: 'Clinic ID required' }, { status: 400 });
    }

    // This would integrate with bed management system
    // For now, returning mock data
    const availability = {
      clinicId,
      department: departmentName,
      availableBeds: {
        general: 12,
        icu: 2,
        emergency: 3,
        private: 5,
      },
      totalBeds: {
        general: 50,
        icu: 10,
        emergency: 8,
        private: 20,
      },
      waitTime: {
        general: '2 hours',
        icu: '4 hours',
        emergency: 'Immediate',
        private: '30 minutes',
      },
    };

    return NextResponse.json({ data: availability });
  } catch (error) {
    console.error('Error checking bed availability:', error);
    return NextResponse.json(
      { error: 'Failed to check bed availability' },
      { status: 500 }
    );
  }
}