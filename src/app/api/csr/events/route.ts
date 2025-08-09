import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { mockCSREvents } from '@/data/mock-csr';

// GET /api/csr/events - Get CSR events
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
    const programId = searchParams.get('programId');
    const status = searchParams.get('status');
    const eventType = searchParams.get('eventType');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    // For demo purposes, return mock data with filtering
    let filteredEvents = mockCSREvents;
    
    // Filter by programId if provided
    if (programId) {
      filteredEvents = mockCSREvents.filter(event => event.programId === programId);
    }
    
    // Filter by status if provided
    if (status) {
      filteredEvents = filteredEvents.filter(event => event.status === status);
    }
    
    // Filter by eventType if provided
    if (eventType) {
      filteredEvents = filteredEvents.filter(event => event.eventType === eventType);
    }

    // Apply pagination
    const paginatedEvents = filteredEvents.slice(offset, offset + limit);

    return NextResponse.json({
      data: paginatedEvents,
      pagination: {
        total: filteredEvents.length,
        limit,
        offset,
        hasMore: filteredEvents.length > offset + limit
      }
    });

  } catch (error) {
    console.error('Error fetching CSR events:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}