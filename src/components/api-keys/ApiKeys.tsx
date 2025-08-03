'use client';

import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { deleteApiKey as deleteApiKeyFn, useApiKeys } from '@/hooks/useApiKeys';
import type { ApiKeyWithoutSensitive } from '@/models/apiKey';

import { NewApiKey } from './NewApiKey';

type ApiKeysProps = {
  organizationId: string;
};

export const ApiKeys = ({ organizationId }: ApiKeysProps) => {
  const { apiKeys, isLoading, error, mutate } = useApiKeys();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (apiKey: ApiKeyWithoutSensitive) => {
    if (!confirm(`Are you sure you want to delete the API key "${apiKey.name}"?`)) {
      return;
    }

    setDeletingId(apiKey.id);
    try {
      await deleteApiKeyFn(organizationId, apiKey.id);
      await mutate();
      toast.success('API key deleted successfully');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete API key');
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">API Keys</h2>
          <Button disabled>
            Create API Key
          </Button>
        </div>
        <div className="flex items-center justify-center py-8">
          <div className="size-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">API Keys</h2>
          <Button onClick={() => setShowCreateModal(true)}>
            Create API Key
          </Button>
        </div>
        <div className="rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-700">
            Failed to load API keys. Please try again.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">API Keys</h2>
          <p className="text-sm text-gray-600">
            Manage API keys for programmatic access to your organization.
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          Create API Key
        </Button>
      </div>

      {apiKeys.length === 0
        ? (
            <div className="py-8 text-center">
              <div className="mx-auto size-12 text-gray-400">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                  />
                </svg>
              </div>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No API keys</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating your first API key.
              </p>
              <div className="mt-6">
                <Button onClick={() => setShowCreateModal(true)}>
                  Create API Key
                </Button>
              </div>
            </div>
          )
        : (
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Last Used</TableHead>
                    <TableHead>Expires</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {apiKeys.map(apiKey => (
                    <TableRow key={apiKey.id}>
                      <TableCell className="font-medium">{apiKey.name}</TableCell>
                      <TableCell>{formatDate(apiKey.createdAt)}</TableCell>
                      <TableCell>
                        {apiKey.lastUsedAt ? formatDate(apiKey.lastUsedAt) : 'Never'}
                      </TableCell>
                      <TableCell>
                        {apiKey.expiresAt ? formatDate(apiKey.expiresAt) : 'Never'}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(apiKey)}
                          disabled={deletingId === apiKey.id}
                        >
                          {deletingId === apiKey.id ? 'Deleting...' : 'Delete'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

      <NewApiKey
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        organizationId={organizationId}
        onSuccess={() => {
          mutate();
          setShowCreateModal(false);
        }}
      />
    </div>
  );
};
