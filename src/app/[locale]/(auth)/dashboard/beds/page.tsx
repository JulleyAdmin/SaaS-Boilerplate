'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarInitials } from '@/components/ui/avatar';
import { Bed, User, Clock, Search, Filter, AlertCircle, CheckCircle, UserPlus, Activity } from 'lucide-react';
import { useState } from 'react';

// Mock bed data
const bedData = [
  { 
    id: 'B001', 
    wardName: 'General Ward A', 
    bedNumber: '101', 
    status: 'occupied', 
    patientName: 'Rajesh Kumar', 
    patientId: 'P001',
    admissionDate: '2024-01-10',
    condition: 'Stable',
    nurseAssigned: 'Sister Mary',
    lastCheckup: '2 hours ago',
    roomType: 'General',
    floor: '1st Floor'
  },
  { 
    id: 'B002', 
    wardName: 'General Ward A', 
    bedNumber: '102', 
    status: 'available', 
    patientName: null, 
    patientId: null,
    admissionDate: null,
    condition: null,
    nurseAssigned: 'Sister Mary',
    lastCheckup: null,
    roomType: 'General',
    floor: '1st Floor'
  },
  { 
    id: 'B003', 
    wardName: 'ICU', 
    bedNumber: '201', 
    status: 'occupied', 
    patientName: 'Sunita Devi', 
    patientId: 'P003',
    admissionDate: '2024-01-12',
    condition: 'Critical',
    nurseAssigned: 'Sister Jane',
    lastCheckup: '30 minutes ago',
    roomType: 'ICU',
    floor: '2nd Floor'
  },
  { 
    id: 'B004', 
    wardName: 'Pediatric Ward', 
    bedNumber: '301', 
    status: 'occupied', 
    patientName: 'Baby Sharma', 
    patientId: 'P004',
    admissionDate: '2024-01-13',
    condition: 'Improving',
    nurseAssigned: 'Sister Priya',
    lastCheckup: '1 hour ago',
    roomType: 'Pediatric',
    floor: '3rd Floor'
  },
  { 
    id: 'B005', 
    wardName: 'General Ward B', 
    bedNumber: '103', 
    status: 'maintenance', 
    patientName: null, 
    patientId: null,
    admissionDate: null,
    condition: null,
    nurseAssigned: 'Sister Mary',
    lastCheckup: null,
    roomType: 'General',
    floor: '1st Floor'
  },
  { 
    id: 'B006', 
    wardName: 'Private Room', 
    bedNumber: '401', 
    status: 'occupied', 
    patientName: 'Amit Patel', 
    patientId: 'P006',
    admissionDate: '2024-01-11',
    condition: 'Stable',
    nurseAssigned: 'Sister Rita',
    lastCheckup: '45 minutes ago',
    roomType: 'Private',
    floor: '4th Floor'
  }
];

const wardSummary = {
  totalBeds: 45,
  occupied: 28,
  available: 12,
  maintenance: 5,
  occupancyRate: 75
};

export default function BedManagementPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [wardFilter, setWardFilter] = useState('all');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'occupied':
        return <Badge className="bg-red-500">Occupied</Badge>;
      case 'available':
        return <Badge className="bg-green-500">Available</Badge>;
      case 'maintenance':
        return <Badge variant="outline">Maintenance</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'Critical':
        return 'text-red-600 font-semibold';
      case 'Stable':
        return 'text-green-600';
      case 'Improving':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  const filteredBeds = bedData.filter(bed => {
    const matchesSearch = 
      bed.bedNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bed.wardName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (bed.patientName && bed.patientName.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || bed.status === statusFilter;
    const matchesWard = wardFilter === 'all' || bed.wardName === wardFilter;
    
    return matchesSearch && matchesStatus && matchesWard;
  });

  const wardNames = Array.from(new Set(bedData.map(bed => bed.wardName)));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bed Management</h1>
          <p className="text-muted-foreground">Monitor and manage hospital bed occupancy and patient assignments</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <UserPlus className="mr-2 size-4" />
            Assign Patient
          </Button>
          <Button>
            <Bed className="mr-2 size-4" />
            Add New Bed
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Beds</CardTitle>
            <Bed className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{wardSummary.totalBeds}</div>
            <p className="text-xs text-muted-foreground">Across all wards</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Occupied</CardTitle>
            <User className="size-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{wardSummary.occupied}</div>
            <p className="text-xs text-muted-foreground">Currently occupied</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
            <CheckCircle className="size-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{wardSummary.available}</div>
            <p className="text-xs text-muted-foreground">Ready for assignment</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Maintenance</CardTitle>
            <AlertCircle className="size-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{wardSummary.maintenance}</div>
            <p className="text-xs text-muted-foreground">Under maintenance</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
            <Activity className="size-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{wardSummary.occupancyRate}%</div>
            <p className="text-xs text-muted-foreground">Current utilization</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                <Input
                  placeholder="Search by bed number, ward, or patient name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="occupied">Occupied</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
            <Select value={wardFilter} onValueChange={setWardFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by ward" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Wards</SelectItem>
                {wardNames.map(ward => (
                  <SelectItem key={ward} value={ward}>{ward}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Bed Management */}
      <Tabs defaultValue="grid" className="space-y-4">
        <TabsList>
          <TabsTrigger value="grid">Grid View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>

        <TabsContent value="grid">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredBeds.map(bed => (
              <Card key={bed.id} className={`${bed.status === 'occupied' && bed.condition === 'Critical' ? 'border-red-500' : ''}`}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{bed.wardName}</CardTitle>
                      <CardDescription>Bed {bed.bedNumber} • {bed.roomType} • {bed.floor}</CardDescription>
                    </div>
                    {getStatusBadge(bed.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {bed.patientName ? (
                    <>
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarFallback>
                            <AvatarInitials name={bed.patientName} />
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{bed.patientName}</p>
                          <p className="text-sm text-muted-foreground">ID: {bed.patientId}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Condition:</span>
                          <span className={getConditionColor(bed.condition!)}>{bed.condition}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Admitted:</span>
                          <span>{bed.admissionDate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Nurse Assigned:</span>
                          <span>{bed.nurseAssigned}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Last Checkup:</span>
                          <span>{bed.lastCheckup}</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <User className="size-4 mr-1" />
                          View Patient
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <Clock className="size-4 mr-1" />
                          Transfer
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-4">
                      <div className="space-y-2">
                        <Bed className="size-12 mx-auto text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          {bed.status === 'available' ? 'Bed available for assignment' : 'Under maintenance'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Nurse: {bed.nurseAssigned}
                        </p>
                      </div>
                      {bed.status === 'available' && (
                        <Button size="sm" className="mt-3">
                          <UserPlus className="size-4 mr-1" />
                          Assign Patient
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>Bed Inventory</CardTitle>
              <CardDescription>Complete list of all hospital beds and their current status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredBeds.map(bed => (
                  <div key={bed.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Bed className="size-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium">{bed.wardName} - Bed {bed.bedNumber}</h4>
                          {getStatusBadge(bed.status)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {bed.patientName ? (
                            `${bed.patientName} • ${bed.condition} • Nurse: ${bed.nurseAssigned}`
                          ) : (
                            `${bed.roomType} Room • {bed.floor} • Nurse: ${bed.nurseAssigned}`
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {bed.patientName ? (
                        <>
                          <Button size="sm" variant="outline">View Patient</Button>
                          <Button size="sm" variant="outline">Transfer</Button>
                        </>
                      ) : bed.status === 'available' ? (
                        <Button size="sm">Assign Patient</Button>
                      ) : (
                        <Button size="sm" variant="outline">Schedule Maintenance</Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}