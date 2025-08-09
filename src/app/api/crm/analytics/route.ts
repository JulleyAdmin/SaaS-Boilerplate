import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { mockCRMAnalytics } from '@/data/mock-crm';
import { realisticHospitalLeads, leadStatistics } from '@/data/mock-hospital-leads';

// GET /api/crm/analytics - Get CRM analytics
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

    // Calculate real-time analytics from realistic hospital leads
    const analytics = {
      overview: {
        totalLeads: realisticHospitalLeads.length,
        todayLeads: realisticHospitalLeads.filter(l => {
          const today = new Date();
          const leadDate = new Date(l.createdAt);
          return leadDate.toDateString() === today.toDateString();
        }).length,
        weeklyLeads: leadStatistics.weekly.total,
        monthlyLeads: leadStatistics.monthly.total,
        conversionRate: leadStatistics.weekly.conversionRate,
        averageLeadScore: leadStatistics.weekly.avgLeadScore,
        averageRevenue: leadStatistics.monthly.averageRevenue,
      },
      leadsByStatus: {
        inquiry: realisticHospitalLeads.filter(l => l.status === 'inquiry').length,
        contacted: realisticHospitalLeads.filter(l => l.status === 'contacted').length,
        appointment_scheduled: realisticHospitalLeads.filter(l => l.status === 'appointment_scheduled').length,
        consultation_done: realisticHospitalLeads.filter(l => l.status === 'consultation_done').length,
        admitted: realisticHospitalLeads.filter(l => l.status === 'admitted').length,
        lost: realisticHospitalLeads.filter(l => l.status === 'lost').length,
      },
      leadsBySource: leadStatistics.monthly.bySource,
      topServices: leadStatistics.monthly.topServices,
      funnel: leadStatistics.funnel,
      dailyStats: leadStatistics.daily,
      // Include original mock data for campaigns and other features
      ...mockCRMAnalytics,
    };
    
    return NextResponse.json({ data: analytics });

  } catch (error) {
    console.error('Error fetching CRM analytics:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}