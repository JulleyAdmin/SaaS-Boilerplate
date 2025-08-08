import { auth } from '@clerk/nextjs/server';
import type { NextRequest } from 'next/server';

import { getTodayActivity } from '@/models/patient';
import { getDemoClinicId } from '@/libs/init-demo-data';
import { ensureDemoData } from '@/middleware/demo-middleware';

// GET /api/analytics/today - Get today's activity statistics
export async function GET(request: NextRequest) {
  try {
    const { userId, orgId } = await auth();

    if (!userId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!orgId) {
      return Response.json({ error: 'Organization context required' }, { status: 400 });
    }

    // Ensure demo data exists in demo mode
    if (process.env.DEMO_MODE === 'true') {
      await ensureDemoData();
    }

    const clinicId = getDemoClinicId(orgId);
    const todayActivity = await getTodayActivity(clinicId);

    return Response.json({ data: todayActivity });
  } catch (error) {
    console.error('Error fetching today\'s activity:', error);
    return Response.json(
      { error: 'Failed to fetch today\'s activity' },
      { status: 500 }
    );
  }
}