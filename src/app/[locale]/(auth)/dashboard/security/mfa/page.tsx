import { Suspense } from 'react';

import { MFASettings } from '@/components/security/MFASettings';

export default function MFAPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Multi-Factor Authentication</h1>
          <p className="text-gray-600 mt-2">
            Add an extra layer of security to your account by enabling two-factor authentication.
          </p>
        </div>
        
        <Suspense fallback={
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        }>
          <MFASettings />
        </Suspense>
      </div>
    </div>
  );
}