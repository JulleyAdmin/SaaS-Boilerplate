// Demo Provider Wrapper for Next.js App
'use client';

import { useEffect } from 'react';
import { DemoAuthProvider, DemoBanner } from '@/lib/demo/authProvider';
import { demoApiInterceptor } from '@/lib/demo/apiInterceptor';

interface DemoProviderProps {
  children: React.ReactNode;
}

export function DemoProvider({ children }: DemoProviderProps) {
  const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

  useEffect(() => {
    if (isDemoMode) {
      // Initialize demo API interceptor
      demoApiInterceptor.init();
      
      // Add demo mode class to body
      document.body.classList.add('demo-mode');
      
      // Log demo mode activation
      console.log('🎭 Hospital Management System - Demo Mode Activated');
      console.log('📊 Mock data and API interception enabled');
      console.log('🔐 Authentication bypassed for demonstration');
    }
  }, [isDemoMode]);

  if (!isDemoMode) {
    return <>{children}</>;
  }

  return (
    <DemoAuthProvider>
      <DemoBanner />
      {children}
    </DemoAuthProvider>
  );
}

// Export a hook to check demo mode
export function useDemoMode() {
  return process.env.NEXT_PUBLIC_DEMO_MODE === 'true';
}