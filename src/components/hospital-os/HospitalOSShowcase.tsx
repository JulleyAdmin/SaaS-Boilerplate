'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Activity,
  AlertCircle,
  Ambulance,
  BarChart3,
  Bed,
  Brain,
  Building2,
  Calendar,
  Camera,
  CheckCircle2,
  ChevronRight,
  Clock,
  Cloud,
  Cpu,
  CreditCard,
  Database,
  FileText,
  Fingerprint,
  Globe,
  GraduationCap,
  Heart,
  Home,
  Hospital,
  Info,
  Key,
  Laptop,
  LineChart,
  Lock,
  Mail,
  MapPin,
  MessageSquare,
  Microscope,
  Monitor,
  Package,
  Phone,
  Pill,
  Play,
  Plus,
  RefreshCw,
  School,
  Settings,
  Shield,
  ShoppingCart,
  Smartphone,
  Stethoscope,
  Target,
  Truck,
  Users,
  Video,
  Wifi,
  Zap,
  Building,
  Siren,
  Droplet,
  FileCheck,
  Bot,
  Network,
  Workflow,
  Calculator,
  TrendingUp,
  HeartHandshake,
  UserCheck,
  BookOpen,
  Award,
  AlertTriangle,
  Radio,
  Boxes,
  Wrench,
  Utensils,
  Car,
  QrCode,
  Sparkles,
  BrainCircuit,
  Share2,
  ClipboardCheck,
  Briefcase,
  IndianRupee,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

// Module status types
type ModuleStatus = 'live' | 'beta' | 'development' | 'planned' | 'future';

// Strategy types for build vs partner
type ModuleStrategy = 'build' | 'partner' | 'hybrid';

// Module interface
interface Module {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  status: ModuleStatus;
  completion: number;
  category: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  features: string[];
  link?: string;
  estimatedDate?: string;
  dependencies?: string[];
  strategy?: ModuleStrategy;
  partners?: string[];
  savings?: string;
}

// Status configuration
const statusConfig = {
  live: {
    label: 'Live',
    color: 'bg-green-500',
    badgeVariant: 'default' as const,
    description: 'Fully operational and deployed',
  },
  beta: {
    label: 'Beta',
    color: 'bg-blue-500',
    badgeVariant: 'secondary' as const,
    description: 'Testing phase with limited access',
  },
  development: {
    label: 'In Development',
    color: 'bg-yellow-500',
    badgeVariant: 'outline' as const,
    description: 'Currently being built',
  },
  planned: {
    label: 'Planned',
    color: 'bg-purple-500',
    badgeVariant: 'outline' as const,
    description: 'Scheduled for development',
  },
  future: {
    label: 'Future',
    color: 'bg-gray-400',
    badgeVariant: 'outline' as const,
    description: 'Long-term roadmap',
  },
};

