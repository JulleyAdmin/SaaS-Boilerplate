import { getTranslations } from 'next-intl/server';

import { TeamMembers } from '@/components/team/TeamMembers';
import { PendingInvitations } from '@/components/team/PendingInvitations';

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
        <p className="text-gray-600 mt-1">
          Manage your team members, roles, and invitations
        </p>
      </div>

      <TeamMembers />
      <PendingInvitations />
    </div>
  );
};

export default TeamManagementPage;