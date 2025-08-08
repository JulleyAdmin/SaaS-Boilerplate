'use client';

import { Building, FileText, Plus, Search, Shield, Users } from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function GovernmentSchemesPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const schemes = [
    {
      id: 'CGHS-001',
      name: 'Central Government Health Scheme',
      description: 'Healthcare for central government employees and pensioners',
      eligibility: 'Central Government Employees',
      coverage: '₹5,00,000',
      status: 'Active',
      beneficiaries: 4250,
    },
    {
      id: 'AYUSH-001',
      name: 'Ayushman Bharat',
      description: 'Universal health coverage for economically vulnerable families',
      eligibility: 'Below Poverty Line families',
      coverage: '₹5,00,000',
      status: 'Active',
      beneficiaries: 12450,
    },
    {
      id: 'ESI-001',
      name: 'Employee State Insurance',
      description: 'Medical care and cash benefits for employees',
      eligibility: 'Private sector employees',
      coverage: '₹1,00,000',
      status: 'Active',
      beneficiaries: 8750,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'default';
      case 'inactive':
        return 'secondary';
      case 'pending':
        return 'warning';
      default:
        return 'outline';
    }
  };

  const filteredSchemes = schemes.filter(scheme =>
    scheme.name.toLowerCase().includes(searchQuery.toLowerCase())
    || scheme.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Government Schemes</h1>
          <p className="text-muted-foreground">
            Manage healthcare schemes, eligibility verification, and claim processing
          </p>
        </div>
        <Button>
          <Plus className="mr-2 size-4" />
          Add New Scheme
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Schemes</CardTitle>
            <Shield className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              Currently available
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Beneficiaries</CardTitle>
            <Users className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">25,450</div>
            <p className="text-xs text-muted-foreground">
              Enrolled patients
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Claims Processed</CardTitle>
            <FileText className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Coverage</CardTitle>
            <Building className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹127.5L</div>
            <p className="text-xs text-muted-foreground">
              Available benefits
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Schemes Management */}
      <Card>
        <CardHeader>
          <CardTitle>Healthcare Schemes</CardTitle>
          <CardDescription>
            Government and private healthcare schemes available for patients
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
              <Input
                placeholder="Search schemes by name or description..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Shield className="mr-2 size-4" />
              Verify Eligibility
            </Button>
          </div>

          <div className="space-y-4">
            {filteredSchemes.map(scheme => (
              <div key={scheme.id} className="rounded-lg border p-4">
                <div className="mb-4 flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{scheme.name}</h3>
                      <Badge variant={getStatusColor(scheme.status) as any}>
                        {scheme.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{scheme.id}</p>
                    <p className="text-sm">{scheme.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">View Details</Button>
                    <Button size="sm">Manage</Button>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-md bg-muted p-3">
                    <p className="mb-1 text-sm font-medium text-muted-foreground">Eligibility</p>
                    <p className="text-sm">{scheme.eligibility}</p>
                  </div>
                  <div className="rounded-md bg-muted p-3">
                    <p className="mb-1 text-sm font-medium text-muted-foreground">Coverage Amount</p>
                    <p className="text-sm font-bold">{scheme.coverage}</p>
                  </div>
                  <div className="rounded-md bg-muted p-3">
                    <p className="mb-1 text-sm font-medium text-muted-foreground">Beneficiaries</p>
                    <p className="text-sm font-bold">{scheme.beneficiaries.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Popular Schemes */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Most Used Schemes</CardTitle>
            <CardDescription>Top schemes by patient enrollment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Ayushman Bharat</span>
                <span className="text-sm font-medium">12,450 patients</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">ESI Scheme</span>
                <span className="text-sm font-medium">8,750 patients</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">CGHS</span>
                <span className="text-sm font-medium">4,250 patients</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Claims</CardTitle>
            <CardDescription>Latest scheme claim submissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Ayushman Bharat Claim</p>
                  <p className="text-xs text-muted-foreground">Patient: John Doe</p>
                </div>
                <Badge variant="secondary">Processing</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">CGHS Reimbursement</p>
                  <p className="text-xs text-muted-foreground">Patient: Jane Smith</p>
                </div>
                <Badge variant="default">Approved</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">ESI Medical Claim</p>
                  <p className="text-xs text-muted-foreground">Patient: Ram Kumar</p>
                </div>
                <Badge variant="default">Approved</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
