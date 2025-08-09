'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { getI18nPath } from '@/utils/Helpers';

const SignInPage = (props: { params: { locale: string } }) => {
  const router = useRouter();

  useEffect(() => {
    // Redirect immediately when component mounts
    const dashboardPath = getI18nPath('/dashboard/hospital-os', props.params.locale);
    router.replace(dashboardPath);
  }, [router, props.params.locale]);

  // Static loading content
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-xl text-gray-600 mb-2">Loading...</p>
        <p className="text-gray-500">Please wait</p>
      </div>
    </div>
  );
};

export default SignInPage;