// Complete modules list with all Hospital OS capabilities
const modules: Module[] = [
  // ===== CLINICAL MODULES =====
  {
    id: 'patient-management',
    name: 'Patient Management',
    description: 'Comprehensive patient registration, demographics, and medical history management with ABHA integration',
    icon: Users,
    status: 'live',
    completion: 100,
    category: 'Clinical',
    priority: 'critical',
    features: ['Registration', 'Demographics', 'ABHA Integration', 'Medical History', 'Family Linking'],
    link: '/dashboard/patients',
    strategy: 'build',
  },
  {
    id: 'appointments',
    name: 'Appointment System',
    description: 'Advanced scheduling with multi-doctor support, automated reminders, and queue management',
    icon: Calendar,
    status: 'live',
    completion: 100,
    category: 'Clinical',
    priority: 'critical',
    features: ['Online Booking', 'Multi-Doctor', 'SMS/WhatsApp Reminders', 'Rescheduling', 'Cancellations'],
    link: '/dashboard/appointments',
    strategy: 'build',
  },
  {
    id: 'emergency',
    name: 'Emergency Department',
    description: 'Complete emergency triage system with severity assessment and automated patient routing',
    icon: Siren,
    status: 'live',
    completion: 100,
    category: 'Clinical',
    priority: 'critical',
    features: ['6-Step Triage', 'Auto-Severity', 'Fast Track', 'Trauma Management', 'Mass Casualty'],
    link: '/dashboard/emergency',
    strategy: 'build',
  },
  {
    id: 'icu-monitoring',
    name: 'ICU Monitoring',
    description: 'Real-time vital signs monitoring with predictive alerts and trend analysis',
    icon: Activity,
    status: 'live',
    completion: 100,
    category: 'Clinical',
    priority: 'critical',
    features: ['Live Vitals', 'Ventilator Modes', 'APACHE Scoring', 'Alert System', 'Trend Charts'],
    link: '/dashboard/icu',
    strategy: 'build',
  },
  {
    id: 'doctor-dashboard',
    name: 'Doctor Workspace',
    description: 'Integrated consultation interface with cross-department history and clinical decision support',
    icon: Stethoscope,
    status: 'live',
    completion: 100,
    category: 'Clinical',
    priority: 'critical',
    features: ['Consultations', 'E-Prescriptions', 'Lab Orders', 'Cross-Department View', 'Clinical Notes'],
    link: '/dashboard/doctor',
    strategy: 'build',
  },
  {
    id: 'radiology-pacs',
    name: 'Radiology & PACS',
    description: 'Medical imaging with DICOM viewer, PACS integration, and teleradiology support',
    icon: Camera,
    status: 'planned',
    completion: 15,
    category: 'Clinical',
    priority: 'critical',
    features: ['DICOM Viewer', 'PACS Server', '3D Reconstruction', 'Teleradiology', 'Image Annotation'],
    estimatedDate: 'Q2 2025',
    strategy: 'partner',
    partners: ['PostDICOM', 'Orthanc', '5C Network'],
    savings: '90% cost, 5 months faster',
  },
  {
    id: 'operation-theatre',
    name: 'Operation Theatre',
    description: 'Complete OT management with scheduling, safety checklists, and equipment tracking',
    icon: Heart,
    status: 'planned',
    completion: 10,
    category: 'Clinical',
    priority: 'critical',
    features: ['OT Scheduling', 'Surgical Safety', 'Anesthesia Records', 'CSSD Integration', 'Equipment Tracking'],
    estimatedDate: 'Q2 2025',
  },
  {
    id: 'blood-bank',
    name: 'Blood Bank',
    description: 'Blood inventory management with donor tracking and transfusion safety',
    icon: Droplet,
    status: 'planned',
    completion: 5,
    category: 'Clinical',
    priority: 'high',
    features: ['Donor Management', 'Component Tracking', 'Cross-Matching', 'Transfusion Records', 'Emergency Requisition'],
    estimatedDate: 'Q3 2025',
  },
  {
    id: 'clinical-decision-support',
    name: 'Clinical Decision Support',
    description: 'AI-powered clinical guidelines, drug interactions, and treatment recommendations',
    icon: Brain,
    status: 'development',
    completion: 30,
    category: 'Clinical',
    priority: 'high',
    features: ['Evidence Guidelines', 'Drug Interactions', 'Clinical Pathways', 'Risk Scoring', 'Predictive Analytics'],
    estimatedDate: 'Q3 2025',
  },

  // ===== DIAGNOSTIC MODULES =====
  {
    id: 'laboratory',
    name: 'Laboratory System',
    description: 'Complete LIS with barcode tracking, analyzer integration, and quality control',
    icon: Microscope,
    status: 'beta',
    completion: 70,
    category: 'Diagnostics',
    priority: 'high',
    features: ['Sample Tracking', 'Barcode Integration', 'Analyzer Connection', 'Quality Control', 'Critical Alerts'],
    link: '/dashboard/lab',
  },
  {
    id: 'pharmacy',
    name: 'Pharmacy Management',
    description: 'Comprehensive pharmacy system with inventory, dispensing, and drug interaction checks',
    icon: Pill,
    status: 'live',
    completion: 100,
    category: 'Diagnostics',
    priority: 'critical',
    features: ['Inventory Management', 'Prescription Queue', 'Dispensing', 'Expiry Tracking', 'Purchase Orders'],
    link: '/dashboard/pharmacy',
  },

  // ===== ADMINISTRATIVE MODULES =====
  {
    id: 'billing-revenue',
    name: 'Billing & Revenue Cycle',
    description: 'Advanced billing with insurance claims, government schemes, and revenue management',
    icon: CreditCard,
    status: 'live',
    completion: 85,
    category: 'Administrative',
    priority: 'critical',
    features: ['Invoice Generation', 'Insurance Claims', 'Government Schemes', 'Payment Plans', 'Revenue Analytics'],
    link: '/dashboard/billing',
  },
  {
    id: 'inventory-supply',
    name: 'Inventory & Supply Chain',
    description: 'Central stores management with auto-reordering and vendor portal',
    icon: Package,
    status: 'development',
    completion: 40,
    category: 'Administrative',
    priority: 'high',
    features: ['Central Stores', 'Auto-Reordering', 'Vendor Portal', 'Consignment', 'Demand Forecasting'],
    estimatedDate: 'Q2 2025',
  },
  {
    id: 'staff-management',
    name: 'Staff Management',
    description: 'Complete HR system with duty scheduling, leave management, and payroll integration',
    icon: UserCheck,
    status: 'beta',
    completion: 60,
    category: 'Administrative',
    priority: 'high',
    features: ['Duty Roster', 'Leave Management', 'Attendance', 'Performance', 'Payroll Integration'],
    link: '/dashboard/staff',
  },
  {
    id: 'asset-management',
    name: 'Asset Management',
    description: 'Medical equipment tracking with RFID/IoT, maintenance scheduling, and utilization analytics',
    icon: Wrench,
    status: 'planned',
    completion: 10,
    category: 'Administrative',
    priority: 'medium',
    features: ['RFID Tracking', 'Maintenance', 'Calibration', 'Warranty', 'Utilization Analytics'],
    estimatedDate: 'Q3 2025',
  },
  {
    id: 'facility-management',
    name: 'Facility Management',
    description: 'Housekeeping, biomedical waste, laundry, and visitor management',
    icon: Building2,
    status: 'planned',
    completion: 5,
    category: 'Administrative',
    priority: 'low',
    features: ['Housekeeping', 'Waste Management', 'Laundry', 'Cafeteria', 'Visitor Management'],
    estimatedDate: 'Q4 2025',
  },

  // ===== PATIENT ENGAGEMENT =====
  {
    id: 'patient-portal',
    name: 'Patient Portal & Mobile Apps',
    description: 'Native iOS/Android apps for appointments, results, and health records',
    icon: Smartphone,
    status: 'development',
    completion: 35,
    category: 'Patient Engagement',
    priority: 'high',
    features: ['Mobile Apps', 'Appointment Booking', 'Lab Results', 'Health Records', 'Bill Payments'],
    estimatedDate: 'Q2 2025',
  },
  {
    id: 'telemedicine',
    name: 'Telemedicine Platform',
    description: 'Video consultations with e-prescriptions and remote monitoring',
    icon: Video,
    status: 'planned',
    completion: 20,
    category: 'Patient Engagement',
    priority: 'high',
    features: ['Video Calls', 'Virtual Waiting', 'E-Prescriptions', 'Remote Monitoring', 'Recording'],
    estimatedDate: 'Q2 2025',
  },
  {
    id: 'crm-marketing',
    name: 'CRM & Marketing',
    description: 'Patient relationship management with marketing automation and loyalty programs',
    icon: TrendingUp,
    status: 'live',
    completion: 80,
    category: 'Patient Engagement',
    priority: 'medium',
    features: ['Lead Management', 'Campaigns', 'Segmentation', 'Loyalty Programs', 'Referral Tracking'],
    link: '/dashboard/crm/leads',
  },
  {
    id: 'csr-programs',
    name: 'CSR & Community Health',
    description: 'Corporate social responsibility with health camps and volunteer management',
    icon: HeartHandshake,
    status: 'live',
    completion: 75,
    category: 'Patient Engagement',
    priority: 'low',
    features: ['Health Camps', 'Volunteer Management', 'Community Programs', 'Impact Tracking', 'Donations'],
    link: '/dashboard/csr/programs',
  },

  // ===== ANALYTICS & INTELLIGENCE =====
  {
    id: 'business-intelligence',
    name: 'Business Intelligence',
    description: 'Real-time dashboards with predictive analytics and custom reports',
    icon: BarChart3,
    status: 'development',
    completion: 45,
    category: 'Analytics',
    priority: 'high',
    features: ['Executive Dashboards', 'Predictive Analytics', 'Custom Reports', 'KPI Tracking', 'Data Warehouse'],
    link: '/dashboard/analytics',
  },
  {
    id: 'ai-ml-platform',
    name: 'AI/ML Platform',
    description: 'Machine learning models for disease prediction, NLP, and computer vision',
    icon: BrainCircuit,
    status: 'development',
    completion: 25,
    category: 'Analytics',
    priority: 'high',
    features: ['Disease Prediction', 'Readmission Risk', 'NLP Clinical Notes', 'Computer Vision', 'Chatbots'],
    estimatedDate: 'Q3 2025',
  },
  {
    id: 'quality-management',
    name: 'Quality Management',
    description: 'Incident reporting, clinical audits, and NABH/JCI compliance tracking',
    icon: Award,
    status: 'planned',
    completion: 15,
    category: 'Analytics',
    priority: 'high',
    features: ['Incident Reporting', 'Root Cause Analysis', 'Clinical Audits', 'Compliance Tracking', 'Patient Safety'],
    estimatedDate: 'Q3 2025',
  },

  // ===== TECHNOLOGY & INTEGRATION =====
  {
    id: 'interoperability',
    name: 'Interoperability & Standards',
    description: 'HL7 FHIR APIs, DICOM support, and national health stack integration',
    icon: Share2,
    status: 'development',
    completion: 30,
    category: 'Technology',
    priority: 'critical',
    features: ['HL7 FHIR', 'DICOM', 'ABDM Integration', 'HIE Connectivity', 'API Gateway'],
    estimatedDate: 'Q1 2025',
  },
  {
    id: 'security-compliance',
    name: 'Security & Compliance',
    description: 'Advanced security with encryption, biometrics, and HIPAA/GDPR compliance',
    icon: Shield,
    status: 'live',
    completion: 90,
    category: 'Technology',
    priority: 'critical',
    features: ['Role-Based Access', 'Audit Trails', 'Encryption', 'HIPAA/GDPR', 'Biometrics'],
    link: '/dashboard/settings',
  },
  {
    id: 'iot-smart-hospital',
    name: 'IoT & Smart Hospital',
    description: 'Smart beds, environmental monitoring, and indoor navigation',
    icon: Wifi,
    status: 'future',
    completion: 5,
    category: 'Technology',
    priority: 'low',
    features: ['Smart Beds', 'Environmental Monitoring', 'Energy Management', 'Indoor Navigation', 'Smart Parking'],
    estimatedDate: 'Q4 2025',
  },
  {
    id: 'rpa-automation',
    name: 'Robotic Process Automation',
    description: 'Automated workflows for reports, insurance verification, and data entry',
    icon: Bot,
    status: 'future',
    completion: 5,
    category: 'Technology',
    priority: 'low',
    features: ['Report Automation', 'Insurance Bots', 'Data Entry', 'Document OCR', 'Workflow Automation'],
    estimatedDate: 'Q4 2025',
  },
  {
    id: 'communication-platform',
    name: 'Unified Communications',
    description: 'Secure messaging, video conferencing, and VOIP integration',
    icon: MessageSquare,
    status: 'beta',
    completion: 65,
    category: 'Technology',
    priority: 'medium',
    features: ['Secure Messaging', 'Video Calls', 'Team Collaboration', 'VOIP Integration', 'WhatsApp API'],
    link: '/dashboard/messages',
  },

  // ===== EDUCATION & TRAINING =====
  {
    id: 'learning-management',
    name: 'Learning Management System',
    description: 'Staff training, certification tracking, and CME credit management',
    icon: GraduationCap,
    status: 'planned',
    completion: 10,
    category: 'Education',
    priority: 'medium',
    features: ['Training Modules', 'Certifications', 'CME Credits', 'Assessments', 'Policy Training'],
    estimatedDate: 'Q3 2025',
  },

  // ===== EMERGENCY & DISASTER =====
  {
    id: 'mass-casualty',
    name: 'Mass Casualty Management',
    description: 'Disaster response protocols with command center dashboard',
    icon: AlertTriangle,
    status: 'planned',
    completion: 10,
    category: 'Emergency',
    priority: 'medium',
    features: ['Disaster Protocols', 'Triage Coding', 'Resource Mobilization', 'Command Center', 'Surge Planning'],
    estimatedDate: 'Q3 2025',
  },
  {
    id: 'ambulance-ems',
    name: 'Ambulance & EMS',
    description: 'GPS tracking, pre-hospital care, and real-time vitals transmission',
    icon: Truck,
    status: 'planned',
    completion: 15,
    category: 'Emergency',
    priority: 'medium',
    features: ['GPS Tracking', 'Pre-Hospital Care', 'Vitals Transmission', 'Hospital Alerts', 'Traffic Integration'],
    estimatedDate: 'Q3 2025',
  },
];

