import { NextRequest, NextResponse } from 'next/server';

// Mock patient segments with Indian healthcare context
const mockSegments = [
  {
    segmentId: 'seg-001',
    segmentName: 'Chronic Care Patients',
    segmentType: 'dynamic',
    description: 'Patients with chronic conditions requiring regular monitoring',
    
    criteria: {
      conditions: [
        { field: 'chronicConditions', operator: 'exists', value: true },
        { field: 'visitFrequency', operator: '>=', value: '4/year' },
      ],
    },
    
    patientCount: 2456,
    avgEngagement: 78,
    
    demographics: {
      avgAge: 52,
      genderSplit: { male: 55, female: 45 },
      topConditions: ['Diabetes', 'Hypertension', 'Heart Disease'],
      governmentSchemes: ['PM-JAY', 'CGHS', 'ESI'],
    },
    
    behavior: {
      avgVisitsPerYear: 8.5,
      medicationAdherence: 82,
      appointmentCompliance: 88,
      preferredChannels: ['WhatsApp', 'Phone'],
    },
    
    recommendations: [
      'Regular health monitoring programs',
      'Medicine adherence reminders',
      'Diet and lifestyle counseling',
      'Quarterly health checkups',
    ],
  },
  {
    segmentId: 'seg-002',
    segmentName: 'Senior Citizens (60+)',
    segmentType: 'static',
    description: 'Elderly patients requiring specialized care',
    
    criteria: {
      conditions: [
        { field: 'age', operator: '>=', value: 60 },
      ],
    },
    
    patientCount: 1823,
    avgEngagement: 65,
    
    demographics: {
      avgAge: 68,
      genderSplit: { male: 48, female: 52 },
      topConditions: ['Arthritis', 'Diabetes', 'Cataract'],
      governmentSchemes: ['Ayushman Bharat', 'State schemes'],
    },
    
    behavior: {
      avgVisitsPerYear: 6.2,
      medicationAdherence: 75,
      appointmentCompliance: 70,
      preferredChannels: ['Phone', 'Family WhatsApp'],
    },
    
    recommendations: [
      'Home visit services',
      'Family member notifications',
      'Large print communications',
      'Voice call reminders',
    ],
  },
  {
    segmentId: 'seg-003',
    segmentName: 'Maternity & Child Care',
    segmentType: 'dynamic',
    description: 'Pregnant women and children under 5',
    
    criteria: {
      conditions: [
        { field: 'category', operator: 'in', value: ['maternity', 'pediatric'] },
        { field: 'age', operator: '<', value: 5, condition: 'OR' },
      ],
    },
    
    patientCount: 934,
    avgEngagement: 92,
    
    demographics: {
      avgAge: 28,
      genderSplit: { male: 15, female: 85 },
      topServices: ['Prenatal care', 'Vaccination', 'Growth monitoring'],
      governmentSchemes: ['JSY', 'PMMVY', 'Mission Indradhanush'],
    },
    
    behavior: {
      avgVisitsPerYear: 12,
      appointmentCompliance: 95,
      vaccinationCompliance: 98,
      preferredChannels: ['WhatsApp', 'SMS'],
    },
    
    recommendations: [
      'Vaccination schedule reminders',
      'Nutrition counseling',
      'Growth milestone tracking',
      'Emergency contact protocols',
    ],
  },
  {
    segmentId: 'seg-004',
    segmentName: 'Corporate Employees',
    segmentType: 'static',
    description: 'Working professionals with corporate insurance',
    
    criteria: {
      conditions: [
        { field: 'insuranceType', operator: 'equals', value: 'corporate' },
        { field: 'age', operator: 'between', value: [25, 55] },
      ],
    },
    
    patientCount: 3201,
    avgEngagement: 72,
    
    demographics: {
      avgAge: 35,
      genderSplit: { male: 62, female: 38 },
      topConcerns: ['Stress', 'Back pain', 'Eye strain', 'Lifestyle diseases'],
      insuranceCoverage: '100% corporate coverage',
    },
    
    behavior: {
      avgVisitsPerYear: 3.5,
      preferredTimings: 'Evenings and weekends',
      healthCheckupCompliance: 85,
      preferredChannels: ['Email', 'App', 'WhatsApp'],
    },
    
    recommendations: [
      'Executive health checkups',
      'Stress management programs',
      'Telemedicine options',
      'Weekend health camps',
    ],
  },
  {
    segmentId: 'seg-005',
    segmentName: 'At-Risk Patients',
    segmentType: 'dynamic',
    description: 'Patients showing signs of disengagement',
    
    criteria: {
      conditions: [
        { field: 'lastVisit', operator: '>', value: '180 days' },
        { field: 'engagementScore', operator: '<', value: 40 },
        { field: 'missedAppointments', operator: '>=', value: 2 },
      ],
    },
    
    patientCount: 567,
    avgEngagement: 25,
    
    behavior: {
      avgDaysSinceLastVisit: 245,
      responseRate: 15,
      reasonsForDisengagement: ['Cost concerns', 'Distance', 'Time constraints'],
    },
    
    recommendations: [
      'Win-back campaigns',
      'Special discounts',
      'Teleconsultation offers',
      'Personalized health reminders',
    ],
  },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const segmentType = searchParams.get('type');
    const minSize = searchParams.get('minSize');
    
    let filteredSegments = [...mockSegments];
    
    if (segmentType) {
      filteredSegments = filteredSegments.filter(s => s.segmentType === segmentType);
    }
    
    if (minSize) {
      filteredSegments = filteredSegments.filter(s => s.patientCount >= parseInt(minSize));
    }
    
    // Calculate segment insights
    const insights = {
      totalSegments: filteredSegments.length,
      totalPatients: filteredSegments.reduce((acc, s) => acc + s.patientCount, 0),
      avgEngagementScore: Math.round(
        filteredSegments.reduce((acc, s) => acc + s.avgEngagement, 0) / filteredSegments.length
      ),
      highEngagementSegments: filteredSegments.filter(s => s.avgEngagement > 70).length,
      atRiskPatients: filteredSegments.find(s => s.segmentId === 'seg-005')?.patientCount || 0,
    };
    
    return NextResponse.json({
      data: filteredSegments,
      insights,
    });
  } catch (error) {
    console.error('Error fetching segments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch segments' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const newSegment = {
      segmentId: `seg-${Date.now()}`,
      ...body,
      patientCount: 0,
      avgEngagement: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    return NextResponse.json({
      data: newSegment,
      message: 'Segment created successfully',
    });
  } catch (error) {
    console.error('Error creating segment:', error);
    return NextResponse.json(
      { error: 'Failed to create segment' },
      { status: 500 }
    );
  }
}