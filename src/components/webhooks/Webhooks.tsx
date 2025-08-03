'use client';

import { useOrganization } from '@clerk/nextjs';
import { useState } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { deleteWebhook, testWebhook, updateWebhook, useWebhooks } from '@/hooks/useWebhooks';
import type { WebhookEndpoint } from '@/types/webhook';

import { CreateWebhook } from './CreateWebhook';
import { EditWebhook } from './EditWebhook';
import { WebhookDeliveries } from './WebhookDeliveries';

export const Webhooks = () => {
  const { organization } = useOrganization();
  // const { user } = useUser();
  const { webhooks, isLoading, mutate } = useWebhooks();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingWebhook, setEditingWebhook] = useState<WebhookEndpoint | null>(null);
  const [selectedWebhook, setSelectedWebhook] = useState<WebhookEndpoint | null>(null);
  const [actioningId, setActioningId] = useState<string | null>(null);

  if (!organization) {
    return null;
  }

  const handleDelete = async (webhook: WebhookEndpoint) => {
    if (!confirm(`Are you sure you want to delete webhook "${webhook.name}"?`)) {
      return;
    }

    setActioningId(webhook.id);
    try {
      await deleteWebhook(organization.id, webhook.id);
      await mutate();
      toast.success('Webhook deleted successfully');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete webhook');
    } finally {
      setActioningId(null);
    }
  };

  const handleTest = async (webhook: WebhookEndpoint) => {
    setActioningId(webhook.id);
    try {
      const result = await testWebhook(organization.id, webhook.id);
      await mutate();
      toast.success(`Test webhook sent successfully (ID: ${result.testEvent.id})`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to test webhook');
    } finally {
      setActioningId(null);
    }
  };

  const handleToggleStatus = async (webhook: WebhookEndpoint) => {
    const newStatus = webhook.status === 'active' ? 'inactive' : 'active';

    setActioningId(webhook.id);
    try {
      await updateWebhook(organization.id, webhook.id, { status: newStatus });
      await mutate();
      toast.success(`Webhook ${newStatus === 'active' ? 'activated' : 'deactivated'}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update webhook');
    } finally {
      setActioningId(null);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'secondary';
      case 'failed':
        return 'destructive';
      case 'paused':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const getLastDeliveryStatus = (webhook: WebhookEndpoint) => {
    if (!webhook.lastDeliveryAt) {
      return <span className="text-gray-500">Never</span>;
    }

    const status = webhook.lastDeliveryStatus;
    const date = new Date(webhook.lastDeliveryAt).toLocaleDateString();

    return (
      <div className="flex items-center gap-2">
        <Badge variant={status === 'success' ? 'success' : 'destructive'} className="text-xs">
          {status}
        </Badge>
        <span className="text-sm text-gray-600">{date}</span>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Webhooks</h2>
          <Button disabled>Create Webhook</Button>
        </div>
        <div className="flex items-center justify-center py-8">
          <div className="size-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  if (selectedWebhook) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedWebhook(null)}
          >
            ← Back to Webhooks
          </Button>
          <h2 className="text-lg font-semibold">{selectedWebhook.name}</h2>
          <Badge variant={getStatusBadgeVariant(selectedWebhook.status)}>
            {selectedWebhook.status}
          </Badge>
        </div>
        <WebhookDeliveries webhook={selectedWebhook} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Webhooks</h2>
          <p className="text-sm text-gray-600">
            Manage webhook endpoints to receive real-time notifications
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          Create Webhook
        </Button>
      </div>

      {webhooks.length === 0
        ? (
            <div className="py-8 text-center">
              <p className="mb-4 text-gray-500">No webhooks configured yet</p>
              <Button onClick={() => setShowCreateModal(true)}>
                Create your first webhook
              </Button>
            </div>
          )
        : (
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>URL</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Events</TableHead>
                    <TableHead>Last Delivery</TableHead>
                    <TableHead>Failures</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {webhooks.map(webhook => (
                    <TableRow key={webhook.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{webhook.name}</div>
                          {webhook.description && (
                            <div className="text-sm text-gray-600">{webhook.description}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="break-all font-mono text-sm">{webhook.url}</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(webhook.status)}>
                          {webhook.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {(webhook.eventTypes || []).slice(0, 2).map(eventType => (
                            <Badge key={eventType} variant="outline" className="text-xs">
                              {eventType}
                            </Badge>
                          ))}
                          {(webhook.eventTypes || []).length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +
                              {(webhook.eventTypes || []).length - 2}
                              {' '}
                              more
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getLastDeliveryStatus(webhook)}
                      </TableCell>
                      <TableCell>
                        {webhook.failureCount > 0
                          ? (
                              <Badge variant="destructive">{webhook.failureCount}</Badge>
                            )
                          : (
                              <span className="text-gray-500">0</span>
                            )}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={actioningId === webhook.id}
                            >
                              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                              </svg>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setSelectedWebhook(webhook)}>
                              View Deliveries
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setEditingWebhook(webhook)}>
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleTest(webhook)}>
                              Send Test
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleToggleStatus(webhook)}>
                              {webhook.status === 'active' ? 'Deactivate' : 'Activate'}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDelete(webhook)}
                              className="text-red-600"
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

      <CreateWebhook
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={() => {
          mutate();
          setShowCreateModal(false);
        }}
      />

      {editingWebhook && (
        <EditWebhook
          webhook={editingWebhook}
          isOpen={!!editingWebhook}
          onClose={() => setEditingWebhook(null)}
          onSuccess={() => {
            mutate();
            setEditingWebhook(null);
          }}
        />
      )}
    </div>
  );
};
