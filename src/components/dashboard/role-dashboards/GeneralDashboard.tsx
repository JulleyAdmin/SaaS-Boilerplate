'use client';

import { useUser } from '@clerk/nextjs';
import {
  Activity,
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  HelpCircle,
  Home,
  Settings,
  User,
  Users,
} from 'lucide-react';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * General Dashboard Component
 * Default dashboard for support staff and other roles
 */
export function GeneralDashboard() {
  const { user } = useUser();
  const userRole = user?.publicMetadata?.role as string || 'Support Staff';

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <Card>
        <CardHeader>
          <CardTitle>Welcome to Hospital Management System</CardTitle>
          <CardDescription>
            You are logged in as
            {' '}
            {userRole.replace('-', ' ')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Access your assigned modules and tasks from the navigation menu. If you need additional
            permissions, please contact your supervisor or the IT department.
          </p>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Date</CardTitle>
            <Calendar className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Date().toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
              })}
            </div>
            <p className="text-xs text-muted-foreground">
              {new Date().toLocaleDateString('en-IN', {
                weekday: 'long',
                year: 'numeric',
              })}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Time</CardTitle>
            <Clock className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Date().toLocaleTimeString('en-IN', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </div>
            <p className="text-xs text-muted-foreground">
              IST (UTC+5:30)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hospital Status</CardTitle>
            <Activity className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Active</div>
            <p className="text-xs text-muted-foreground">
              All systems operational
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Your Department</CardTitle>
            <Users className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Support</div>
            <p className="text-xs text-muted-foreground">
              General Services
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Available Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Available Actions</CardTitle>
            <CardDescription>Common tasks for your role</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            <Button className="justify-start" variant="outline" asChild>
              <Link href="/dashboard/profile">
                <User className="mr-2 size-4" />
                View Profile
              </Link>
            </Button>
            <Button className="justify-start" variant="outline" asChild>
              <Link href="/dashboard/schedule">
                <Calendar className="mr-2 size-4" />
                My Schedule
              </Link>
            </Button>
            <Button className="justify-start" variant="outline" asChild>
              <Link href="/dashboard/tasks">
                <CheckCircle className="mr-2 size-4" />
                My Tasks
              </Link>
            </Button>
            <Button className="justify-start" variant="outline" asChild>
              <Link href="/dashboard/documents">
                <FileText className="mr-2 size-4" />
                Documents
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Help & Resources */}
        <Card>
          <CardHeader>
            <CardTitle>Help & Resources</CardTitle>
            <CardDescription>Get assistance and learn more</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <HelpCircle className="mt-0.5 size-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">User Guide</p>
                  <p className="text-xs text-muted-foreground">
                    Learn how to use the system effectively
                  </p>
                  <Button variant="link" size="sm" className="h-auto px-0" asChild>
                    <Link href="/help/user-guide">View Guide</Link>
                  </Button>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Settings className="mt-0.5 size-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">System Settings</p>
                  <p className="text-xs text-muted-foreground">
                    Customize your preferences
                  </p>
                  <Button variant="link" size="sm" className="h-auto px-0" asChild>
                    <Link href="/dashboard/settings">Open Settings</Link>
                  </Button>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Home className="mt-0.5 size-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">IT Support</p>
                  <p className="text-xs text-muted-foreground">
                    Contact: ext. 1234 or it@hospital.com
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Announcements */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Announcements</CardTitle>
          <CardDescription>Important updates and notifications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <Badge variant="outline" className="mt-0.5">New</Badge>
              <div className="flex-1">
                <p className="text-sm font-medium">System Maintenance Scheduled</p>
                <p className="text-xs text-muted-foreground">
                  The system will undergo maintenance on Sunday, 2:00 AM - 4:00 AM IST
                </p>
                <p className="mt-1 text-xs text-muted-foreground">Posted 2 hours ago</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Badge variant="outline" className="mt-0.5">Info</Badge>
              <div className="flex-1">
                <p className="text-sm font-medium">New Training Module Available</p>
                <p className="text-xs text-muted-foreground">
                  Complete the infection control training by end of this month
                </p>
                <p className="mt-1 text-xs text-muted-foreground">Posted yesterday</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Badge variant="outline" className="mt-0.5">Update</Badge>
              <div className="flex-1">
                <p className="text-sm font-medium">COVID-19 Protocol Updates</p>
                <p className="text-xs text-muted-foreground">
                  Please review the updated safety protocols in the documents section
                </p>
                <p className="mt-1 text-xs text-muted-foreground">Posted 3 days ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
