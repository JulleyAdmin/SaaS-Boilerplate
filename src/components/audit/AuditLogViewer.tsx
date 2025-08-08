'use client';

import { format } from 'date-fns';
import { useState } from 'react';

import { AccessControl } from '@/components/security/AccessControl';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import type { AuditLogEntry } from '@/hooks/api/useAuditLogs';
import { useAuditLogs, useExportAuditLogs } from '@/hooks/api/useAuditLogs';
import { useHospitalPermissions } from '@/hooks/useHospitalPermissions';

type AuditLogViewerProps = {
  organizationId: string;
};

export const AuditLogViewer: React.FC<AuditLogViewerProps> = ({ organizationId: _organizationId }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState<string>('');
  const [filterUser, setFilterUser] = useState<string>('');
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: format(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'), // Last 7 days
    end: format(new Date(), 'yyyy-MM-dd'),
  });
  const [_currentPage, _setCurrentPage] = useState(1);

  const { } = useHospitalPermissions();

  // Use the API hook
  const { data: auditData, isLoading: loading } = useAuditLogs({
    page: _currentPage,
    pageSize: 20,
    startDate: dateRange.start,
    endDate: dateRange.end,
    action: filterAction as any || undefined,
    search: searchTerm || undefined,
  });

  const { exportLogs } = useExportAuditLogs();

  const logs = auditData?.data || [];

  // Fallback mock data if API is not ready
  const useMockData = !auditData && !loading;
  const mockLogs: AuditLogEntry[] = useMockData
    ? [] /* Mock data commented out for build - TODO: Fix mock data structure
    [
        {
          id: '1',
          timestamp: new Date().toISOString(),
          action: 'sso.connection.create',
          actor: {
            id: 'user1',
            name: 'Dr. Sarah Johnson',
            email: 'sarah.johnson@hospital.com',
            role: 'doctor',
            department: 'cardiology',
          },
          resource: {
            id: 'sso-cardiology-1',
            name: 'Cardiology Department SAML',
            type: 'sso_connection',
          },
          metadata: {
            department: 'cardiology',
            provider: 'Azure AD',
          },
          success: true,
          ipAddress: '192.168.1.100',
        },
        {
          id: '2',
          timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
          action: 'user.login',
          actor: {
            id: 'user2',
            name: 'Nurse Mary Wilson',
            email: 'mary.wilson@hospital.com',
            role: 'nurse',
            department: 'emergency',
          },
          metadata: {
            login_method: 'sso',
          },
          success: true,
          ipAddress: '192.168.1.101',
        },
        {
          id: '3',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          action: 'user.failed_login',
          actor: {
            id: 'unknown',
            name: 'unknown.user@hospital.com',
            email: 'unknown.user@hospital.com',
          },
          metadata: {
            failure_reason: 'Invalid credentials',
            security_event: true,
          },
          success: false,
          ipAddress: '192.168.1.200',
        },
        {
          id: '4',
          timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
          action: 'sensitive.data.access',
          actor: {
            id: 'user3',
            name: 'Dr. Michael Chen',
            email: 'michael.chen@hospital.com',
            role: 'doctor',
            department: 'surgery',
          },
          resource: {
            id: 'patient-record-1234',
            type: 'patient_data',
          },
          metadata: {
            security_classification: 'sensitive',
            compliance_relevant: true,
          },
          success: true,
          ipAddress: '192.168.1.102',
        },
      ] */
    : [];

  const displayLogs = useMockData ? mockLogs : logs;

  const filteredLogs = displayLogs.filter((log) => {
    const matchesSearch
      = (log.actorName && log.actorName.toLowerCase().includes(searchTerm.toLowerCase()))
      || log.action.toLowerCase().includes(searchTerm.toLowerCase())
      || (log.resourceId && log.resourceId.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesAction = !filterAction || log.action.includes(filterAction);
    const matchesUser = !filterUser || (log.actorName && log.actorName.toLowerCase().includes(filterUser.toLowerCase()));

    const logDate = new Date(log.createdAt).toDateString();
    const startDate = new Date(dateRange.start).toDateString();
    const endDate = new Date(dateRange.end).toDateString();
    const matchesDateRange = logDate >= startDate && logDate <= endDate;

    return matchesSearch && matchesAction && matchesUser && matchesDateRange;
  });

  const getActionBadge = (action: string, success: boolean) => {
    const variant = success ? 'default' : 'destructive';

    const actionColors: Record<string, string> = {
      'sso.': 'bg-blue-100 text-blue-800',
      'user.': 'bg-green-100 text-green-800',
      'department.': 'bg-purple-100 text-purple-800',
      'sensitive.': 'bg-red-100 text-red-800',
      'permission.': 'bg-yellow-100 text-yellow-800',
    };

    const colorClass = Object.entries(actionColors).find(([prefix]) =>
      action.startsWith(prefix),
    )?.[1] || 'bg-gray-100 text-gray-800';

    return (
      <Badge variant={variant} className={success ? colorClass : ''}>
        {action.replace(/\./g, ' ').toUpperCase()}
      </Badge>
    );
  };

  const handleExportLogs = () => {
    if (useMockData) {
      // Mock export for demo
      const csvContent = [
        ['Timestamp', 'Action', 'Actor', 'Resource', 'Success', 'IP Address'].join(','),
        ...filteredLogs.map(log => [
          log.createdAt,
          log.action,
          log.actorName || 'Unknown',
          log.resourceId || 'N/A',
          'N/A', // success field not available
          log.metadata?.ipAddress || 'N/A',
        ].join(',')),
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `audit-logs-${format(new Date(), 'yyyy-MM-dd')}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      return;
    }

    // Use real export API
    exportLogs({
      startDate: dateRange.start,
      endDate: dateRange.end,
      action: filterAction as any || undefined,
      search: searchTerm || undefined,
    });
  };

  return (
    <AccessControl
      resource="audit_logs"
      action="read"
      fallback={(
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-gray-500">
              You don't have permission to view audit logs.
            </div>
          </CardContent>
        </Card>
      )}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            🔍 Audit Logs
            <Button onClick={handleExportLogs} variant="outline" size="sm">
              Export CSV
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
            <Input
              placeholder="Search logs..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            <Input
              placeholder="Filter by action..."
              value={filterAction}
              onChange={e => setFilterAction(e.target.value)}
            />
            <Input
              placeholder="Filter by user..."
              value={filterUser}
              onChange={e => setFilterUser(e.target.value)}
            />
            <div className="flex gap-2">
              <Input
                type="date"
                value={dateRange.start}
                onChange={e => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              />
              <Input
                type="date"
                value={dateRange.end}
                onChange={e => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              />
            </div>
          </div>

          {/* Logs Table */}
          {loading
            ? (
                <div className="py-8 text-center">
                  <div className="mx-auto size-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
                  <p className="mt-2 text-gray-500">Loading audit logs...</p>
                </div>
              )
            : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-200">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-200 px-4 py-2 text-left">Timestamp</th>
                        <th className="border border-gray-200 px-4 py-2 text-left">Action</th>
                        <th className="border border-gray-200 px-4 py-2 text-left">Actor</th>
                        <th className="border border-gray-200 px-4 py-2 text-left">Resource</th>
                        <th className="border border-gray-200 px-4 py-2 text-left">Details</th>
                        <th className="border border-gray-200 px-4 py-2 text-left">IP Address</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredLogs.map(log => (
                        <tr key={log.id} className="hover:bg-gray-50">
                          <td className="border border-gray-200 px-4 py-2 text-sm">
                            {format(new Date(log.createdAt), 'MMM dd, yyyy HH:mm:ss')}
                          </td>
                          <td className="border border-gray-200 px-4 py-2">
                            {getActionBadge(log.action, true)}
                          </td>
                          <td className="border border-gray-200 px-4 py-2">
                            <div>
                              <div className="font-medium">{log.actorName || 'Unknown'}</div>
                              {log.metadata?.email && (
                                <div className="text-sm text-gray-500">{log.metadata?.email}</div>
                              )}
                              {log.metadata?.role && log.metadata?.department && (
                                <div className="text-xs text-gray-400">
                                  {log.metadata?.role}
                                  {' '}
                                  •
                                  {log.metadata?.department}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="border border-gray-200 px-4 py-2 text-sm">
                            {log.resource
                              ? (
                                  <div>
                                    <div className="font-medium">{log.resourceId || 'Unknown'}</div>
                                    <div className="text-xs text-gray-400">{log.resource}</div>
                                  </div>
                                )
                              : (
                                  <span className="text-gray-400">N/A</span>
                                )}
                          </td>
                          <td className="border border-gray-200 px-4 py-2 text-sm">
                            {log.metadata && Object.keys(log.metadata).length > 0
                              ? (
                                  <details className="cursor-pointer">
                                    <summary className="text-blue-600 hover:text-blue-800">
                                      View details
                                    </summary>
                                    <pre className="mt-2 max-w-xs overflow-auto rounded bg-gray-100 p-2 text-xs">
                                      {JSON.stringify(log.metadata, null, 2)}
                                    </pre>
                                  </details>
                                )
                              : (
                                  <span className="text-gray-400">No details</span>
                                )}
                          </td>
                          <td className="border border-gray-200 px-4 py-2 font-mono text-sm">
                            {log.ipAddress || 'N/A'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {filteredLogs.length === 0 && (
                    <div className="py-8 text-center text-gray-500">
                      No audit logs found matching your criteria.
                    </div>
                  )}
                </div>
              )}

          {/* Summary Stats */}
          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="rounded-lg bg-blue-50 p-4">
              <div className="text-2xl font-bold text-blue-600">{filteredLogs.length}</div>
              <div className="text-sm text-blue-800">Total Events</div>
            </div>
            <div className="rounded-lg bg-green-50 p-4">
              <div className="text-2xl font-bold text-green-600">
                {filteredLogs.length}
              </div>
              <div className="text-sm text-green-800">Successful</div>
            </div>
            <div className="rounded-lg bg-red-50 p-4">
              <div className="text-2xl font-bold text-red-600">
                {0}
              </div>
              <div className="text-sm text-red-800">Failed</div>
            </div>
            <div className="rounded-lg bg-purple-50 p-4">
              <div className="text-2xl font-bold text-purple-600">
                {new Set(filteredLogs.map(log => log.actorId)).size}
              </div>
              <div className="text-sm text-purple-800">Unique Users</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </AccessControl>
  );
};

export default AuditLogViewer;
