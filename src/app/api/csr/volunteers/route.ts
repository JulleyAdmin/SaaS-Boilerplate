import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { mockVolunteers } from '@/data/mock-csr';



// GET /api/csr/volunteers - Get volunteers
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
    const status = searchParams.get('status');
    const availability = searchParams.get('availability');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    // For demo purposes, return mock data with filtering
    let filteredVolunteers = mockVolunteers;
    
    // Filter by status if provided
    if (status) {
      filteredVolunteers = mockVolunteers.filter(volunteer => volunteer.status === status);
    }
    
    // Filter by availability if provided
    if (availability) {
      filteredVolunteers = filteredVolunteers.filter(volunteer => 
        volunteer.availability.includes(availability)
      );
    }

    // Apply pagination
    const paginatedVolunteers = filteredVolunteers.slice(offset, offset + limit);

    return NextResponse.json({
      data: paginatedVolunteers,
      pagination: {
        total: filteredVolunteers.length,
        limit,
        offset,
        hasMore: filteredVolunteers.length > offset + limit
      }
    });

  } catch (error) {
    console.error('Error fetching volunteers:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}