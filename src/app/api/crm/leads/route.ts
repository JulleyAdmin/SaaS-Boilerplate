import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { realisticHospitalLeads } from '@/data/mock-hospital-leads';

// GET /api/crm/leads - Get leads
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
    const source = searchParams.get('source');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    // For demo purposes, return mock data with filtering
    let filteredLeads = realisticHospitalLeads;
    
    // Filter by status if provided
    if (status && status !== 'all') {
      filteredLeads = filteredLeads.filter(lead => lead.status === status);
    }
    
    // Filter by source if provided
    if (source) {
      filteredLeads = filteredLeads.filter(lead => lead.source === source);
    }
    
    // Sort by most recent first
    filteredLeads = filteredLeads.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // Apply pagination
    const paginatedLeads = filteredLeads.slice(offset, offset + limit);

    return NextResponse.json({
      data: paginatedLeads,
      pagination: {
        total: filteredLeads.length,
        limit,
        offset,
        hasMore: filteredLeads.length > offset + limit
      }
    });

  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}