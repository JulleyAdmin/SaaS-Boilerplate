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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { createSSOConnection } from '@/hooks/useSSOConnections';

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  metadataUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  metadata: z.string().optional(),
  redirectUrl: z.string().url('Must be a valid URL'),
});

type FormData = z.infer<typeof formSchema>;

type CreateSSOConnectionDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
};

export function CreateSSOConnectionDialog({
  open,
  onOpenChange,
  onSuccess,
}: CreateSSOConnectionDialogProps) {
  const { organization } = useOrganization();
  const [isLoading, setIsLoading] = useState(false);
  const [metadataMethod, setMetadataMethod] = useState<'url' | 'xml'>('url');

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      metadataUrl: '',
      metadata: '',
      redirectUrl: organization
        ? `${window.location.origin}/api/auth/sso/callback`
        : '',
    },
  });

  const onSubmit = async (data: FormData) => {
    if (!organization) {
      return;
    }

    setIsLoading(true);
    try {
      const connectionData = {
        name: data.name,
        description: data.description,
        redirectUrl: data.redirectUrl,
        ...(metadataMethod === 'url'
          ? { metadataUrl: data.metadataUrl }
          : { metadata: data.metadata }
        ),
      };

      await createSSOConnection(organization.id, connectionData);
      toast.success('SSO connection created successfully');
      form.reset();
      onSuccess();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create SSO connection');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create SSO Connection</DialogTitle>
          <DialogDescription>
            Add a new SAML or OIDC connection for enterprise authentication.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Connection Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Company Active Directory" {...field} />
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
                    <Input placeholder="Brief description of this connection" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="redirectUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Redirect URL</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    This URL will be used for SAML ACS and OIDC callback
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <FormLabel>SAML Metadata</FormLabel>
              <Tabs value={metadataMethod} onValueChange={value => setMetadataMethod(value as 'url' | 'xml')}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="url">Metadata URL</TabsTrigger>
                  <TabsTrigger value="xml">Upload XML</TabsTrigger>
                </TabsList>

                <TabsContent value="url">
                  <FormField
                    control={form.control}
                    name="metadataUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="https://idp.example.com/metadata" {...field} />
                        </FormControl>
                        <FormDescription>
                          URL where the IdP metadata can be downloaded
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                <TabsContent value="xml">
                  <FormField
                    control={form.control}
                    name="metadata"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            placeholder="Paste SAML metadata XML here..."
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Paste the XML metadata from your identity provider
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
              </Tabs>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Creating...' : 'Create Connection'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
