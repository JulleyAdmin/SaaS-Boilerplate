'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useWebhookDeliveries } from '@/hooks/useWebhooks';
import type { WebhookEndpoint, WebhookDelivery } from '@/models/webhook';

interface WebhookDeliveriesProps {
  webhook: WebhookEndpoint;
}

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
    if (!duration) return '-';
    if (duration < 1000) return `${duration}ms`;
    return `${(duration / 1000).toFixed(2)}s`;
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Recent Deliveries</h3>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Recent Deliveries</h3>
        <div className="text-sm text-gray-600">
          Showing last {deliveries.length} deliveries
        </div>
      </div>

      {deliveries.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No deliveries yet</p>
          <p className="text-sm text-gray-400 mt-1">
            Deliveries will appear here when events are triggered
          </p>
        </div>
      ) : (
        <div className="border rounded-lg">
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
              {deliveries.map((delivery) => (
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
                    {delivery.httpStatus ? (
                      <Badge 
                        variant={delivery.httpStatus >= 200 && delivery.httpStatus < 300 ? 'success' : 'destructive'}
                      >
                        {delivery.httpStatus}
                      </Badge>
                    ) : (
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
                    {delivery.deliveredAt ? (
                      new Date(delivery.deliveredAt).toLocaleString()
                    ) : (
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
          <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Delivery Details</DialogTitle>
              <DialogDescription>
                Event: {selectedDelivery.eventType} • Status: {selectedDelivery.status}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-sm">Event ID</h4>
                  <p className="text-sm text-gray-600 font-mono">{selectedDelivery.eventId}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm">Delivery ID</h4>
                  <p className="text-sm text-gray-600 font-mono">{selectedDelivery.id}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm">HTTP Status</h4>
                  <p className="text-sm text-gray-600">
                    {selectedDelivery.httpStatus || 'No response'}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-sm">Duration</h4>
                  <p className="text-sm text-gray-600">
                    {formatDuration(selectedDelivery.duration)}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-sm">Attempt</h4>
                  <p className="text-sm text-gray-600">{selectedDelivery.attempt}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm">Created At</h4>
                  <p className="text-sm text-gray-600">
                    {new Date(selectedDelivery.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              {selectedDelivery.errorMessage && (
                <div>
                  <h4 className="font-medium text-sm text-red-600">Error Message</h4>
                  <p className="text-sm text-red-600 bg-red-50 p-2 rounded font-mono">
                    {selectedDelivery.errorMessage}
                  </p>
                </div>
              )}

              {selectedDelivery.nextRetryAt && (
                <div>
                  <h4 className="font-medium text-sm">Next Retry</h4>
                  <p className="text-sm text-gray-600">
                    {new Date(selectedDelivery.nextRetryAt).toLocaleString()}
                  </p>
                </div>
              )}

              <div>
                <h4 className="font-medium text-sm">Request Payload</h4>
                <pre className="text-xs bg-gray-50 p-3 rounded overflow-x-auto">
                  {JSON.stringify(selectedDelivery.payload, null, 2)}
                </pre>
              </div>

              {selectedDelivery.responseBody && (
                <div>
                  <h4 className="font-medium text-sm">Response Body</h4>
                  <pre className="text-xs bg-gray-50 p-3 rounded overflow-x-auto max-h-32 overflow-y-auto">
                    {selectedDelivery.responseBody}
                  </pre>
                </div>
              )}

              {selectedDelivery.responseHeaders && Object.keys(selectedDelivery.responseHeaders).length > 0 && (
                <div>
                  <h4 className="font-medium text-sm">Response Headers</h4>
                  <pre className="text-xs bg-gray-50 p-3 rounded overflow-x-auto">
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