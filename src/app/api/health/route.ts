import { NextRequest, NextResponse } from 'next/server';

import { healthCheck } from '@/libs/DB';

export async function GET(request: NextRequest) {
  try {
    const dbHealth = await healthCheck();
    const uptime = process.uptime();
    const memoryUsage = process.memoryUsage();
    
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: `${Math.floor(uptime)}s`,
      database: dbHealth,
      memory: {
        used: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
        total: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,
        rss: `${Math.round(memoryUsage.rss / 1024 / 1024)}MB`,
      },
      demo: {
        mode: process.env.DEMO_MODE === 'true',
        version: '1.0.0',
        ready: true,
      }
    };

    return NextResponse.json(health, { status: 200 });
  } catch (error) {
    const errorResponse = {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
      demo: {
        mode: process.env.DEMO_MODE === 'true',
        version: '1.0.0',
        ready: false,
      }
    };

    return NextResponse.json(errorResponse, { status: 503 });
  }
}
