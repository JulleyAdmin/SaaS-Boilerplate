import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { eq, and, desc, sql, gte, lte } from 'drizzle-orm';
import { db } from '@/libs/DB';
import { patientFeedback, patients, departments, consultations } from '@/models/Schema';
import { auth } from '@clerk/nextjs/server';
import { mockPatientFeedback } from '@/data/mock-engagement';

// Request validation schemas
const createFeedbackSchema = z.object({
  patientId: z.string().uuid(),
  feedbackType: z.enum(['consultation', 'service', 'facility', 'staff', 'overall']),
  referenceId: z.string().uuid().optional(), // consultation_id, appointment_id, etc.
  departmentId: z.string().uuid().optional(),
  
  // Ratings (1-5)
  overallRating: z.number().min(1).max(5).optional(),
  waitTimeRating: z.number().min(1).max(5).optional(),
  staffRating: z.number().min(1).max(5).optional(),
  facilityRating: z.number().min(1).max(5).optional(),
  treatmentRating: z.number().min(1).max(5).optional(),
  
  // Feedback text
  feedbackText: z.string().max(2000).optional(),
  improvementSuggestions: z.string().max(1000).optional(),
  
  // NPS
  npsScore: z.number().min(0).max(10).optional(),
  wouldRecommend: z.boolean().optional(),
  
  // Platform
  platform: z.enum(['web', 'mobile', 'kiosk', 'sms', 'phone']).optional().default('web'),
  anonymous: z.boolean().optional().default(false),
});

const updateFeedbackSchema = z.object({
  feedbackId: z.string().uuid(),
  requiresFollowup: z.boolean().optional(),
  followupCompleted: z.boolean().optional(),
  followupNotes: z.string().max(1000).optional(),
});

// GET /api/patient/feedback - Get feedback records
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
    const patientId = searchParams.get('patientId');
    const feedbackType = searchParams.get('feedbackType');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    // For demo purposes, return mock data with filtering
    let filteredFeedback = mockPatientFeedback;
    
    // Filter by patientId if provided and exists in mock data
    if (patientId) {
      const patientSpecificFeedback = mockPatientFeedback.filter(feedback => feedback.patientId === patientId);
      // If no feedback found for specific patientId, return all feedback (for demo)
      filteredFeedback = patientSpecificFeedback.length > 0 ? patientSpecificFeedback : mockPatientFeedback;
    }
    
    // Filter by feedbackType if provided
    if (feedbackType) {
      filteredFeedback = filteredFeedback.filter(feedback => feedback.feedbackType === feedbackType);
    }

    // Apply pagination
    const paginatedFeedback = filteredFeedback.slice(offset, offset + limit);

    return NextResponse.json({
      data: paginatedFeedback,
      pagination: {
        total: filteredFeedback.length,
        limit,
        offset,
        hasMore: filteredFeedback.length > offset + limit
      }
    });

  } catch (error) {
    console.error('Error fetching patient feedback:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/patient/feedback - Submit patient feedback
export async function POST(request: NextRequest) {
  try {
    const { orgId } = auth();
    if (!orgId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createFeedbackSchema.parse(body);

    // Verify patient belongs to the organization (unless anonymous)
    if (!validatedData.anonymous) {
      const patient = await db
        .select()
        .from(patients)
        .where(and(
          eq(patients.patientId, validatedData.patientId),
          eq(patients.clinicId, orgId)
        ))
        .limit(1);

      if (!patient.length) {
        return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
      }
    }

    // Validate reference ID if provided
    if (validatedData.referenceId && validatedData.feedbackType === 'consultation') {
      const consultation = await db
        .select()
        .from(consultations)
        .where(eq(consultations.consultationId, validatedData.referenceId))
        .limit(1);

      if (!consultation.length) {
        return NextResponse.json({ error: 'Referenced consultation not found' }, { status: 404 });
      }
    }

    // Create feedback record
    const result = await db
      .insert(patientFeedback)
      .values({
        ...validatedData,
        clinicId: orgId,
      })
      .returning();

    // Check if feedback requires follow-up (low ratings or specific issues)
    const requiresFollowup = 
      (validatedData.overallRating && validatedData.overallRating <= 2) ||
      (validatedData.staffRating && validatedData.staffRating <= 2) ||
      (validatedData.npsScore !== undefined && validatedData.npsScore <= 6) ||
      (validatedData.improvementSuggestions && validatedData.improvementSuggestions.length > 0);

    if (requiresFollowup) {
      await db
        .update(patientFeedback)
        .set({ requiresFollowup: true })
        .where(eq(patientFeedback.feedbackId, result[0].feedbackId));
    }

    return NextResponse.json({ 
      data: result[0],
      message: 'Feedback submitted successfully'
    }, { status: 201 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error creating patient feedback:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/patient/feedback - Update feedback (admin only)
export async function PUT(request: NextRequest) {
  try {
    const { orgId, userId } = auth();
    if (!orgId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = updateFeedbackSchema.parse(body);
    const { feedbackId, ...updateData } = validatedData;

    // Verify feedback belongs to the organization
    const existingFeedback = await db
      .select()
      .from(patientFeedback)
      .where(and(
        eq(patientFeedback.feedbackId, feedbackId),
        eq(patientFeedback.clinicId, orgId)
      ))
      .limit(1);

    if (!existingFeedback.length) {
      return NextResponse.json({ error: 'Feedback not found' }, { status: 404 });
    }

    // Update feedback
    const result = await db
      .update(patientFeedback)
      .set(updateData)
      .where(eq(patientFeedback.feedbackId, feedbackId))
      .returning();

    return NextResponse.json({ data: result[0] });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error updating patient feedback:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}