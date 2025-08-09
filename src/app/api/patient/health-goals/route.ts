import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { eq, and, desc } from 'drizzle-orm';
import { db } from '@/libs/DB';
import { healthGoals, patients, users } from '@/models/Schema';
import { auth } from '@clerk/nextjs/server';
import { mockHealthGoals } from '@/data/mock-engagement';

// Request validation schemas
const createGoalSchema = z.object({
  patientId: z.string().uuid(),
  goalType: z.enum([
    'weight_loss', 'weight_gain', 'bp_control', 'diabetes_management',
    'cholesterol_control', 'fitness_improvement', 'quit_smoking', 'mental_health'
  ]),
  goalName: z.string().min(1).max(200),
  targetValue: z.object({
    metric: z.string(),
    value: z.number(),
    unit: z.string(),
  }),
  currentValue: z.object({
    metric: z.string(),
    value: z.number(),
    unit: z.string(),
  }).optional(),
  startDate: z.string().transform((str) => new Date(str)),
  targetDate: z.string().transform((str) => new Date(str)),
  assignedCoachId: z.string().uuid().optional(),
  supportGroupId: z.string().uuid().optional(),
});

const updateGoalSchema = z.object({
  goalId: z.string().uuid(),
  goalName: z.string().min(1).max(200).optional(),
  targetValue: z.object({
    metric: z.string(),
    value: z.number(),
    unit: z.string(),
  }).optional(),
  currentValue: z.object({
    metric: z.string(),
    value: z.number(),
    unit: z.string(),
  }).optional(),
  targetDate: z.string().transform((str) => new Date(str)).optional(),
  achievedDate: z.string().transform((str) => new Date(str)).optional(),
  status: z.enum(['active', 'paused', 'achieved', 'abandoned']).optional(),
  assignedCoachId: z.string().uuid().optional(),
  supportGroupId: z.string().uuid().optional(),
});

const progressUpdateSchema = z.object({
  goalId: z.string().uuid(),
  currentValue: z.object({
    metric: z.string(),
    value: z.number(),
    unit: z.string(),
  }),
  milestone: z.object({
    date: z.string().transform((str) => new Date(str)),
    value: z.number(),
    note: z.string().optional(),
  }).optional(),
});

// Calculate progress percentage
function calculateProgress(current: any, target: any): number {
  if (!current || !target) return 0;
  
  const currentVal = current.value;
  const targetVal = target.value;
  
  // For weight loss, diabetes management, BP control (lower is better)
  if (['weight_loss', 'diabetes_management', 'bp_control', 'cholesterol_control'].includes(target.metric)) {
    const initialVal = currentVal * 1.2; // Assume 20% higher initial value
    return Math.min(100, Math.max(0, ((initialVal - currentVal) / (initialVal - targetVal)) * 100));
  }
  
  // For fitness improvement, weight gain (higher is better)
  return Math.min(100, Math.max(0, (currentVal / targetVal) * 100));
}

