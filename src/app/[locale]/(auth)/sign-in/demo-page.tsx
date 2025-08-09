// Demo Sign-In Page
'use client';

import { DemoSignIn } from '../../../../lib/demo/authProvider';
import { useDemoMode } from '../../../../lib/demo/utils';
import Image from 'next/image';
import Link from 'next/link';

export default function DemoSignInPage() {
  const isDemoMode = useDemoMode();

  if (!isDemoMode) {
    // In production, this would render the actual Clerk sign-in
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600">Demo mode is not enabled.</p>
          <p className="text-sm text-gray-500 mt-2">Set NEXT_PUBLIC_DEMO_MODE=true to enable demo mode.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Demo Header */}
      <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span className="text-sm font-medium">🎭 Demo Mode - Hospital Management System</span>
          <Link 
            href="https://github.com/your-repo/hospitalos" 
            target="_blank"
            className="text-xs hover:underline"
          >
            View Source Code →
          </Link>
        </div>
      </div>

      <div className="flex min-h-screen">
        {/* Left Panel - Features */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-purple-700 p-12 text-white">
          <div className="max-w-lg mx-auto my-auto">
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-4">
                Hospital Management System
              </h1>
              <p className="text-lg opacity-90">
                Experience a comprehensive healthcare management solution with our demo
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <span className="text-sm">👥</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Patient Management</h3>
                  <p className="text-sm opacity-80">
                    50+ sample patients with complete medical history, appointments, and records
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <span className="text-sm">👨‍⚕️</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Doctor & Staff Portal</h3>
                  <p className="text-sm opacity-80">
                    20+ doctors across specializations with scheduling and patient management
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <span className="text-sm">🏥</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Department Management</h3>
                  <p className="text-sm opacity-80">
                    Emergency, ICU, Surgery, Pediatrics, and more departments
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <span className="text-sm">💊</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Pharmacy & Lab</h3>
                  <p className="text-sm opacity-80">
                    Prescription management, lab tests, and results tracking
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <span className="text-sm">💰</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Billing & Insurance</h3>
                  <p className="text-sm opacity-80">
                    Complete billing system with insurance claim management
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <span className="text-sm">📊</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Analytics Dashboard</h3>
                  <p className="text-sm opacity-80">
                    Real-time statistics, occupancy rates, and performance metrics
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-white/20">
              <p className="text-sm opacity-70">
                This is a demonstration environment with simulated data. 
                No real patient information is used or stored.
              </p>
            </div>
          </div>
        </div>

        {/* Right Panel - Sign In */}
        <div className="flex-1 flex items-center justify-center p-8 pt-20">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4">
                <span className="text-2xl">🏥</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Welcome to HMS Demo</h2>
              <p className="mt-2 text-gray-600">
                Explore all features with pre-populated sample data
              </p>
            </div>

            <DemoSignIn />

            <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-start space-x-2">
                <span className="text-amber-600 mt-0.5">ℹ️</span>
                <div className="text-sm text-amber-800">
                  <p className="font-semibold mb-1">Demo Information:</p>
                  <ul className="list-disc list-inside space-y-0.5 text-xs">
                    <li>All data is randomly generated for demonstration</li>
                    <li>Changes are not persisted between sessions</li>
                    <li>API calls are intercepted and return mock data</li>
                    <li>Perfect for exploring the UI and features</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}