'use client';

import {
  Users,
  Plus,
  Search,
  Edit,
  Trash2,
  UserPlus,
  Heart,
  Shield,
  Calendar,
  CreditCard,
  Home,
  Phone,
  Mail,
  User,
  AlertCircle,
  CheckCircle,
  FileText,
  Download,
  Upload,
  Share2,
  Activity,
  Baby,
  UserCheck,
  IndianRupee,
  Stethoscope,
  History,
  Building,
  MapPin,
  Star,
  Settings,
  ChevronRight,
  Eye,
  EyeOff,
  Link2,
  Unlink,
  Users2,
  UserX,
  Crown,
  Briefcase,
  HelpCircle,
  AlertTriangle,
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
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { useState, useEffect } from 'react';

// Family relationship types based on schema
const RELATIONSHIP_TYPES = [
  // Immediate Family
  { value: 'SELF', label: 'Self', category: 'immediate' },
  { value: 'SPOUSE', label: 'Spouse', category: 'immediate' },
  { value: 'FATHER', label: 'Father', category: 'immediate' },
  { value: 'MOTHER', label: 'Mother', category: 'immediate' },
  { value: 'SON', label: 'Son', category: 'immediate' },
  { value: 'DAUGHTER', label: 'Daughter', category: 'immediate' },
  { value: 'BROTHER', label: 'Brother', category: 'immediate' },
  { value: 'SISTER', label: 'Sister', category: 'immediate' },
  // Extended Family
  { value: 'GRANDFATHER', label: 'Grandfather', category: 'extended' },
  { value: 'GRANDMOTHER', label: 'Grandmother', category: 'extended' },
  { value: 'UNCLE', label: 'Uncle', category: 'extended' },
  { value: 'AUNT', label: 'Aunt', category: 'extended' },
  { value: 'COUSIN', label: 'Cousin', category: 'extended' },
  { value: 'NEPHEW', label: 'Nephew', category: 'extended' },
  { value: 'NIECE', label: 'Niece', category: 'extended' },
  // In-Laws
  { value: 'FATHER-IN-LAW', label: 'Father-in-law', category: 'in-laws' },
  { value: 'MOTHER-IN-LAW', label: 'Mother-in-law', category: 'in-laws' },
  { value: 'SON-IN-LAW', label: 'Son-in-law', category: 'in-laws' },
  { value: 'DAUGHTER-IN-LAW', label: 'Daughter-in-law', category: 'in-laws' },
  { value: 'BROTHER-IN-LAW', label: 'Brother-in-law', category: 'in-laws' },
  { value: 'SISTER-IN-LAW', label: 'Sister-in-law', category: 'in-laws' },
];

// Income categories
const INCOME_CATEGORIES = [
  { value: 'BPL', label: 'Below Poverty Line (BPL)', color: 'red' },
  { value: 'APL', label: 'Above Poverty Line (APL)', color: 'green' },
  { value: 'AAY', label: 'Antyodaya Anna Yojana (AAY)', color: 'orange' },
  { value: 'Others', label: 'Others', color: 'gray' },
];

export default function FamiliesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFamily, setSelectedFamily] = useState<any>(null);
  const [showAddMemberDialog, setShowAddMemberDialog] = useState(false);
  const [showMedicalHistoryDialog, setShowMedicalHistoryDialog] = useState(false);
  const [showInsuranceDialog, setShowInsuranceDialog] = useState(false);
  const [showRegisterFamilyDialog, setShowRegisterFamilyDialog] = useState(false);
  const [showEditFamilyDialog, setShowEditFamilyDialog] = useState(false);
  const [showBookAppointmentDialog, setShowBookAppointmentDialog] = useState(false);
  const [showViewAppointmentDialog, setShowViewAppointmentDialog] = useState(false);
  const [showFileClaimDialog, setShowFileClaimDialog] = useState(false);
  const [showEditMemberDialog, setShowEditMemberDialog] = useState(false);
  const [showRemoveMemberDialog, setShowRemoveMemberDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showReportsDialog, setShowReportsDialog] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [incomeFilter, setIncomeFilter] = useState('all');
  const [insuranceFilter, setInsuranceFilter] = useState('all');

  // Mock data for families
  const [families] = useState([
    {
      familyId: 'FAM001',
      familyCode: 'SHARMA2024001',
      familyName: 'Sharma Family',
      primaryMember: {
        name: 'Rajesh Sharma',
        age: 45,
        patientId: 'PAT001',
        phone: '+91 98765 43210',
        abhaNumber: '12-3456-7890-1234',
      },
      address: {
        line1: '123, MG Road',
        line2: 'Near City Hospital',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
      },
      rationCardNumber: 'MH-12345678',
      incomeCategory: 'APL',
      totalMembers: 5,
      activeMembers: 5,
      dependents: 3,
      earningMembers: 2,
      lastVisit: '2024-01-10',
      upcomingAppointments: 2,
      totalSpent: 45000,
      insuranceCoverage: true,
      governmentScheme: 'PMJAY',
      members: [
        {
          memberId: 'MEM001',
          patientId: 'PAT001',
          name: 'Rajesh Sharma',
          age: 45,
          gender: 'M',
          relationship: 'SELF',
          isPrimary: true,
          isEarning: true,
          isDependent: false,
          bloodGroup: 'O+',
          phone: '+91 98765 43210',
          abhaNumber: '12-3456-7890-1234',
          lastVisit: '2024-01-10',
          chronicConditions: ['Diabetes', 'Hypertension'],
          status: 'Active',
          recentDiagnoses: [
            { condition: 'Type 2 Diabetes', date: '2024-01-10', department: 'General Medicine' },
            { condition: 'Hypertension', date: '2023-11-15', department: 'Cardiology' },
            { condition: 'Gastritis', date: '2023-09-20', department: 'Gastroenterology' },
          ],
          allergies: ['Penicillin', 'Sulfa drugs'],
        },
        {
          memberId: 'MEM002',
          patientId: 'PAT002',
          name: 'Priya Sharma',
          age: 42,
          gender: 'F',
          relationship: 'SPOUSE',
          isPrimary: false,
          isEarning: true,
          isDependent: false,
          bloodGroup: 'B+',
          phone: '+91 98765 43211',
          abhaNumber: '12-3456-7890-1235',
          lastVisit: '2024-01-15',
          chronicConditions: ['Thyroid'],
          status: 'Active',
          recentDiagnoses: [
            { condition: 'Hypothyroidism', date: '2024-01-15', department: 'Endocrinology' },
            { condition: 'Migraine', date: '2023-10-22', department: 'Neurology' },
          ],
          allergies: ['Aspirin'],
        },
        {
          memberId: 'MEM003',
          patientId: 'PAT003',
          name: 'Aarav Sharma',
          age: 18,
          gender: 'M',
          relationship: 'SON',
          isPrimary: false,
          isEarning: false,
          isDependent: true,
          bloodGroup: 'O+',
          lastVisit: '2023-12-20',
          chronicConditions: [],
          status: 'Active',
          recentDiagnoses: [
            { condition: 'Viral Fever', date: '2023-12-20', department: 'Pediatrics' },
            { condition: 'Common Cold', date: '2023-10-05', department: 'General Medicine' },
          ],
          allergies: [],
        },
        {
          memberId: 'MEM004',
          patientId: 'PAT004',
          name: 'Ananya Sharma',
          age: 14,
          gender: 'F',
          relationship: 'DAUGHTER',
          isPrimary: false,
          isEarning: false,
          isDependent: true,
          bloodGroup: 'B+',
          lastVisit: '2024-01-05',
          chronicConditions: ['Asthma'],
          status: 'Active',
          recentDiagnoses: [
            { condition: 'Asthma Exacerbation', date: '2024-01-05', department: 'Pulmonology' },
            { condition: 'Allergic Rhinitis', date: '2023-08-15', department: 'ENT' },
          ],
          allergies: ['Dust', 'Pollen', 'Peanuts'],
        },
        {
          memberId: 'MEM005',
          patientId: 'PAT005',
          name: 'Kamla Devi',
          age: 70,
          gender: 'F',
          relationship: 'MOTHER',
          isPrimary: false,
          isEarning: false,
          isDependent: true,
          bloodGroup: 'AB+',
          lastVisit: '2024-01-12',
          chronicConditions: ['Arthritis', 'Diabetes'],
          status: 'Active',
          recentDiagnoses: [
            { condition: 'Osteoarthritis', date: '2024-01-12', department: 'Orthopedics' },
            { condition: 'Type 2 Diabetes', date: '2023-12-01', department: 'General Medicine' },
            { condition: 'Cataract', date: '2023-07-20', department: 'Ophthalmology' },
          ],
          allergies: ['NSAIDs'],
        },
      ],
      medicalHistory: [
        {
          condition: 'Diabetes',
          affectedMembers: ['Father', 'Mother', 'Grandfather'],
          isHereditary: true,
          severity: 'Moderate',
        },
        {
          condition: 'Hypertension',
          affectedMembers: ['Father', 'Uncle'],
          isHereditary: true,
          severity: 'Mild',
        },
        {
          condition: 'Heart Disease',
          affectedMembers: ['Grandfather'],
          isHereditary: true,
          severity: 'Severe',
        },
      ],
      insurance: {
        provider: 'Star Health Insurance',
        policyNumber: 'STAR2024001234',
        policyType: 'Family Floater',
        sumInsured: 500000,
        remainingSum: 455000,
        validTill: '2024-12-31',
        coveredMembers: 5,
        premiumAmount: 25000,
      },
      appointments: [
        {
          date: '2024-01-25',
          time: '10:00 AM',
          members: ['Rajesh Sharma', 'Kamla Devi'],
          type: 'Family-Checkup',
          doctor: 'Dr. Amit Patel',
        },
        {
          date: '2024-02-01',
          time: '2:00 PM',
          members: ['Ananya Sharma'],
          type: 'Vaccination',
          doctor: 'Dr. Priya Singh',
        },
      ],
    },
    {
      familyId: 'FAM002',
      familyCode: 'PATEL2024002',
      familyName: 'Patel Family',
      primaryMember: {
        name: 'Suresh Patel',
        age: 38,
        patientId: 'PAT006',
        phone: '+91 98765 43220',
        abhaNumber: '12-3456-7890-2234',
      },
      address: {
        line1: '456, Station Road',
        city: 'Ahmedabad',
        state: 'Gujarat',
        pincode: '380001',
      },
      rationCardNumber: 'GJ-87654321',
      incomeCategory: 'BPL',
      totalMembers: 4,
      activeMembers: 4,
      dependents: 2,
      earningMembers: 2,
      lastVisit: '2024-01-08',
      upcomingAppointments: 1,
      totalSpent: 12000,
      insuranceCoverage: false,
      governmentScheme: 'PMJAY',
      members: [
        {
          memberId: 'MEM006',
          patientId: 'PAT006',
          name: 'Suresh Patel',
          age: 38,
          gender: 'M',
          relationship: 'SELF',
          isPrimary: true,
          isEarning: true,
          isDependent: false,
          bloodGroup: 'A+',
          phone: '+91 98765 43220',
          abhaNumber: '12-3456-7890-2234',
          lastVisit: '2024-01-08',
          chronicConditions: [],
          status: 'Active',
        },
        {
          memberId: 'MEM007',
          patientId: 'PAT007',
          name: 'Kavita Patel',
          age: 35,
          gender: 'F',
          relationship: 'SPOUSE',
          isPrimary: false,
          isEarning: true,
          isDependent: false,
          bloodGroup: 'A+',
          lastVisit: '2024-01-08',
          chronicConditions: [],
          status: 'Active',
        },
        {
          memberId: 'MEM008',
          patientId: 'PAT008',
          name: 'Rohan Patel',
          age: 10,
          gender: 'M',
          relationship: 'SON',
          isPrimary: false,
          isEarning: false,
          isDependent: true,
          bloodGroup: 'A+',
          lastVisit: '2023-12-15',
          chronicConditions: [],
          status: 'Active',
        },
        {
          memberId: 'MEM009',
          patientId: 'PAT009',
          name: 'Neha Patel',
          age: 8,
          gender: 'F',
          relationship: 'DAUGHTER',
          isPrimary: false,
          isEarning: false,
          isDependent: true,
          bloodGroup: 'A+',
          lastVisit: '2023-12-15',
          chronicConditions: [],
          status: 'Active',
        },
      ],
      medicalHistory: [],
      insurance: null,
      appointments: [],
    },
  ]);

  const getIncomeColor = (category: string) => {
    const cat = INCOME_CATEGORIES.find(c => c.value === category);
    return cat?.color || 'gray';
  };

  const getMemberIcon = (relationship: string) => {
    if (relationship === 'SELF') return <Crown className="size-3" />;
    if (relationship === 'SPOUSE') return <Heart className="size-3" />;
    if (['SON', 'DAUGHTER'].includes(relationship)) return <Baby className="size-3" />;
    if (['FATHER', 'MOTHER'].includes(relationship)) return <Users className="size-3" />;
    return <User className="size-3" />;
  };

  const filteredFamilies = families.filter(family => {
    const matchesSearch = 
      family.familyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      family.familyCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      family.primaryMember.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesIncome = incomeFilter === 'all' || family.incomeCategory === incomeFilter;
    
    const matchesInsurance = 
      insuranceFilter === 'all' ||
      (insuranceFilter === 'insured' && family.insuranceCoverage) ||
      (insuranceFilter === 'uninsured' && !family.insuranceCoverage) ||
      (insuranceFilter === 'government' && family.governmentScheme);
    
    return matchesSearch && matchesIncome && matchesInsurance;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Family Management</h1>
          <p className="text-muted-foreground">
            Manage family groups, relationships, medical history, and shared insurance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setShowImportDialog(true)}>
            <Upload className="mr-2 size-4" />
            Import Families
          </Button>
          <Button onClick={() => setShowRegisterFamilyDialog(true)}>
            <Plus className="mr-2 size-4" />
            Register Family
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Families</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">156</div>
              <Users2 className="size-4 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">+12 this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">624</div>
              <Users className="size-4 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">Avg 4 per family</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Insured Families</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">89</div>
              <Shield className="size-4 text-green-600" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">57% coverage</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">BPL Families</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">42</div>
              <CreditCard className="size-4 text-orange-600" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">Eligible for schemes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active PMJAY</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">38</div>
              <Building className="size-4 text-blue-600" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">₹5L coverage each</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search Families</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by family name, code, or primary member..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
                prefix={<Search className="size-4" />}
              />
            </div>
            <Select value={incomeFilter} onValueChange={setIncomeFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Income Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="BPL">BPL</SelectItem>
                <SelectItem value="APL">APL</SelectItem>
                <SelectItem value="AAY">AAY</SelectItem>
                <SelectItem value="Others">Others</SelectItem>
              </SelectContent>
            </Select>
            <Select value={insuranceFilter} onValueChange={setInsuranceFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Insurance Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Families</SelectItem>
                <SelectItem value="insured">Insured</SelectItem>
                <SelectItem value="uninsured">Uninsured</SelectItem>
                <SelectItem value="government">Government Scheme</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Families List and Details */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Families List */}
        <div className="lg:col-span-1">
          <Card className="h-[800px]">
            <CardHeader>
              <CardTitle>Registered Families</CardTitle>
              <CardDescription>Click on a family to view details</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[700px]">
                <div className="space-y-2 p-4">
                  {filteredFamilies.map((family) => (
                    <Card
                      key={family.familyId}
                      className={`cursor-pointer transition-colors hover:bg-accent ${
                        selectedFamily?.familyId === family.familyId ? 'border-primary' : ''
                      }`}
                      onClick={() => setSelectedFamily(family)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <p className="font-medium">{family.familyName}</p>
                              <Badge variant="outline" className="text-xs">
                                {family.familyCode}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {family.primaryMember.name} • {family.primaryMember.age}y
                            </p>
                            <div className="flex items-center gap-2 text-xs">
                              <Badge className={`bg-${getIncomeColor(family.incomeCategory)}-100 text-${getIncomeColor(family.incomeCategory)}-800`}>
                                {family.incomeCategory}
                              </Badge>
                              {family.insuranceCoverage && (
                                <Badge className="bg-green-100 text-green-800">
                                  <Shield className="mr-1 size-3" />
                                  Insured
                                </Badge>
                              )}
                              {family.governmentScheme && (
                                <Badge className="bg-blue-100 text-blue-800">
                                  {family.governmentScheme}
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">{family.totalMembers}</p>
                            <p className="text-xs text-muted-foreground">members</p>
                          </div>
                        </div>
                        <Separator className="my-2" />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{family.address.city}</span>
                          <span>Last visit: {family.lastVisit}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Family Details */}
        <div className="lg:col-span-2">
          {selectedFamily ? (
            <Card className="h-[800px]">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{selectedFamily.familyName}</CardTitle>
                    <CardDescription>Family ID: {selectedFamily.familyCode}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setShowEditFamilyDialog(true)}>
                      <Edit className="mr-2 size-4" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setShowReportsDialog(true)}>
                      <FileText className="mr-2 size-4" />
                      Reports
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="h-[650px]">
                  <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="members">Members</TabsTrigger>
                    <TabsTrigger value="medical">Medical History</TabsTrigger>
                    <TabsTrigger value="insurance">Insurance</TabsTrigger>
                    <TabsTrigger value="appointments">Appointments</TabsTrigger>
                  </TabsList>

                  {/* Overview Tab */}
                  <TabsContent value="overview" className="space-y-4 mt-4">
                    {/* Primary Member & Address */}
                    <div className="grid gap-4 md:grid-cols-2">
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm">Primary Member</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarFallback>
                                {selectedFamily.primaryMember.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{selectedFamily.primaryMember.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {selectedFamily.primaryMember.age} years • {selectedFamily.primaryMember.phone}
                              </p>
                            </div>
                          </div>
                          {selectedFamily.primaryMember.abhaNumber && (
                            <div className="flex items-center gap-2 text-sm">
                              <Badge variant="outline">
                                ABHA: {selectedFamily.primaryMember.abhaNumber}
                              </Badge>
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm">Address</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-1 text-sm">
                            <p>{selectedFamily.address.line1}</p>
                            {selectedFamily.address.line2 && <p>{selectedFamily.address.line2}</p>}
                            <p>{selectedFamily.address.city}, {selectedFamily.address.state}</p>
                            <p>PIN: {selectedFamily.address.pincode}</p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Income & Government Details */}
                    <div className="grid gap-4 md:grid-cols-2">
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm">Income Category</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <Badge className={`bg-${getIncomeColor(selectedFamily.incomeCategory)}-100 text-${getIncomeColor(selectedFamily.incomeCategory)}-800`}>
                              {INCOME_CATEGORIES.find(c => c.value === selectedFamily.incomeCategory)?.label}
                            </Badge>
                            {selectedFamily.rationCardNumber && (
                              <p className="text-sm text-muted-foreground">
                                Ration Card: {selectedFamily.rationCardNumber}
                              </p>
                            )}
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm">Government Schemes</CardTitle>
                        </CardHeader>
                        <CardContent>
                          {selectedFamily.governmentScheme ? (
                            <div className="space-y-2">
                              <Badge className="bg-blue-100 text-blue-800">
                                {selectedFamily.governmentScheme}
                              </Badge>
                              <p className="text-sm text-muted-foreground">
                                Coverage: ₹5,00,000 per year
                              </p>
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground">No active schemes</p>
                          )}
                        </CardContent>
                      </Card>
                    </div>

                    {/* Statistics */}
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Family Statistics</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-4 gap-4">
                          <div className="text-center">
                            <p className="text-2xl font-bold">{selectedFamily.totalMembers}</p>
                            <p className="text-xs text-muted-foreground">Total Members</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold">{selectedFamily.earningMembers}</p>
                            <p className="text-xs text-muted-foreground">Earning</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold">{selectedFamily.dependents}</p>
                            <p className="text-xs text-muted-foreground">Dependents</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold">₹{selectedFamily.totalSpent.toLocaleString()}</p>
                            <p className="text-xs text-muted-foreground">Total Spent</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Members Tab */}
                  <TabsContent value="members" className="mt-4">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-muted-foreground">
                          {selectedFamily.members.length} family members registered
                        </p>
                        <Button size="sm" onClick={() => setShowAddMemberDialog(true)}>
                          <UserPlus className="mr-2 size-4" />
                          Add Member
                        </Button>
                      </div>

                      <ScrollArea className="h-[500px]">
                        <div className="space-y-3">
                          {selectedFamily.members.map((member: any) => (
                            <Card key={member.memberId}>
                              <CardContent className="p-4">
                                <div className="flex items-start justify-between">
                                  <div className="flex gap-3">
                                    <Avatar>
                                      <AvatarFallback>
                                        {member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div className="space-y-1">
                                      <div className="flex items-center gap-2">
                                        <p className="font-medium">{member.name}</p>
                                        {member.isPrimary && (
                                          <Badge className="bg-yellow-100 text-yellow-800">
                                            <Crown className="mr-1 size-3" />
                                            Primary
                                          </Badge>
                                        )}
                                        {member.isEarning && (
                                          <Badge className="bg-green-100 text-green-800">
                                            <Briefcase className="mr-1 size-3" />
                                            Earning
                                          </Badge>
                                        )}
                                      </div>
                                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                          {getMemberIcon(member.relationship)}
                                          {member.relationship}
                                        </span>
                                        <span>•</span>
                                        <span>{member.age}y/{member.gender}</span>
                                        <span>•</span>
                                        <span>Blood: {member.bloodGroup || 'Unknown'}</span>
                                      </div>
                                      {member.phone && (
                                        <p className="text-sm text-muted-foreground">
                                          <Phone className="inline mr-1 size-3" />
                                          {member.phone}
                                        </p>
                                      )}
                                      {member.abhaNumber && (
                                        <Badge variant="outline" className="text-xs">
                                          ABHA: {member.abhaNumber}
                                        </Badge>
                                      )}
                                      {member.chronicConditions && member.chronicConditions.length > 0 && (
                                        <div className="flex gap-1 flex-wrap mt-1">
                                          {member.chronicConditions.map((condition: string) => (
                                            <Badge key={condition} variant="secondary" className="text-xs">
                                              {condition}
                                            </Badge>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex flex-col items-end gap-2">
                                    <Badge className={member.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                                      {member.status}
                                    </Badge>
                                    <p className="text-xs text-muted-foreground">
                                      Last visit: {member.lastVisit}
                                    </p>
                                    <div className="flex gap-1">
                                      <Select 
                                        onValueChange={(value) => {
                                          if (value === 'view-history') {
                                            setSelectedMember(member);
                                            setShowMedicalHistoryDialog(true);
                                          }
                                        }}
                                      >
                                        <SelectTrigger className="h-8 w-[140px]">
                                          <SelectValue placeholder="Medical History" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="view-history">
                                            <div className="flex items-center">
                                              <FileText className="mr-2 size-3" />
                                              View Full History
                                            </div>
                                          </SelectItem>
                                          <Separator className="my-1" />
                                          <div className="px-2 py-1 text-xs font-medium text-muted-foreground">Recent Conditions</div>
                                          {member.recentDiagnoses && member.recentDiagnoses.length > 0 ? (
                                            member.recentDiagnoses.slice(0, 5).map((diagnosis: any, idx: number) => (
                                              <SelectItem key={idx} value={`diagnosis-${idx}`} disabled>
                                                <div className="flex flex-col items-start">
                                                  <span className="text-xs font-medium">{diagnosis.condition}</span>
                                                  <span className="text-xs text-muted-foreground">{diagnosis.date} • {diagnosis.department}</span>
                                                </div>
                                              </SelectItem>
                                            ))
                                          ) : (
                                            <div className="px-2 py-2 text-xs text-muted-foreground">No recent diagnoses</div>
                                          )}
                                          <Separator className="my-1" />
                                          <div className="px-2 py-1 text-xs font-medium text-muted-foreground">Chronic Conditions</div>
                                          {member.chronicConditions && member.chronicConditions.length > 0 ? (
                                            member.chronicConditions.map((condition: string, idx: number) => (
                                              <SelectItem key={idx} value={`chronic-${idx}`} disabled>
                                                <div className="flex items-center">
                                                  <AlertCircle className="mr-2 size-3 text-orange-500" />
                                                  <span className="text-xs">{condition}</span>
                                                </div>
                                              </SelectItem>
                                            ))
                                          ) : (
                                            <div className="px-2 py-2 text-xs text-muted-foreground">No chronic conditions</div>
                                          )}
                                          <Separator className="my-1" />
                                          <div className="px-2 py-1 text-xs font-medium text-muted-foreground">Allergies</div>
                                          {member.allergies && member.allergies.length > 0 ? (
                                            member.allergies.map((allergy: string, idx: number) => (
                                              <SelectItem key={idx} value={`allergy-${idx}`} disabled>
                                                <div className="flex items-center">
                                                  <AlertTriangle className="mr-2 size-3 text-red-500" />
                                                  <span className="text-xs">{allergy}</span>
                                                </div>
                                              </SelectItem>
                                            ))
                                          ) : (
                                            <div className="px-2 py-2 text-xs text-muted-foreground">No known allergies</div>
                                          )}
                                        </SelectContent>
                                      </Select>
                                      <Button 
                                        size="sm" 
                                        variant="ghost"
                                        onClick={() => {
                                          setSelectedMember(member);
                                          setShowEditMemberDialog(true);
                                        }}
                                      >
                                        <Edit className="size-3" />
                                      </Button>
                                      {!member.isPrimary && (
                                        <Button 
                                          size="sm" 
                                          variant="ghost"
                                          onClick={() => {
                                            setSelectedMember(member);
                                            setShowRemoveMemberDialog(true);
                                          }}
                                        >
                                          <UserX className="size-3" />
                                        </Button>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                  </TabsContent>

                  {/* Medical History Tab */}
                  <TabsContent value="medical" className="mt-4">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-muted-foreground">
                          Family medical history and hereditary conditions
                        </p>
                        <Button size="sm" onClick={() => setShowMedicalHistoryDialog(true)}>
                          <Plus className="mr-2 size-4" />
                          Add Condition
                        </Button>
                      </div>

                      <ScrollArea className="h-[500px]">
                        <div className="space-y-3">
                          {selectedFamily.medicalHistory && selectedFamily.medicalHistory.length > 0 ? (
                            selectedFamily.medicalHistory.map((history: any, index: number) => (
                            <Card key={index}>
                              <CardContent className="p-4">
                                <div className="flex items-start justify-between">
                                  <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                      <Activity className="size-4 text-red-600" />
                                      <p className="font-medium">{history.condition}</p>
                                      {history.isHereditary && (
                                        <Badge className="bg-orange-100 text-orange-800">
                                          Hereditary
                                        </Badge>
                                      )}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                      <p>Affected members: {history.affectedMembers.join(', ')}</p>
                                      <p>Severity: {history.severity}</p>
                                    </div>
                                  </div>
                                  <Button size="sm" variant="ghost">
                                    <Edit className="size-4" />
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))
                          ) : (
                            <div className="text-center py-8">
                              <Activity className="mx-auto size-12 text-muted-foreground mb-4" />
                              <p className="text-muted-foreground">No medical history recorded</p>
                            </div>
                          )}
                        </div>
                      </ScrollArea>
                    </div>
                  </TabsContent>

                  {/* Insurance Tab */}
                  <TabsContent value="insurance" className="mt-4">
                    <div className="space-y-4">
                      {selectedFamily.insurance ? (
                        <>
                          <Card>
                            <CardHeader>
                              <div className="flex justify-between items-center">
                                <CardTitle className="text-base">Insurance Policy Details</CardTitle>
                                <div className="flex gap-2">
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => setShowFileClaimDialog(true)}
                                  >
                                    <Shield className="mr-2 size-4" />
                                    File Claim
                                  </Button>
                                  <Button size="sm" variant="outline">
                                    <Edit className="mr-2 size-4" />
                                    Edit Policy
                                  </Button>
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                  <div>
                                    <p className="text-sm text-muted-foreground">Provider</p>
                                    <p className="font-medium">{selectedFamily.insurance.provider}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground">Policy Number</p>
                                    <p className="font-medium">{selectedFamily.insurance.policyNumber}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground">Policy Type</p>
                                    <p className="font-medium">{selectedFamily.insurance.policyType}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground">Premium Amount</p>
                                    <p className="font-medium">₹{selectedFamily.insurance.premiumAmount.toLocaleString()}/year</p>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <div>
                                    <p className="text-sm text-muted-foreground">Sum Insured</p>
                                    <p className="font-medium">₹{selectedFamily.insurance.sumInsured.toLocaleString()}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground">Remaining Sum</p>
                                    <p className="font-medium text-green-600">₹{selectedFamily.insurance.remainingSum.toLocaleString()}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground">Valid Till</p>
                                    <p className="font-medium">{selectedFamily.insurance.validTill}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground">Covered Members</p>
                                    <p className="font-medium">{selectedFamily.insurance.coveredMembers} members</p>
                                  </div>
                                </div>
                              </div>

                              <Separator className="my-4" />

                              <div>
                                <p className="text-sm font-medium mb-2">Coverage Utilization</p>
                                <Progress 
                                  value={((selectedFamily.insurance.sumInsured - selectedFamily.insurance.remainingSum) / selectedFamily.insurance.sumInsured) * 100} 
                                  className="h-2"
                                />
                                <p className="text-xs text-muted-foreground mt-1">
                                  ₹{(selectedFamily.insurance.sumInsured - selectedFamily.insurance.remainingSum).toLocaleString()} used of ₹{selectedFamily.insurance.sumInsured.toLocaleString()}
                                </p>
                              </div>
                            </CardContent>
                          </Card>

                          <Card>
                            <CardHeader>
                              <CardTitle className="text-base">Recent Claims</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm text-muted-foreground">No recent claims filed</p>
                            </CardContent>
                          </Card>
                        </>
                      ) : (
                        <Card>
                          <CardContent className="py-8 text-center">
                            <Shield className="mx-auto size-12 text-muted-foreground mb-4" />
                            <p className="text-muted-foreground mb-4">No insurance policy linked</p>
                            <Button onClick={() => setShowInsuranceDialog(true)}>
                              <Plus className="mr-2 size-4" />
                              Add Insurance Policy
                            </Button>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </TabsContent>

                  {/* Appointments Tab */}
                  <TabsContent value="appointments" className="mt-4">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-muted-foreground">
                          Family appointments and health checkups
                        </p>
                        <Button size="sm" onClick={() => setShowBookAppointmentDialog(true)}>
                          <Calendar className="mr-2 size-4" />
                          Book Appointment
                        </Button>
                      </div>

                      <ScrollArea className="h-[500px]">
                        <div className="space-y-3">
                          {selectedFamily.appointments && selectedFamily.appointments.length > 0 ? (
                            selectedFamily.appointments.map((appointment: any, index: number) => (
                            <Card key={index}>
                              <CardContent className="p-4">
                                <div className="flex items-start justify-between">
                                  <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                      <Calendar className="size-4 text-blue-600" />
                                      <p className="font-medium">{appointment.date} at {appointment.time}</p>
                                      <Badge>{appointment.type}</Badge>
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                      <p>Members: {appointment.members.join(', ')}</p>
                                      <p>Doctor: {appointment.doctor}</p>
                                    </div>
                                  </div>
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => {
                                      setSelectedAppointment(appointment);
                                      setShowViewAppointmentDialog(true);
                                    }}
                                  >
                                    View
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))
                          ) : (
                            <div className="text-center py-8">
                              <Calendar className="mx-auto size-12 text-muted-foreground mb-4" />
                              <p className="text-muted-foreground">No appointments scheduled</p>
                            </div>
                          )}
                        </div>
                      </ScrollArea>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ) : (
            <Card className="h-[800px] flex items-center justify-center">
              <CardContent className="text-center">
                <Users className="mx-auto size-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Select a family to view details</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Add Member Dialog */}
      <Dialog open={showAddMemberDialog} onOpenChange={setShowAddMemberDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add Family Member</DialogTitle>
            <DialogDescription>
              Add a new member to the {selectedFamily?.familyName}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Patient ID</Label>
                <Input placeholder="Search patient or create new" />
              </div>
              <div>
                <Label>Relationship</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select relationship" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SPOUSE">Spouse</SelectItem>
                    <SelectItem value="SON">Son</SelectItem>
                    <SelectItem value="DAUGHTER">Daughter</SelectItem>
                    <SelectItem value="FATHER">Father</SelectItem>
                    <SelectItem value="MOTHER">Mother</SelectItem>
                    <SelectItem value="BROTHER">Brother</SelectItem>
                    <SelectItem value="SISTER">Sister</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox id="earning" />
                <Label htmlFor="earning">Earning Member</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="dependent" defaultChecked />
                <Label htmlFor="dependent">Dependent</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="share-medical" />
                <Label htmlFor="share-medical">Share Medical History</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="share-insurance" defaultChecked />
                <Label htmlFor="share-insurance">Share Insurance Benefits</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddMemberDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowAddMemberDialog(false)}>
              Add Member
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Medical History Dialog */}
      <Dialog open={showMedicalHistoryDialog} onOpenChange={setShowMedicalHistoryDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Medical Condition</DialogTitle>
            <DialogDescription>
              Add hereditary or family medical conditions
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label>Condition Name</Label>
              <Input placeholder="e.g., Diabetes, Hypertension" />
            </div>
            <div>
              <Label>ICD-10 Code (Optional)</Label>
              <Input placeholder="e.g., E11.9" />
            </div>
            <div>
              <Label>Affected Relationships</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select affected members" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FATHER">Father</SelectItem>
                  <SelectItem value="MOTHER">Mother</SelectItem>
                  <SelectItem value="GRANDFATHER">Grandfather</SelectItem>
                  <SelectItem value="GRANDMOTHER">Grandmother</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Severity</Label>
              <RadioGroup defaultValue="moderate">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="mild" id="mild" />
                  <Label htmlFor="mild">Mild</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="moderate" id="moderate" />
                  <Label htmlFor="moderate">Moderate</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="severe" id="severe" />
                  <Label htmlFor="severe">Severe</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="hereditary" defaultChecked />
              <Label htmlFor="hereditary">Hereditary Condition</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowMedicalHistoryDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowMedicalHistoryDialog(false)}>
              Add Condition
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Register Family Dialog */}
      <Dialog open={showRegisterFamilyDialog} onOpenChange={setShowRegisterFamilyDialog}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Register New Family</DialogTitle>
            <DialogDescription>
              Create a new family group and add the primary member
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Family Name</Label>
                <Input placeholder="e.g., Sharma Family" />
              </div>
              <div>
                <Label>Family Code</Label>
                <Input placeholder="Auto-generated" disabled value="FAM2024003" />
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h4 className="font-medium mb-3">Primary Member Details</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>First Name</Label>
                  <Input placeholder="Enter first name" />
                </div>
                <div>
                  <Label>Last Name</Label>
                  <Input placeholder="Enter last name" />
                </div>
                <div>
                  <Label>Date of Birth</Label>
                  <Input type="date" />
                </div>
                <div>
                  <Label>Gender</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="M">Male</SelectItem>
                      <SelectItem value="F">Female</SelectItem>
                      <SelectItem value="O">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Phone Number</Label>
                  <Input placeholder="+91 98765 43210" />
                </div>
                <div>
                  <Label>Email (Optional)</Label>
                  <Input type="email" placeholder="email@example.com" />
                </div>
                <div>
                  <Label>ABHA Number (Optional)</Label>
                  <Input placeholder="12-3456-7890-1234" />
                </div>
                <div>
                  <Label>Aadhaar Number</Label>
                  <Input placeholder="XXXX-XXXX-XXXX" />
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h4 className="font-medium mb-3">Address Information</h4>
              <div className="grid gap-4">
                <div>
                  <Label>Address Line 1</Label>
                  <Input placeholder="House/Flat No, Building Name" />
                </div>
                <div>
                  <Label>Address Line 2 (Optional)</Label>
                  <Input placeholder="Street, Landmark" />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>City</Label>
                    <Input placeholder="City" />
                  </div>
                  <div>
                    <Label>State</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MH">Maharashtra</SelectItem>
                        <SelectItem value="GJ">Gujarat</SelectItem>
                        <SelectItem value="DL">Delhi</SelectItem>
                        <SelectItem value="KA">Karnataka</SelectItem>
                        <SelectItem value="TN">Tamil Nadu</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Pincode</Label>
                    <Input placeholder="400001" />
                  </div>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h4 className="font-medium mb-3">Economic Information</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Income Category</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BPL">Below Poverty Line (BPL)</SelectItem>
                      <SelectItem value="APL">Above Poverty Line (APL)</SelectItem>
                      <SelectItem value="AAY">Antyodaya Anna Yojana (AAY)</SelectItem>
                      <SelectItem value="Others">Others</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Ration Card Number (Optional)</Label>
                  <Input placeholder="XX-12345678" />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRegisterFamilyDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              setShowRegisterFamilyDialog(false);
              // Show success message
              alert('Family registered successfully!');
            }}>
              Register Family
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Family Dialog */}
      <Dialog open={showEditFamilyDialog} onOpenChange={setShowEditFamilyDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Family Details</DialogTitle>
            <DialogDescription>
              Update family information for {selectedFamily?.familyName}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Family Name</Label>
                <Input defaultValue={selectedFamily?.familyName} />
              </div>
              <div>
                <Label>Primary Member</Label>
                <Select defaultValue={selectedFamily?.primaryMember.patientId}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedFamily?.members.map((member: any) => (
                      <SelectItem key={member.patientId} value={member.patientId}>
                        {member.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Address Line 1</Label>
              <Input defaultValue={selectedFamily?.address.line1} />
            </div>
            <div>
              <Label>Address Line 2</Label>
              <Input defaultValue={selectedFamily?.address.line2} />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>City</Label>
                <Input defaultValue={selectedFamily?.address.city} />
              </div>
              <div>
                <Label>State</Label>
                <Input defaultValue={selectedFamily?.address.state} />
              </div>
              <div>
                <Label>Pincode</Label>
                <Input defaultValue={selectedFamily?.address.pincode} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Income Category</Label>
                <Select defaultValue={selectedFamily?.incomeCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BPL">BPL</SelectItem>
                    <SelectItem value="APL">APL</SelectItem>
                    <SelectItem value="AAY">AAY</SelectItem>
                    <SelectItem value="Others">Others</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Ration Card Number</Label>
                <Input defaultValue={selectedFamily?.rationCardNumber} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditFamilyDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              setShowEditFamilyDialog(false);
              alert('Family details updated successfully!');
            }}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Import Families Dialog */}
      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Import Families</DialogTitle>
            <DialogDescription>
              Upload a CSV or Excel file to import multiple families
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="mx-auto size-12 text-muted-foreground mb-4" />
              <p className="text-sm text-muted-foreground mb-2">
                Drag and drop your file here, or click to browse
              </p>
              <Button variant="outline">
                Select File
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                Supported formats: CSV, XLSX (Max 10MB)
              </p>
            </div>
            <div>
              <p className="text-sm font-medium mb-2">Download Template:</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download className="mr-2 size-4" />
                  CSV Template
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 size-4" />
                  Excel Template
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowImportDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              setShowImportDialog(false);
              alert('Import process started. You will be notified when complete.');
            }}>
              Import
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reports Dialog */}
      <Dialog open={showReportsDialog} onOpenChange={setShowReportsDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Family Reports</DialogTitle>
            <DialogDescription>
              Generate and download reports for {selectedFamily?.familyName}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-3">
              <Card className="cursor-pointer hover:bg-accent">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="size-5 text-blue-600" />
                      <div>
                        <p className="font-medium">Family Health Summary</p>
                        <p className="text-sm text-muted-foreground">
                          Complete medical history and current health status
                        </p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      <Download className="mr-2 size-4" />
                      PDF
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:bg-accent">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CreditCard className="size-5 text-green-600" />
                      <div>
                        <p className="font-medium">Billing Statement</p>
                        <p className="text-sm text-muted-foreground">
                          Transaction history and payment details
                        </p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      <Download className="mr-2 size-4" />
                      Excel
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:bg-accent">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Shield className="size-5 text-purple-600" />
                      <div>
                        <p className="font-medium">Insurance Claims</p>
                        <p className="text-sm text-muted-foreground">
                          Policy details and claim history
                        </p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      <Download className="mr-2 size-4" />
                      PDF
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:bg-accent">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Calendar className="size-5 text-orange-600" />
                      <div>
                        <p className="font-medium">Appointment History</p>
                        <p className="text-sm text-muted-foreground">
                          Past and upcoming appointments
                        </p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      <Download className="mr-2 size-4" />
                      PDF
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Separator />

            <div>
              <Label>Custom Date Range</Label>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <Input type="date" />
                <Input type="date" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReportsDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Member Dialog */}
      <Dialog open={showEditMemberDialog} onOpenChange={setShowEditMemberDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Member Details</DialogTitle>
            <DialogDescription>
              Update information for {selectedMember?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label>Relationship to Primary</Label>
              <Select defaultValue={selectedMember?.relationship}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {RELATIONSHIP_TYPES.map(rel => (
                    <SelectItem key={rel.value} value={rel.value}>
                      {rel.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="edit-earning" 
                  defaultChecked={selectedMember?.isEarning}
                />
                <Label htmlFor="edit-earning">Earning Member</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="edit-dependent" 
                  defaultChecked={selectedMember?.isDependent}
                />
                <Label htmlFor="edit-dependent">Dependent</Label>
              </div>
            </div>
            <Separator />
            <div>
              <h4 className="font-medium mb-3">Sharing Preferences</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Switch id="share-medical-edit" />
                  <Label htmlFor="share-medical-edit">Share Medical History</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="share-insurance-edit" defaultChecked />
                  <Label htmlFor="share-insurance-edit">Share Insurance Benefits</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="share-billing-edit" defaultChecked />
                  <Label htmlFor="share-billing-edit">Share Billing</Label>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditMemberDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              setShowEditMemberDialog(false);
              alert('Member details updated successfully!');
            }}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Remove Member Dialog */}
      <Dialog open={showRemoveMemberDialog} onOpenChange={setShowRemoveMemberDialog}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Remove Family Member</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove {selectedMember?.name} from the family?
            </DialogDescription>
          </DialogHeader>
          <Alert className="border-orange-200 bg-orange-50">
            <AlertCircle className="size-4 text-orange-600" />
            <AlertDescription>
              This action will remove the member from the family group but will not delete their patient record. 
              They can be added back later if needed.
            </AlertDescription>
          </Alert>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRemoveMemberDialog(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => {
                setShowRemoveMemberDialog(false);
                alert(`${selectedMember?.name} has been removed from the family.`);
              }}
            >
              Remove Member
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Book Appointment Dialog */}
      <Dialog open={showBookAppointmentDialog} onOpenChange={setShowBookAppointmentDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Book Family Appointment</DialogTitle>
            <DialogDescription>
              Schedule appointment for family members
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label>Appointment Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="family-checkup">Family Health Checkup</SelectItem>
                  <SelectItem value="vaccination">Vaccination</SelectItem>
                  <SelectItem value="consultation">Consultation</SelectItem>
                  <SelectItem value="health-camp">Health Camp</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Select Family Members</Label>
              <div className="space-y-2 mt-2 max-h-32 overflow-y-auto border rounded-lg p-3">
                {selectedFamily?.members.map((member: any) => (
                  <div key={member.memberId} className="flex items-center space-x-2">
                    <Checkbox id={`appt-${member.memberId}`} />
                    <Label htmlFor={`appt-${member.memberId}`} className="font-normal">
                      {member.name} ({member.age}y)
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Date</Label>
                <Input type="date" />
              </div>
              <div>
                <Label>Time</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="09:00">09:00 AM</SelectItem>
                    <SelectItem value="09:30">09:30 AM</SelectItem>
                    <SelectItem value="10:00">10:00 AM</SelectItem>
                    <SelectItem value="10:30">10:30 AM</SelectItem>
                    <SelectItem value="11:00">11:00 AM</SelectItem>
                    <SelectItem value="11:30">11:30 AM</SelectItem>
                    <SelectItem value="14:00">02:00 PM</SelectItem>
                    <SelectItem value="14:30">02:30 PM</SelectItem>
                    <SelectItem value="15:00">03:00 PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Department/Doctor</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select department or doctor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General Medicine - Dr. Amit Patel</SelectItem>
                  <SelectItem value="pediatrics">Pediatrics - Dr. Priya Singh</SelectItem>
                  <SelectItem value="gynecology">Gynecology - Dr. Meera Sharma</SelectItem>
                  <SelectItem value="cardiology">Cardiology - Dr. Raj Kumar</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Notes (Optional)</Label>
              <Textarea placeholder="Any special requirements or medical concerns..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBookAppointmentDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              setShowBookAppointmentDialog(false);
              alert('Appointment booked successfully! Confirmation sent via SMS.');
            }}>
              Book Appointment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Appointment Dialog */}
      <Dialog open={showViewAppointmentDialog} onOpenChange={setShowViewAppointmentDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Appointment Details</DialogTitle>
            <DialogDescription>
              View and manage appointment information
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Date & Time</p>
                <p className="font-medium">
                  {selectedAppointment?.date} at {selectedAppointment?.time}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Type</p>
                <p className="font-medium">{selectedAppointment?.type}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Doctor</p>
                <p className="font-medium">{selectedAppointment?.doctor}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge className="bg-green-100 text-green-800">Confirmed</Badge>
              </div>
            </div>

            <Separator />

            <div>
              <p className="text-sm text-muted-foreground mb-2">Members Included</p>
              <div className="space-y-2">
                {selectedAppointment?.members.map((member: string, index: number) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle className="size-4 text-green-600" />
                    <span className="text-sm">{member}</span>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <p className="text-sm text-muted-foreground mb-2">Appointment Token</p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-blue-600">A-045</p>
                <p className="text-xs text-muted-foreground mt-1">Show this token at reception</p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowViewAppointmentDialog(false)}>
              Close
            </Button>
            <Button variant="destructive" onClick={() => {
              setShowViewAppointmentDialog(false);
              alert('Appointment cancelled successfully.');
            }}>
              Cancel Appointment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* File Claim Dialog */}
      <Dialog open={showFileClaimDialog} onOpenChange={setShowFileClaimDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>File Insurance Claim</DialogTitle>
            <DialogDescription>
              Submit a new insurance claim for the family
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Claim Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hospitalization">Hospitalization</SelectItem>
                    <SelectItem value="opd">OPD Treatment</SelectItem>
                    <SelectItem value="diagnostic">Diagnostic Tests</SelectItem>
                    <SelectItem value="pharmacy">Pharmacy Bills</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Claim Amount</Label>
                <Input type="number" placeholder="Enter amount in ₹" />
              </div>
            </div>

            <div>
              <Label>Member(s) Involved</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select member" />
                </SelectTrigger>
                <SelectContent>
                  {selectedFamily?.members.map((member: any) => (
                    <SelectItem key={member.memberId} value={member.memberId}>
                      {member.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Treatment Date</Label>
                <Input type="date" />
              </div>
              <div>
                <Label>Hospital/Clinic</Label>
                <Input placeholder="Enter hospital name" />
              </div>
            </div>

            <div>
              <Label>Upload Documents</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <Upload className="mx-auto size-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  Upload bills, prescriptions, and reports
                </p>
                <Button variant="outline" size="sm" className="mt-2">
                  Select Files
                </Button>
              </div>
            </div>

            <div>
              <Label>Additional Notes</Label>
              <Textarea placeholder="Enter any additional information..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowFileClaimDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              setShowFileClaimDialog(false);
              alert('Claim submitted successfully! Claim ID: CLM2024001');
            }}>
              Submit Claim
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Insurance Dialog */}
      <Dialog open={showInsuranceDialog} onOpenChange={setShowInsuranceDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add Insurance Policy</DialogTitle>
            <DialogDescription>
              Link family insurance policy details
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Insurance Provider</Label>
                <Input placeholder="e.g., Star Health" />
              </div>
              <div>
                <Label>Policy Number</Label>
                <Input placeholder="Enter policy number" />
              </div>
              <div>
                <Label>Policy Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="family-floater">Family Floater</SelectItem>
                    <SelectItem value="individual">Individual</SelectItem>
                    <SelectItem value="group">Group Insurance</SelectItem>
                    <SelectItem value="government">Government Scheme</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Sum Insured</Label>
                <Input type="number" placeholder="500000" />
              </div>
              <div>
                <Label>Policy Start Date</Label>
                <Input type="date" />
              </div>
              <div>
                <Label>Policy End Date</Label>
                <Input type="date" />
              </div>
            </div>
            <div>
              <Label>Covered Members</Label>
              <div className="space-y-2 mt-2">
                {selectedFamily?.members.map((member: any) => (
                  <div key={member.memberId} className="flex items-center space-x-2">
                    <Checkbox id={member.memberId} defaultChecked />
                    <Label htmlFor={member.memberId}>{member.name}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowInsuranceDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowInsuranceDialog(false)}>
              Add Policy
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}