'use client';

import { Clock, Download, Eye, Filter, Search, Shield, User } from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function AuditLogsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  // Mock audit log data for demo
  const auditLogs = [
    {
      id: 'LOG-2024-001',
      timestamp: '2024-01-15 14:30:25',
      user: 'Dr. Sarah Wilson',
      action: 'Patient Record Accessed',
      resource: 'Patient P-12345 (John Doe)',
      ipAddress: '192.168.1.101',
      result: 'Success',
      details: 'Viewed patient medical history',
      severity: 'Info',
    },
    {
      id: 'LOG-2024-002',
      timestamp: '2024-01-15 14:25:18',
      user: 'Nurse Mary Johnson',
      action: 'Vital Signs Updated',
      resource: 'Patient P-12346 (Jane Smith)',
      ipAddress: '192.168.1.102',
      result: 'Success',
      details: 'Updated blood pressure and heart rate readings',
      severity: 'Info',
    },
    {
      id: 'LOG-2024-003',
      timestamp: '2024-01-15 14:20:45',
      user: 'Admin User',
      action: 'Failed Login Attempt',
      resource: 'Authentication System',
      ipAddress: '203.45.67.89',
      result: 'Failed',
      details: 'Multiple failed login attempts detected',
      severity: 'Warning',
    },
    {
      id: 'LOG-2024-004',
      timestamp: '2024-01-15 14:15:30',
      user: 'Dr. Michael Brown',
      action: 'Prescription Created',
      resource: 'Patient P-12347 (Ram Kumar)',
      ipAddress: '192.168.1.103',
      result: 'Success',
      details: 'Prescribed medication for diabetes management',
      severity: 'Info',
    },
    {
      id: 'LOG-2024-005',
      timestamp: '2024-01-15 14:10:12',
      user: 'System',
      action: 'Unauthorized Access Attempt',
      resource: 'Financial Records',
      ipAddress: '45.123.67.12',
      result: 'Blocked',
      details: 'Blocked attempt to access restricted financial data',
      severity: 'Critical',
    },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical':
        return 'destructive';
      case 'warning':
        return 'warning';
      case 'info':
        return 'default';
      default:
        return 'secondary';
    }
  };

  const getResultColor = (result: string) => {
    switch (result.toLowerCase()) {
      case 'success':
        return 'default';
      case 'failed':
        return 'destructive';
      case 'blocked':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const filteredLogs = auditLogs.filter(log =>
    log.user.toLowerCase().includes(searchQuery.toLowerCase())
    || log.action.toLowerCase().includes(searchQuery.toLowerCase())
    || log.resource.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Audit Logs</h1>
          <p className="text-muted-foreground">
            Monitor system activities, security events, and compliance tracking
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 size-4" />
            Export Logs
          </Button>
          <Button variant="outline">
            <Shield className="mr-2 size-4" />
            Security Report
          </Button>
        </div>
      </div>

      {/* Audit Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <Eye className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,847</div>
            <p className="text-xs text-muted-foreground">
              Last 24 hours
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Alerts</CardTitle>
            <Shield className="size-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              Require investigation
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed Logins</CardTitle>
            <User className="size-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground">
              Authentication failures
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
            <Clock className="size-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">124</div>
            <p className="text-xs text-muted-foreground">
              Currently active
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Audit Log Viewer */}
      <Card>
        <CardHeader>
          <CardTitle>System Audit Trail</CardTitle>
          <CardDescription>
            Comprehensive log of all system activities and security events
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
              <Input
                placeholder="Search audit logs by user, action, or resource..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="mr-2 size-4" />
              Advanced Filters
            </Button>
          </div>

          <Tabs defaultValue="all" className="w-full">
            <TabsList>
              <TabsTrigger value="all">All Events</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="access">Data Access</TabsTrigger>
              <TabsTrigger value="system">System Events</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Resource</TableHead>
                      <TableHead>IP Address</TableHead>
                      <TableHead>Result</TableHead>
                      <TableHead>Severity</TableHead>
                      <TableHead>Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLogs.map(log => (
                      <TableRow key={log.id}>
                        <TableCell className="font-mono text-xs">
                          {log.timestamp}
                        </TableCell>
                        <TableCell className="font-medium">
                          {log.user}
                        </TableCell>
                        <TableCell>{log.action}</TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {log.resource}
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          {log.ipAddress}
                        </TableCell>
                        <TableCell>
                          <Badge variant={getResultColor(log.result) as any}>
                            {log.result}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getSeverityColor(log.severity) as any}>
                            {log.severity}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {log.details}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Security Summary */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Security Events</CardTitle>
            <CardDescription>Critical and warning security alerts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {auditLogs
                .filter(log => log.severity === 'Critical' || log.severity === 'Warning')
                .slice(0, 3)
                .map(log => (
                  <div key={log.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{log.action}</p>
                      <p className="text-xs text-muted-foreground">{log.timestamp}</p>
                      <p className="text-xs text-muted-foreground">{log.details}</p>
                    </div>
                    <Badge variant={getSeverityColor(log.severity) as any}>
                      {log.severity}
                    </Badge>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Compliance Summary</CardTitle>
            <CardDescription>HIPAA and security compliance status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Data Access Logging</span>
                <Badge variant="default">Compliant</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Authentication Tracking</span>
                <Badge variant="default">Compliant</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Failed Access Monitoring</span>
                <Badge variant="default">Compliant</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Data Modification Logs</span>
                <Badge variant="default">Compliant</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Log Retention Policy</span>
                <Badge variant="default">Compliant</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
