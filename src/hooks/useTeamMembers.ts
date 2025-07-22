import { useOrganization } from '@clerk/nextjs';
import useSWR from 'swr';

import type { TeamMemberWithUser } from '@/models/team';

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

export const useTeamMembers = () => {
  const { organization } = useOrganization();
  const orgId = organization?.id;

  const { data, error, isLoading, mutate } = useSWR<ApiResponse<TeamMemberWithUser[]>>(
    orgId ? `/api/organizations/${orgId}/members` : null,
    fetcher
  );

  return {
    members: data?.data || [],
    isLoading,
    error,
    mutate,
  };
};

export const updateMemberRole = async (
  orgId: string,
  memberId: string,
  role: 'ADMIN' | 'MEMBER'
): Promise<void> => {
  const response = await fetch(`/api/organizations/${orgId}/members/${memberId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ role }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to update member role');
  }
};

export const removeMember = async (
  orgId: string,
  memberId: string
): Promise<void> => {
  const response = await fetch(`/api/organizations/${orgId}/members/${memberId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to remove member');
  }
};