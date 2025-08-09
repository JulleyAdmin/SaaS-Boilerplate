import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { mockCampaigns } from '@/data/mock-crm';

// GET /api/crm/campaigns - Get campaigns
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
    const campaignType = searchParams.get('campaignType');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    // For demo purposes, return mock data with filtering
    let filteredCampaigns = mockCampaigns;
    
    // Filter by status if provided
    if (status) {
      filteredCampaigns = mockCampaigns.filter(campaign => campaign.status === status);
    }
    
    // Filter by campaignType if provided
    if (campaignType) {
      filteredCampaigns = filteredCampaigns.filter(campaign => campaign.campaignType === campaignType);
    }

    // Apply pagination
    const paginatedCampaigns = filteredCampaigns.slice(offset, offset + limit);

    return NextResponse.json({
      data: paginatedCampaigns,
      pagination: {
        total: filteredCampaigns.length,
        limit,
        offset,
        hasMore: filteredCampaigns.length > offset + limit
      }
    });

  } catch (error) {
    console.error('Error fetching campaigns:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}