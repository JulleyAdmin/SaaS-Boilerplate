'use client';

import { useOrganization } from '@clerk/nextjs';
import { Download, MoreHorizontal, Plus, Settings, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { deleteSSOConnection, useSSOConnections } from '@/hooks/useSSOConnections';
import type { SSOConnection } from '@/lib/sso/types';

import { CreateSSOConnectionDialog } from './CreateSSOConnectionDialog';
import { EditSSOConnectionDialog } from './EditSSOConnectionDialog';

export function SSOConnectionList() {
  const { organization } = useOrganization();
  const { connections, isLoading, mutate } = useSSOConnections();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editConnection, setEditConnection] = useState<SSOConnection | null>(null);

  const handleDelete = async (connection: SSOConnection) => {
    if (!organization) {
      return;
    }

    if (!confirm(`Are you sure you want to delete the SSO connection "${connection.name}"?`)) {
      return;
    }

    try {
      await deleteSSOConnection(organization.id, connection.tenant);
      toast.success('SSO connection deleted successfully');
      mutate();
    } catch (error) {
      toast.error('Failed to delete SSO connection');
      console.error('Delete connection error:', error);
    }
  };

  const handleDownloadMetadata = async () => {
    if (!organization) {
      return;
    }

    try {
      const response = await fetch(`/api/organizations/${organization.id}/sso/metadata`);

      if (!response.ok) {
        throw new Error('Failed to download metadata');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `saml-metadata-${organization.id}.xml`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success('Metadata downloaded successfully');
    } catch (error) {
      toast.error('Failed to download metadata');
      console.error('Download metadata error:', error);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-6">
          <div className="size-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">SSO Connections</h2>
          <p className="text-muted-foreground">
            Manage SAML and OIDC connections for enterprise authentication
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleDownloadMetadata}>
            <Download className="mr-2 size-4" />
            Download Metadata
          </Button>
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="mr-2 size-4" />
            Add Connection
          </Button>
        </div>
      </div>

      {connections.length === 0
        ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                <Settings className="mb-4 size-12 text-muted-foreground" />
                <h3 className="mb-2 text-lg font-semibold">No SSO connections</h3>
                <p className="mb-4 text-muted-foreground">
                  Get started by creating your first SAML or OIDC connection
                </p>
                <Button onClick={() => setCreateDialogOpen(true)}>
                  <Plus className="mr-2 size-4" />
                  Add Connection
                </Button>
              </CardContent>
            </Card>
          )
        : (
            <div className="grid gap-4">
              {connections.map(connection => (
                <Card key={connection.tenant}>
                  <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{connection.name}</CardTitle>
                      {connection.description && (
                        <CardDescription>{connection.description}</CardDescription>
                      )}
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="size-8 p-0">
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setEditConnection(connection)}>
                          <Settings className="mr-2 size-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(connection)}
                          className="text-destructive"
                        >
                          <Trash2 className="mr-2 size-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">SAML</Badge>
                          <span className="text-sm text-muted-foreground">
                            Tenant:
                            {' '}
                            {connection.tenant}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Redirect URL:
                          {' '}
                          {connection.defaultRedirectUrl}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

      <CreateSSOConnectionDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSuccess={() => {
          mutate();
          setCreateDialogOpen(false);
        }}
      />

      {editConnection && (
        <EditSSOConnectionDialog
          connection={editConnection}
          open={!!editConnection}
          onOpenChange={open => !open && setEditConnection(null)}
          onSuccess={() => {
            mutate();
            setEditConnection(null);
          }}
        />
      )}
    </div>
  );
}
