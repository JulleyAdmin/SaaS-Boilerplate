'use client';

import {
  Activity,
  AlertTriangle,
  BarChart3,
  Building,
  Database,
  DollarSign,
  FileText,
  MapPin,
  Settings,
  Share2,
  Shield,
  TrendingUp,
  UserCog,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { useMemo } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
// Mock data imports
import {
  generateHospitalStaff,
  randomDecimal,
  randomInt,
} from '@/mocks/hms';

/**
 * Admin Dashboard Component
 * Shows hospital-wide metrics and administrative controls
 */
export function AdminDashboard() {
  // Generate mock data
  const mockData = useMemo(() => {
    const { statistics: staffStats } = generateHospitalStaff('clinic-1');
    const monthlyRevenue = 7500000; // Fixed value to avoid hydration mismatch
    const monthlyExpenses = 5000000; // Fixed value to avoid hydration mismatch
    const profit = monthlyRevenue - monthlyExpenses;
    const profitMargin = (profit / monthlyRevenue) * 100;

    return {
      staffStats,
      financials: {
        monthlyRevenue,
        monthlyExpenses,
        profit,
        profitMargin,
        pendingPayments: 950000, // Fixed value to avoid hydration mismatch
        outstandingClaims: 450000, // Fixed value to avoid hydration mismatch
      },
      operations: {
        bedOccupancy: 75, // Fixed value to avoid hydration mismatch
        emergencyCapacity: 80, // Fixed value to avoid hydration mismatch
        icuOccupancy: 70, // Fixed value to avoid hydration mismatch
        avgPatientStay: randomDecimal(3, 7, 1),
      },
      compliance: {
        licenseRenewal: 90, // Fixed value to avoid hydration mismatch (days)
        accreditationStatus: 'Active',
        lastAudit: '2024-01-15',
        complianceScore: 92, // Fixed value to avoid hydration mismatch
      },
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Financial Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹
              {(mockData.financials.monthlyRevenue / 100000).toFixed(1)}
              L
            </div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline size-3 text-green-600" />
              {' '}
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
            <BarChart3 className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockData.financials.profitMargin.toFixed(1)}
              %
            </div>
            <Progress value={mockData.financials.profitMargin} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
            <Users className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockData.staffStats.totalStaff}</div>
            <p className="text-xs text-muted-foreground">
              {mockData.staffStats.activeStaff}
              {' '}
              active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bed Occupancy</CardTitle>
            <Building className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockData.operations.bedOccupancy}
              %
            </div>
            <p className="text-xs text-muted-foreground">
              Avg stay:
              {' '}
              {mockData.operations.avgPatientStay}
              {' '}
              days
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-7">
        {/* Department Performance */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Department Performance</CardTitle>
            <CardDescription>Key metrics by department</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: 'Emergency', occupancy: 85, revenue: 1250000, patients: 450 },
                { name: 'Cardiology', occupancy: 78, revenue: 2100000, patients: 120 },
                { name: 'General Medicine', occupancy: 82, revenue: 1800000, patients: 380 },
                { name: 'Surgery', occupancy: 70, revenue: 3200000, patients: 95 },
                { name: 'Pediatrics', occupancy: 65, revenue: 950000, patients: 210 },
              ].map(dept => (
                <div key={dept.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{dept.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {dept.patients}
                        {' '}
                        patients • ₹
                        {(dept.revenue / 100000).toFixed(1)}
                        L revenue
                      </p>
                    </div>
                    <Badge variant="outline">
                      {dept.occupancy}
                      %
                    </Badge>
                  </div>
                  <Progress value={dept.occupancy} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions & Alerts */}
        <div className="space-y-6 lg:col-span-3">
          {/* Administrative Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Administrative Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2">
              <Button className="justify-start" variant="outline" asChild>
                <Link href="/dashboard/staff-management">
                  <UserCog className="mr-2 size-4" />
                  Staff Management
                </Link>
              </Button>
              <Button className="justify-start" variant="outline" asChild>
                <Link href="/dashboard/financial-reports">
                  <FileText className="mr-2 size-4" />
                  Financial Reports
                </Link>
              </Button>
              <Button className="justify-start" variant="outline" asChild>
                <Link href="/dashboard/compliance">
                  <Shield className="mr-2 size-4" />
                  Compliance & Audit
                </Link>
              </Button>
              <Button className="justify-start" variant="outline" asChild>
                <Link href="/dashboard/system-settings">
                  <Settings className="mr-2 size-4" />
                  System Settings
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Analytics Navigation */}
          <Card>
            <CardHeader>
              <CardTitle>Analytics & Insights</CardTitle>
              <CardDescription>Marketing and operational analytics</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-2">
              <Button className="justify-start" variant="outline" asChild>
                <Link href="/dashboard/analytics/geographical">
                  <MapPin className="mr-2 size-4" />
                  Patient Location Analytics
                </Link>
              </Button>
              <Button className="justify-start" variant="outline" asChild>
                <Link href="/dashboard/analytics/referrals">
                  <Share2 className="mr-2 size-4" />
                  Referral Analytics
                </Link>
              </Button>
              <Button className="justify-start" variant="outline" asChild>
                <Link href="/dashboard/analytics/marketing">
                  <TrendingUp className="mr-2 size-4" />
                  Marketing Intelligence
                </Link>
              </Button>
              <Button className="justify-start" variant="outline" asChild>
                <Link href="/dashboard/analytics/operational">
                  <BarChart3 className="mr-2 size-4" />
                  Operational Metrics
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Critical Alerts */}
          <Card>
            <CardHeader>
              <CardTitle>Critical Alerts</CardTitle>
              <CardDescription>Requires immediate attention</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="mt-0.5 size-5 text-amber-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">License Renewal Due</p>
                  <p className="text-xs text-muted-foreground">
                    Hospital license expires in
                    {' '}
                    {mockData.compliance.licenseRenewal}
                    {' '}
                    days
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <AlertTriangle className="mt-0.5 size-5 text-red-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Low Medicine Stock</p>
                  <p className="text-xs text-muted-foreground">
                    15 critical medicines below reorder level
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <AlertTriangle className="mt-0.5 size-5 text-amber-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Pending Insurance Claims</p>
                  <p className="text-xs text-muted-foreground">
                    ₹
                    {(mockData.financials.outstandingClaims / 100000).toFixed(1)}
                    L in pending claims
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* System Health */}
          <Card>
            <CardHeader>
              <CardTitle>System Health</CardTitle>
              <CardDescription>Infrastructure status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Activity className="size-4 text-green-500" />
                  <span className="text-sm">Server Status</span>
                </div>
                <Badge variant="outline" className="bg-green-50">Healthy</Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Database className="size-4 text-blue-500" />
                  <span className="text-sm">Database Usage</span>
                </div>
                <span className="text-sm font-medium">67%</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Shield className="size-4 text-green-500" />
                  <span className="text-sm">Security Status</span>
                </div>
                <Badge variant="outline" className="bg-green-50">Secure</Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Activity className="size-4 text-blue-500" />
                  <span className="text-sm">API Uptime</span>
                </div>
                <span className="text-sm font-medium">99.9%</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Staff Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Staff Distribution</CardTitle>
          <CardDescription>Breakdown by category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              { category: 'Medical', count: mockData.staffStats.byCategory.medical, color: 'text-blue-600' },
              { category: 'Nursing', count: mockData.staffStats.byCategory.nursing, color: 'text-green-600' },
              { category: 'Administrative', count: mockData.staffStats.byCategory.administrative, color: 'text-purple-600' },
              { category: 'Support Services', count: mockData.staffStats.byCategory.supportServices, color: 'text-orange-600' },
            ].map(item => (
              <div key={item.category} className="text-center">
                <p className={`text-3xl font-bold ${item.color}`}>{item.count}</p>
                <p className="text-sm text-muted-foreground">{item.category}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
