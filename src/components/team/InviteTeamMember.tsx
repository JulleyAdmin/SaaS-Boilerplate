'use client';

import { useState } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { createInvitation } from '@/hooks/useInvitations';

const inviteSchema = z.object({
  email: z.string().email('Please enter a valid email address').optional().or(z.literal('')),
  role: z.enum(['ADMIN', 'MEMBER'], {
    required_error: 'Please select a role',
  }),
  allowedDomains: z.string().optional(),
});

type InviteFormValues = z.infer<typeof inviteSchema>;

interface InviteTeamMemberProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const InviteTeamMember = ({ isOpen, onClose, onSuccess }: InviteTeamMemberProps) => {
  const { organization } = useOrganization();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [invitationUrl, setInvitationUrl] = useState<string | null>(null);

  const form = useForm<InviteFormValues>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      email: '',
      role: 'MEMBER',
      allowedDomains: '',
    },
  });

  const handleSubmit = async (values: InviteFormValues) => {
    if (!organization) return;

    setIsSubmitting(true);
    try {
      const invitation = await createInvitation(organization.id, {
        email: values.email || undefined,
        role: values.role,
        allowedDomains: values.allowedDomains
          ? values.allowedDomains.split(',').map(d => d.trim()).filter(Boolean)
          : undefined,
      });

      if (invitation.invitationUrl) {
        setInvitationUrl(invitation.invitationUrl);
      } else {
        toast.success('Invitation created successfully');
        onSuccess();
        handleClose();
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create invitation');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    form.reset();
    setInvitationUrl(null);
    onClose();
  };

  const copyInvitationUrl = () => {
    if (invitationUrl) {
      navigator.clipboard.writeText(invitationUrl);
      toast.success('Invitation link copied to clipboard');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[525px]">
        {invitationUrl ? (
          <>
            <DialogHeader>
              <DialogTitle>Invitation Created</DialogTitle>
              <DialogDescription>
                Share this link with the new team member to join your organization.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Invitation Link</label>
                <div className="flex gap-2">
                  <Input
                    value={invitationUrl}
                    readOnly
                    className="font-mono text-sm"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={copyInvitationUrl}
                  >
                    Copy
                  </Button>
                </div>
                <p className="text-sm text-gray-500">
                  This link will expire in 7 days
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => {
                onSuccess();
                handleClose();
              }}>
                Done
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Invite Team Member</DialogTitle>
              <DialogDescription>
                Send an invitation to add a new member to your team.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="member@example.com"
                          type="email"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Leave empty to generate a shareable invitation link
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="MEMBER">Member</SelectItem>
                          <SelectItem value="ADMIN">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Admins can manage team members and settings
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="allowedDomains"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Allowed Email Domains (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="example.com, company.org"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Comma-separated list of domains that can use this invitation
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
                    {isSubmitting ? 'Creating...' : 'Create Invitation'}
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