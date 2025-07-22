import { useOrganization } from '@clerk/nextjs';
import useSWR from 'swr';

import type { Invitation } from '@/models/invitation';

type ApiResponse<T> = {
  data: T;
  error?: never;
} | {
  data?: never;
  error: Error;
};

interface InvitationWithUrl extends Invitation {
  invitationUrl?: string;
}

const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch');
  }
  return response.json();
};

export const useInvitations = () => {
  const { organization } = useOrganization();
  const orgId = organization?.id;

  const { data, error, isLoading, mutate } = useSWR<ApiResponse<Invitation[]>>(
    orgId ? `/api/organizations/${orgId}/invitations` : null,
    fetcher
  );

  return {
    invitations: data?.data || [],
    isLoading,
    error,
    mutate,
  };
};

export const createInvitation = async (
  orgId: string,
  data: {
    email?: string;
    role: 'ADMIN' | 'MEMBER';
    allowedDomains?: string[];
  }
): Promise<InvitationWithUrl> => {
  const response = await fetch(`/api/organizations/${orgId}/invitations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to create invitation');
  }

  const result = await response.json();
  return result.data;
};

export const deleteInvitation = async (
  orgId: string,
  invitationId: string
): Promise<void> => {
  const response = await fetch(`/api/organizations/${orgId}/invitations/${invitationId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to delete invitation');
  }
};