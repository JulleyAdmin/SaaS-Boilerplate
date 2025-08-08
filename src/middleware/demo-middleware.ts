import { NextRequest, NextResponse } from 'next/server';
import { initializeDemoData, checkDemoData } from '@/libs/init-demo-data';

let demoInitialized = false;
let initializationPromise: Promise<boolean> | null = null;

export async function ensureDemoData() {
  // Only run in demo mode
  if (process.env.DEMO_MODE !== 'true') {
    return true;
  }

  // If already initialized, skip
  if (demoInitialized) {
    return true;
  }

  // If initialization is in progress, wait for it
  if (initializationPromise) {
    return await initializationPromise;
  }

  // Start initialization
  initializationPromise = (async () => {
    try {
      console.log('[DEMO-MIDDLEWARE] Checking demo data...');
      const status = await checkDemoData();
      
      if (!status.isComplete) {
        console.log('[DEMO-MIDDLEWARE] Demo data incomplete, initializing...');
        const result = await initializeDemoData();
        demoInitialized = result;
        return result;
      } else {
        console.log('[DEMO-MIDDLEWARE] Demo data already complete');
        demoInitialized = true;
        return true;
      }
    } catch (error) {
      console.error('[DEMO-MIDDLEWARE] Error ensuring demo data:', error);
      return false;
    }
  })();

  return await initializationPromise;
}

export async function demoMiddleware(request: NextRequest) {
  // Only apply to API routes in demo mode
  if (process.env.DEMO_MODE !== 'true' || !request.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Ensure demo data is initialized
  await ensureDemoData();

  return NextResponse.next();
}