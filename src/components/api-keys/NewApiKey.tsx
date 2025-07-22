'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

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
import { createApiKey } from '@/hooks/useApiKeys';

const createApiKeySchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name must be 50 characters or less'),
  expiresAt: z.string().optional(),
});

type CreateApiKeyForm = z.infer<typeof createApiKeySchema>;

interface NewApiKeyProps {
  isOpen: boolean;
  onClose: () => void;
  organizationId: string;
  onSuccess: () => void;
}

export const NewApiKey = ({ isOpen, onClose, organizationId, onSuccess }: NewApiKeyProps) => {
  const [step, setStep] = useState<'form' | 'display'>('form');
  const [createdApiKey, setCreatedApiKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const form = useForm<CreateApiKeyForm>({
    resolver: zodResolver(createApiKeySchema),
    defaultValues: {
      name: '',
      expiresAt: '',
    },
  });

  const handleClose = () => {
    setStep('form');
    setCreatedApiKey(null);
    setCopied(false);
    form.reset();
    onClose();
  };

  const onSubmit = async (data: CreateApiKeyForm) => {
    try {
      const result = await createApiKey(
        organizationId,
        data.name,
        data.expiresAt || undefined,
      );

      setCreatedApiKey(result.plainKey);
      setStep('display');
      toast.success('API key created successfully');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create API key');
    }
  };

  const copyToClipboard = async () => {
    if (createdApiKey) {
      try {
        await navigator.clipboard.writeText(createdApiKey);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toast.success('API key copied to clipboard');
      } catch (error) {
        toast.error('Failed to copy to clipboard');
      }
    }
  };

  const handleFinish = () => {
    onSuccess();
    handleClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        {step === 'form' ? (
          <>
            <DialogHeader>
              <DialogTitle>Create API Key</DialogTitle>
              <DialogDescription>
                Create a new API key for programmatic access to your organization.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="My API Key"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        A descriptive name for this API key.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="expiresAt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expiration Date (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          type="datetime-local"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Leave empty for a key that never expires.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={handleClose}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? 'Creating...' : 'Create API Key'}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>API Key Created</DialogTitle>
              <DialogDescription>
                Your API key has been created. Copy it now as it won't be shown again.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <code className="text-sm font-mono break-all pr-2">
                    {createdApiKey}
                  </code>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={copyToClipboard}
                  >
                    {copied ? 'Copied!' : 'Copy'}
                  </Button>
                </div>
              </div>
              <div className="p-4 border border-yellow-200 bg-yellow-50 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Important:</strong> This is the only time you'll see this API key. 
                  Make sure to copy it and store it securely.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleFinish}>
                Done
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};