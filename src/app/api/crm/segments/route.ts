import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { mockPatientSegments } from '@/data/mock-crm';



// GET /api/crm/segments - Get patient segments
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
    const isActive = searchParams.get('isActive');
    const segmentType = searchParams.get('segmentType');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    // For demo purposes, return mock data with filtering
    let filteredSegments = mockPatientSegments;
    
    // Filter by segment type if provided
    if (segmentType && segmentType !== 'all') {
      filteredSegments = filteredSegments.filter(segment => segment.segmentType === segmentType);
    }
    
    // Filter by active status if provided
    if (isActive !== null) {
      const activeFilter = isActive === 'true';
      filteredSegments = filteredSegments.filter(segment => segment.isActive === activeFilter);
    }

    // Apply pagination
    const paginatedSegments = filteredSegments.slice(offset, offset + limit);

    return NextResponse.json({
      data: paginatedSegments,
      pagination: {
        total: filteredSegments.length,
        limit,
        offset,
        hasMore: filteredSegments.length > offset + limit
      }
    });

  } catch (error) {
    console.error('Error fetching patient segments:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}