'use client';

import { 
  Building, 
  FileText, 
  Plus, 
  Search, 
  Shield, 
  Users,
  CheckCircle,
  IndianRupee,
  Calendar,
  AlertCircle,
  Download,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

export default function GovernmentSchemesPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showVerifyDialog, setShowVerifyDialog] = useState(false);
  const [showManageDialog, setShowManageDialog] = useState(false);
  const [selectedScheme, setSelectedScheme] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');

  const schemes = [
    {
      id: 'CGHS-001',
      name: 'Central Government Health Scheme',
      fullName: 'Central Government Health Scheme (CGHS)',
      description: 'Healthcare for central government employees and pensioners',
      eligibility: 'Central Government Employees',
      coverage: '₹5,00,000',
      status: 'Active',
      beneficiaries: 4250,
      type: 'Government',
      validFrom: '2020-01-01',
      validTill: '2025-12-31',
      documentsRequired: [
        'CGHS Card',
        'Government ID Card',
        'Aadhar Card',
        'Recent Salary Slip'
      ],
      coveredTreatments: [
        'OPD Consultation',
        'Hospitalization',
        'Diagnostic Tests',
        'Emergency Care',
        'Maternity Benefits',
        'Dental Treatment'
      ],
      exclusions: [
        'Cosmetic Surgery',
        'Self-inflicted injuries',
        'Experimental treatments'
      ],
      claimProcess: 'Cashless at empaneled hospitals, reimbursement for non-empaneled',
      networkHospitals: 385,
      averageClaimTime: '7-10 days',
      contactInfo: {
        phone: '1800-208-8900',
        email: 'cghs@gov.in',
        website: 'www.cghs.gov.in'
      }
    },
    {
      id: 'PMJAY-001',
      name: 'Ayushman Bharat PM-JAY',
      fullName: 'Pradhan Mantri Jan Arogya Yojana',
      description: 'Universal health coverage for economically vulnerable families',
      eligibility: 'Below Poverty Line families',
      coverage: '₹5,00,000',
      status: 'Active',
      beneficiaries: 12450,
      type: 'Government',
      validFrom: '2018-09-23',
      validTill: '2030-12-31',
      documentsRequired: [
        'Ayushman Card',
        'Aadhar Card',
        'Ration Card',
        'Income Certificate'
      ],
      coveredTreatments: [
        'Secondary & Tertiary Care',
        'Surgery',
        'Medical & Day Care',
        'Pre & Post Hospitalization',
        'Diagnostics',
        'Medicine & Consumables'
      ],
      exclusions: [
        'OPD',
        'Fertility treatments',
        'Cosmetic procedures',
        'Drug rehabilitation'
      ],
      claimProcess: 'Completely cashless at empaneled hospitals',
      networkHospitals: 1250,
      averageClaimTime: '3-5 days',
      contactInfo: {
        phone: '14555',
        email: 'pmjay@nha.gov.in',
        website: 'www.pmjay.gov.in'
      }
    },
    {
      id: 'ESI-001',
      name: 'Employee State Insurance',
      fullName: 'Employee State Insurance Scheme (ESIC)',
      description: 'Medical care and cash benefits for employees',
      eligibility: 'Private sector employees earning up to ₹21,000/month',
      coverage: '₹1,00,000',
      status: 'Active',
      beneficiaries: 8750,
      type: 'Government',
      validFrom: '1952-02-24',
      validTill: 'Ongoing',
      documentsRequired: [
        'ESI Card',
        'Employment Certificate',
        'Aadhar Card',
        'Family Photo'
      ],
      coveredTreatments: [
        'Medical Treatment',
        'Maternity Benefits',
        'Disability Benefits',
        'Dependent Benefits',
        'Funeral Expenses',
        'Rehabilitation Services'
      ],
      exclusions: [
        'Self-inflicted injuries',
        'Sterilization',
        'Cosmetic treatments'
      ],
      claimProcess: 'Cashless at ESI hospitals and dispensaries',
      networkHospitals: 156,
      averageClaimTime: '5-7 days',
      contactInfo: {
        phone: '1800-11-3839',
        email: 'esic@nic.in',
        website: 'www.esic.nic.in'
      }
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
            <Button 
              variant="outline"
              onClick={() => setShowVerifyDialog(true)}
            >
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
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        setSelectedScheme(scheme);
                        setShowDetailsDialog(true);
                      }}
                    >
                      <Eye className="size-4 mr-1" />
                      View Details
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => {
                        setSelectedScheme(scheme);
                        setShowManageDialog(true);
                      }}
                    >
                      <Edit className="size-4 mr-1" />
                      Manage
                    </Button>
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

      {/* Scheme Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Scheme Details</DialogTitle>
            <DialogDescription>
              Complete information about {selectedScheme?.fullName}
            </DialogDescription>
          </DialogHeader>
          
          {selectedScheme && (
            <div className="space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="font-semibold mb-3">Basic Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Scheme ID</p>
                    <p className="font-medium">{selectedScheme.id}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Status</p>
                    <Badge variant={getStatusColor(selectedScheme.status) as any}>
                      {selectedScheme.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Type</p>
                    <p className="font-medium">{selectedScheme.type}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Beneficiaries</p>
                    <p className="font-medium">{selectedScheme.beneficiaries.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Valid From</p>
                    <p className="font-medium">{selectedScheme.validFrom}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Valid Till</p>
                    <p className="font-medium">{selectedScheme.validTill}</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Coverage Information */}
              <div>
                <h3 className="font-semibold mb-3">Coverage & Eligibility</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Coverage Amount</p>
                    <p className="font-medium text-green-600 text-lg">{selectedScheme.coverage}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Eligibility Criteria</p>
                    <p className="font-medium">{selectedScheme.eligibility}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Claim Process</p>
                    <p className="font-medium">{selectedScheme.claimProcess}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Average Claim Time</p>
                    <p className="font-medium">{selectedScheme.averageClaimTime}</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Covered Treatments */}
              <div>
                <h3 className="font-semibold mb-3">Covered Treatments</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {selectedScheme.coveredTreatments.map((treatment: string, index: number) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-green-50 rounded">
                      <CheckCircle className="size-4 text-green-600" />
                      <span className="text-sm">{treatment}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Exclusions */}
              <div>
                <h3 className="font-semibold mb-3">Exclusions</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {selectedScheme.exclusions.map((exclusion: string, index: number) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-red-50 rounded">
                      <AlertCircle className="size-4 text-red-600" />
                      <span className="text-sm">{exclusion}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Required Documents */}
              <div>
                <h3 className="font-semibold mb-3">Required Documents</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {selectedScheme.documentsRequired.map((doc: string, index: number) => (
                    <div key={index} className="flex items-center gap-2 p-2 border rounded">
                      <FileText className="size-4 text-blue-600" />
                      <span className="text-sm">{doc}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Network & Contact */}
              <div>
                <h3 className="font-semibold mb-3">Network & Contact Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <Card className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Building className="size-5 text-blue-600" />
                      <p className="font-medium">Network Hospitals</p>
                    </div>
                    <p className="text-2xl font-bold">{selectedScheme.networkHospitals}</p>
                    <p className="text-sm text-muted-foreground">Empaneled hospitals</p>
                  </Card>
                  <Card className="p-4">
                    <div className="space-y-2">
                      <p className="font-medium">Contact Details</p>
                      <p className="text-sm">📞 {selectedScheme.contactInfo.phone}</p>
                      <p className="text-sm">✉️ {selectedScheme.contactInfo.email}</p>
                      <p className="text-sm">🌐 {selectedScheme.contactInfo.website}</p>
                    </div>
                  </Card>
                </div>
              </div>

              {/* Statistics */}
              <div>
                <h3 className="font-semibold mb-3">Scheme Statistics</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">{selectedScheme.beneficiaries.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Active Beneficiaries</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">{selectedScheme.coverage}</p>
                    <p className="text-sm text-muted-foreground">Coverage Amount</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">{selectedScheme.networkHospitals}</p>
                    <p className="text-sm text-muted-foreground">Network Hospitals</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>
              Close
            </Button>
            <Button onClick={() => {
              toast({
                title: "Downloading Information",
                description: `Downloading ${selectedScheme?.name} scheme details...`,
              });
            }}>
              <Download className="mr-2 size-4" />
              Download PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Verify Eligibility Dialog */}
      <Dialog open={showVerifyDialog} onOpenChange={setShowVerifyDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Verify Scheme Eligibility</DialogTitle>
            <DialogDescription>
              Check patient eligibility for government healthcare schemes
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="patientId">Patient ID or Aadhar Number</Label>
              <Input
                id="patientId"
                placeholder="Enter patient ID or 12-digit Aadhar"
              />
            </div>

            <div>
              <Label htmlFor="scheme">Select Scheme</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a scheme to verify" />
                </SelectTrigger>
                <SelectContent>
                  {schemes.map(scheme => (
                    <SelectItem key={scheme.id} value={scheme.id}>
                      {scheme.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="category">Employment Category</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select employment category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="government">Government Employee</SelectItem>
                  <SelectItem value="private">Private Sector</SelectItem>
                  <SelectItem value="self">Self Employed</SelectItem>
                  <SelectItem value="unemployed">Unemployed</SelectItem>
                  <SelectItem value="bpl">Below Poverty Line</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="income">Annual Income (Optional)</Label>
              <Input
                id="income"
                type="number"
                placeholder="Enter annual income in ₹"
              />
            </div>

            <Alert>
              <AlertCircle className="size-4" />
              <AlertDescription>
                Eligibility verification requires valid government ID and income proof documents.
              </AlertDescription>
            </Alert>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowVerifyDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              toast({
                title: "Verifying Eligibility",
                description: "Checking patient eligibility against scheme criteria...",
              });
              setTimeout(() => {
                toast({
                  title: "Eligibility Verified",
                  description: "Patient is eligible for Ayushman Bharat PM-JAY scheme",
                });
                setShowVerifyDialog(false);
              }, 2000);
            }}>
              <Shield className="mr-2 size-4" />
              Verify Eligibility
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Manage Scheme Dialog */}
      <Dialog open={showManageDialog} onOpenChange={setShowManageDialog}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Manage Scheme - {selectedScheme?.name}</DialogTitle>
            <DialogDescription>
              Configure scheme settings, manage beneficiaries, process claims, and view analytics
            </DialogDescription>
          </DialogHeader>
          
          {selectedScheme && (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="beneficiaries">Beneficiaries</TabsTrigger>
                <TabsTrigger value="claims">Claims</TabsTrigger>
                <TabsTrigger value="hospitals">Hospitals</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Total Beneficiaries</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{selectedScheme.beneficiaries.toLocaleString()}</div>
                      <p className="text-xs text-muted-foreground">+12% this month</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Active Claims</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">324</div>
                      <p className="text-xs text-muted-foreground">Worth ₹48.2L</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Approval Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">87%</div>
                      <Progress value={87} className="h-2 mt-2" />
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Fund Utilization</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">68%</div>
                      <p className="text-xs text-muted-foreground">₹342L of ₹500L</p>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activities</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <p className="font-medium">New beneficiary enrolled</p>
                          <p className="text-sm text-muted-foreground">Patient: Rahul Singh • ID: BEN-2024-892</p>
                        </div>
                        <span className="text-sm text-muted-foreground">2 hours ago</span>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <p className="font-medium">Claim approved</p>
                          <p className="text-sm text-muted-foreground">Amount: ₹85,000 • Hospital: City Medical Center</p>
                        </div>
                        <span className="text-sm text-muted-foreground">4 hours ago</span>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <p className="font-medium">Hospital empaneled</p>
                          <p className="text-sm text-muted-foreground">New Life Hospital added to network</p>
                        </div>
                        <span className="text-sm text-muted-foreground">1 day ago</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="beneficiaries" className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Beneficiary Management</CardTitle>
                        <CardDescription>Enrolled patients under {selectedScheme.name}</CardDescription>
                      </div>
                      <Button size="sm">
                        <Plus className="mr-2 size-4" />
                        Add Beneficiary
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4 flex gap-4">
                      <div className="flex-1">
                        <Input placeholder="Search by name, ID, or Aadhar..." />
                      </div>
                      <Select defaultValue="all">
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="expired">Expired</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 border rounded">
                        <div className="flex items-center gap-4">
                          <div>
                            <p className="font-medium">Rajesh Kumar</p>
                            <p className="text-sm text-muted-foreground">BEN-2024-001 • Aadhar: XXXX-XXXX-4532</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-green-100 text-green-700">Active</Badge>
                          <Button size="sm" variant="outline">View</Button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded">
                        <div className="flex items-center gap-4">
                          <div>
                            <p className="font-medium">Priya Sharma</p>
                            <p className="text-sm text-muted-foreground">BEN-2024-002 • Aadhar: XXXX-XXXX-7891</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-green-100 text-green-700">Active</Badge>
                          <Button size="sm" variant="outline">View</Button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded">
                        <div className="flex items-center gap-4">
                          <div>
                            <p className="font-medium">Mohammed Ali</p>
                            <p className="text-sm text-muted-foreground">BEN-2024-003 • Aadhar: XXXX-XXXX-2468</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">Renewal Due</Badge>
                          <Button size="sm" variant="outline">View</Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="claims" className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Claims Processing</CardTitle>
                        <CardDescription>Manage and process scheme claims</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">Export</Button>
                        <Button size="sm">Process Claims</Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <p className="font-medium">CLM-2024-1234</p>
                          <p className="text-sm text-muted-foreground">
                            Patient: Sunita Devi • Amount: ₹45,000 • Surgery
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-yellow-100 text-yellow-700">Under Review</Badge>
                          <Button size="sm" variant="outline">Review</Button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <p className="font-medium">CLM-2024-1235</p>
                          <p className="text-sm text-muted-foreground">
                            Patient: Amit Patel • Amount: ₹28,000 • Hospitalization
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-green-100 text-green-700">Approved</Badge>
                          <Button size="sm" variant="outline">Details</Button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <p className="font-medium">CLM-2024-1236</p>
                          <p className="text-sm text-muted-foreground">
                            Patient: Geeta Rani • Amount: ₹15,000 • Diagnostics
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-blue-100 text-blue-700">Processing</Badge>
                          <Button size="sm" variant="outline">Track</Button>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-4">
                      <Card className="p-3">
                        <p className="text-sm text-muted-foreground">Pending Review</p>
                        <p className="text-xl font-bold">42</p>
                      </Card>
                      <Card className="p-3">
                        <p className="text-sm text-muted-foreground">Approved Today</p>
                        <p className="text-xl font-bold">18</p>
                      </Card>
                      <Card className="p-3">
                        <p className="text-sm text-muted-foreground">Rejected</p>
                        <p className="text-xl font-bold">3</p>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="hospitals" className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Network Hospitals</CardTitle>
                        <CardDescription>Empaneled hospitals for {selectedScheme.name}</CardDescription>
                      </div>
                      <Button size="sm">
                        <Plus className="mr-2 size-4" />
                        Add Hospital
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <Input placeholder="Search hospitals..." />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <p className="font-medium">City Medical Center</p>
                          <p className="text-sm text-muted-foreground">
                            Mumbai • 500 beds • Multi-specialty
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-green-100 text-green-700">Active</Badge>
                          <span className="text-sm font-medium">248 claims</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <p className="font-medium">Apollo Hospital</p>
                          <p className="text-sm text-muted-foreground">
                            Delhi • 750 beds • Super-specialty
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-green-100 text-green-700">Active</Badge>
                          <span className="text-sm font-medium">412 claims</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <p className="font-medium">Community Health Center</p>
                          <p className="text-sm text-muted-foreground">
                            Rural Area • 50 beds • Primary care
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-green-100 text-green-700">Active</Badge>
                          <span className="text-sm font-medium">89 claims</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 p-4 bg-blue-50 rounded">
                      <p className="text-sm font-medium">Network Statistics</p>
                      <div className="mt-2 grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground">Total Hospitals</p>
                          <p className="font-bold">{selectedScheme.networkHospitals}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Total Beds</p>
                          <p className="font-bold">45,280</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Coverage</p>
                          <p className="font-bold">28 States</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Scheme Configuration</CardTitle>
                    <CardDescription>Update scheme settings and parameters</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Scheme Name</Label>
                        <Input defaultValue={selectedScheme.name} />
                      </div>
                      <div>
                        <Label>Scheme ID</Label>
                        <Input defaultValue={selectedScheme.id} disabled />
                      </div>
                      <div>
                        <Label>Coverage Amount</Label>
                        <Input defaultValue={selectedScheme.coverage} />
                      </div>
                      <div>
                        <Label>Status</Label>
                        <Select defaultValue={selectedScheme.status.toLowerCase()}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                            <SelectItem value="suspended">Suspended</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <Label>Eligibility Criteria</Label>
                      <Textarea 
                        defaultValue={selectedScheme.eligibility}
                        rows={3}
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label>Claim Processing Time</Label>
                      <Input defaultValue={selectedScheme.averageClaimTime} />
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-medium mb-3">Contact Information</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Phone</Label>
                          <Input defaultValue={selectedScheme.contactInfo.phone} />
                        </div>
                        <div>
                          <Label>Email</Label>
                          <Input defaultValue={selectedScheme.contactInfo.email} />
                        </div>
                        <div className="col-span-2">
                          <Label>Website</Label>
                          <Input defaultValue={selectedScheme.contactInfo.website} />
                        </div>
                      </div>
                    </div>

                    <Alert>
                      <AlertCircle className="size-4" />
                      <AlertDescription>
                        Changes to scheme configuration require administrative approval and will affect all enrolled beneficiaries.
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowManageDialog(false);
              setActiveTab('overview');
            }}>
              Close
            </Button>
            <Button onClick={() => {
              toast({
                title: "Changes Saved",
                description: `Updates to ${selectedScheme?.name} have been saved successfully.`,
              });
              setShowManageDialog(false);
            }}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
