'use client';

import { 
  CheckCircle, 
  Clock, 
  FileText, 
  Shield, 
  XCircle,
  Upload,
  Search,
  Download,
  AlertCircle,
  IndianRupee,
  Building,
  Filter,
  Plus,
  Eye
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';

export default function InsuranceClaimsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [providerFilter, setProviderFilter] = useState('all');
  const [schemeFilter, setSchemeFilter] = useState('all');

  // Enhanced claims data with Indian insurance context
  const claims = [
    {
      claimId: 'INS-2024-001',
      patientName: 'Rajesh Kumar',
      patientId: 'P001',
      provider: 'Star Health Insurance',
      policyNumber: 'SH-2023-45678',
      claimType: 'Cashless',
      amount: 125000,
      status: 'approved',
      submittedDate: '2024-01-15',
      approvedAmount: 118000,
      tpaName: 'Medi Assist',
      treatmentType: 'Cardiac Surgery',
      documents: ['discharge_summary.pdf', 'bills.pdf', 'reports.pdf'],
      remarks: 'Pre-authorization approved, 5% co-pay applied'
    },
    {
      claimId: 'PMJAY-2024-002',
      patientName: 'Sunita Devi',
      patientId: 'P003',
      provider: 'Ayushman Bharat (PMJAY)',
      policyNumber: 'PMJAY-UP-234567',
      claimType: 'Government Scheme',
      amount: 75000,
      status: 'pending',
      submittedDate: '2024-01-10',
      approvedAmount: 0,
      tpaName: 'SHA (State Health Agency)',
      treatmentType: 'Maternity Care',
      documents: ['abha_card.pdf', 'admission_note.pdf'],
      remarks: 'Under verification with SHA'
    },
    {
      claimId: 'INS-2024-003',
      patientName: 'Mohammed Ali',
      patientId: 'P006',
      provider: 'ICICI Lombard',
      policyNumber: 'ICL-2023-98765',
      claimType: 'Reimbursement',
      amount: 45000,
      status: 'rejected',
      submittedDate: '2024-01-05',
      approvedAmount: 0,
      tpaName: 'Paramount Health',
      treatmentType: 'Orthopedic Treatment',
      documents: ['prescription.pdf', 'bills.pdf'],
      remarks: 'Pre-existing condition, not covered under policy'
    },
    {
      claimId: 'CGHS-2024-004',
      patientName: 'Priya Sharma',
      patientId: 'P002',
      provider: 'CGHS',
      policyNumber: 'CGHS-DL-456789',
      claimType: 'Government Scheme',
      amount: 35000,
      status: 'approved',
      submittedDate: '2024-01-12',
      approvedAmount: 35000,
      tpaName: 'CGHS Office',
      treatmentType: 'General Surgery',
      documents: ['cghs_card.pdf', 'referral.pdf', 'discharge.pdf'],
      remarks: 'Approved as per CGHS rates'
    },
    {
      claimId: 'ESIC-2024-005',
      patientName: 'Ramesh Yadav',
      patientId: 'P007',
      provider: 'ESIC',
      policyNumber: 'ESIC-MH-789012',
      claimType: 'Government Scheme',
      amount: 28000,
      status: 'processing',
      submittedDate: '2024-01-14',
      approvedAmount: 0,
      tpaName: 'ESIC Regional Office',
      treatmentType: 'Accident Emergency',
      documents: ['esic_card.pdf', 'accident_report.pdf', 'bills.pdf'],
      remarks: 'Verification in progress'
    },
    {
      claimId: 'INS-2024-006',
      patientName: 'Amit Patel',
      patientId: 'P008',
      provider: 'HDFC ERGO',
      policyNumber: 'HE-2023-34567',
      claimType: 'Cashless',
      amount: 95000,
      status: 'approved',
      submittedDate: '2024-01-08',
      approvedAmount: 90000,
      tpaName: 'Health India TPA',
      treatmentType: 'Kidney Stone Surgery',
      documents: ['pre_auth.pdf', 'surgery_notes.pdf', 'discharge.pdf'],
      remarks: 'Room rent limit applied'
    }
  ];

  // Enhanced statistics calculation
  const totalClaims = claims.length;
  const approvedClaims = claims.filter(c => c.status === 'approved');
  const pendingClaims = claims.filter(c => c.status === 'pending' || c.status === 'processing');
  const totalApprovedAmount = approvedClaims.reduce((sum, c) => sum + c.approvedAmount, 0);
  const governmentClaims = claims.filter(c => c.claimType === 'Government Scheme');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="size-4 text-green-600" />;
      case 'pending':
        return <Clock className="size-4 text-yellow-600" />;
      case 'processing':
        return <Clock className="size-4 text-blue-600" />;
      case 'rejected':
        return <XCircle className="size-4 text-red-600" />;
      default:
        return <Clock className="size-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500">Approved</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case 'processing':
        return <Badge className="bg-blue-500">Processing</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getClaimTypeBadge = (type: string) => {
    switch (type) {
      case 'Cashless':
        return <Badge variant="outline" className="border-green-500 text-green-600">Cashless</Badge>;
      case 'Reimbursement':
        return <Badge variant="outline" className="border-blue-500 text-blue-600">Reimbursement</Badge>;
      case 'Government Scheme':
        return <Badge variant="outline" className="border-purple-500 text-purple-600">Government</Badge>;
      default:
        return <Badge variant="secondary">{type}</Badge>;
    }
  };

  const filteredClaims = claims.filter(claim => {
    const matchesSearch = 
      claim.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      claim.claimId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      claim.policyNumber.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || claim.status === statusFilter;
    const matchesProvider = providerFilter === 'all' || claim.provider === providerFilter;
    const matchesScheme = schemeFilter === 'all' || 
      (schemeFilter === 'private' && claim.claimType !== 'Government Scheme') ||
      (schemeFilter === 'government' && claim.claimType === 'Government Scheme');
    
    return matchesSearch && matchesStatus && matchesProvider && matchesScheme;
  });

  const providers = Array.from(new Set(claims.map(c => c.provider)));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Insurance Claims Management</h1>
          <p className="text-muted-foreground">
            Manage insurance claims, government schemes, TPA coordination, and reimbursements
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Upload className="mr-2 size-4" />
            Upload Documents
          </Button>
          <Button>
            <Plus className="mr-2 size-4" />
            Submit New Claim
          </Button>
        </div>
      </div>

      {/* Government Scheme Alert */}
      {governmentClaims.length > 0 && (
        <Alert className="border-purple-200 bg-purple-50">
          <Building className="size-4" />
          <AlertDescription>
            <strong>{governmentClaims.length} active government scheme claims</strong> including Ayushman Bharat (PMJAY), CGHS, and ESIC. 
            Ensure all required documents are submitted for timely processing.
          </AlertDescription>
        </Alert>
      )}

      {/* Enhanced Statistics */}
      <div className="grid gap-4 md:grid-cols-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Claims</CardTitle>
            <Shield className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClaims}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="size-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{approvedClaims.length}</div>
            <p className="text-xs text-muted-foreground">₹{(totalApprovedAmount/100000).toFixed(1)}L settled</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processing</CardTitle>
            <Clock className="size-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{pendingClaims.length}</div>
            <p className="text-xs text-muted-foreground">Under review</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cashless</CardTitle>
            <IndianRupee className="size-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {claims.filter(c => c.claimType === 'Cashless').length}
            </div>
            <p className="text-xs text-muted-foreground">Direct settlement</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Govt Schemes</CardTitle>
            <Building className="size-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{governmentClaims.length}</div>
            <p className="text-xs text-muted-foreground">PMJAY, CGHS, ESIC</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <Shield className="size-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {totalClaims > 0 ? Math.round((approvedClaims.length / totalClaims) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">Approval rate</p>
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
                  placeholder="Search by patient name, claim ID, or policy number..."
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
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select value={schemeFilter} onValueChange={setSchemeFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="private">Private Insurance</SelectItem>
                <SelectItem value="government">Government Schemes</SelectItem>
              </SelectContent>
            </Select>
            <Select value={providerFilter} onValueChange={setProviderFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by provider" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Providers</SelectItem>
                {providers.map(provider => (
                  <SelectItem key={provider} value={provider}>{provider}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Claims Management */}
      <Tabs defaultValue="claims" className="space-y-4">
        <TabsList>
          <TabsTrigger value="claims">Active Claims</TabsTrigger>
          <TabsTrigger value="preauth">Pre-Authorization</TabsTrigger>
          <TabsTrigger value="documents">Document Management</TabsTrigger>
          <TabsTrigger value="tpa">TPA Coordination</TabsTrigger>
        </TabsList>

        <TabsContent value="claims">
          <Card>
            <CardHeader>
              <CardTitle>Insurance Claims</CardTitle>
              <CardDescription>
                Manage all insurance claims including private insurance and government schemes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredClaims.map(claim => (
                  <div key={claim.claimId} className="border rounded-lg p-4 hover:bg-muted/50">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(claim.status)}
                          <h3 className="font-medium text-lg">{claim.claimId}</h3>
                          {getStatusBadge(claim.status)}
                          {getClaimTypeBadge(claim.claimType)}
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Patient</p>
                            <p className="font-medium">{claim.patientName} ({claim.patientId})</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Provider</p>
                            <p className="font-medium">{claim.provider}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Policy Number</p>
                            <p className="font-medium">{claim.policyNumber}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">TPA</p>
                            <p className="font-medium">{claim.tpaName}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Treatment</p>
                            <p className="font-medium">{claim.treatmentType}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Claim Amount</p>
                            <p className="font-medium">₹{claim.amount.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Approved Amount</p>
                            <p className="font-medium text-green-600">
                              {claim.approvedAmount > 0 ? `₹${claim.approvedAmount.toLocaleString()}` : '-'}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Submitted</p>
                            <p className="font-medium">{claim.submittedDate}</p>
                          </div>
                        </div>
                        {claim.remarks && (
                          <div className="mt-2 p-2 bg-muted rounded text-sm">
                            <p className="font-medium">Remarks:</p>
                            <p>{claim.remarks}</p>
                          </div>
                        )}
                        {claim.documents && claim.documents.length > 0 && (
                          <div className="flex items-center gap-2 text-sm">
                            <FileText className="size-4" />
                            <span>{claim.documents.length} documents uploaded</span>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="size-4 mr-1" />
                          View Details
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="size-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preauth">
          <Card>
            <CardHeader>
              <CardTitle>Pre-Authorization Requests</CardTitle>
              <CardDescription>Manage cashless treatment pre-authorization requests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Patient ID</Label>
                    <Input placeholder="Enter patient ID" />
                  </div>
                  <div className="space-y-2">
                    <Label>Insurance Provider</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select provider" />
                      </SelectTrigger>
                      <SelectContent>
                        {providers.map(provider => (
                          <SelectItem key={provider} value={provider}>{provider}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Estimated Treatment Cost</Label>
                    <Input type="number" placeholder="Enter amount" />
                  </div>
                  <div className="space-y-2">
                    <Label>Treatment Type</Label>
                    <Input placeholder="e.g., Surgery, ICU admission" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Clinical Details</Label>
                  <Textarea 
                    placeholder="Enter diagnosis, treatment plan, and justification for pre-authorization..."
                    rows={4}
                  />
                </div>
                <Button>Submit Pre-Authorization Request</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Document Management</CardTitle>
              <CardDescription>Upload and manage claim-related documents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert>
                  <AlertCircle className="size-4" />
                  <AlertDescription>
                    Required documents vary by insurance provider and claim type. Ensure all documents are clear and legible.
                  </AlertDescription>
                </Alert>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <Card className="p-4">
                    <h4 className="font-medium mb-2">Standard Documents</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Discharge Summary</li>
                      <li>• Hospital Bills (Original)</li>
                      <li>• Prescription & Pharmacy Bills</li>
                      <li>• Investigation Reports</li>
                      <li>• Doctor's Certificate</li>
                    </ul>
                  </Card>
                  <Card className="p-4">
                    <h4 className="font-medium mb-2">Government Scheme Documents</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• ABHA Card / Health ID</li>
                      <li>• Aadhar Card</li>
                      <li>• BPL Certificate (if applicable)</li>
                      <li>• Scheme Enrollment Card</li>
                      <li>• Income Certificate</li>
                    </ul>
                  </Card>
                </div>

                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                  <Upload className="size-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-sm text-muted-foreground mb-4">
                    Drag and drop files here or click to browse
                  </p>
                  <Button variant="outline">
                    <Upload className="size-4 mr-2" />
                    Choose Files
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">
                    Supported formats: PDF, JPG, PNG (Max 5MB per file)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tpa">
          <Card>
            <CardHeader>
              <CardTitle>TPA Coordination</CardTitle>
              <CardDescription>Third Party Administrator communication and tracking</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <Card className="p-4">
                    <h4 className="font-medium mb-2">Medi Assist</h4>
                    <p className="text-sm text-muted-foreground mb-2">Active Claims: 3</p>
                    <p className="text-sm text-muted-foreground mb-3">Avg. TAT: 48 hours</p>
                    <Button size="sm" variant="outline">Contact TPA</Button>
                  </Card>
                  <Card className="p-4">
                    <h4 className="font-medium mb-2">Paramount Health</h4>
                    <p className="text-sm text-muted-foreground mb-2">Active Claims: 2</p>
                    <p className="text-sm text-muted-foreground mb-3">Avg. TAT: 72 hours</p>
                    <Button size="sm" variant="outline">Contact TPA</Button>
                  </Card>
                  <Card className="p-4">
                    <h4 className="font-medium mb-2">Health India TPA</h4>
                    <p className="text-sm text-muted-foreground mb-2">Active Claims: 4</p>
                    <p className="text-sm text-muted-foreground mb-3">Avg. TAT: 36 hours</p>
                    <Button size="sm" variant="outline">Contact TPA</Button>
                  </Card>
                </div>

                <Card className="p-4">
                  <h4 className="font-medium mb-3">TPA Query Resolution</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <p className="font-medium">Query: Additional documents required</p>
                        <p className="text-sm text-muted-foreground">Claim ID: INS-2024-002 • Medi Assist</p>
                      </div>
                      <Button size="sm">Respond</Button>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <p className="font-medium">Query: Treatment justification needed</p>
                        <p className="text-sm text-muted-foreground">Claim ID: ESIC-2024-005 • ESIC Regional Office</p>
                      </div>
                      <Button size="sm">Respond</Button>
                    </div>
                  </div>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