// GET /api/patient/health-goals - Get patient health goals
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
    const status = searchParams.get('status');

    // For demo purposes, return mock data
    let filteredGoals = mockHealthGoals;
    
    // Filter by patientId if provided and exists in mock data
    if (patientId) {
      const patientSpecificGoals = mockHealthGoals.filter(goal => goal.patientId === patientId);
      // If no goals found for specific patientId, return all goals (for demo)
      filteredGoals = patientSpecificGoals.length > 0 ? patientSpecificGoals : mockHealthGoals;
    }
    
    // Filter by status if provided
    if (status) {
      filteredGoals = filteredGoals.filter(goal => goal.status === status);
    }

    return NextResponse.json({ data: filteredGoals });

  } catch (error) {
    console.error('Error fetching health goals:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/patient/health-goals - Create a new health goal
export async function POST(request: NextRequest) {
  try {
    const { orgId, userId } = auth();
    if (!orgId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createGoalSchema.parse(body);

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

    // Calculate initial progress
    const progressPercentage = calculateProgress(validatedData.currentValue, validatedData.targetValue);

    // Create health goal
    const result = await db
      .insert(healthGoals)
      .values({
        ...validatedData,
        clinicId: orgId,
        progressPercentage,
        milestones: validatedData.currentValue ? [{
          date: new Date(),
          value: validatedData.currentValue.value,
          note: 'Initial measurement'
        }] : [],
        createdBy: userId,
      })
      .returning();

    return NextResponse.json({ data: result[0] }, { status: 201 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error creating health goal:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/patient/health-goals - Update a health goal
export async function PUT(request: NextRequest) {
  try {
    const { orgId } = auth();
    if (!orgId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = updateGoalSchema.parse(body);
    const { goalId, ...updateData } = validatedData;

    // Verify goal belongs to the organization
    const existingGoal = await db
      .select()
      .from(healthGoals)
      .where(and(
        eq(healthGoals.goalId, goalId),
        eq(healthGoals.clinicId, orgId)
      ))
      .limit(1);

    if (!existingGoal.length) {
      return NextResponse.json({ error: 'Health goal not found' }, { status: 404 });
    }

    // Calculate new progress if current value updated
    let updatedProgress = existingGoal[0].progressPercentage;
    if (updateData.currentValue && (updateData.targetValue || existingGoal[0].targetValue)) {
      const targetValue = updateData.targetValue || existingGoal[0].targetValue;
      updatedProgress = calculateProgress(updateData.currentValue, targetValue);
    }

    // Mark as achieved if progress reaches 100%
    let status = updateData.status;
    if (updatedProgress >= 100 && status !== 'abandoned') {
      status = 'achieved';
      updateData.achievedDate = new Date();
    }

    // Update health goal
    const result = await db
      .update(healthGoals)
      .set({
        ...updateData,
        progressPercentage: updatedProgress,
        status: status || existingGoal[0].status,
        updatedAt: new Date(),
      })
      .where(eq(healthGoals.goalId, goalId))
      .returning();

    return NextResponse.json({ data: result[0] });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error updating health goal:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH /api/patient/health-goals - Update progress
export async function PATCH(request: NextRequest) {
  try {
    const { orgId } = auth();
    if (!orgId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = progressUpdateSchema.parse(body);

    // Verify goal belongs to the organization
    const existingGoal = await db
      .select()
      .from(healthGoals)
      .where(and(
        eq(healthGoals.goalId, validatedData.goalId),
        eq(healthGoals.clinicId, orgId)
      ))
      .limit(1);

    if (!existingGoal.length) {
      return NextResponse.json({ error: 'Health goal not found' }, { status: 404 });
    }

    const goal = existingGoal[0];

    // Calculate new progress
    const progressPercentage = calculateProgress(validatedData.currentValue, goal.targetValue);

    // Add milestone if provided
    const updatedMilestones = [...(goal.milestones as any[] || [])];
    if (validatedData.milestone) {
      updatedMilestones.push(validatedData.milestone);
    }

    // Check if goal is achieved
    let status = goal.status;
    let achievedDate = goal.achievedDate;
    if (progressPercentage >= 100 && status !== 'abandoned') {
      status = 'achieved';
      achievedDate = new Date();
    }

    // Update progress
    const result = await db
      .update(healthGoals)
      .set({
        currentValue: validatedData.currentValue,
        progressPercentage,
        milestones: updatedMilestones,
        status,
        achievedDate,
        updatedAt: new Date(),
      })
      .where(eq(healthGoals.goalId, validatedData.goalId))
      .returning();

    return NextResponse.json({ data: result[0] });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error updating goal progress:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/patient/health-goals - Delete a health goal
export async function DELETE(request: NextRequest) {
  try {
    const { orgId } = auth();
    if (!orgId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const goalId = searchParams.get('goalId');

    if (!goalId) {
      return NextResponse.json({ error: 'Goal ID is required' }, { status: 400 });
    }

    // Verify goal belongs to the organization
    const existingGoal = await db
      .select()
      .from(healthGoals)
      .where(and(
        eq(healthGoals.goalId, goalId),
        eq(healthGoals.clinicId, orgId)
      ))
      .limit(1);

    if (!existingGoal.length) {
      return NextResponse.json({ error: 'Health goal not found' }, { status: 404 });
    }

    // Instead of hard delete, mark as abandoned
    await db
      .update(healthGoals)
      .set({
        status: 'abandoned',
        updatedAt: new Date(),
      })
      .where(eq(healthGoals.goalId, goalId));

    return NextResponse.json({ message: 'Health goal deleted successfully' });

  } catch (error) {
    console.error('Error deleting health goal:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}