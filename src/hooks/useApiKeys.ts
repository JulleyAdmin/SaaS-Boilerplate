import { useOrganization } from '@clerk/nextjs';
import useSWR from 'swr';

import type { ApiKeyWithoutSensitive } from '@/models/apiKey';

type ApiResponse<T> = {
  data: T;
  error?: never;
} | {
  data?: never;
  error: Error;
};

const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch');
  }
  return response.json();
};

export const useApiKeys = () => {
  const { organization } = useOrganization();
  const orgId = organization?.id;

  const { data, error, isLoading, mutate } = useSWR<ApiResponse<ApiKeyWithoutSensitive[]>>(
    orgId ? `/api/organizations/${orgId}/api-keys` : null,
    fetcher,
  );

  return {
    apiKeys: data?.data || [],
    isLoading,
    error,
    mutate,
  };
};

export const createApiKey = async (
  orgId: string,
  name: string,
  expiresAt?: string,
): Promise<{ apiKey: ApiKeyWithoutSensitive; plainKey: string }> => {
  const response = await fetch(`/api/organizations/${orgId}/api-keys`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name,
      expiresAt,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to create API key');
  }

  const result = await response.json();
  return result.data;
};

export const deleteApiKey = async (orgId: string, apiKeyId: string): Promise<void> => {
  const response = await fetch(`/api/organizations/${orgId}/api-keys/${apiKeyId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to delete API key');
  }
};