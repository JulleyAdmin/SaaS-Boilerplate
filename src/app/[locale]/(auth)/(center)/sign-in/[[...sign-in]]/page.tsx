'use client';

import { SignIn } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { getI18nPath } from '@/utils/Helpers';

const SignInPage = (props: { params: { locale: string } }) => {
  const router = useRouter();

  useEffect(() => {
    // In demo mode, redirect directly to dashboard
    const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true' || process.env.DEMO_MODE === 'true';
    
    if (isDemoMode) {
      router.replace(getI18nPath('/dashboard', props.params.locale));
      return;
    }
  }, [router, props.params.locale]);

  // In demo mode, show loading instead of Clerk component
  const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true' || process.env.DEMO_MODE === 'true';
  
  if (isDemoMode) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to demo...</p>
        </div>
      </div>
    );
  }

  return <SignIn path={getI18nPath('/sign-in', props.params.locale)} />;
};

export default SignInPage;
