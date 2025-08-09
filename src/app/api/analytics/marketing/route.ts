import { NextRequest, NextResponse } from 'next/server';
import { campaignData, generateMonthlyTrends } from '@/lib/demo/analyticsData';

// GET /api/analytics/marketing/campaigns
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status') || 'all';
    const type = searchParams.get('type') || 'all';
    const timeRange = searchParams.get('timeRange') || '30days';
    
    // Filter campaigns
    let filteredCampaigns = [...campaignData];
    
    if (status !== 'all') {
      filteredCampaigns = filteredCampaigns.filter(c => c.status === status);
    }
    
    if (type !== 'all') {
      filteredCampaigns = filteredCampaigns.filter(c => c.type === type);
    }

    // Calculate aggregate metrics
    const totalBudget = filteredCampaigns.reduce((sum, c) => sum + c.budget, 0);
    const totalSpent = filteredCampaigns.reduce((sum, c) => sum + c.spent, 0);
    const totalRevenue = filteredCampaigns.reduce((sum, c) => sum + c.revenue, 0);
    const totalConversions = filteredCampaigns.reduce((sum, c) => sum + c.conversions, 0);
    const avgROI = filteredCampaigns.reduce((sum, c) => sum + c.roi, 0) / filteredCampaigns.length;

    // Channel performance
    const channelPerformance = [
      { 
        channel: 'Facebook',
        campaigns: 8,
        spent: 450000,
        conversions: 567,
        cpa: 794,
        roi: 14.2
      },
      { 
        channel: 'WhatsApp',
        campaigns: 12,
        spent: 280000,
        conversions: 892,
        cpa: 314,
        roi: 18.5
      },
      { 
        channel: 'Google Ads',
        campaigns: 6,
        spent: 680000,
        conversions: 423,
        cpa: 1608,
        roi: 9.8
      },
      { 
        channel: 'Instagram',
        campaigns: 5,
        spent: 320000,
        conversions: 345,
        cpa: 928,
        roi: 11.2
      },
      { 
        channel: 'SMS',
        campaigns: 15,
        spent: 180000,
        conversions: 1234,
        cpa: 146,
        roi: 22.3
      },
      { 
        channel: 'Email',
        campaigns: 9,
        spent: 120000,
        conversions: 678,
        cpa: 177,
        roi: 19.7
      }
    ];

    // Attribution analysis
    const attributionData = {
      firstTouch: {
        'Social Media': 34,
        'Search': 28,
        'Direct': 18,
        'Referral': 12,
        'Email': 8
      },
      lastTouch: {
        'Direct': 42,
        'Social Media': 23,
        'Search': 18,
        'Email': 10,
        'Referral': 7
      },
      multiTouch: {
        'Social Media': 28,
        'Direct': 30,
        'Search': 23,
        'Referral': 10,
        'Email': 9
      }
    };

    // Customer journey stages
    const customerJourney = [
      { stage: 'Awareness', touchpoints: 4523, conversion: 100 },
      { stage: 'Interest', touchpoints: 3234, conversion: 71.5 },
      { stage: 'Consideration', touchpoints: 2145, conversion: 47.4 },
      { stage: 'Intent', touchpoints: 1234, conversion: 27.3 },
      { stage: 'Purchase', touchpoints: 678, conversion: 15.0 },
      { stage: 'Retention', touchpoints: 456, conversion: 10.1 }
    ];

    // Segment performance
    const segmentPerformance = [
      {
        segment: 'Young Adults (18-35)',
        size: 45000,
        engaged: 12340,
        converted: 1234,
        avgValue: 8500,
        ltv: 34000
      },
      {
        segment: 'Families',
        size: 32000,
        engaged: 8900,
        converted: 890,
        avgValue: 15000,
        ltv: 67000
      },
      {
        segment: 'Senior Citizens',
        size: 28000,
        engaged: 9800,
        converted: 1456,
        avgValue: 12000,
        ltv: 45000
      },
      {
        segment: 'Corporate Employees',
        size: 38000,
        engaged: 15600,
        converted: 2100,
        avgValue: 10000,
        ltv: 38000
      },
      {
        segment: 'Chronic Patients',
        size: 15000,
        engaged: 8900,
        converted: 1780,
        avgValue: 25000,
        ltv: 120000
      }
    ];

    const response = {
      success: true,
      data: {
        campaigns: filteredCampaigns,
        channelPerformance,
        attributionData,
        customerJourney,
        segmentPerformance,
        monthlyTrends: generateMonthlyTrends(),
        metrics: {
          totalBudget,
          totalSpent,
          totalRevenue,
          totalConversions,
          avgROI: avgROI.toFixed(1),
          costPerAcquisition: Math.round(totalSpent / totalConversions),
          conversionRate: ((totalConversions / 50000) * 100).toFixed(1), // Assuming 50k impressions
          budgetUtilization: ((totalSpent / totalBudget) * 100).toFixed(1)
        }
      },
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching marketing analytics:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch marketing analytics',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// POST /api/analytics/marketing/campaign
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      type,
      budget,
      targetAudience,
      channels,
      startDate,
      endDate
    } = body;

    if (!name || !type || !budget || !channels || !startDate || !endDate) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields' 
        },
        { status: 400 }
      );
    }

    // Simulate campaign creation
    const campaignId = `camp-${Date.now()}`;
    
    const response = {
      success: true,
      data: {
        campaignId,
        name,
        type,
        budget,
        targetAudience,
        channels,
        startDate,
        endDate,
        status: 'draft',
        message: 'Campaign created successfully. Review and activate when ready.'
      }
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Error creating campaign:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create campaign',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// PUT /api/analytics/marketing/campaign/[id]/status
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { campaignId, status } = body;

    if (!campaignId || !status) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields: campaignId and status' 
        },
        { status: 400 }
      );
    }

    const validStatuses = ['draft', 'active', 'paused', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` 
        },
        { status: 400 }
      );
    }

    const response = {
      success: true,
      data: {
        campaignId,
        status,
        message: `Campaign status updated to ${status}`,
        updatedAt: new Date().toISOString()
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error updating campaign status:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update campaign status',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}