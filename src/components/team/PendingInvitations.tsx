'use client';

import { useState } from 'react';
import { useOrganization } from '@clerk/nextjs';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useInvitations, deleteInvitation } from '@/hooks/useInvitations';

export const PendingInvitations = () => {
  const { organization } = useOrganization();
  const { invitations, isLoading, mutate } = useInvitations();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  if (!organization) {
    return null;
  }

  const handleDelete = async (invitationId: string) => {
    if (!confirm('Are you sure you want to cancel this invitation?')) {
      return;
    }

    setDeletingId(invitationId);
    try {
      await deleteInvitation(organization.id, invitationId);
      await mutate();
      toast.success('Invitation cancelled successfully');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to cancel invitation');
    } finally {
      setDeletingId(null);
    }
  };

  const copyInvitationUrl = (token: string) => {
    const baseUrl = window.location.origin;
    const invitationUrl = `${baseUrl}/invitations/accept?token=${token}`;
    navigator.clipboard.writeText(invitationUrl);
    toast.success('Invitation link copied to clipboard');
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Pending Invitations</h3>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  const activeInvitations = invitations.filter(inv => inv.status === 'PENDING');

  if (activeInvitations.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">Pending Invitations</h3>
        <p className="text-sm text-gray-600">
          Manage pending invitations to your team
        </p>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email / Domain</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Expires</TableHead>
              <TableHead>Invited By</TableHead>
              <TableHead className="w-[150px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activeInvitations.map((invitation) => {
              const daysUntilExpiry = Math.ceil(
                (new Date(invitation.expires).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
              );
              const isExpiringSoon = daysUntilExpiry <= 2;

              return (
                <TableRow key={invitation.id}>
                  <TableCell>
                    {invitation.email ? (
                      <span>{invitation.email}</span>
                    ) : invitation.allowedDomains && invitation.allowedDomains.length > 0 ? (
                      <div className="space-y-1">
                        <span className="text-sm text-gray-500">Allowed domains:</span>
                        <div className="flex flex-wrap gap-1">
                          {invitation.allowedDomains.map((domain) => (
                            <Badge key={domain} variant="outline" className="text-xs">
                              {domain}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-500">Open invitation</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{invitation.role}</Badge>
                  </TableCell>
                  <TableCell>
                    <span className={isExpiringSoon ? 'text-orange-600' : ''}>
                      {daysUntilExpiry} days
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {invitation.invitedBy}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyInvitationUrl(invitation.token)}
                      >
                        Copy Link
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(invitation.id)}
                        disabled={deletingId === invitation.id}
                        className="text-red-600 hover:text-red-700"
                      >
                        Cancel
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};