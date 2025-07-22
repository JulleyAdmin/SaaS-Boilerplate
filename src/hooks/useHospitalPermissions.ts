import { useUser } from '@clerk/nextjs';
import { useMemo } from 'react';

import type { HospitalAction, HospitalResource, HospitalRole } from '@/libs/permissions';
import { HospitalAccessControl } from '@/libs/permissions';

export const useHospitalPermissions = () => {
  const { user, isLoaded } = useUser();

  const userRole = useMemo(() => {
    if (!isLoaded || !user) {
      return null;
    }

    // Get role from user metadata or public metadata
    const role = user.publicMetadata?.hospitalRole as HospitalRole | undefined;
    return role || 'viewer'; // Default to viewer if no role set
  }, [user, isLoaded]);

  const userDepartment = useMemo(() => {
    if (!isLoaded || !user) {
      return null;
    }

    return user.publicMetadata?.hospitalDepartment as string | undefined;
  }, [user, isLoaded]);

  const canAccess = useMemo(() => {
    return (resource: HospitalResource, action: HospitalAction) => {
      if (!userRole) {
        return false;
      }
      return HospitalAccessControl.canAccess(userRole, resource, action);
    };
  }, [userRole]);

  const canAccessDepartment = useMemo(() => {
    return (targetDepartment: string) => {
      if (!userRole || !userDepartment) {
        return false;
      }
      return HospitalAccessControl.canAccessDepartment(userRole, userDepartment, targetDepartment);
    };
  }, [userRole, userDepartment]);

  const hasMinimumRole = useMemo(() => {
    return (minimumRole: HospitalRole) => {
      if (!userRole) {
        return false;
      }
      return HospitalAccessControl.hasMinimumRole(userRole, minimumRole);
    };
  }, [userRole]);

  const getAllowedActions = useMemo(() => {
    return (resource: HospitalResource) => {
      if (!userRole) {
        return [];
      }
      return HospitalAccessControl.getAllowedActions(userRole, resource);
    };
  }, [userRole]);

  return {
    userRole,
    userDepartment,
    canAccess,
    canAccessDepartment,
    hasMinimumRole,
    getAllowedActions,
    isLoaded,
  };
};

export default useHospitalPermissions;
