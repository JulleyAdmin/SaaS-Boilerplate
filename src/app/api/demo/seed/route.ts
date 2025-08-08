import { NextRequest } from 'next/server';
import { initializeDemoData, checkDemoData } from '@/libs/init-demo-data';

// POST /api/demo/seed - Manually seed demo data
export async function POST(request: NextRequest) {
  try {
    // Only allow in demo mode
    if (process.env.DEMO_MODE !== 'true') {
      return Response.json(
        { error: 'Demo seeding is only available in demo mode' },
        { status: 403 }
      );
    }

    console.log('[API] Demo seed endpoint called');
    
    // Check current status
    const beforeStatus = await checkDemoData();
    console.log('[API] Before seeding:', beforeStatus);

    // Initialize demo data
    const result = await initializeDemoData();
    
    // Check status after
    const afterStatus = await checkDemoData();
    console.log('[API] After seeding:', afterStatus);

    return Response.json({
      success: result,
      message: result ? 'Demo data seeded successfully' : 'Failed to seed demo data',
      status: {
        before: beforeStatus,
        after: afterStatus
      }
    });
  } catch (error) {
    console.error('[API] Error seeding demo data:', error);
    return Response.json(
      { 
        error: 'Failed to seed demo data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// GET /api/demo/seed - Check demo data status
export async function GET(request: NextRequest) {
  try {
    // Only allow in demo mode
    if (process.env.DEMO_MODE !== 'true') {
      return Response.json(
        { error: 'Demo status is only available in demo mode' },
        { status: 403 }
      );
    }

    const status = await checkDemoData();
    
    return Response.json({
      demoMode: true,
      ...status
    });
  } catch (error) {
    console.error('[API] Error checking demo data:', error);
    return Response.json(
      { 
        error: 'Failed to check demo data status',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}