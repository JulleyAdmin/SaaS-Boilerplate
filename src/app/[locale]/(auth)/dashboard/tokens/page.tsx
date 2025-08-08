'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Printer, Hash, Clock, Search, QrCode, Users, RefreshCw } from 'lucide-react';
import { useState } from 'react';

// Mock data
const departments = [
  { id: 'general', name: 'General Medicine', prefix: 'A', currentToken: 'A15', totalToday: 28 },
  { id: 'pediatrics', name: 'Pediatrics', prefix: 'P', currentToken: 'P12', totalToday: 15 },
  { id: 'cardiology', name: 'Cardiology', prefix: 'C', currentToken: 'C08', totalToday: 12 },
  { id: 'orthopedics', name: 'Orthopedics', prefix: 'O', currentToken: 'O21', totalToday: 18 },
  { id: 'dermatology', name: 'Dermatology', prefix: 'D', currentToken: 'D05', totalToday: 8 },
  { id: 'emergency', name: 'Emergency', prefix: 'E', currentToken: 'E07', totalToday: 22 },
];

const recentTokens = [
  { tokenNumber: 'A16', patientName: 'Rajesh Kumar', department: 'General Medicine', generatedAt: '2:45 PM', status: 'active' },
  { tokenNumber: 'P13', patientName: 'Baby Sharma', department: 'Pediatrics', generatedAt: '2:43 PM', status: 'active' },
  { tokenNumber: 'C09', patientName: 'Amit Singh', department: 'Cardiology', generatedAt: '2:40 PM', status: 'active' },
  { tokenNumber: 'A15', patientName: 'Sunita Devi', department: 'General Medicine', generatedAt: '2:38 PM', status: 'called' },
  { tokenNumber: 'O22', patientName: 'Mohammed Ali', department: 'Orthopedics', generatedAt: '2:35 PM', status: 'active' },
];

export default function TokenGenerationPage() {
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [appointmentType, setAppointmentType] = useState('walk-in');
  const [searchQuery, setSearchQuery] = useState('');
  const [generatedToken, setGeneratedToken] = useState<string | null>(null);

  const handleGenerateToken = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDepartment || !patientName) {
      return;
    }

    const dept = departments.find(d => d.id === selectedDepartment);
    if (dept) {
      // Generate next token number
      const currentNum = parseInt(dept.currentToken.slice(1));
      const nextToken = `${dept.prefix}${(currentNum + 1).toString().padStart(2, '0')}`;
      setGeneratedToken(nextToken);
      
      // Show success message and reset form
      setTimeout(() => {
        setGeneratedToken(null);
        setPatientName('');
        setPatientPhone('');
        setSelectedDepartment('');
      }, 5000);
    }
  };

  const filteredTokens = recentTokens.filter(token =>
    token.tokenNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    token.patientName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalTokensToday = departments.reduce((sum, dept) => sum + dept.totalToday, 0);
  const activeTokens = recentTokens.filter(token => token.status === 'active').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Token Generation</h1>
          <p className="text-muted-foreground">Generate and manage patient tokens for queue management</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <RefreshCw className="mr-2 size-4" />
            Refresh Status
          </Button>
          <Button variant="outline">
            <Printer className="mr-2 size-4" />
            Print Blank Tokens
          </Button>
        </div>
      </div>

      {/* Success Alert */}
      {generatedToken && (
        <Alert className="border-green-200 bg-green-50">
          <QrCode className="size-4" />
          <AlertDescription>
            <strong>Token Generated Successfully!</strong> Token number <strong>{generatedToken}</strong> has been generated. 
            Please print and hand over to the patient.
          </AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tokens Today</CardTitle>
            <Hash className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTokensToday}</div>
            <p className="text-xs text-muted-foreground">Across all departments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tokens</CardTitle>
            <Clock className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeTokens}</div>
            <p className="text-xs text-muted-foreground">Currently waiting</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Departments Active</CardTitle>
            <Users className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{departments.length}</div>
            <p className="text-xs text-muted-foreground">All departments operational</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Peak Department</CardTitle>
            <Users className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">General</div>
            <p className="text-xs text-muted-foreground">28 tokens today</p>
          </CardContent>
        </Card>
      </div>

      {/* Department Status */}
      <Card>
        <CardHeader>
          <CardTitle>Department Token Status</CardTitle>
          <CardDescription>Current token status for each department</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {departments.map(dept => (
              <div key={dept.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">{dept.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    Current: {dept.currentToken} • Today: {dept.totalToday}
                  </p>
                </div>
                <Badge variant="outline">{dept.prefix} Series</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="generate" className="space-y-4">
        <TabsList>
          <TabsTrigger value="generate">Generate Token</TabsTrigger>
          <TabsTrigger value="recent">Recent Tokens</TabsTrigger>
        </TabsList>

        {/* Token Generation Form */}
        <TabsContent value="generate">
          <Card>
            <CardHeader>
              <CardTitle>Generate New Token</CardTitle>
              <CardDescription>Create a new token for patient queue management</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleGenerateToken} className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="department">Department *</Label>
                    <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map(dept => (
                          <SelectItem key={dept.id} value={dept.id}>
                            {dept.name} - {dept.prefix} Series (Current: {dept.currentToken})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="appointmentType">Appointment Type</Label>
                    <Select value={appointmentType} onValueChange={setAppointmentType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="walk-in">Walk-in</SelectItem>
                        <SelectItem value="appointment">Scheduled Appointment</SelectItem>
                        <SelectItem value="emergency">Emergency</SelectItem>
                        <SelectItem value="follow-up">Follow-up</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="patientName">Patient Name *</Label>
                    <Input
                      id="patientName"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      placeholder="Enter patient full name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="patientPhone">Phone Number</Label>
                    <Input
                      id="patientPhone"
                      value={patientPhone}
                      onChange={(e) => setPatientPhone(e.target.value)}
                      placeholder="+91 9876543210"
                    />
                  </div>
                </div>

                {selectedDepartment && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Next Token Preview</h4>
                        <p className="text-sm text-muted-foreground">
                          Department: {departments.find(d => d.id === selectedDepartment)?.name}
                        </p>
                      </div>
                      <div className="text-2xl font-bold text-blue-600">
                        {(() => {
                          const dept = departments.find(d => d.id === selectedDepartment);
                          if (dept) {
                            const currentNum = parseInt(dept.currentToken.slice(1));
                            return `${dept.prefix}${(currentNum + 1).toString().padStart(2, '0')}`;
                          }
                          return '';
                        })()}
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-end space-x-4">
                  <Button type="button" variant="outline">
                    Clear Form
                  </Button>
                  <Button type="submit" disabled={!selectedDepartment || !patientName}>
                    <Hash className="mr-2 size-4" />
                    Generate Token
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Recent Tokens */}
        <TabsContent value="recent">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Tokens</CardTitle>
                  <CardDescription>View and manage recently generated tokens</CardDescription>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                  <Input
                    placeholder="Search tokens..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 w-64"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredTokens.map(token => (
                  <div key={token.tokenNumber} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Hash className="size-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium">{token.tokenNumber}</h4>
                          <Badge variant={token.status === 'active' ? 'default' : 'secondary'}>
                            {token.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {token.patientName} • {token.department}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">Generated: {token.generatedAt}</p>
                      <div className="flex gap-2 mt-2">
                        <Button size="sm" variant="outline">
                          <Printer className="size-4 mr-1" />
                          Print
                        </Button>
                        <Button size="sm" variant="outline">
                          <QrCode className="size-4 mr-1" />
                          QR Code
                        </Button>
                      </div>
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