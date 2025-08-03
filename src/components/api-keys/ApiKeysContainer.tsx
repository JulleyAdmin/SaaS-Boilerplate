'use client';

import { useOrganization } from '@clerk/nextjs';

import { ApiKeys } from './ApiKeys';

export const ApiKeysContainer = () => {
  const { organization, isLoaded } = useOrganization();

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="size-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="rounded-md bg-yellow-50 p-4">
        <div className="text-sm text-yellow-700">
          Please select an organization to manage API keys.
        </div>
      </div>
    );
  }

  return <ApiKeys organizationId={organization.id} />;
};
