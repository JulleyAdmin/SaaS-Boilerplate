import { NextRequest, NextResponse } from 'next/server';
import { generateReferrerProfiles, campaignData } from '@/lib/demo/analyticsData';

// GET /api/analytics/referrals
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const timeRange = searchParams.get('timeRange') || '30days';
    const type = searchParams.get('type') || 'all';
    const specialty = searchParams.get('specialty') || 'all';
    const sortBy = searchParams.get('sortBy') || 'revenue';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    // Generate referrer profiles
    let referrers = generateReferrerProfiles();

    // Filter by type
    if (type !== 'all') {
      referrers = referrers.filter(r => r.type === type);
    }

    // Filter by specialty (for doctors)
    if (specialty !== 'all') {
      referrers = referrers.filter(r => 
        r.specialty?.toLowerCase().includes(specialty.toLowerCase())
      );
    }

    // Time range filter
    const now = Date.now();
    const timeRanges: Record<string, number> = {
      '7days': 7 * 24 * 60 * 60 * 1000,
      '30days': 30 * 24 * 60 * 60 * 1000,
      '90days': 90 * 24 * 60 * 60 * 1000,
      'year': 365 * 24 * 60 * 60 * 1000
    };
    
    if (timeRanges[timeRange]) {
      referrers = referrers.filter(r => 
        r.lastReferralDate.getTime() > now - timeRanges[timeRange]
      );
    }

    // Sort
    referrers.sort((a, b) => {
      switch (sortBy) {
        case 'revenue':
          return b.totalRevenue - a.totalRevenue;
        case 'referrals':
          return b.totalReferrals - a.totalReferrals;
        case 'conversion':
          return b.conversionRate - a.conversionRate;
        case 'recent':
          return b.lastReferralDate.getTime() - a.lastReferralDate.getTime();
        default:
          return 0;
      }
    });

    // Calculate aggregate metrics
    const totalReferrals = referrers.reduce((sum, r) => sum + r.totalReferrals, 0);
    const totalRevenue = referrers.reduce((sum, r) => sum + r.totalRevenue, 0);
    const avgConversionRate = referrers.reduce((sum, r) => sum + r.conversionRate, 0) / referrers.length;
    const totalActiveReferrals = referrers.reduce((sum, r) => sum + r.activeReferrals, 0);
    const totalIncentivesDue = referrers.reduce((sum, r) => sum + r.incentivesDue, 0);
    const totalIncentivesPaid = referrers.reduce((sum, r) => sum + r.incentivesPaid, 0);

    // Source breakdown
    const sourceBreakdown = [
      { 
        type: 'Doctor',
        count: referrers.filter(r => r.type === 'Doctor').length,
        referrals: referrers.filter(r => r.type === 'Doctor').reduce((sum, r) => sum + r.totalReferrals, 0),
        revenue: referrers.filter(r => r.type === 'Doctor').reduce((sum, r) => sum + r.totalRevenue, 0)
      },
      { 
        type: 'Patient',
        count: referrers.filter(r => r.type === 'Patient').length,
        referrals: referrers.filter(r => r.type === 'Patient').reduce((sum, r) => sum + r.totalReferrals, 0),
        revenue: referrers.filter(r => r.type === 'Patient').reduce((sum, r) => sum + r.totalRevenue, 0)
      },
      { 
        type: 'Corporate',
        count: referrers.filter(r => r.type === 'Corporate').length,
        referrals: referrers.filter(r => r.type === 'Corporate').reduce((sum, r) => sum + r.totalReferrals, 0),
        revenue: referrers.filter(r => r.type === 'Corporate').reduce((sum, r) => sum + r.totalRevenue, 0)
      },
      { 
        type: 'Insurance',
        count: referrers.filter(r => r.type === 'Insurance').length,
        referrals: referrers.filter(r => r.type === 'Insurance').reduce((sum, r) => sum + r.totalReferrals, 0),
        revenue: referrers.filter(r => r.type === 'Insurance').reduce((sum, r) => sum + r.totalRevenue, 0)
      },
      { 
        type: 'HealthCamp',
        count: referrers.filter(r => r.type === 'HealthCamp').length,
        referrals: referrers.filter(r => r.type === 'HealthCamp').reduce((sum, r) => sum + r.totalReferrals, 0),
        revenue: referrers.filter(r => r.type === 'HealthCamp').reduce((sum, r) => sum + r.totalRevenue, 0)
      }
    ];

    // Conversion funnel
    const conversionFunnel = {
      received: totalReferrals,
      contacted: Math.floor(totalReferrals * 0.91),
      booked: Math.floor(totalReferrals * 0.67),
      consulted: Math.floor(totalReferrals * 0.53),
      treated: Math.floor(totalReferrals * 0.41),
      completed: Math.floor(totalReferrals * 0.33)
    };

    // Monthly trends
    const monthlyTrends = generateMonthlyTrends();

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedReferrers = referrers.slice(startIndex, endIndex);
    const totalPages = Math.ceil(referrers.length / limit);

    const response = {
      success: true,
      data: {
        referrers: paginatedReferrers,
        sourceBreakdown,
        conversionFunnel,
        monthlyTrends,
        campaigns: campaignData,
        metrics: {
          totalReferrals,
          totalRevenue,
          avgConversionRate: avgConversionRate.toFixed(1),
          totalActiveReferrals,
          totalIncentivesDue,
          totalIncentivesPaid,
          avgReferralValue: Math.floor(totalRevenue / totalReferrals),
          avgConversionTime: 3.2, // days
          topReferrerType: sourceBreakdown.sort((a, b) => b.referrals - a.referrals)[0].type
        },
        pagination: {
          page,
          limit,
          total: referrers.length,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      },
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching referral analytics:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch referral analytics',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// POST /api/analytics/referrals/incentive
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { referrerId, amount, type = 'payment' } = body;

    if (!referrerId || !amount) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields: referrerId and amount' 
        },
        { status: 400 }
      );
    }

    // Simulate incentive processing
    const transactionId = `txn-${Date.now()}`;
    
    const response = {
      success: true,
      data: {
        transactionId,
        referrerId,
        amount,
        type,
        status: 'processing',
        message: `Incentive payment of ₹${amount} initiated for referrer ${referrerId}`,
        estimatedCompletion: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error processing incentive:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to process incentive',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// POST /api/analytics/referrals/roi-calculation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      referrerType = 'Doctor',
      incentiveAmount = 500,
      avgPatientValue = 12500,
      conversionRate = 75,
      referralsPerMonth = 10,
      retentionRate = 60
    } = body;

    // Calculate ROI metrics
    const monthlyIncentives = incentiveAmount * referralsPerMonth * (conversionRate / 100);
    const monthlyRevenue = referralsPerMonth * (conversionRate / 100) * avgPatientValue;
    const yearlyIncentives = monthlyIncentives * 12;
    const yearlyRevenue = monthlyRevenue * 12;
    
    // Account for retention and repeat visits
    const retentionMultiplier = 1 + (retentionRate / 100) * 0.5;
    const adjustedRevenue = yearlyRevenue * retentionMultiplier;
    
    const netProfit = adjustedRevenue - yearlyIncentives;
    const roi = ((netProfit / yearlyIncentives) * 100);
    const paybackPeriod = yearlyIncentives / (adjustedRevenue / 12);
    const costPerAcquisition = incentiveAmount / (conversionRate / 100);
    const lifetimeValue = avgPatientValue * retentionMultiplier * 2;
    const profitMargin = (netProfit / adjustedRevenue) * 100;

    const response = {
      success: true,
      data: {
        input: {
          referrerType,
          incentiveAmount,
          avgPatientValue,
          conversionRate,
          referralsPerMonth,
          retentionRate
        },
        metrics: {
          totalInvestment: yearlyIncentives,
          totalRevenue: adjustedRevenue,
          netProfit,
          roi: roi.toFixed(1),
          paybackPeriod: paybackPeriod.toFixed(1),
          costPerAcquisition: Math.round(costPerAcquisition),
          lifetimeValue: Math.round(lifetimeValue),
          profitMargin: profitMargin.toFixed(1)
        },
        recommendation: roi > 200 
          ? 'Excellent ROI! This referral program configuration shows strong profitability.'
          : roi > 100
          ? 'Good ROI. Consider optimizing conversion rates for better returns.'
          : 'Low ROI. Review incentive structure and improve conversion processes.'
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error calculating ROI:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to calculate ROI',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}