import { NextRequest, NextResponse } from 'next/server';
import { mockHealthGoals } from '@/data/mock-engagement';

// GET /api/demo/health-goals - Get demo health goals (no auth required)
export async function GET(request: NextRequest) {
  try {
    console.log('Demo health goals endpoint called');
    return NextResponse.json({ 
      data: mockHealthGoals,
      message: 'Demo health goals data' 
    });
  } catch (error) {
    console.error('Error in demo health goals:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error },
      { status: 500 }
    );
  }
}