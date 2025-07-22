'use client';

import { useState } from 'react';
import { useOrganization, useUser } from '@clerk/nextjs';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useTeamMembers, updateMemberRole, removeMember } from '@/hooks/useTeamMembers';
import { InviteTeamMember } from './InviteTeamMember';

export const TeamMembers = () => {
  const { organization } = useOrganization();
  const { user } = useUser();
  const { members, isLoading, mutate } = useTeamMembers();
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);

  if (!organization) {
    return null;
  }

  const currentUserMember = members.find(m => m.userId === user?.id);
  const currentUserRole = currentUserMember?.role;
  const canManage = currentUserRole === 'OWNER' || currentUserRole === 'ADMIN';

  const handleRoleChange = async (memberId: string, newRole: 'ADMIN' | 'MEMBER') => {
    setUpdatingId(memberId);
    try {
      await updateMemberRole(organization.id, memberId, newRole);
      await mutate();
      toast.success('Member role updated successfully');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update role');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRemoveMember = async (memberId: string, memberName: string) => {
    if (!confirm(`Are you sure you want to remove ${memberName} from the team?`)) {
      return;
    }

    setRemovingId(memberId);
    try {
      await removeMember(organization.id, memberId);
      await mutate();
      toast.success('Member removed successfully');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to remove member');
    } finally {
      setRemovingId(null);
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'OWNER':
        return 'default';
      case 'ADMIN':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Team Members</h2>
          <Button disabled>Invite Member</Button>
        </div>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">Team Members</h2>
          <p className="text-sm text-gray-600">
            Manage your team members and their roles
          </p>
        </div>
        {canManage && (
          <Button onClick={() => setShowInviteModal(true)}>
            Invite Member
          </Button>
        )}
      </div>

      {members.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No team members yet</p>
        </div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Joined</TableHead>
                {canManage && <TableHead className="w-[100px]">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={member.user?.imageUrl} />
                        <AvatarFallback>
                          {member.user?.name?.charAt(0) || member.user?.email?.charAt(0) || '?'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{member.user?.name || 'Unknown'}</div>
                        <div className="text-sm text-gray-600">{member.user?.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getRoleBadgeVariant(member.role)}>
                      {member.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(member.createdAt).toLocaleDateString()}
                  </TableCell>
                  {canManage && (
                    <TableCell>
                      {member.role !== 'OWNER' && member.userId !== user?.id && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={updatingId === member.id || removingId === member.id}
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                              </svg>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {currentUserRole === 'OWNER' && member.role !== 'ADMIN' && (
                              <DropdownMenuItem onClick={() => handleRoleChange(member.id, 'ADMIN')}>
                                Promote to Admin
                              </DropdownMenuItem>
                            )}
                            {currentUserRole === 'OWNER' && member.role === 'ADMIN' && (
                              <DropdownMenuItem onClick={() => handleRoleChange(member.id, 'MEMBER')}>
                                Demote to Member
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              onClick={() => handleRemoveMember(member.id, member.user?.name || 'this member')}
                              className="text-red-600"
                            >
                              Remove from team
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <InviteTeamMember
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        onSuccess={() => {
          mutate();
          setShowInviteModal(false);
        }}
      />
    </div>
  );
};