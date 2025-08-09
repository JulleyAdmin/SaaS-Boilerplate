import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { eq, and, desc, sql, gte, lte } from 'drizzle-orm';
import { db } from '@/libs/DB';
import { csrPrograms, csrEvents, csrEventRegistrations, users } from '@/models/Schema';
import { auth } from '@clerk/nextjs/server';
import { mockCSRPrograms } from '@/data/mock-csr';



// Request validation schemas
const createProgramSchema = z.object({
  programName: z.string().min(1).max(200),
  programType: z.enum([
    'health_camp', 'vaccination_drive', 'screening_program', 'health_education',
    'blood_donation', 'mental_health_awareness', 'nutrition_program', 'fitness_program'
  ]),
  description: z.string().optional(),
  objectives: z.array(z.string()).optional().default([]),
  
  // Target audience
  targetDemographic: z.string().max(100).optional(),
  targetCount: z.number().positive().optional(),
  eligibilityCriteria: z.record(z.any()).optional(),
  
  // Timeline
  startDate: z.string().transform((str) => new Date(str)),
  endDate: z.string().transform((str) => new Date(str)).optional(),
  registrationDeadline: z.string().transform((str) => new Date(str)).optional(),
  
  // Location
  venueType: z.enum(['hospital', 'community_center', 'school', 'mobile_van', 'outdoor']).optional(),
  venueName: z.string().max(200).optional(),
  venueAddress: z.string().optional(),
  
  // Resources
  budget: z.number().nonnegative().optional(),
  requiredStaff: z.number().nonnegative().optional(),
  requiredVolunteers: z.number().nonnegative().optional(),
  equipmentNeeded: z.array(z.string()).optional().default([]),
  
  // Partners
  partnerOrganizations: z.array(z.string()).optional().default([]),
  sponsors: z.array(z.string()).optional().default([]),
  governmentSchemeId: z.string().uuid().optional(),
});

const updateProgramSchema = createProgramSchema.partial().extend({
  programId: z.string().uuid(),
});

const updateProgramStatusSchema = z.object({
  programId: z.string().uuid(),
  status: z.enum(['planned', 'approved', 'active', 'completed', 'cancelled']),
  approvalStatus: z.enum(['pending', 'approved', 'rejected']).optional(),
});

