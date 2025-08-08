import { useQuery } from '@tanstack/react-query';

export type AuditLogEntry = {
  id: string;
  organizationId: string;
  actorId?: string;
  actorName?: string;
  action: string;
  crud: 'create' | 'read' | 'update' | 'delete' | 'emergency_access';
  resource: string;
  resourceId?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  ipAddress?: string;
  userAgent?: string;
};

export type AuditLogFilters = {
  startDate?: string;
  endDate?: string;
  action?: string;
  resource?: string;
  actorId?: string;
  limit?: number;
  offset?: number;
  page?: number;
  pageSize?: number;
  search?: string;
};

export const useAuditLogs = (filters: AuditLogFilters = {}) => {
  return useQuery({
    queryKey: ['auditLogs', filters],
    queryFn: async () => {
      const params = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });

      const response = await fetch(`/api/audit-logs?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch audit logs');
      }

      return response.json() as Promise<{
        data: AuditLogEntry[];
        pagination: {
          total: number;
          page: number;
          pageSize: number;
          totalPages: number;
        };
      }>;
    },
  });
};

export const useExportAuditLogs = () => {
  const exportLogs = async (filters: AuditLogFilters = {}) => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        params.append(key, value.toString());
      }
    });

    const response = await fetch(`/api/audit-logs/export?${params}`);
    if (!response.ok) {
      throw new Error('Failed to export audit logs');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return { exportLogs };
};
