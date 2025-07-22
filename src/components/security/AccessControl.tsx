import { useUser } from '@clerk/nextjs';
import type { ReactNode } from 'react';
import React from 'react';

import { useHospitalPermissions } from '@/hooks/useHospitalPermissions';
import { HospitalAuditLogger } from '@/libs/audit';
import type { HospitalAction, HospitalResource, HospitalRole } from '@/libs/permissions';

type AccessControlProps = {
  children: ReactNode;
  resource: HospitalResource;
  action: HospitalAction;
  department?: string;
  minimumRole?: HospitalRole;
  fallback?: ReactNode;
  onAccessDenied?: () => void;
};

export const AccessControl: React.FC<AccessControlProps> = ({
  children,
  resource,
  action,
  department,
  minimumRole,
  fallback = null,
  onAccessDenied,
}) => {
  const { user } = useUser();
  const {
    canAccess,
    canAccessDepartment,
    hasMinimumRole,
    userRole,
    userDepartment,
    isLoaded,
  } = useHospitalPermissions();

  // Show loading state while permissions are being loaded
  if (!isLoaded) {
    return <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />;
  }

  // Check resource permission
  const hasResourceAccess = canAccess(resource, action);

  // Check department permission if specified
  const hasDepartmentAccess = department ? canAccessDepartment(department) : true;

  // Check minimum role if specified
  const hasRoleAccess = minimumRole ? hasMinimumRole(minimumRole) : true;

  const hasAccess = hasResourceAccess && hasDepartmentAccess && hasRoleAccess;

  // Log permission denied events for audit
  if (!hasAccess && user && userRole) {
    const organizationId = user.organizationMemberships[0]?.organization?.id || 'unknown';
    const organizationName = user.organizationMemberships[0]?.organization?.name || 'Unknown Hospital';

    HospitalAuditLogger.permissionDenied(
      {
        id: user.id,
        name: user.fullName || user.emailAddresses[0]?.emailAddress || 'Unknown',
        email: user.emailAddresses[0]?.emailAddress,
        role: userRole,
        department: userDepartment || undefined,
      },
      {
        id: organizationId,
        name: organizationName,
      },
      resource,
      action,
      minimumRole,
    );

    // Call custom handler if provided
    onAccessDenied?.();
  }

  if (!hasAccess) {
    return (
      <>
        {fallback}
      </>
    );
  }

  return <>{children}</>;
};

type ProtectedPageProps = {
  children: ReactNode;
  requiredRole: HospitalRole;
  requiredResource?: HospitalResource;
  requiredAction?: HospitalAction;
  department?: string;
};

export const ProtectedPage: React.FC<ProtectedPageProps> = ({
  children,
  requiredRole,
  requiredResource = 'system_settings',
  requiredAction = 'read',
  department,
}) => {
  const { hasMinimumRole, canAccess, canAccessDepartment, isLoaded } = useHospitalPermissions();

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="size-32 animate-spin rounded-full border-b-2 border-blue-600" />
      </div>
    );
  }

  const hasRoleAccess = hasMinimumRole(requiredRole);
  const hasResourceAccess = canAccess(requiredResource, requiredAction);
  const hasDepartmentAccess = department ? canAccessDepartment(department) : true;

  const hasAccess = hasRoleAccess && hasResourceAccess && hasDepartmentAccess;

  if (!hasAccess) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="mx-4 w-full max-w-md rounded-lg bg-white p-8 shadow-md">
          <div className="text-center">
            <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-red-100">
              <svg className="size-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="mb-2 text-xl font-semibold text-gray-900">
              Access Denied
            </h2>
            <p className="mb-4 text-gray-600">
              You don't have permission to access this page. Please contact your administrator if you believe this is an error.
            </p>
            <div className="text-sm text-gray-500">
              <p>
                Required role:
                <span className="font-medium">{requiredRole}</span>
              </p>
              {department && (
                <p>
                  Required department:
                  <span className="font-medium">{department}</span>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

// Utility component for showing role-based content
type RoleBasedContentProps = {
  children: ReactNode;
  allowedRoles: HospitalRole[];
  fallback?: ReactNode;
};

export const RoleBasedContent: React.FC<RoleBasedContentProps> = ({
  children,
  allowedRoles,
  fallback = null,
}) => {
  const { userRole, isLoaded } = useHospitalPermissions();

  if (!isLoaded) {
    return <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />;
  }

  if (!userRole || !allowedRoles.includes(userRole)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

export default AccessControl;