// Calculate overall progress
const calculateOverallProgress = () => {
  const totalCompletion = modules.reduce((acc, module) => acc + module.completion, 0);
  return Math.round(totalCompletion / modules.length);
};

// Get module statistics
const getModuleStats = () => {
  const stats = {
    live: modules.filter(m => m.status === 'live').length,
    beta: modules.filter(m => m.status === 'beta').length,
    development: modules.filter(m => m.status === 'development').length,
    planned: modules.filter(m => m.status === 'planned').length,
    future: modules.filter(m => m.status === 'future').length,
    total: modules.length,
  };
  return stats;
};

// Module card component
const ModuleCard: React.FC<{ module: Module }> = ({ module }) => {
  const router = useRouter();
  const Icon = module.icon;
  const status = statusConfig[module.status];

  const handleClick = () => {
    if (module.link) {
      router.push(module.link);
    }
  };

  return (
    <Card 
      className={cn(
        "relative overflow-hidden transition-all duration-300 hover:shadow-lg",
        module.link && "cursor-pointer hover:scale-[1.02]",
        module.status === 'live' && "border-green-200 bg-green-50/30",
        module.status === 'beta' && "border-blue-200 bg-blue-50/30",
        module.status === 'development' && "border-yellow-200 bg-yellow-50/30",
        module.status === 'planned' && "border-purple-200 bg-purple-50/30",
        module.status === 'future' && "border-gray-200 bg-gray-50/30"
      )}
      onClick={handleClick}
    >
      {/* Status indicator */}
      <div className={cn("absolute top-0 right-0 w-24 h-24 -mr-12 -mt-12 rounded-full opacity-10", status.color)} />
      
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              "p-2 rounded-lg",
              module.status === 'live' && "bg-green-100 text-green-700",
              module.status === 'beta' && "bg-blue-100 text-blue-700",
              module.status === 'development' && "bg-yellow-100 text-yellow-700",
              module.status === 'planned' && "bg-purple-100 text-purple-700",
              module.status === 'future' && "bg-gray-100 text-gray-700"
            )}>
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                {module.name}
                {module.link && <ChevronRight className="h-4 w-4 text-gray-400" />}
              </CardTitle>
            </div>
          </div>
          <Badge variant={status.badgeVariant} className="text-xs">
            {status.label}
          </Badge>
        </div>
        <CardDescription className="mt-2 text-sm">
          {module.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs text-gray-600">
            <span>Completion</span>
            <span className="font-medium">{module.completion}%</span>
          </div>
          <Progress value={module.completion} className="h-2" />
        </div>

        {/* Features */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-gray-600">Key Features:</p>
          <div className="flex flex-wrap gap-1">
            {module.features.slice(0, 3).map((feature, idx) => (
              <Badge key={idx} variant="outline" className="text-xs px-2 py-0.5">
                {feature}
              </Badge>
            ))}
            {module.features.length > 3 && (
              <Badge variant="outline" className="text-xs px-2 py-0.5 bg-gray-50">
                +{module.features.length - 3} more
              </Badge>
            )}
          </div>
        </div>

        {/* Metadata */}
        <div className="flex items-center justify-between pt-2 border-t">
          <Badge 
            variant="outline" 
            className={cn(
              "text-xs",
              module.priority === 'critical' && "border-red-200 bg-red-50",
              module.priority === 'high' && "border-orange-200 bg-orange-50",
              module.priority === 'medium' && "border-yellow-200 bg-yellow-50",
              module.priority === 'low' && "border-gray-200 bg-gray-50"
            )}
          >
            {module.priority} priority
          </Badge>
          {module.estimatedDate && (
            <span className="text-xs text-gray-500">
              ETA: {module.estimatedDate}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default function HospitalOSShowcase() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const stats = getModuleStats();
  const overallProgress = calculateOverallProgress();

  // Filter modules
  const filteredModules = modules.filter(module => {
    const categoryMatch = selectedCategory === 'all' || module.category === selectedCategory;
    const statusMatch = selectedStatus === 'all' || module.status === selectedStatus;
    return categoryMatch && statusMatch;
  });

  // Get unique categories
  const categories = ['all', ...Array.from(new Set(modules.map(m => m.category)))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white">
        <div className="container mx-auto px-6 py-16">
          <div className="flex items-center justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Hospital className="h-12 w-12" />
                <h1 className="text-4xl font-bold">Hospital OS</h1>
              </div>
              <p className="text-xl text-blue-100">
                Complete Digital Healthcare Platform - From HMS to Hospital Operating System
              </p>
              <p className="text-lg text-blue-100 max-w-3xl">
                Transforming healthcare delivery with 30+ integrated modules covering clinical care, 
                operations, patient engagement, and advanced analytics. Built for the future of healthcare.
              </p>
            </div>
            <div className="hidden lg:block">
              <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
                <div className="text-center space-y-2">
                  <div className="text-5xl font-bold">{overallProgress}%</div>
                  <div className="text-sm">Overall Completion</div>
                  <Progress value={overallProgress} className="h-3 bg-white/20" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Bar */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-6 py-6">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.live}</div>
              <div className="text-sm text-gray-600">Live Modules</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.beta}</div>
              <div className="text-sm text-gray-600">Beta Testing</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{stats.development}</div>
              <div className="text-sm text-gray-600">In Development</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.planned}</div>
              <div className="text-sm text-gray-600">Planned</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">{stats.future}</div>
              <div className="text-sm text-gray-600">Future</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-sm text-gray-600">Total Modules</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Info Alert */}
        <Alert className="mb-8 border-blue-200 bg-blue-50">
          <Info className="h-4 w-4" />
          <AlertTitle>Hospital OS Transformation Journey</AlertTitle>
          <AlertDescription>
            This comprehensive platform represents our vision for modern healthcare delivery. 
            Click on any live or beta module to explore its features. Our roadmap includes 
            regular updates as we progress from HMS to a complete Hospital Operating System.
          </AlertDescription>
        </Alert>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          <Tabs defaultValue="all" value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="grid grid-cols-4 lg:grid-cols-8 w-full">
              {categories.map(category => (
                <TabsTrigger key={category} value={category} className="text-xs">
                  {category === 'all' ? 'All Modules' : category}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <div className="flex gap-2 flex-wrap">
            <Button
              variant={selectedStatus === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedStatus('all')}
            >
              All Status
            </Button>
            {Object.entries(statusConfig).map(([key, config]) => (
              <Button
                key={key}
                variant={selectedStatus === key ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedStatus(key)}
                className="gap-2"
              >
                <div className={cn("w-2 h-2 rounded-full", config.color)} />
                {config.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {filteredModules.map(module => (
            <ModuleCard key={module.id} module={module} />
          ))}
        </div>

        {/* Key Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="border-green-200 bg-green-50/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                Indian Healthcare Ready
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Badge className="h-1.5 w-1.5 p-0 bg-green-600" />
                  ABHA & Aadhaar Integration
                </li>
                <li className="flex items-center gap-2">
                  <Badge className="h-1.5 w-1.5 p-0 bg-green-600" />
                  Government Schemes (PM-JAY, CGHS, ESI)
                </li>
                <li className="flex items-center gap-2">
                  <Badge className="h-1.5 w-1.5 p-0 bg-green-600" />
                  ABDM Compliance Ready
                </li>
                <li className="flex items-center gap-2">
                  <Badge className="h-1.5 w-1.5 p-0 bg-green-600" />
                  Multi-language Support
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-blue-50/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-600" />
                Enterprise Security
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Badge className="h-1.5 w-1.5 p-0 bg-blue-600" />
                  HIPAA & GDPR Compliant
                </li>
                <li className="flex items-center gap-2">
                  <Badge className="h-1.5 w-1.5 p-0 bg-blue-600" />
                  Role-Based Access (95+ Roles)
                </li>
                <li className="flex items-center gap-2">
                  <Badge className="h-1.5 w-1.5 p-0 bg-blue-600" />
                  End-to-End Encryption
                </li>
                <li className="flex items-center gap-2">
                  <Badge className="h-1.5 w-1.5 p-0 bg-blue-600" />
                  Comprehensive Audit Trails
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-purple-50/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-600" />
                AI-Powered Future
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Badge className="h-1.5 w-1.5 p-0 bg-purple-600" />
                  Predictive Analytics
                </li>
                <li className="flex items-center gap-2">
                  <Badge className="h-1.5 w-1.5 p-0 bg-purple-600" />
                  Clinical Decision Support
                </li>
                <li className="flex items-center gap-2">
                  <Badge className="h-1.5 w-1.5 p-0 bg-purple-600" />
                  NLP for Clinical Notes
                </li>
                <li className="flex items-center gap-2">
                  <Badge className="h-1.5 w-1.5 p-0 bg-purple-600" />
                  Computer Vision for Imaging
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Configuration Options Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">Flexible Configuration for Every Healthcare Provider</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Small Clinic Configuration */}
            <Card className="border-blue-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Building className="h-5 w-5 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg">Small Clinics</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">
                  Single doctor practices and small clinics (1-5 doctors)
                </p>
                <div className="space-y-2">
                  <p className="text-xs font-medium text-gray-700">Essential Modules:</p>
                  <ul className="text-xs space-y-1 text-gray-600">
                    <li className="flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3 text-green-500" />
                      Patient Management
                    </li>
                    <li className="flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3 text-green-500" />
                      Appointments & Queue
                    </li>
                    <li className="flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3 text-green-500" />
                      Basic Billing
                    </li>
                    <li className="flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3 text-green-500" />
                      Prescriptions
                    </li>
                    <li className="flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3 text-green-500" />
                      WhatsApp Integration
                    </li>
                  </ul>
                </div>
                <div className="pt-2 border-t">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Starting at</span>
                    <span className="font-bold text-blue-600">₹5,000/month</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Multi-Specialty Clinic */}
            <Card className="border-green-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Building2 className="h-5 w-5 text-green-600" />
                  </div>
                  <CardTitle className="text-lg">Multi-Specialty Clinics</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">
                  Polyclinics and diagnostic centers (5-20 doctors)
                </p>
                <div className="space-y-2">
                  <p className="text-xs font-medium text-gray-700">Includes Small Clinic + :</p>
                  <ul className="text-xs space-y-1 text-gray-600">
                    <li className="flex items-center gap-1">
                      <Plus className="h-3 w-3 text-green-500" />
                      Department Management
                    </li>
                    <li className="flex items-center gap-1">
                      <Plus className="h-3 w-3 text-green-500" />
                      Lab Management
                    </li>
                    <li className="flex items-center gap-1">
                      <Plus className="h-3 w-3 text-green-500" />
                      Pharmacy System
                    </li>
                    <li className="flex items-center gap-1">
                      <Plus className="h-3 w-3 text-green-500" />
                      Insurance Claims
                    </li>
                    <li className="flex items-center gap-1">
                      <Plus className="h-3 w-3 text-green-500" />
                      Multi-location Support
                    </li>
                  </ul>
                </div>
                <div className="pt-2 border-t">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Starting at</span>
                    <span className="font-bold text-green-600">₹15,000/month</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Medium Hospitals */}
            <Card className="border-purple-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Hospital className="h-5 w-5 text-purple-600" />
                  </div>
                  <CardTitle className="text-lg">Medium Hospitals</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">
                  50-200 bed hospitals with multiple departments
                </p>
                <div className="space-y-2">
                  <p className="text-xs font-medium text-gray-700">Complete Suite + :</p>
                  <ul className="text-xs space-y-1 text-gray-600">
                    <li className="flex items-center gap-1">
                      <Plus className="h-3 w-3 text-purple-500" />
                      IPD & Ward Management
                    </li>
                    <li className="flex items-center gap-1">
                      <Plus className="h-3 w-3 text-purple-500" />
                      OT Management
                    </li>
                    <li className="flex items-center gap-1">
                      <Plus className="h-3 w-3 text-purple-500" />
                      ICU Monitoring
                    </li>
                    <li className="flex items-center gap-1">
                      <Plus className="h-3 w-3 text-purple-500" />
                      Radiology/PACS
                    </li>
                    <li className="flex items-center gap-1">
                      <Plus className="h-3 w-3 text-purple-500" />
                      Blood Bank
                    </li>
                  </ul>
                </div>
                <div className="pt-2 border-t">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Starting at</span>
                    <span className="font-bold text-purple-600">₹50,000/month</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Large Hospital Chains */}
            <Card className="border-orange-200 hover:shadow-lg transition-shadow relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-orange-500 text-white text-xs px-2 py-1 rounded-bl">
                Enterprise
              </div>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Building2 className="h-5 w-5 text-orange-600" />
                  </div>
                  <CardTitle className="text-lg">Hospital Chains</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">
                  200+ bed hospitals and multi-city chains
                </p>
                <div className="space-y-2">
                  <p className="text-xs font-medium text-gray-700">Enterprise Features:</p>
                  <ul className="text-xs space-y-1 text-gray-600">
                    <li className="flex items-center gap-1">
                      <Zap className="h-3 w-3 text-orange-500" />
                      Multi-Hospital Network
                    </li>
                    <li className="flex items-center gap-1">
                      <Zap className="h-3 w-3 text-orange-500" />
                      Central Command Center
                    </li>
                    <li className="flex items-center gap-1">
                      <Zap className="h-3 w-3 text-orange-500" />
                      AI/ML Analytics
                    </li>
                    <li className="flex items-center gap-1">
                      <Zap className="h-3 w-3 text-orange-500" />
                      Telemedicine Platform
                    </li>
                    <li className="flex items-center gap-1">
                      <Zap className="h-3 w-3 text-orange-500" />
                      Custom Integrations
                    </li>
                  </ul>
                </div>
                <div className="pt-2 border-t">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Custom Pricing</span>
                    <span className="font-bold text-orange-600">Contact Sales</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Specialized Configurations */}
        <div className="mb-12">
          <h3 className="text-xl font-semibold mb-6 text-center">Specialized Healthcare Configurations</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Standalone Lab */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <Microscope className="h-5 w-5 text-red-600" />
                  </div>
                  <CardTitle className="text-lg">Diagnostic Labs</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-gray-600">
                  Standalone pathology labs and diagnostic centers
                </p>
                <div className="space-y-2">
                  <ul className="text-xs space-y-1 text-gray-600">
                    <li>• Sample Collection & Tracking</li>
                    <li>• Barcode Integration</li>
                    <li>• Analyzer Connectivity</li>
                    <li>• Report Generation & Delivery</li>
                    <li>• Home Collection Management</li>
                    <li>• B2B Portal for Clinics</li>
                    <li>• Quality Control & NABL Compliance</li>
                  </ul>
                </div>
                <Badge variant="outline" className="text-xs">
                  ₹10,000/month onwards
                </Badge>
              </CardContent>
            </Card>

            {/* Standalone Pharmacy */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-teal-100 rounded-lg">
                    <Pill className="h-5 w-5 text-teal-600" />
                  </div>
                  <CardTitle className="text-lg">Pharmacy Chains</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-gray-600">
                  Retail pharmacies and pharmacy chains
                </p>
                <div className="space-y-2">
                  <ul className="text-xs space-y-1 text-gray-600">
                    <li>• Inventory Management</li>
                    <li>• E-Prescription Integration</li>
                    <li>• Drug Interaction Checks</li>
                    <li>• Expiry Management</li>
                    <li>• GST Billing</li>
                    <li>• Loyalty Programs</li>
                    <li>• Multi-Store Management</li>
                  </ul>
                </div>
                <Badge variant="outline" className="text-xs">
                  ₹3,000/month onwards
                </Badge>
              </CardContent>
            </Card>

            {/* Specialty Centers */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <Heart className="h-5 w-5 text-indigo-600" />
                  </div>
                  <CardTitle className="text-lg">Specialty Centers</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-gray-600">
                  Dialysis, IVF, Eye Care, Dental, etc.
                </p>
                <div className="space-y-2">
                  <ul className="text-xs space-y-1 text-gray-600">
                    <li>• Specialty-Specific Workflows</li>
                    <li>• Treatment Protocols</li>
                    <li>• Package Management</li>
                    <li>• Equipment Scheduling</li>
                    <li>• Outcome Tracking</li>
                    <li>• Compliance Reporting</li>
                    <li>• Research Data Collection</li>
                  </ul>
                </div>
                <Badge variant="outline" className="text-xs">
                  Custom Configuration
                </Badge>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Deployment Options */}
        <div className="mb-12">
          <h3 className="text-xl font-semibold mb-6 text-center">Flexible Deployment Options</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-blue-200 bg-blue-50/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cloud className="h-5 w-5 text-blue-600" />
                  Cloud (SaaS)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p className="text-gray-600">Fully managed cloud solution</p>
                <ul className="text-xs space-y-1 text-gray-600">
                  <li>✓ No infrastructure setup</li>
                  <li>✓ Automatic updates</li>
                  <li>✓ 99.9% uptime SLA</li>
                  <li>✓ Instant scalability</li>
                  <li>✓ Pay-as-you-go pricing</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-green-50/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5 text-green-600" />
                  On-Premise
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p className="text-gray-600">Installed on your servers</p>
                <ul className="text-xs space-y-1 text-gray-600">
                  <li>✓ Complete data control</li>
                  <li>✓ Customizable infrastructure</li>
                  <li>✓ No internet dependency</li>
                  <li>✓ One-time license fee</li>
                  <li>✓ Full compliance control</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-purple-200 bg-purple-50/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RefreshCw className="h-5 w-5 text-purple-600" />
                  Hybrid
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p className="text-gray-600">Best of both worlds</p>
                <ul className="text-xs space-y-1 text-gray-600">
                  <li>✓ Critical data on-premise</li>
                  <li>✓ Non-critical on cloud</li>
                  <li>✓ Disaster recovery</li>
                  <li>✓ Flexible scaling</li>
                  <li>✓ Optimized costs</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Integration Ecosystem */}
        <Card className="mb-12 border-2 border-blue-200">
          <CardHeader className="bg-blue-50">
            <CardTitle className="flex items-center gap-2">
              <Network className="h-5 w-5 text-blue-600" />
              Integration Ecosystem
            </CardTitle>
            <CardDescription>
              Seamlessly connect with your existing healthcare infrastructure
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[
                { name: 'Government', items: ['ABDM', 'CoWIN', 'e-Sanjeevani', 'PM-JAY'] },
                { name: 'Payment', items: ['Razorpay', 'Paytm', 'PhonePe', 'UPI'] },
                { name: 'Insurance', items: ['TPA APIs', 'IRDA', 'Claim APIs', 'Eligibility'] },
                { name: 'Lab Equipment', items: ['Roche', 'Siemens', 'Abbott', 'Beckman'] },
                { name: 'Communication', items: ['WhatsApp', 'SMS', 'Email', 'Push'] },
                { name: 'Standards', items: ['HL7 FHIR', 'DICOM', 'LOINC', 'SNOMED'] },
              ].map((category, idx) => (
                <div key={idx} className="space-y-2">
                  <h4 className="font-medium text-sm text-gray-700">{category.name}</h4>
                  <ul className="text-xs space-y-1 text-gray-500">
                    {category.items.map((item, i) => (
                      <li key={i}>• {item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-blue-600 to-green-600 text-white border-0">
          <CardContent className="p-8">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold">Ready to Transform Your Healthcare Facility?</h2>
              <p className="text-blue-100 max-w-3xl mx-auto">
                Whether you're a small clinic or a large hospital chain, Hospital OS adapts to your needs. 
                Our modular architecture ensures you only pay for what you use, with the flexibility to 
                scale as you grow. Join 500+ healthcare providers already using Hospital OS.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto pt-4">
                <div className="text-center">
                  <div className="text-3xl font-bold">500+</div>
                  <div className="text-sm text-blue-100">Healthcare Facilities</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">10M+</div>
                  <div className="text-sm text-blue-100">Patients Served</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">99.9%</div>
                  <div className="text-sm text-blue-100">Uptime SLA</div>
                </div>
              </div>
              <div className="flex gap-4 justify-center pt-4">
                <Button size="lg" variant="secondary">
                  Get Personalized Quote
                </Button>
                <Button size="lg" variant="outline" className="bg-white/10 text-white border-white/30 hover:bg-white/20">
                  Schedule Live Demo
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}