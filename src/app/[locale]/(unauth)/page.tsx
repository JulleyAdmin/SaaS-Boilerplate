import { redirect } from 'next/navigation';

export default function SimpleLandingPage() {
  // In demo mode, redirect directly to hospital-os dashboard
  const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true' || process.env.DEMO_MODE === 'true';
  
  if (isDemoMode) {
    redirect('/dashboard/hospital-os');
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
