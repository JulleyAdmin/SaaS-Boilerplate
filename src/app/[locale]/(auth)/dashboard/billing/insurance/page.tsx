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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { Separator } from '@/components/ui/separator';

export default function InsuranceClaimsPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [providerFilter, setProviderFilter] = useState('all');
  const [schemeFilter, setSchemeFilter] = useState('all');
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showNewClaimDialog, setShowNewClaimDialog] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState<any>(null);
  const [newClaimData, setNewClaimData] = useState({
    patientId: '',
    patientName: '',
    provider: '',
    policyNumber: '',
    claimType: '',
    treatmentType: '',
    amount: '',
    diagnosis: '',
    admissionDate: '',
    dischargeDate: '',
    documents: [] as string[]
  });

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
          <Button onClick={() => setShowNewClaimDialog(true)}>
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
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            setSelectedClaim(claim);
                            setShowDetailsDialog(true);
                          }}
                        >
                          <Eye className="size-4 mr-1" />
                          View Details
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            toast({
                              title: "Downloading Claim",
                              description: `Downloading claim documents for ${claim.claimId}...`,
                            });
                          }}
                        >
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

      {/* Claim Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Insurance Claim Details</DialogTitle>
            <DialogDescription>
              Complete information for claim {selectedClaim?.claimId}
            </DialogDescription>
          </DialogHeader>
          
          {selectedClaim && (
            <div className="space-y-6">
              {/* Claim Status and Type */}
              <div className="flex items-center gap-2">
                {getStatusBadge(selectedClaim.status)}
                {getClaimTypeBadge(selectedClaim.claimType)}
                {selectedClaim.isGovernmentScheme && (
                  <Badge variant="outline" className="bg-orange-50">
                    <Building className="size-3 mr-1" />
                    Government Scheme
                  </Badge>
                )}
              </div>

              {/* Basic Information */}
              <div>
                <h3 className="font-semibold mb-3">Basic Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Claim ID</p>
                    <p className="font-medium">{selectedClaim.claimId}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Submitted Date</p>
                    <p className="font-medium">{selectedClaim.submittedDate}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Patient Name</p>
                    <p className="font-medium">{selectedClaim.patientName}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Patient ID</p>
                    <p className="font-medium">{selectedClaim.patientId}</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Insurance Information */}
              <div>
                <h3 className="font-semibold mb-3">Insurance Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Provider</p>
                    <p className="font-medium">{selectedClaim.provider}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Policy Number</p>
                    <p className="font-medium">{selectedClaim.policyNumber}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">TPA Name</p>
                    <p className="font-medium">{selectedClaim.tpaName}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Claim Type</p>
                    <p className="font-medium">{selectedClaim.claimType}</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Treatment Information */}
              <div>
                <h3 className="font-semibold mb-3">Treatment Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Treatment Type</p>
                    <p className="font-medium">{selectedClaim.treatmentType}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Treatment Date</p>
                    <p className="font-medium">{selectedClaim.submittedDate}</p>
                  </div>
                  {selectedClaim.diagnosis && (
                    <div className="col-span-2">
                      <p className="text-muted-foreground">Diagnosis</p>
                      <p className="font-medium">{selectedClaim.diagnosis || 'Not specified'}</p>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              {/* Financial Information */}
              <div>
                <h3 className="font-semibold mb-3">Financial Details</h3>
                <div className="space-y-2">
                  <div className="flex justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm">Claim Amount</span>
                    <span className="font-medium">₹{selectedClaim.amount.toLocaleString()}</span>
                  </div>
                  {selectedClaim.approvedAmount > 0 && (
                    <div className="flex justify-between p-2 bg-green-50 rounded">
                      <span className="text-sm">Approved Amount</span>
                      <span className="font-medium text-green-600">₹{selectedClaim.approvedAmount.toLocaleString()}</span>
                    </div>
                  )}
                  {selectedClaim.approvedAmount > 0 && selectedClaim.approvedAmount < selectedClaim.amount && (
                    <div className="flex justify-between p-2 bg-orange-50 rounded">
                      <span className="text-sm">Deduction</span>
                      <span className="font-medium text-orange-600">₹{(selectedClaim.amount - selectedClaim.approvedAmount).toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Remarks */}
              {selectedClaim.remarks && (
                <>
                  <Separator />
                  <div>
                    <h3 className="font-semibold mb-3">Remarks</h3>
                    <div className="p-3 bg-muted rounded">
                      <p className="text-sm">{selectedClaim.remarks}</p>
                    </div>
                  </div>
                </>
              )}

              {/* Documents */}
              {selectedClaim.documents && selectedClaim.documents.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h3 className="font-semibold mb-3">Uploaded Documents</h3>
                    <div className="space-y-2">
                      {selectedClaim.documents.map((doc: string, index: number) => (
                        <div key={index} className="flex items-center justify-between p-2 border rounded">
                          <div className="flex items-center gap-2">
                            <FileText className="size-4" />
                            <span className="text-sm">{doc}</span>
                          </div>
                          <Button size="sm" variant="ghost">
                            <Download className="size-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Timeline */}
              <Separator />
              <div>
                <h3 className="font-semibold mb-3">Claim Timeline</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 size-2 rounded-full bg-blue-500"></div>
                    <div>
                      <p className="font-medium text-sm">Claim Submitted</p>
                      <p className="text-xs text-muted-foreground">{selectedClaim.submittedDate}</p>
                    </div>
                  </div>
                  {selectedClaim.status === 'processing' && (
                    <div className="flex items-start gap-3">
                      <div className="mt-1 size-2 rounded-full bg-yellow-500"></div>
                      <div>
                        <p className="font-medium text-sm">Under Review</p>
                        <p className="text-xs text-muted-foreground">Processing by TPA</p>
                      </div>
                    </div>
                  )}
                  {selectedClaim.status === 'approved' && (
                    <div className="flex items-start gap-3">
                      <div className="mt-1 size-2 rounded-full bg-green-500"></div>
                      <div>
                        <p className="font-medium text-sm">Claim Approved</p>
                        <p className="text-xs text-muted-foreground">Amount: ₹{selectedClaim.approvedAmount.toLocaleString()}</p>
                      </div>
                    </div>
                  )}
                  {selectedClaim.status === 'rejected' && (
                    <div className="flex items-start gap-3">
                      <div className="mt-1 size-2 rounded-full bg-red-500"></div>
                      <div>
                        <p className="font-medium text-sm">Claim Rejected</p>
                        <p className="text-xs text-muted-foreground">{selectedClaim.remarks}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>
              Close
            </Button>
            {selectedClaim?.status === 'pending' && (
              <Button onClick={() => {
                toast({
                  title: "Following Up",
                  description: `Following up on claim ${selectedClaim.claimId} with ${selectedClaim.tpaName}`,
                });
                setShowDetailsDialog(false);
              }}>
                Follow Up
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Claim Submission Dialog */}
      <Dialog open={showNewClaimDialog} onOpenChange={setShowNewClaimDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Submit New Insurance Claim</DialogTitle>
            <DialogDescription>
              File a new insurance claim for patient treatment
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Patient Information */}
            <div>
              <h3 className="font-semibold mb-3">Patient Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="patientId">Patient ID *</Label>
                  <Input
                    id="patientId"
                    value={newClaimData.patientId}
                    onChange={(e) => setNewClaimData({...newClaimData, patientId: e.target.value})}
                    placeholder="Enter patient ID"
                  />
                </div>
                <div>
                  <Label htmlFor="patientName">Patient Name *</Label>
                  <Input
                    id="patientName"
                    value={newClaimData.patientName}
                    onChange={(e) => setNewClaimData({...newClaimData, patientName: e.target.value})}
                    placeholder="Enter patient name"
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Insurance Information */}
            <div>
              <h3 className="font-semibold mb-3">Insurance Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="provider">Insurance Provider *</Label>
                  <Select 
                    value={newClaimData.provider} 
                    onValueChange={(value) => setNewClaimData({...newClaimData, provider: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select provider" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Star Health Insurance">Star Health Insurance</SelectItem>
                      <SelectItem value="ICICI Lombard">ICICI Lombard</SelectItem>
                      <SelectItem value="HDFC ERGO">HDFC ERGO</SelectItem>
                      <SelectItem value="Bajaj Allianz">Bajaj Allianz</SelectItem>
                      <SelectItem value="New India Assurance">New India Assurance</SelectItem>
                      <SelectItem value="United India Insurance">United India Insurance</SelectItem>
                      <SelectItem value="National Insurance">National Insurance</SelectItem>
                      <SelectItem value="Oriental Insurance">Oriental Insurance</SelectItem>
                      <SelectItem value="PMJAY">Ayushman Bharat (PM-JAY)</SelectItem>
                      <SelectItem value="CGHS">CGHS</SelectItem>
                      <SelectItem value="ESIC">ESIC</SelectItem>
                      <SelectItem value="State Scheme">State Government Scheme</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="policyNumber">Policy/Card Number *</Label>
                  <Input
                    id="policyNumber"
                    value={newClaimData.policyNumber}
                    onChange={(e) => setNewClaimData({...newClaimData, policyNumber: e.target.value})}
                    placeholder="Enter policy or card number"
                  />
                </div>
                <div>
                  <Label htmlFor="claimType">Claim Type *</Label>
                  <Select 
                    value={newClaimData.claimType} 
                    onValueChange={(value) => setNewClaimData({...newClaimData, claimType: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select claim type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cashless">Cashless</SelectItem>
                      <SelectItem value="Reimbursement">Reimbursement</SelectItem>
                      <SelectItem value="Government Scheme">Government Scheme</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="amount">Claim Amount (₹) *</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={newClaimData.amount}
                    onChange={(e) => setNewClaimData({...newClaimData, amount: e.target.value})}
                    placeholder="Enter claim amount"
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Treatment Information */}
            <div>
              <h3 className="font-semibold mb-3">Treatment Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="treatmentType">Treatment Type *</Label>
                  <Select 
                    value={newClaimData.treatmentType} 
                    onValueChange={(value) => setNewClaimData({...newClaimData, treatmentType: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select treatment type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="OPD Consultation">OPD Consultation</SelectItem>
                      <SelectItem value="Emergency Care">Emergency Care</SelectItem>
                      <SelectItem value="General Surgery">General Surgery</SelectItem>
                      <SelectItem value="Cardiac Surgery">Cardiac Surgery</SelectItem>
                      <SelectItem value="Orthopedic Treatment">Orthopedic Treatment</SelectItem>
                      <SelectItem value="Maternity Care">Maternity Care</SelectItem>
                      <SelectItem value="ICU Admission">ICU Admission</SelectItem>
                      <SelectItem value="Dialysis">Dialysis</SelectItem>
                      <SelectItem value="Chemotherapy">Chemotherapy</SelectItem>
                      <SelectItem value="Diagnostic Tests">Diagnostic Tests</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="diagnosis">Diagnosis/ICD Code</Label>
                  <Input
                    id="diagnosis"
                    value={newClaimData.diagnosis}
                    onChange={(e) => setNewClaimData({...newClaimData, diagnosis: e.target.value})}
                    placeholder="Enter diagnosis or ICD code"
                  />
                </div>
                <div>
                  <Label htmlFor="admissionDate">Admission Date *</Label>
                  <Input
                    id="admissionDate"
                    type="date"
                    value={newClaimData.admissionDate}
                    onChange={(e) => setNewClaimData({...newClaimData, admissionDate: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="dischargeDate">Discharge Date</Label>
                  <Input
                    id="dischargeDate"
                    type="date"
                    value={newClaimData.dischargeDate}
                    onChange={(e) => setNewClaimData({...newClaimData, dischargeDate: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Document Upload */}
            <div>
              <h3 className="font-semibold mb-3">Required Documents</h3>
              <Alert className="mb-4">
                <AlertCircle className="size-4" />
                <AlertDescription>
                  Please ensure all documents are clear and legible. Required documents vary by insurance provider.
                </AlertDescription>
              </Alert>
              
              <div className="space-y-3">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" />
                  <span className="text-sm">Discharge Summary</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" />
                  <span className="text-sm">Hospital Bills (Original)</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" />
                  <span className="text-sm">Prescription & Pharmacy Bills</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" />
                  <span className="text-sm">Investigation Reports (Lab/Radiology)</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" />
                  <span className="text-sm">Doctor's Certificate</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" />
                  <span className="text-sm">Insurance Card/Policy Copy</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" />
                  <span className="text-sm">Government ID (Aadhar/PAN)</span>
                </label>
                {(newClaimData.provider === 'PMJAY' || newClaimData.provider === 'CGHS' || newClaimData.provider === 'ESIC') && (
                  <>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" />
                      <span className="text-sm">ABHA Card / Health ID</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" />
                      <span className="text-sm">Income Certificate (if applicable)</span>
                    </label>
                  </>
                )}
              </div>

              <div className="mt-4 border-2 border-dashed rounded-lg p-6 text-center">
                <Upload className="size-10 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground mb-2">
                  Drag and drop files here or click to browse
                </p>
                <Button variant="outline" size="sm">
                  <Upload className="size-4 mr-2" />
                  Choose Files
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  Supported: PDF, JPG, PNG (Max 5MB per file)
                </p>
              </div>
            </div>

            {/* Additional Notes */}
            <div>
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                placeholder="Enter any additional information or special instructions..."
                rows={3}
              />
            </div>

            {/* Pre-Authorization Alert for Cashless Claims */}
            {newClaimData.claimType === 'Cashless' && (
              <Alert className="border-blue-200 bg-blue-50">
                <AlertCircle className="size-4" />
                <AlertDescription>
                  <strong>Pre-Authorization Required:</strong> For cashless claims, pre-authorization must be obtained from the TPA before treatment. 
                  Ensure pre-auth form is submitted at least 48 hours before planned procedures.
                </AlertDescription>
              </Alert>
            )}
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setShowNewClaimDialog(false);
                setNewClaimData({
                  patientId: '',
                  patientName: '',
                  provider: '',
                  policyNumber: '',
                  claimType: '',
                  treatmentType: '',
                  amount: '',
                  diagnosis: '',
                  admissionDate: '',
                  dischargeDate: '',
                  documents: []
                });
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={() => {
                // Validate required fields
                if (!newClaimData.patientId || !newClaimData.patientName || !newClaimData.provider || 
                    !newClaimData.policyNumber || !newClaimData.claimType || !newClaimData.treatmentType || 
                    !newClaimData.amount || !newClaimData.admissionDate) {
                  toast({
                    title: "Missing Information",
                    description: "Please fill in all required fields",
                    variant: "destructive"
                  });
                  return;
                }

                // Generate claim ID
                const claimId = `INS-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
                
                toast({
                  title: "Claim Submitted Successfully",
                  description: `Claim ${claimId} has been submitted for processing. You will receive updates via SMS and email.`,
                });
                
                setShowNewClaimDialog(false);
                setNewClaimData({
                  patientId: '',
                  patientName: '',
                  provider: '',
                  policyNumber: '',
                  claimType: '',
                  treatmentType: '',
                  amount: '',
                  diagnosis: '',
                  admissionDate: '',
                  dischargeDate: '',
                  documents: []
                });
              }}
            >
              <Shield className="mr-2 size-4" />
              Submit Claim
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
