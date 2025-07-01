'use client';

import { useOrganization } from '@clerk/nextjs';
import useSWR from 'swr';

import type { SSOConnection } from '@/lib/sso/types';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function useSSOConnections() {
  const { organization } = useOrganization();

  const { data, error, mutate } = useSWR(
    organization ? `/api/organizations/${organization.id}/sso/connections` : null,
    fetcher,
  );

  return {
    connections: (data?.connections || []) as SSOConnection[],
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}

export function useSSOConnection(connectionId: string) {
  const { organization } = useOrganization();

  const { data, error, mutate } = useSWR(
    organization && connectionId
      ? `/api/organizations/${organization.id}/sso/connections/${connectionId}`
      : null,
    fetcher,
  );

  return {
    connection: data?.connection as SSOConnection | undefined,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}

export async function createSSOConnection(
  organizationId: string,
  connectionData: {
    name: string;
    description?: string;
    metadataUrl?: string;
    metadata?: string;
    redirectUrl: string;
  },
) {
  const response = await fetch(`/api/organizations/${organizationId}/sso/connections`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(connectionData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create SSO connection');
  }

  return response.json();
}

export async function updateSSOConnection(
  organizationId: string,
  connectionId: string,
  updates: {
    name?: string;
    description?: string;
    metadataUrl?: string;
    metadata?: string;
    redirectUrl?: string;
  },
) {
  const response = await fetch(
    `/api/organizations/${organizationId}/sso/connections/${connectionId}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    },
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update SSO connection');
  }

  return response.json();
}

export async function deleteSSOConnection(
  organizationId: string,
  connectionId: string,
) {
  const response = await fetch(
    `/api/organizations/${organizationId}/sso/connections/${connectionId}`,
    {
      method: 'DELETE',
    },
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete SSO connection');
  }

  return response.json();
}
