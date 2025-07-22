// Hospital-specific role-based access control system

export type HospitalRole = 'doctor' | 'nurse' | 'technician' | 'administrator' | 'viewer';

export type HospitalAction = 'create' | 'read' | 'update' | 'delete' | 'manage' | 'audit';

export type HospitalResource =
  // SSO Management
  | 'sso_connections'
  | 'sso_settings'

  // User Management
  | 'users'
  | 'roles'
  | 'departments'

  // Audit & Security
  | 'audit_logs'
  | 'security_settings'
  | 'account_lockouts'

  // Hospital Operations
  | 'patient_data'
  | 'medical_records'
  | 'department_settings'

  // System Administration
  | 'system_settings'
  | 'billing'
  | 'integrations';

export type HospitalPermission = {
  resource: HospitalResource;
  actions: HospitalAction[] | '*';
};

type HospitalRolePermissions = {
  [role in HospitalRole]: HospitalPermission[];
};

export const hospitalRoles = [
  {
    id: 'administrator' as const,
    name: 'Administrator',
    description: 'Full system access and management capabilities',
    level: 100,
  },
  {
    id: 'doctor' as const,
    name: 'Doctor',
    description: 'Medical staff with patient data access',
    level: 80,
  },
  {
    id: 'nurse' as const,
    name: 'Nurse',
    description: 'Nursing staff with limited patient access',
    level: 60,
  },
  {
    id: 'technician' as const,
    name: 'Technician',
    description: 'Technical staff with system access',
    level: 40,
  },
  {
    id: 'viewer' as const,
    name: 'Viewer',
    description: 'Read-only access to assigned areas',
    level: 20,
  },
];

export const hospitalPermissions: HospitalRolePermissions = {
  administrator: [
    // Full access to everything
    { resource: 'sso_connections', actions: '*' },
    { resource: 'sso_settings', actions: '*' },
    { resource: 'users', actions: '*' },
    { resource: 'roles', actions: '*' },
    { resource: 'departments', actions: '*' },
    { resource: 'audit_logs', actions: '*' },
    { resource: 'security_settings', actions: '*' },
    { resource: 'account_lockouts', actions: '*' },
    { resource: 'patient_data', actions: '*' },
    { resource: 'medical_records', actions: '*' },
    { resource: 'department_settings', actions: '*' },
    { resource: 'system_settings', actions: '*' },
    { resource: 'billing', actions: '*' },
    { resource: 'integrations', actions: '*' },
  ],

  doctor: [
    // SSO management for their department
    { resource: 'sso_connections', actions: ['read', 'create', 'update'] },
    { resource: 'sso_settings', actions: ['read'] },

    // User management limited
    { resource: 'users', actions: ['read', 'update'] },
    { resource: 'roles', actions: ['read'] },
    { resource: 'departments', actions: ['read'] },

    // Audit access
    { resource: 'audit_logs', actions: ['read'] },

    // Medical data access
    { resource: 'patient_data', actions: ['read', 'create', 'update'] },
    { resource: 'medical_records', actions: ['read', 'create', 'update'] },
    { resource: 'department_settings', actions: ['read', 'update'] },
  ],

  nurse: [
    // Limited SSO access
    { resource: 'sso_connections', actions: ['read'] },
    { resource: 'sso_settings', actions: ['read'] },

    // User management - read only
    { resource: 'users', actions: ['read'] },
    { resource: 'roles', actions: ['read'] },
    { resource: 'departments', actions: ['read'] },

    // Limited medical access
    { resource: 'patient_data', actions: ['read', 'update'] },
    { resource: 'medical_records', actions: ['read'] },
    { resource: 'department_settings', actions: ['read'] },
  ],

  technician: [
    // SSO technical management
    { resource: 'sso_connections', actions: ['read', 'create', 'update'] },
    { resource: 'sso_settings', actions: ['read', 'update'] },

    // User management
    { resource: 'users', actions: ['read', 'create', 'update'] },
    { resource: 'roles', actions: ['read'] },
    { resource: 'departments', actions: ['read'] },

    // Security and audit
    { resource: 'audit_logs', actions: ['read'] },
    { resource: 'security_settings', actions: ['read', 'update'] },
    { resource: 'account_lockouts', actions: ['read', 'update'] },

    // System access
    { resource: 'system_settings', actions: ['read', 'update'] },
    { resource: 'integrations', actions: ['read', 'update'] },
  ],

  viewer: [
    // Read-only access to basic information
    { resource: 'sso_connections', actions: ['read'] },
    { resource: 'users', actions: ['read'] },
    { resource: 'departments', actions: ['read'] },
    { resource: 'audit_logs', actions: ['read'] },
  ],
};

