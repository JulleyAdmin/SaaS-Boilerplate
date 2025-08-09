'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function SimpleLandingPage() {
  const router = useRouter();

  useEffect(() => {
    // In demo mode, redirect directly to hospital-os dashboard
    const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true' || process.env.DEMO_MODE === 'true';
    
    if (isDemoMode) {
      router.replace('/dashboard/hospital-os');
      return;
    }
  }, [router]);

  // In demo mode, show loading instead of landing page
  const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true' || process.env.DEMO_MODE === 'true';
  
  if (isDemoMode) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600 mb-2">Loading Hospital Management Demo...</p>
          <p className="text-gray-500">Redirecting to dashboard</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="text-center">
        <h1 className="mb-4 text-5xl font-bold text-gray-900">HospitalOS</h1>
        <p className="mb-8 text-xl text-gray-600">Modern Hospital Management System</p>
        <div className="space-x-4">
          <a href="/sign-in" className="inline-block rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700">
            Sign In
          </a>
          <a href="/sign-up" className="inline-block rounded-lg bg-gray-200 px-6 py-3 text-gray-800 hover:bg-gray-300">
            Get Started
          </a>
        </div>
      </div>
    </div>
  );
}
