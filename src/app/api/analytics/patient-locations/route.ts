import { NextRequest, NextResponse } from 'next/server';
import { bangaloreAreas, generateMonthlyTrends, serviceUtilizationData, diseasePrevalenceByArea, demographicsByArea } from '@/lib/demo/analyticsData';

// GET /api/analytics/patient-locations
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const timeRange = searchParams.get('timeRange') || '30days';
    const area = searchParams.get('area') || 'all';
    const pincode = searchParams.get('pincode');
    
    // Simulate different data based on time range
    const timeMultiplier = {
      '7days': 0.3,
      '30days': 1,
      '90days': 2.5,
      'year': 8
    }[timeRange] || 1;

    // Filter areas based on parameters
    let filteredAreas = [...bangaloreAreas];
    
    if (area !== 'all' && area) {
      filteredAreas = filteredAreas.filter(loc => 
        loc.area.toLowerCase().includes(area.toLowerCase())
      );
    }
    
    if (pincode) {
      filteredAreas = filteredAreas.filter(loc => 
        loc.pincode === pincode
      );
    }

    // Adjust data based on time range
    const adjustedAreas = filteredAreas.map(area => ({
      ...area,
      patients: Math.floor(area.patients * timeMultiplier),
      revenue: Math.floor(area.revenue * timeMultiplier)
    }));

    // Calculate aggregate metrics
    const totalPatients = adjustedAreas.reduce((sum, area) => sum + area.patients, 0);
    const totalRevenue = adjustedAreas.reduce((sum, area) => sum + area.revenue, 0);
    const avgDistance = adjustedAreas.reduce((sum, area) => sum + area.avgDistance, 0) / adjustedAreas.length;
    
    // Top locations by patients
    const topLocations = [...adjustedAreas]
      .sort((a, b) => b.patients - a.patients)
      .slice(0, 10)
      .map(loc => ({
        area: loc.area,
        pincode: loc.pincode,
        patients: loc.patients,
        revenue: loc.revenue,
        avgDistance: loc.avgDistance,
        growthRate: Math.random() * 30 - 5 // -5% to +25% growth
      }));

    // Catchment area analysis
    const catchmentAnalysis = {
      primary: { // 0-5km
        patients: Math.floor(totalPatients * 0.45),
        revenue: Math.floor(totalRevenue * 0.48),
        avgVisits: 4.2,
        retention: 82
      },
      secondary: { // 5-10km
        patients: Math.floor(totalPatients * 0.35),
        revenue: Math.floor(totalRevenue * 0.32),
        avgVisits: 2.8,
        retention: 68
      },
      tertiary: { // 10-20km
        patients: Math.floor(totalPatients * 0.15),
        revenue: Math.floor(totalRevenue * 0.15),
        avgVisits: 1.9,
        retention: 54
      },
      extended: { // >20km
        patients: Math.floor(totalPatients * 0.05),
        revenue: Math.floor(totalRevenue * 0.05),
        avgVisits: 1.2,
        retention: 38
      }
    };

    // Market opportunity scores
    const marketOpportunities = adjustedAreas.map(area => ({
      area: area.area,
      population: area.population,
      currentPatients: area.patients,
      penetration: (area.patients / area.population) * 100,
      potential: Math.floor(area.population * 0.15), // 15% potential
      opportunityScore: Math.random() * 100,
      competitorDensity: Math.floor(Math.random() * 10) + 1,
      avgIncome: Math.floor(Math.random() * 50000) + 30000
    }));

    const response = {
      success: true,
      data: {
        locations: adjustedAreas,
        topLocations,
        catchmentAnalysis,
        marketOpportunities,
        serviceUtilization: serviceUtilizationData,
        diseasePrevalence: diseasePrevalenceByArea,
        demographics: demographicsByArea,
        monthlyTrends: generateMonthlyTrends(),
        summary: {
          totalPatients,
          totalRevenue,
          avgDistance: avgDistance.toFixed(1),
          totalAreas: adjustedAreas.length,
          growthRate: 15.5,
          marketShare: 23.4
        }
      },
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching patient location analytics:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch patient location analytics',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// POST /api/analytics/patient-locations/export
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { format = 'csv', timeRange = '30days' } = body;

    // Simulate export generation
    const exportId = `export-${Date.now()}`;
    
    // In a real implementation, this would trigger a background job
    // to generate the export file and return a download URL
    
    const response = {
      success: true,
      data: {
        exportId,
        format,
        status: 'processing',
        estimatedTime: 30, // seconds
        message: 'Export generation started. You will receive a notification when ready.'
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error generating export:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to generate export',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}