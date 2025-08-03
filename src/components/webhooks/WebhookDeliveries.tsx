'use client';

import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useWebhookDeliveries } from '@/hooks/useWebhooks';
import type { WebhookDelivery, WebhookEndpoint } from '@/types/webhook';

type WebhookDeliveriesProps = {
  webhook: WebhookEndpoint;
};

export const WebhookDeliveries = ({ webhook }: WebhookDeliveriesProps) => {
  const { deliveries, isLoading } = useWebhookDeliveries(webhook.id);
  const [selectedDelivery, setSelectedDelivery] = useState<WebhookDelivery | null>(null);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'success':
        return 'success';
      case 'failed':
        return 'destructive';
      case 'pending':
        return 'secondary';
      case 'retrying':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return '✓';
      case 'failed':
        return '✗';
      case 'pending':
        return '⏳';
      case 'retrying':
        return '🔄';
      default:
        return '?';
    }
  };

  const formatDuration = (duration: number | null) => {
    if (!duration) {
      return '-';
    }
    if (duration < 1000) {
      return `${duration}ms`;
    }
    return `${(duration / 1000).toFixed(2)}s`;
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Recent Deliveries</h3>
        <div className="flex items-center justify-center py-8">
          <div className="size-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Recent Deliveries</h3>
        <div className="text-sm text-gray-600">
          Showing last
          {' '}
          {deliveries.length}
          {' '}
          deliveries
        </div>
      </div>

      {deliveries.length === 0
        ? (
            <div className="py-8 text-center">
              <p className="text-gray-500">No deliveries yet</p>
              <p className="mt-1 text-sm text-gray-400">
                Deliveries will appear here when events are triggered
              </p>
            </div>
          )
        : (
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Status</TableHead>
                    <TableHead>Event</TableHead>
                    <TableHead>HTTP Status</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Attempt</TableHead>
                    <TableHead>Delivered At</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {deliveries.map(delivery => (
                    <TableRow key={delivery.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{getStatusIcon(delivery.status)}</span>
                          <Badge variant={getStatusBadgeVariant(delivery.status)}>
                            {delivery.status}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {delivery.eventType}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {delivery.httpStatus
                          ? (
                              <Badge
                                variant={delivery.httpStatus >= 200 && delivery.httpStatus < 300 ? 'success' : 'destructive'}
                              >
                                {delivery.httpStatus}
                              </Badge>
                            )
                          : (
                              <span className="text-gray-500">-</span>
                            )}
                      </TableCell>
                      <TableCell>{formatDuration(delivery.duration)}</TableCell>
                      <TableCell>
                        <span className={delivery.attempt > 1 ? 'text-orange-600' : ''}>
                          {delivery.attempt}
                        </span>
                      </TableCell>
                      <TableCell>
                        {delivery.deliveredAt
                          ? (
                              new Date(delivery.deliveredAt).toLocaleString()
                            )
                          : (
                              <span className="text-gray-500">Not delivered</span>
                            )}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedDelivery(delivery)}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

      {selectedDelivery && (
        <Dialog open={!!selectedDelivery} onOpenChange={() => setSelectedDelivery(null)}>
          <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>Delivery Details</DialogTitle>
              <DialogDescription>
                Event:
                {' '}
                {selectedDelivery.eventType}
                {' '}
                • Status:
                {' '}
                {selectedDelivery.status}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium">Event ID</h4>
                  <p className="font-mono text-sm text-gray-600">{selectedDelivery.eventId}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Delivery ID</h4>
                  <p className="font-mono text-sm text-gray-600">{selectedDelivery.id}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">HTTP Status</h4>
                  <p className="text-sm text-gray-600">
                    {selectedDelivery.httpStatus || 'No response'}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Duration</h4>
                  <p className="text-sm text-gray-600">
                    {formatDuration(selectedDelivery.duration)}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Attempt</h4>
                  <p className="text-sm text-gray-600">{selectedDelivery.attempt}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Created At</h4>
                  <p className="text-sm text-gray-600">
                    {new Date(selectedDelivery.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              {selectedDelivery.errorMessage && (
                <div>
                  <h4 className="text-sm font-medium text-red-600">Error Message</h4>
                  <p className="rounded bg-red-50 p-2 font-mono text-sm text-red-600">
                    {selectedDelivery.errorMessage}
                  </p>
                </div>
              )}

              {selectedDelivery.nextRetryAt && (
                <div>
                  <h4 className="text-sm font-medium">Next Retry</h4>
                  <p className="text-sm text-gray-600">
                    {new Date(selectedDelivery.nextRetryAt).toLocaleString()}
                  </p>
                </div>
              )}

              <div>
                <h4 className="text-sm font-medium">Request Payload</h4>
                <pre className="overflow-x-auto rounded bg-gray-50 p-3 text-xs">
                  {JSON.stringify(selectedDelivery.payload, null, 2)}
                </pre>
              </div>

              {selectedDelivery.responseBody && (
                <div>
                  <h4 className="text-sm font-medium">Response Body</h4>
                  <pre className="max-h-32 overflow-auto rounded bg-gray-50 p-3 text-xs">
                    {selectedDelivery.responseBody}
                  </pre>
                </div>
              )}

              {selectedDelivery.responseHeaders && Object.keys(selectedDelivery.responseHeaders).length > 0 && (
                <div>
                  <h4 className="text-sm font-medium">Response Headers</h4>
                  <pre className="overflow-x-auto rounded bg-gray-50 p-3 text-xs">
                    {JSON.stringify(selectedDelivery.responseHeaders, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
