import { NextRequest, NextResponse } from 'next/server';

// Mock patient journey data with comprehensive tracking
const mockJourneyData = {
  generateJourney: (patientId: string) => ({
    journeyId: `journey-${patientId}`,
    patientId,
    currentStage: ['awareness', 'consideration', 'active', 'loyal', 'at_risk', 'churned'][Math.floor(Math.random() * 4)],
    engagementScore: Math.floor(Math.random() * 40) + 60,
    
    // Journey metrics
    metrics: {
      totalInteractions: Math.floor(Math.random() * 50) + 10,
      lastInteraction: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
      avgResponseTime: Math.floor(Math.random() * 24) + 1,
      channelPreference: ['whatsapp', 'email', 'sms', 'phone'][Math.floor(Math.random() * 4)],
      contentEngagement: Math.floor(Math.random() * 30) + 70,
      appointmentAdherence: Math.floor(Math.random() * 20) + 80,
      medicationCompliance: Math.floor(Math.random() * 15) + 85,
    },
    
    // Touchpoints history
    touchpoints: [
      {
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        type: 'appointment',
        channel: 'whatsapp',
        action: 'Appointment reminder sent',
        response: 'Confirmed',
        engagementImpact: 5,
      },
      {
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        type: 'health_tip',
        channel: 'email',
        action: 'Diabetes management tips',
        response: 'Opened',
        engagementImpact: 3,
      },
      {
        date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        type: 'feedback',
        channel: 'sms',
        action: 'Post-consultation survey',
        response: 'Completed',
        engagementImpact: 10,
      },
    ],
    
    // Predictive insights
    predictions: {
      churnRisk: Math.random() * 0.3,
      nextVisitProbability: Math.random() * 0.4 + 0.6,
      lifetimeValue: Math.floor(Math.random() * 50000) + 100000,
      recommendedActions: [
        'Send personalized health tips',
        'Schedule preventive checkup',
        'Offer loyalty program enrollment',
      ],
    },
    
    // Segmentation
    segments: ['chronic_care', 'high_value', 'engaged', 'preventive_care'],
    
    // Health journey milestones
    milestones: [
      {
        type: 'first_visit',
        date: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
        completed: true,
      },
      {
        type: 'health_screening',
        date: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
        completed: true,
      },
      {
        type: 'vaccination_complete',
        date: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
        completed: false,
      },
    ],
    
    createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(),
  }),
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get('patientId');
    
    if (!patientId) {
      // Return multiple patient journeys for dashboard
      const journeys = Array.from({ length: 10 }, (_, i) => 
        mockJourneyData.generateJourney(`patient-${i + 1}`)
      );
      
      return NextResponse.json({
        data: journeys,
        stats: {
          totalPatients: journeys.length,
          avgEngagement: Math.round(journeys.reduce((acc, j) => acc + j.engagementScore, 0) / journeys.length),
          atRiskCount: journeys.filter(j => j.currentStage === 'at_risk').length,
          loyalCount: journeys.filter(j => j.currentStage === 'loyal').length,
        },
      });
    }
    
    // Return specific patient journey
    const journey = mockJourneyData.generateJourney(patientId);
    
    return NextResponse.json({
      data: journey,
    });
  } catch (error) {
    console.error('Error fetching patient journey:', error);
    return NextResponse.json(
      { error: 'Failed to fetch patient journey' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { patientId, touchpoint } = body;
    
    // Track new touchpoint
    const updatedJourney = {
      ...mockJourneyData.generateJourney(patientId),
      touchpoints: [
        {
          date: new Date(),
          type: touchpoint.type,
          channel: touchpoint.channel,
          action: touchpoint.action,
          response: touchpoint.response || 'Pending',
          engagementImpact: touchpoint.impact || 5,
        },
      ],
      engagementScore: Math.min(100, Math.floor(Math.random() * 10) + 75),
    };
    
    return NextResponse.json({
      data: updatedJourney,
      message: 'Touchpoint tracked successfully',
    });
  } catch (error) {
    console.error('Error tracking touchpoint:', error);
    return NextResponse.json(
      { error: 'Failed to track touchpoint' },
      { status: 500 }
    );
  }
}