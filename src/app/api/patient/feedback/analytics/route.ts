import { NextRequest, NextResponse } from 'next/server';
import { eq, and, desc, sql, gte, lte, avg, count } from 'drizzle-orm';
import { db } from '@/libs/DB';
import { patientFeedback, departments } from '@/models/Schema';
import { auth } from '@clerk/nextjs';
import { mockFeedbackAnalytics } from '@/data/mock-engagement';

// GET /api/patient/feedback/analytics - Get feedback analytics
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
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const departmentId = searchParams.get('departmentId');

    // Build date range conditions
    const conditions = [eq(patientFeedback.clinicId, orgId)];

    if (startDate) {
      conditions.push(gte(patientFeedback.submittedAt, new Date(startDate)));
    }

    if (endDate) {
      conditions.push(lte(patientFeedback.submittedAt, new Date(endDate)));
    }

    if (departmentId) {
      conditions.push(eq(patientFeedback.departmentId, departmentId));
    }

    // 1. Overall satisfaction metrics
    const overallMetrics = await db
      .select({
        totalFeedbacks: count(),
        avgOverallRating: avg(patientFeedback.overallRating),
        avgWaitTimeRating: avg(patientFeedback.waitTimeRating),
        avgStaffRating: avg(patientFeedback.staffRating),
        avgFacilityRating: avg(patientFeedback.facilityRating),
        avgTreatmentRating: avg(patientFeedback.treatmentRating),
        avgNpsScore: avg(patientFeedback.npsScore),
      })
      .from(patientFeedback)
      .where(and(...conditions));

    // 2. NPS categorization (Promoters: 9-10, Passives: 7-8, Detractors: 0-6)
    const npsBreakdown = await db
      .select({
        npsCategory: sql<string>`
          CASE 
            WHEN ${patientFeedback.npsScore} >= 9 THEN 'promoter'
            WHEN ${patientFeedback.npsScore} >= 7 THEN 'passive'
            WHEN ${patientFeedback.npsScore} IS NOT NULL THEN 'detractor'
            ELSE 'no_score'
          END
        `,
        count: count(),
      })
      .from(patientFeedback)
      .where(and(...conditions))
      .groupBy(sql`
        CASE 
          WHEN ${patientFeedback.npsScore} >= 9 THEN 'promoter'
          WHEN ${patientFeedback.npsScore} >= 7 THEN 'passive'
          WHEN ${patientFeedback.npsScore} IS NOT NULL THEN 'detractor'
          ELSE 'no_score'
        END
      `);

    // Calculate NPS score
    const promoters = npsBreakdown.find(n => n.npsCategory === 'promoter')?.count || 0;
    const detractors = npsBreakdown.find(n => n.npsCategory === 'detractor')?.count || 0;
    const totalWithNps = promoters + detractors + (npsBreakdown.find(n => n.npsCategory === 'passive')?.count || 0);
    const npsScore = totalWithNps > 0 ? Math.round(((promoters - detractors) / totalWithNps) * 100) : 0;

    // 3. Rating distribution (1-5 stars)
    const ratingDistribution = await db
      .select({
        rating: patientFeedback.overallRating,
        count: count(),
      })
      .from(patientFeedback)
      .where(and(...conditions, sql`${patientFeedback.overallRating} IS NOT NULL`))
      .groupBy(patientFeedback.overallRating)
      .orderBy(desc(patientFeedback.overallRating));

    // 4. Department-wise breakdown
    const departmentBreakdown = await db
      .select({
        departmentId: departments.departmentId,
        departmentName: departments.departmentName,
        feedbackCount: count(),
        avgOverallRating: avg(patientFeedback.overallRating),
        avgStaffRating: avg(patientFeedback.staffRating),
        avgNpsScore: avg(patientFeedback.npsScore),
      })
      .from(patientFeedback)
      .leftJoin(departments, eq(patientFeedback.departmentId, departments.departmentId))
      .where(and(...conditions))
      .groupBy(departments.departmentId, departments.departmentName)
      .orderBy(desc(count()));

    // 5. Feedback type distribution
    const feedbackTypeDistribution = await db
      .select({
        feedbackType: patientFeedback.feedbackType,
        count: count(),
        avgRating: avg(patientFeedback.overallRating),
      })
      .from(patientFeedback)
      .where(and(...conditions))
      .groupBy(patientFeedback.feedbackType);

    // 6. Platform usage
    const platformDistribution = await db
      .select({
        platform: patientFeedback.platform,
        count: count(),
        avgRating: avg(patientFeedback.overallRating),
      })
      .from(patientFeedback)
      .where(and(...conditions))
      .groupBy(patientFeedback.platform);

    // 7. Feedback requiring follow-up
    const followupMetrics = await db
      .select({
        requiresFollowup: count(sql`CASE WHEN ${patientFeedback.requiresFollowup} = true THEN 1 END`),
        followupCompleted: count(sql`CASE WHEN ${patientFeedback.followupCompleted} = true THEN 1 END`),
        pendingFollowup: count(sql`CASE WHEN ${patientFeedback.requiresFollowup} = true AND ${patientFeedback.followupCompleted} = false THEN 1 END`),
      })
      .from(patientFeedback)
      .where(and(...conditions));

    // 8. Monthly trend (last 12 months)
    const monthlyTrend = await db
      .select({
        month: sql<string>`TO_CHAR(${patientFeedback.submittedAt}, 'YYYY-MM')`,
        feedbackCount: count(),
        avgOverallRating: avg(patientFeedback.overallRating),
        avgNpsScore: avg(patientFeedback.npsScore),
      })
      .from(patientFeedback)
      .where(and(
        eq(patientFeedback.clinicId, orgId),
        gte(patientFeedback.submittedAt, new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)) // Last 12 months
      ))
      .groupBy(sql`TO_CHAR(${patientFeedback.submittedAt}, 'YYYY-MM')`)
      .orderBy(sql`TO_CHAR(${patientFeedback.submittedAt}, 'YYYY-MM')`);

    // 9. Top improvement suggestions
    const improvementSuggestions = await db
      .select({
        suggestion: patientFeedback.improvementSuggestions,
        count: count(),
        avgRating: avg(patientFeedback.overallRating),
      })
      .from(patientFeedback)
      .where(and(...conditions, sql`${patientFeedback.improvementSuggestions} IS NOT NULL AND ${patientFeedback.improvementSuggestions} != ''`))
      .groupBy(patientFeedback.improvementSuggestions)
      .orderBy(desc(count()))
      .limit(10);

    // For demo purposes, return mock analytics data
    return NextResponse.json({ data: mockFeedbackAnalytics });

  } catch (error) {
    console.error('Error fetching feedback analytics:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}