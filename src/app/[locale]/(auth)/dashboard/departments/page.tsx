'use client';

import { Bed, Building2, Filter, Plus, Search, Settings, Stethoscope, Users } from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function DepartmentsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const departments = [
    {
      departmentId: 'DEPT-001',
      name: 'Cardiology',
      head: 'Dr. Sarah Wilson',
      location: 'Block A, Floor 3',
      totalStaff: 24,
      activeStaff: 18,
      totalBeds: 20,
      occupiedBeds: 16,
      equipment: ['ECG Machines', 'Holter Monitors', 'Stress Test Equipment'],
      specialties: ['Interventional Cardiology', 'Electrophysiology', 'Heart Failure'],
      status: 'active',
      emergencyContact: '+91-9876543210',
    },
    {
      departmentId: 'DEPT-002',
      name: 'Orthopedics',
      head: 'Dr. Michael Brown',
      location: 'Block B, Floor 2',
      totalStaff: 32,
      activeStaff: 28,
      totalBeds: 25,
      occupiedBeds: 22,
      equipment: ['X-Ray Machines', 'MRI Scanner', 'Arthroscopy Equipment'],
      specialties: ['Joint Replacement', 'Sports Medicine', 'Spine Surgery'],
      status: 'active',
      emergencyContact: '+91-9876543211',
    },
    {
      departmentId: 'DEPT-003',
      name: 'Pediatrics',
      head: 'Dr. Priya Sharma',
      location: 'Block C, Floor 1',
      totalStaff: 28,
      activeStaff: 24,
      totalBeds: 30,
      occupiedBeds: 18,
      equipment: ['Pediatric Ventilators', 'Incubators', 'Neonatal Monitors'],
      specialties: ['Neonatology', 'Pediatric Cardiology', 'Child Development'],
      status: 'active',
      emergencyContact: '+91-9876543212',
    },
    {
      departmentId: 'DEPT-004',
      name: 'Emergency Medicine',
      head: 'Dr. Ravi Kumar',
      location: 'Block A, Ground Floor',
      totalStaff: 40,
      activeStaff: 35,
      totalBeds: 15,
      occupiedBeds: 12,
      equipment: ['Trauma Beds', 'Ventilators', 'Defibrillators', 'Portable X-Ray'],
      specialties: ['Trauma Care', 'Critical Care', 'Emergency Surgery'],
      status: 'active',
      emergencyContact: '+91-9876543213',
    },
    {
      departmentId: 'DEPT-005',
      name: 'Pathology',
      head: 'Dr. Anjali Singh',
      location: 'Block D, Basement',
      totalStaff: 16,
      activeStaff: 14,
      totalBeds: 0,
      occupiedBeds: 0,
      equipment: ['Microscopes', 'Centrifuges', 'Automated Analyzers'],
      specialties: ['Clinical Pathology', 'Histopathology', 'Microbiology'],
      status: 'maintenance',
      emergencyContact: '+91-9876543214',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'maintenance':
        return 'warning';
      case 'closed':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getOccupancyColor = (percentage: number) => {
    if (percentage >= 90) {
      return 'destructive';
    }
    if (percentage >= 75) {
      return 'warning';
    }
    return 'default';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Departments</h1>
          <p className="text-muted-foreground">
            Manage hospital departments, staff allocation, and resource planning
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Settings className="mr-2 size-4" />
            Department Settings
          </Button>
          <Button>
            <Plus className="mr-2 size-4" />
            Add Department
          </Button>
        </div>
      </div>

      {/* Department Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Departments</CardTitle>
            <Building2 className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15</div>
            <p className="text-xs text-muted-foreground">
              Active departments
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
            <Users className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">847</div>
            <p className="text-xs text-muted-foreground">
              Healthcare professionals
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Beds</CardTitle>
            <Bed className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">450</div>
            <p className="text-xs text-muted-foreground">
              Hospital capacity
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bed Occupancy</CardTitle>
            <Stethoscope className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78%</div>
            <p className="text-xs text-muted-foreground">
              Current occupancy rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Department Management */}
      <Card>
        <CardHeader>
          <CardTitle>Department Overview</CardTitle>
          <CardDescription>
            Monitor department status, staffing, and resource allocation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
              <Input
                placeholder="Search departments..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="mr-2 size-4" />
              Filters
            </Button>
            <Button variant="outline">
              <Building2 className="mr-2 size-4" />
              Floor Plan
            </Button>
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="staffing">Staffing</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="mt-6">
              <div className="space-y-4">
                {departments.map(dept => (
                  <div key={dept.departmentId} className="rounded-lg border p-6">
                    <div className="mb-4 flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-medium">{dept.name}</h3>
                          <Badge variant={getStatusColor(dept.status) as any}>
                            {dept.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{dept.departmentId}</p>
                        <p className="text-sm text-muted-foreground">
                          Head:
                          {' '}
                          {dept.head}
                          {' '}
                          • Location:
                          {' '}
                          {dept.location}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Emergency Contact:
                          {' '}
                          {dept.emergencyContact}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">View Details</Button>
                        <Button size="sm">Manage</Button>
                      </div>
                    </div>

                    {/* Department Metrics */}
                    <div className="mb-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                      <div className="rounded-md bg-muted p-3">
                        <p className="mb-1 text-sm font-medium text-muted-foreground">Staff</p>
                        <p className="font-bold">
                          {dept.activeStaff}
                          {' '}
                          /
                          {' '}
                          {dept.totalStaff}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {Math.round((dept.activeStaff / dept.totalStaff) * 100)}
                          % active
                        </p>
                      </div>

                      {dept.totalBeds > 0 && (
                        <div className="rounded-md bg-muted p-3">
                          <p className="mb-1 text-sm font-medium text-muted-foreground">Beds</p>
                          <p className="font-bold">
                            {dept.occupiedBeds}
                            {' '}
                            /
                            {' '}
                            {dept.totalBeds}
                          </p>
                          <Badge
                            variant={getOccupancyColor((dept.occupiedBeds / dept.totalBeds) * 100) as any}
                            className="text-xs"
                          >
                            {Math.round((dept.occupiedBeds / dept.totalBeds) * 100)}
                            % occupied
                          </Badge>
                        </div>
                      )}

                      <div className="rounded-md bg-muted p-3">
                        <p className="mb-1 text-sm font-medium text-muted-foreground">Specialties</p>
                        <p className="font-bold">{dept.specialties.length}</p>
                        <p className="text-xs text-muted-foreground">Service areas</p>
                      </div>

                      <div className="rounded-md bg-muted p-3">
                        <p className="mb-1 text-sm font-medium text-muted-foreground">Equipment</p>
                        <p className="font-bold">{dept.equipment.length}</p>
                        <p className="text-xs text-muted-foreground">Major equipment</p>
                      </div>
                    </div>

                    {/* Specialties */}
                    <div className="mb-4">
                      <h4 className="mb-2 text-sm font-medium">Specialties:</h4>
                      <div className="flex flex-wrap gap-2">
                        {dept.specialties.map((specialty, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Equipment */}
                    <div>
                      <h4 className="mb-2 text-sm font-medium">Key Equipment:</h4>
                      <div className="flex flex-wrap gap-2">
                        {dept.equipment.map((item, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {item}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
