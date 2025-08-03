'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';

import type { ApiKeyWithoutSensitive } from '@/models/apiKey';

// Mock data for demonstration
export const mockApiKeys: ApiKeyWithoutSensitive[] = [
  {
    id: 'key_1',
    name: 'Production API - Main Service',
    organizationId: 'org_demo',
    createdAt: new Date('2025-06-15T10:30:00'),
    updatedAt: new Date('2025-07-01T14:20:00'),
    expiresAt: new Date('2025-12-31T23:59:59'),
    lastUsedAt: new Date('2025-07-01T12:00:00'),
  },
  {
    id: 'key_2',
    name: 'Development API - Testing',
    organizationId: 'org_demo',
    createdAt: new Date('2025-06-20T09:15:00'),
    updatedAt: new Date('2025-06-30T16:45:00'),
    expiresAt: null,
    lastUsedAt: new Date('2025-06-30T16:45:00'),
  },
  {
    id: 'key_3',
    name: 'Mobile App Integration',
    organizationId: 'org_demo',
    createdAt: new Date('2025-05-10T14:00:00'),
    updatedAt: new Date('2025-06-25T11:30:00'),
    expiresAt: new Date('2025-09-30T23:59:59'),
    lastUsedAt: new Date('2025-06-25T11:30:00'),
  },
  {
    id: 'key_4',
    name: 'CI/CD Pipeline',
    organizationId: 'org_demo',
    createdAt: new Date('2025-06-01T08:00:00'),
    updatedAt: new Date('2025-06-01T08:00:00'),
    expiresAt: null,
    lastUsedAt: null,
  },
  {
    id: 'key_5',
    name: 'Analytics Service',
    organizationId: 'org_demo',
    createdAt: new Date('2025-06-05T13:20:00'),
    updatedAt: new Date('2025-07-01T10:15:00'),
    expiresAt: new Date('2025-08-31T23:59:59'),
    lastUsedAt: new Date('2025-07-01T10:15:00'),
  },
];

// Hook to inject mock data for demo purposes
export const useMockApiKeys = (enabled: boolean = false) => {
  useEffect(() => {
    if (enabled) {
      // Store in sessionStorage for demo persistence
      const existingData = sessionStorage.getItem('demo_api_keys');
      if (!existingData) {
        sessionStorage.setItem('demo_api_keys', JSON.stringify(mockApiKeys));
        toast.info('Demo API keys loaded for testing');
      }
    }
  }, [enabled]);

  const getMockKeys = (): ApiKeyWithoutSensitive[] => {
    if (!enabled) {
      return [];
    }
    const stored = sessionStorage.getItem('demo_api_keys');
    return stored ? JSON.parse(stored) : mockApiKeys;
  };

  const addMockKey = (key: ApiKeyWithoutSensitive) => {
    const current = getMockKeys();
    const updated = [...current, key];
    sessionStorage.setItem('demo_api_keys', JSON.stringify(updated));
  };

  const removeMockKey = (id: string) => {
    const current = getMockKeys();
    const updated = current.filter(k => k.id !== id);
    sessionStorage.setItem('demo_api_keys', JSON.stringify(updated));
  };

  return {
    mockKeys: getMockKeys(),
    addMockKey,
    removeMockKey,
  };
};
