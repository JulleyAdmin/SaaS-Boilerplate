import { Suspense } from 'react';

import { ApiKeysContainer } from '@/components/api-keys/ApiKeysContainer';

export default function ApiKeysPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">API Key Management</h1>
          <p className="text-gray-600 mt-2">
            Create and manage API keys for programmatic access to your organization's resources.
          </p>
        </div>
        
        <Suspense fallback={
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        }>
          <ApiKeysContainer />
        </Suspense>
      </div>
    </div>
  );
}