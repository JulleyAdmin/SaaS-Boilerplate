import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { eq, and } from 'drizzle-orm';
import { db } from '@/libs/DB';
import { patientPreferences, patients } from '@/models/Schema';
import { auth } from '@clerk/nextjs/server';
import { mockPatientPreferences } from '@/data/mock-engagement';

// Request validation schemas
const createPreferencesSchema = z.object({
  patientId: z.string().uuid(),
  preferredLanguage: z.string().optional().default('en'),
  preferredChannel: z.enum(['sms', 'whatsapp', 'email', 'voice_call', 'push_notification']).optional().default('whatsapp'),
  communicationFrequency: z.string().optional().default('weekly'),
  quietHoursStart: z.string().optional(),
  quietHoursEnd: z.string().optional(),
  interestedPrograms: z.array(z.string()).optional().default([]),
  healthGoals: z.array(z.string()).optional().default([]),
  preferredDoctorId: z.string().uuid().optional(),
  allowFamilyAccess: z.boolean().optional().default(false),
  marketingConsent: z.boolean().optional().default(false),
  researchConsent: z.boolean().optional().default(false),
  dataSharingConsent: z.boolean().optional().default(false),
});

const updatePreferencesSchema = createPreferencesSchema.partial().extend({
  preferenceId: z.string().uuid(),
});

// GET /api/patient/preferences - Get patient preferences
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

    // For demo purposes, return mock data
    let filteredPreferences = mockPatientPreferences;
    
    // Filter by patientId if provided and exists in mock data
    if (patientId) {
      const patientSpecificPrefs = mockPatientPreferences.filter(pref => pref.patientId === patientId);
      // If no preferences found for specific patientId, return first preference (for demo)
      filteredPreferences = patientSpecificPrefs.length > 0 ? patientSpecificPrefs : mockPatientPreferences;
    }

    return NextResponse.json({ 
      data: filteredPreferences.length > 0 ? filteredPreferences[0] : null 
    });

  } catch (error) {
    console.error('Error fetching patient preferences:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/patient/preferences - Create or update patient preferences
export async function POST(request: NextRequest) {
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
    const validatedData = createPreferencesSchema.parse(body);

    // Verify patient belongs to the organization
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

    // Check if preferences already exist
    const existingPreferences = await db
      .select()
      .from(patientPreferences)
      .where(eq(patientPreferences.patientId, validatedData.patientId))
      .limit(1);

    let result;

    if (existingPreferences.length) {
      // Update existing preferences
      result = await db
        .update(patientPreferences)
        .set({
          ...validatedData,
          clinicId: orgId,
          consentUpdatedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(patientPreferences.patientId, validatedData.patientId))
        .returning();
    } else {
      // Create new preferences
      result = await db
        .insert(patientPreferences)
        .values({
          ...validatedData,
          clinicId: orgId,
          consentUpdatedAt: new Date(),
        })
        .returning();
    }

    return NextResponse.json({ data: result[0] }, { status: existingPreferences.length ? 200 : 201 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error creating/updating patient preferences:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/patient/preferences - Update specific preferences
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
    const validatedData = updatePreferencesSchema.parse(body);
    const { preferenceId, ...updateData } = validatedData;

    // Verify preferences belong to the organization
    const existingPreferences = await db
      .select()
      .from(patientPreferences)
      .where(and(
        eq(patientPreferences.preferenceId, preferenceId),
        eq(patientPreferences.clinicId, orgId)
      ))
      .limit(1);

    if (!existingPreferences.length) {
      return NextResponse.json({ error: 'Preferences not found' }, { status: 404 });
    }

    // Update preferences
    const result = await db
      .update(patientPreferences)
      .set({
        ...updateData,
        consentUpdatedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(patientPreferences.preferenceId, preferenceId))
      .returning();

    return NextResponse.json({ data: result[0] });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error updating patient preferences:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/patient/preferences - Reset preferences to default
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
    const patientId = searchParams.get('patientId');

    if (!patientId) {
      return NextResponse.json({ error: 'Patient ID is required' }, { status: 400 });
    }

    // Delete patient preferences (will fall back to defaults)
    await db
      .delete(patientPreferences)
      .where(and(
        eq(patientPreferences.patientId, patientId),
        eq(patientPreferences.clinicId, orgId)
      ));

    return NextResponse.json({ message: 'Preferences reset to default' });

  } catch (error) {
    console.error('Error deleting patient preferences:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}