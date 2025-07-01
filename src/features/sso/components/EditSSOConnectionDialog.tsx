'use client';

import { useOrganization } from '@clerk/nextjs';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
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
import { updateSSOConnection } from '@/hooks/useSSOConnections';
import type { SSOConnection } from '@/lib/sso/types';

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  metadataUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  metadata: z.string().optional(),
  redirectUrl: z.string().url('Must be a valid URL'),
});

type FormData = z.infer<typeof formSchema>;

type EditSSOConnectionDialogProps = {
  connection: SSOConnection;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
};

export function EditSSOConnectionDialog({
  connection,
  open,
  onOpenChange,
  onSuccess,
}: EditSSOConnectionDialogProps) {
  const { organization } = useOrganization();
  const [isLoading, setIsLoading] = useState(false);
  const [metadataMethod, setMetadataMethod] = useState<'url' | 'xml'>('url');

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: connection.name,
      description: connection.description || '',
      metadataUrl: connection.metadataUrl || '',
      metadata: connection.metadata || '',
      redirectUrl: connection.defaultRedirectUrl,
    },
  });

  useEffect(() => {
    if (connection) {
      form.reset({
        name: connection.name,
        description: connection.description || '',
        metadataUrl: connection.metadataUrl || '',
        metadata: connection.metadata || '',
        redirectUrl: connection.defaultRedirectUrl,
      });

      // Set initial metadata method based on existing data
      if (connection.metadataUrl) {
        setMetadataMethod('url');
      } else if (connection.metadata) {
        setMetadataMethod('xml');
      }
    }
  }, [connection, form]);

  const onSubmit = async (data: FormData) => {
    if (!organization) {
      return;
    }

    setIsLoading(true);
    try {
      const updates = {
        name: data.name,
        description: data.description,
        redirectUrl: data.redirectUrl,
        ...(metadataMethod === 'url'
          ? { metadataUrl: data.metadataUrl, metadata: undefined }
          : { metadata: data.metadata, metadataUrl: undefined }
        ),
      };

      await updateSSOConnection(organization.id, connection.tenant, updates);
      toast.success('SSO connection updated successfully');
      onSuccess();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update SSO connection');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit SSO Connection</DialogTitle>
          <DialogDescription>
            Update the configuration for this SAML or OIDC connection.
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
                {isLoading ? 'Updating...' : 'Update Connection'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
