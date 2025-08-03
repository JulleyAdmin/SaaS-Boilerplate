import { Suspense } from 'react';

import { MFASettings } from '@/components/security/MFASettings';

export default function MFAPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Multi-Factor Authentication</h1>
          <p className="mt-2 text-gray-600">
            Add an extra layer of security to your account by enabling two-factor authentication.
          </p>
        </div>

        <Suspense fallback={(
          <div className="flex items-center justify-center py-8">
            <div className="size-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
          </div>
        )}
        >
          <MFASettings />
        </Suspense>
      </div>
    </div>
  );
}
