'use client';

import { useOrganization } from '@clerk/nextjs';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { createApiKey } from '@/hooks/useApiKeys';

const createApiKeySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  description: z.string().max(500, 'Description too long').optional(),
  expiresInDays: z.number().min(1).max(365).optional(),
});

type CreateApiKeyFormValues = z.infer<typeof createApiKeySchema>;

type CreateApiKeyProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

export const CreateApiKey = ({ isOpen, onClose, onSuccess }: CreateApiKeyProps) => {
  const { organization } = useOrganization();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdKey, setCreatedKey] = useState<{ key: string; name: string } | null>(null);

  const form = useForm<CreateApiKeyFormValues>({
    resolver: zodResolver(createApiKeySchema),
    defaultValues: {
      name: '',
      description: '',
      expiresInDays: 90,
    },
  });

  const handleSubmit = async (values: CreateApiKeyFormValues) => {
    if (!organization) {
      return;
    }

    setIsSubmitting(true);
    try {
      const expiresAt = values.expiresInDays
        ? new Date(Date.now() + values.expiresInDays * 24 * 60 * 60 * 1000).toISOString()
        : undefined;

      const result = await createApiKey(organization.id, values.name, expiresAt);

      setCreatedKey({
        key: result.plainKey,
        name: result.apiKey.name,
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create API key');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    form.reset();
    setCreatedKey(null);
    onClose();
  };

  const copyKey = () => {
    if (createdKey?.key) {
      navigator.clipboard.writeText(createdKey.key);
      toast.success('API key copied to clipboard');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[525px]">
        {createdKey
          ? (
              <>
                <DialogHeader>
                  <DialogTitle>API Key Created</DialogTitle>
                  <DialogDescription>
                    Your API key "
                    {createdKey.name}
                    " has been created. Copy it now - it won't be shown again.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">API Key</label>
                    <div className="flex gap-2">
                      <Input
                        value={createdKey.key}
                        readOnly
                        className="font-mono text-sm"
                      />
                      <Button type="button" variant="outline" onClick={copyKey}>
                        Copy
                      </Button>
                    </div>
                    <p className="text-sm text-gray-500">
                      Store this key securely - you won't be able to see it again
                    </p>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={() => {
                    onSuccess();
                    handleClose();
                  }}
                  >
                    Done
                  </Button>
                </DialogFooter>
              </>
            )
          : (
              <>
                <DialogHeader>
                  <DialogTitle>Create API Key</DialogTitle>
                  <DialogDescription>
                    Create a new API key for programmatic access to your organization
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
                            <Input placeholder="Production API Key" {...field} />
                          </FormControl>
                          <FormDescription>
                            A descriptive name for this API key
                          </FormDescription>
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
                              placeholder="What this API key will be used for..."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="expiresInDays"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Expires In (Days)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min={1}
                              max={365}
                              {...field}
                              onChange={e => field.onChange(Number.parseInt(e.target.value))}
                            />
                          </FormControl>
                          <FormDescription>
                            How many days until this key expires (1-365 days)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

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
                        {isSubmitting ? 'Creating...' : 'Create API Key'}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </>
            )}
      </DialogContent>
    </Dialog>
  );
};
