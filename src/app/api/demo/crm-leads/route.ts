import { NextRequest, NextResponse } from 'next/server';
import { mockLeads } from '@/data/mock-crm';

// GET /api/demo/crm-leads - Get demo CRM leads (no auth required)
export async function GET(request: NextRequest) {
  try {
    console.log('Demo CRM leads endpoint called');
    return NextResponse.json({ 
      data: mockLeads,
      message: 'Demo CRM leads data' 
    });
  } catch (error) {
    console.error('Error in demo CRM leads:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error },
      { status: 500 }
    );
  }
}