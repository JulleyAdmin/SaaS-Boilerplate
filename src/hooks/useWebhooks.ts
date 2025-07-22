import { useOrganization } from '@clerk/nextjs';
import useSWR from 'swr';

import type { WebhookEndpoint, WebhookDelivery, WebhookEventType } from '@/models/webhook';

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

export const useWebhooks = () => {
  const { organization } = useOrganization();
  const orgId = organization?.id;

  const { data, error, isLoading, mutate } = useSWR<ApiResponse<WebhookEndpoint[]>>(
    orgId ? `/api/organizations/${orgId}/webhooks` : null,
    fetcher
  );

  return {
    webhooks: data?.data || [],
    isLoading,
    error,
    mutate,
  };
};

export const useWebhookDeliveries = (webhookId: string | null) => {
  const { organization } = useOrganization();
  const orgId = organization?.id;

  const { data, error, isLoading, mutate } = useSWR<ApiResponse<WebhookDelivery[]>>(
    orgId && webhookId ? `/api/organizations/${orgId}/webhooks/${webhookId}/deliveries` : null,
    fetcher
  );

  return {
    deliveries: data?.data || [],
    isLoading,
    error,
    mutate,
  };
};

export const createWebhook = async (
  orgId: string,
  webhook: {
    name: string;
    description?: string;
    url: string;
    eventTypes: WebhookEventType[];
    headers?: Record<string, string>;
    timeout?: number;
    retryCount?: number;
  }
): Promise<WebhookEndpoint> => {
  const response = await fetch(`/api/organizations/${orgId}/webhooks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(webhook),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to create webhook');
  }

  const result = await response.json();
  return result.data;
};

export const updateWebhook = async (
  orgId: string,
  webhookId: string,
  updates: {
    name?: string;
    description?: string;
    url?: string;
    status?: 'active' | 'inactive' | 'failed' | 'paused';
    eventTypes?: WebhookEventType[];
    headers?: Record<string, string>;
    timeout?: number;
    retryCount?: number;
  }
): Promise<WebhookEndpoint> => {
  const response = await fetch(`/api/organizations/${orgId}/webhooks/${webhookId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to update webhook');
  }

  const result = await response.json();
  return result.data;
};

export const deleteWebhook = async (
  orgId: string,
  webhookId: string
): Promise<void> => {
  const response = await fetch(`/api/organizations/${orgId}/webhooks/${webhookId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to delete webhook');
  }
};

export const testWebhook = async (
  orgId: string,
  webhookId: string
): Promise<{ message: string; testEvent: { id: string; timestamp: string } }> => {
  const response = await fetch(`/api/organizations/${orgId}/webhooks/${webhookId}/test`, {
    method: 'POST',
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to test webhook');
  }

  return response.json();
};