import { NextRequest, NextResponse } from 'next/server';

// Mock campaign data
const mockCampaigns = [
  {
    campaignId: 'camp-001',
    campaignName: 'Diabetes Awareness Month',
    campaignType: 'health_education',
    status: 'active',
    targetSegments: ['chronic_care', 'diabetes_patients'],
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 23 * 24 * 60 * 60 * 1000),
    
    channels: ['whatsapp', 'email', 'sms'],
    
    content: {
      subject: 'Managing Diabetes: Tips for Better Health',
      preview: 'Learn how to control your blood sugar effectively',
      body: 'Regular monitoring and lifestyle changes can make a big difference...',
      cta: 'Book Free Consultation',
      ctaLink: '/appointments/book',
    },
    
    automation: {
      trigger: 'scheduled',
      frequency: 'weekly',
      sendTime: '09:00',
      personalization: true,
    },
    
    metrics: {
      sent: 1250,
      delivered: 1200,
      opened: 840,
      clicked: 320,
      converted: 48,
      roi: 2.5,
    },
    
    segmentCriteria: {
      conditions: [
        { field: 'diagnosis', operator: 'contains', value: 'diabetes' },
        { field: 'lastVisit', operator: 'within', value: '90 days' },
      ],
    },
  },
  {
    campaignId: 'camp-002',
    campaignName: 'Vaccination Reminder - Flu Season',
    campaignType: 'preventive_care',
    status: 'scheduled',
    targetSegments: ['senior_citizens', 'chronic_patients'],
    startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 37 * 24 * 60 * 60 * 1000),
    
    channels: ['whatsapp', 'voice_call'],
    
    content: {
      subject: 'Flu Season Alert: Get Your Vaccine',
      preview: 'Protect yourself this flu season',
      body: 'Annual flu vaccination is now available. Book your slot today!',
      cta: 'Schedule Vaccination',
      ctaLink: '/vaccines/schedule',
    },
    
    automation: {
      trigger: 'event_based',
      event: 'flu_season_start',
      personalization: true,
    },
    
    metrics: {
      sent: 0,
      delivered: 0,
      opened: 0,
      clicked: 0,
      converted: 0,
      roi: 0,
    },
  },
  {
    campaignId: 'camp-003',
    campaignName: 'Post-Surgery Follow-up',
    campaignType: 'patient_care',
    status: 'active',
    targetSegments: ['post_surgical'],
    
    channels: ['whatsapp', 'phone'],
    
    automation: {
      trigger: 'event_based',
      event: 'surgery_completed',
      delays: [1, 3, 7, 14, 30], // days after surgery
      personalization: true,
    },
    
    metrics: {
      sent: 450,
      delivered: 445,
      opened: 420,
      clicked: 380,
      converted: 375,
      roi: 4.2,
    },
  },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    
    let filteredCampaigns = [...mockCampaigns];
    
    if (status) {
      filteredCampaigns = filteredCampaigns.filter(c => c.status === status);
    }
    
    if (type) {
      filteredCampaigns = filteredCampaigns.filter(c => c.campaignType === type);
    }
    
    // Calculate overall metrics
    const overallMetrics = {
      totalCampaigns: filteredCampaigns.length,
      activeCampaigns: filteredCampaigns.filter(c => c.status === 'active').length,
      totalSent: filteredCampaigns.reduce((acc, c) => acc + c.metrics.sent, 0),
      avgOpenRate: filteredCampaigns.reduce((acc, c) => 
        acc + (c.metrics.sent > 0 ? (c.metrics.opened / c.metrics.sent) * 100 : 0), 0) / filteredCampaigns.length,
      avgClickRate: filteredCampaigns.reduce((acc, c) => 
        acc + (c.metrics.sent > 0 ? (c.metrics.clicked / c.metrics.sent) * 100 : 0), 0) / filteredCampaigns.length,
      totalConverted: filteredCampaigns.reduce((acc, c) => acc + c.metrics.converted, 0),
    };
    
    return NextResponse.json({
      data: filteredCampaigns,
      metrics: overallMetrics,
    });
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    return NextResponse.json(
      { error: 'Failed to fetch campaigns' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const newCampaign = {
      campaignId: `camp-${Date.now()}`,
      ...body,
      status: 'draft',
      metrics: {
        sent: 0,
        delivered: 0,
        opened: 0,
        clicked: 0,
        converted: 0,
        roi: 0,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    return NextResponse.json({
      data: newCampaign,
      message: 'Campaign created successfully',
    });
  } catch (error) {
    console.error('Error creating campaign:', error);
    return NextResponse.json(
      { error: 'Failed to create campaign' },
      { status: 500 }
    );
  }
}