// GET /api/csr/programs - Get CSR programs
export async function GET(request: NextRequest) {
  try {
    // For demo mode, skip authentication
    const DEMO_MODE = true; // Set to false for production
    
    let orgId = null;
    try {
      const authResult = auth();
      orgId = authResult?.orgId;
    } catch (error) {
      // Auth failed, but continue in demo mode
      console.log('Auth failed, continuing in demo mode');
    }
    if (!DEMO_MODE && !orgId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const programType = searchParams.get('programType');
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    // For demo purposes, return mock data with filtering
    let filteredPrograms = mockCSRPrograms;
    
    // Filter by programType if provided
    if (programType) {
      filteredPrograms = mockCSRPrograms.filter(program => program.programType === programType);
    }
    
    // Filter by status if provided
    if (status) {
      filteredPrograms = filteredPrograms.filter(program => program.status === status);
    }

    // Apply pagination
    const paginatedPrograms = filteredPrograms.slice(offset, offset + limit);

    return NextResponse.json({
      data: paginatedPrograms,
      pagination: {
        total: filteredPrograms.length,
        limit,
        offset,
        hasMore: filteredPrograms.length > offset + limit
      }
    });

  } catch (error) {
    console.error('Error fetching CSR programs:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/csr/programs - Create a new CSR program
export async function POST(request: NextRequest) {
  try {
    const { orgId, userId } = auth();
    if (!orgId || !userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createProgramSchema.parse(body);

    // Create CSR program
    const result = await db
      .insert(csrPrograms)
      .values({
        ...validatedData,
        clinicId: orgId,
        createdBy: userId,
      })
      .returning();

    return NextResponse.json({ 
      data: result[0],
      message: 'CSR program created successfully'
    }, { status: 201 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error creating CSR program:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/csr/programs - Update a CSR program
export async function PUT(request: NextRequest) {
  try {
    let orgId = null;
    try {
      const authResult = auth();
      orgId = authResult?.orgId;
    } catch (error) {
      // Auth failed, but continue in demo mode
      console.log('Auth failed, continuing in demo mode');
    }
    if (!orgId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = updateProgramSchema.parse(body);
    const { programId, ...updateData } = validatedData;

    // Verify program belongs to the organization
    const existingProgram = await db
      .select()
      .from(csrPrograms)
      .where(and(
        eq(csrPrograms.programId, programId),
        eq(csrPrograms.clinicId, orgId)
      ))
      .limit(1);

    if (!existingProgram.length) {
      return NextResponse.json({ error: 'CSR program not found' }, { status: 404 });
    }

    // Don't allow editing if program is active or completed
    if (['active', 'completed'].includes(existingProgram[0].status)) {
      return NextResponse.json({ 
        error: 'Cannot edit program that is active or completed' 
      }, { status: 400 });
    }

    // Update program
    const result = await db
      .update(csrPrograms)
      .set({
        ...updateData,
        updatedAt: new Date(),
      })
      .where(eq(csrPrograms.programId, programId))
      .returning();

    return NextResponse.json({ 
      data: result[0],
      message: 'CSR program updated successfully'
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error updating CSR program:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH /api/csr/programs - Update program status
export async function PATCH(request: NextRequest) {
  try {
    const { orgId, userId } = auth();
    if (!orgId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = updateProgramStatusSchema.parse(body);

    // Verify program belongs to the organization
    const existingProgram = await db
      .select()
      .from(csrPrograms)
      .where(and(
        eq(csrPrograms.programId, validatedData.programId),
        eq(csrPrograms.clinicId, orgId)
      ))
      .limit(1);

    if (!existingProgram.length) {
      return NextResponse.json({ error: 'CSR program not found' }, { status: 404 });
    }

    const updateData: any = {
      status: validatedData.status,
      updatedAt: new Date(),
    };

    // Handle approval status
    if (validatedData.approvalStatus) {
      updateData.approvalStatus = validatedData.approvalStatus;
      if (validatedData.approvalStatus === 'approved') {
        updateData.approvedBy = userId;
      }
    }

    // Update program status
    const result = await db
      .update(csrPrograms)
      .set(updateData)
      .where(eq(csrPrograms.programId, validatedData.programId))
      .returning();

    return NextResponse.json({ 
      data: result[0],
      message: `Program status updated to ${validatedData.status}`
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error updating program status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/csr/programs - Delete a CSR program (soft delete)
export async function DELETE(request: NextRequest) {
  try {
    let orgId = null;
    try {
      const authResult = auth();
      orgId = authResult?.orgId;
    } catch (error) {
      // Auth failed, but continue in demo mode
      console.log('Auth failed, continuing in demo mode');
    }
    if (!orgId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const programId = searchParams.get('programId');

    if (!programId) {
      return NextResponse.json({ error: 'Program ID is required' }, { status: 400 });
    }

    // Verify program belongs to the organization
    const existingProgram = await db
      .select()
      .from(csrPrograms)
      .where(and(
        eq(csrPrograms.programId, programId),
        eq(csrPrograms.clinicId, orgId)
      ))
      .limit(1);

    if (!existingProgram.length) {
      return NextResponse.json({ error: 'CSR program not found' }, { status: 404 });
    }

    // Don't allow deletion if program has events with registrations
    const eventsWithRegistrations = await db
      .select({ eventId: csrEvents.eventId })
      .from(csrEvents)
      .leftJoin(csrEventRegistrations, eq(csrEvents.eventId, csrEventRegistrations.eventId))
      .where(eq(csrEvents.programId, programId))
      .limit(1);

    if (eventsWithRegistrations.length > 0) {
      return NextResponse.json({ 
        error: 'Cannot delete program with existing event registrations. Cancel the program instead.' 
      }, { status: 400 });
    }

    // Soft delete by setting status to cancelled
    await db
      .update(csrPrograms)
      .set({
        status: 'cancelled',
        updatedAt: new Date(),
      })
      .where(eq(csrPrograms.programId, programId));

    return NextResponse.json({ message: 'CSR program cancelled successfully' });

  } catch (error) {
    console.error('Error deleting CSR program:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}