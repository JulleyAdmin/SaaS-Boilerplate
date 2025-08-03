import { getTranslations } from 'next-intl/server';

import { PendingInvitations } from '@/components/team/PendingInvitations';
import { TeamMembers } from '@/components/team/TeamMembers';

export async function generateMetadata(props: { params: { locale: string } }) {
  const t = await getTranslations({
    locale: props.params.locale,
    namespace: 'team_management',
  });

  return {
    title: t('meta_title'),
  };
}

const TeamManagementPage = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Team Management</h1>
        <p className="mt-1 text-gray-600">
          Manage your team members, roles, and invitations
        </p>
      </div>

      <TeamMembers />
      <PendingInvitations />
    </div>
  );
};

export default TeamManagementPage;
