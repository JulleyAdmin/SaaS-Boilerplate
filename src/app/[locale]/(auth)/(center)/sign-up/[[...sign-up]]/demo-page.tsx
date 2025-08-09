'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getI18nPath } from '@/utils/Helpers';

export default function DemoSignUpPage(props: { params: { locale: string } }) {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // Small delay to ensure proper hydration before redirect
    const timer = setTimeout(() => {
      const dashboardPath = getI18nPath('/dashboard/hospital-os', props.params.locale);
      router.replace(dashboardPath);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [router, props.params.locale]);

  // Always return the same loading state to avoid hydration issues
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-xl text-gray-600 mb-2">
          {isClient ? 'Loading Hospital Management Demo...' : 'Loading...'}
        </p>
        {isClient && <p className="text-gray-500">Redirecting to dashboard</p>}
      </div>
    </div>
  );
}