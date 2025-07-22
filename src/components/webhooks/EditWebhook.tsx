'use client';

import { useState, useEffect } from 'react';
import { useOrganization } from '@clerk/nextjs';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from 'sonner';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { updateWebhook } from '@/hooks/useWebhooks';
import { 
  webhookEventTypes, 
  getEventTypeDescription, 
  type WebhookEventType, 
  type WebhookEndpoint 
} from '@/models/webhook';

const editWebhookSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  description: z.string().max(500, 'Description too long').optional(),
  url: z.string().url('Please enter a valid URL'),
  status: z.enum(['active', 'inactive', 'paused'] as const),
  eventTypes: z.array(z.string()).min(1, 'Select at least one event type'),
  timeout: z.number().min(5).max(120).optional(),
  retryCount: z.number().min(0).max(5).optional(),
});

type EditWebhookFormValues = z.infer<typeof editWebhookSchema>;

interface EditWebhookProps {
  webhook: WebhookEndpoint;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const EditWebhook = ({ webhook, isOpen, onClose, onSuccess }: EditWebhookProps) => {
  const { organization } = useOrganization();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedEvents, setSelectedEvents] = useState<WebhookEventType[]>([]);

  const form = useForm<EditWebhookFormValues>({
    resolver: zodResolver(editWebhookSchema),
    defaultValues: {
      name: webhook.name,
      description: webhook.description || '',
      url: webhook.url,
      status: webhook.status === 'failed' ? 'inactive' : webhook.status,
      eventTypes: webhook.eventTypes || [],
      timeout: webhook.timeout,
      retryCount: webhook.retryCount,
    },
  });

  useEffect(() => {
    setSelectedEvents((webhook.eventTypes || []) as WebhookEventType[]);
    form.reset({
      name: webhook.name,
      description: webhook.description || '',
      url: webhook.url,
      status: webhook.status === 'failed' ? 'inactive' : webhook.status,
      eventTypes: webhook.eventTypes || [],
      timeout: webhook.timeout,
      retryCount: webhook.retryCount,
    });
  }, [webhook, form]);

  const handleEventToggle = (eventType: WebhookEventType) => {
    const newSelected = selectedEvents.includes(eventType)
      ? selectedEvents.filter(e => e !== eventType)
      : [...selectedEvents, eventType];
    
    setSelectedEvents(newSelected);
    form.setValue('eventTypes', newSelected);
  };

  const handleSubmit = async (values: EditWebhookFormValues) => {
    if (!organization) return;

    setIsSubmitting(true);
    try {
      await updateWebhook(organization.id, webhook.id, {
        name: values.name,
        description: values.description,
        url: values.url,
        status: values.status,
        eventTypes: values.eventTypes as WebhookEventType[],
        timeout: values.timeout,
        retryCount: values.retryCount,
      });

      toast.success('Webhook updated successfully');
      onSuccess();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update webhook');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Webhook</DialogTitle>
          <DialogDescription>
            Update your webhook endpoint configuration
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="My webhook endpoint" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="What this webhook is used for..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Endpoint URL</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="https://your-app.com/webhooks/hospitalos"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    The URL where webhook events will be sent
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="paused">Paused</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Only active webhooks will receive events
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-3">
              <label className="text-sm font-medium">Event Types</label>
              <p className="text-sm text-gray-600">
                Select which events you want to receive
              </p>
              <div className="space-y-2 max-h-48 overflow-y-auto border rounded-md p-3">
                {webhookEventTypes.map((eventType) => (
                  <div
                    key={eventType}
                    className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded"
                    onClick={() => handleEventToggle(eventType)}
                  >
                    <input
                      type="checkbox"
                      checked={selectedEvents.includes(eventType)}
                      onChange={() => handleEventToggle(eventType)}
                      className="h-4 w-4 text-blue-600 rounded border-gray-300"
                    />
                    <div className="flex-1">
                      <div className="text-sm font-medium">{eventType}</div>
                      <div className="text-xs text-gray-500">
                        {getEventTypeDescription(eventType)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {selectedEvents.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {selectedEvents.map((eventType) => (
                    <Badge key={eventType} variant="secondary" className="text-xs">
                      {eventType}
                    </Badge>
                  ))}
                </div>
              )}
              {form.formState.errors.eventTypes && (
                <p className="text-sm text-red-600">
                  {form.formState.errors.eventTypes.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="timeout"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Timeout (seconds)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        min={5}
                        max={120}
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>
                      Request timeout (5-120 seconds)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="retryCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Retry Count</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        min={0}
                        max={5}
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>
                      Number of retries on failure
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Updating...' : 'Update Webhook'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};