export class HospitalAccessControl {
  /**
   * Check if a user with given role can perform an action on a resource
   */
  static canAccess(
    userRole: HospitalRole,
    resource: HospitalResource,
    action: HospitalAction,
  ): boolean {
    const permissions = hospitalPermissions[userRole];

    if (!permissions) {
      return false;
    }

    const resourcePermission = permissions.find(p => p.resource === resource);

    if (!resourcePermission) {
      return false;
    }

    // Check for wildcard permission
    if (resourcePermission.actions === '*') {
      return true;
    }

    // Check specific action
    return resourcePermission.actions.includes(action);
  }

  /**
   * Get all permissions for a role
   */
  static getRolePermissions(role: HospitalRole): HospitalPermission[] {
    return hospitalPermissions[role] || [];
  }

  /**
   * Check if role has sufficient level for action
   */
  static hasMinimumRole(userRole: HospitalRole, minimumRole: HospitalRole): boolean {
    const userLevel = hospitalRoles.find(r => r.id === userRole)?.level || 0;
    const minimumLevel = hospitalRoles.find(r => r.id === minimumRole)?.level || 0;

    return userLevel >= minimumLevel;
  }

  /**
   * Get allowed actions for a resource
   */
  static getAllowedActions(
    userRole: HospitalRole,
    resource: HospitalResource,
  ): HospitalAction[] {
    const permissions = hospitalPermissions[userRole];
    const resourcePermission = permissions?.find(p => p.resource === resource);

    if (!resourcePermission) {
      return [];
    }

    if (resourcePermission.actions === '*') {
      return ['create', 'read', 'update', 'delete', 'manage', 'audit'];
    }

    return resourcePermission.actions;
  }

  /**
   * Department-based access control
   */
  static canAccessDepartment(
    userRole: HospitalRole,
    userDepartment: string,
    targetDepartment: string,
  ): boolean {
    // Administrators can access all departments
    if (userRole === 'administrator') {
      return true;
    }

    // Users can access their own department
    if (userDepartment === targetDepartment) {
      return true;
    }

    // Doctors can access related departments
    if (userRole === 'doctor') {
      const relatedDepartments = ['emergency', 'icu', 'general'];
      return relatedDepartments.includes(targetDepartment);
    }

    return false;
  }
}

// Type guards and utilities
export const isValidHospitalRole = (role: string): role is HospitalRole => {
  return hospitalRoles.some(r => r.id === role);
};

export const isValidHospitalResource = (resource: string): resource is HospitalResource => {
  const allResources: HospitalResource[] = [
    'sso_connections',
    'sso_settings',
    'users',
    'roles',
    'departments',
    'audit_logs',
    'security_settings',
    'account_lockouts',
    'patient_data',
    'medical_records',
    'department_settings',
    'system_settings',
    'billing',
    'integrations',
  ];
  return allResources.includes(resource as HospitalResource);
};

export const isValidHospitalAction = (action: string): action is HospitalAction => {
  const allActions: HospitalAction[] = ['create', 'read', 'update', 'delete', 'manage', 'audit'];
  return allActions.includes(action as HospitalAction);
};
