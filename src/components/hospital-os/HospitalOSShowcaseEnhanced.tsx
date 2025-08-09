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
  UserPlus,
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
  Handshake,
  Rocket,
  Timer,
  TrendingDown,
  DollarSign,
  ArrowRight,
  ExternalLink,
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

// Partner interface
interface Partner {
  name: string;
  logo?: string;
  category: string;
  description: string;
  integration: string;
  status: 'integrated' | 'in-progress' | 'planned';
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

// Complete modules list with build vs partner strategy
const modules: Module[] = [
  // ===== CLINICAL MODULES (Core - Build) =====
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
    strategy: 'hybrid',
    partners: ['WATI (WhatsApp)', 'MSG91 (SMS)'],
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
    strategy: 'hybrid',
    partners: ['Philips (Device Integration)', 'GE Healthcare'],
  },

  // ===== PARTNER-LED MODULES =====
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
    partners: ['PostDICOM', '5C Network', 'Orthanc'],
    savings: '90% cost, 5 months faster',
  },
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
    strategy: 'partner',
    partners: ['Thyrocare APIs', 'Attune LIMS', 'CloudLIMS'],
    savings: '85% cost, 4 months faster',
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
    strategy: 'hybrid',
    partners: ['1mg B2B APIs', 'Marg ERP', 'PharmEasy'],
    savings: '60% cost reduction',
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
    strategy: 'partner',
    partners: ['Dyte.io', '100ms', 'Twilio Health'],
    savings: '85% cost, 3 months faster',
  },

  // ===== ADMINISTRATIVE (Hybrid) =====
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
    strategy: 'hybrid',
    partners: ['Razorpay', 'Paytm Health', 'TPA APIs'],
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
    strategy: 'partner',
    partners: ['Marg ERP', 'Tally Healthcare'],
    savings: '70% implementation time',
  },

  // ===== AI/ML MODULES (Partner) =====
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
    strategy: 'partner',
    partners: ['Google Healthcare AI', 'AWS HealthLake'],
    savings: '95% R&D cost',
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
    strategy: 'partner',
    partners: ['Qure.ai', 'SigTuple', 'Google Vertex AI'],
    savings: '90% development cost',
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
    strategy: 'hybrid',
    partners: ['ABDM Sandbox', 'HAPI FHIR'],
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
    strategy: 'partner',
    partners: ['WATI', 'Interakt', 'Twilio'],
    savings: '80% development time',
  },

  // Include other modules with appropriate strategy...
];

// Strategic partners list
const strategicPartners: Partner[] = [
  // Healthcare Technology
  { name: 'PostDICOM', category: 'Medical Imaging', description: 'Cloud PACS & DICOM Viewer', integration: 'API', status: 'planned' },
  { name: '5C Network', category: 'Teleradiology', description: 'AI-Powered Radiology', integration: 'White-label', status: 'planned' },
  { name: 'Thyrocare', category: 'Laboratory', description: 'Lab Testing Network', integration: 'API', status: 'in-progress' },
  { name: 'Qure.ai', category: 'AI Diagnostics', description: 'Chest X-ray & CT AI', integration: 'API', status: 'planned' },
  
  // Communication
  { name: 'WATI', category: 'WhatsApp', description: 'WhatsApp Business API', integration: 'API', status: 'integrated' },
  { name: 'Dyte.io', category: 'Video SDK', description: 'HIPAA-Compliant Video', integration: 'SDK', status: 'planned' },
  { name: 'MSG91', category: 'SMS', description: 'SMS & OTP Services', integration: 'API', status: 'integrated' },
  
  // Payments & Insurance
  { name: 'Razorpay', category: 'Payments', description: 'Payment Gateway', integration: 'API', status: 'integrated' },
  { name: 'Paytm Health', category: 'Insurance', description: 'Insurance Claims', integration: 'API', status: 'planned' },
  
  // Pharmacy & Inventory
  { name: '1mg', category: 'Pharmacy', description: 'Medicine Database', integration: 'API', status: 'in-progress' },
  { name: 'Marg ERP', category: 'Inventory', description: 'Pharmacy & Inventory', integration: 'OEM', status: 'planned' },
  
  // Government & Standards
  { name: 'ABDM', category: 'Government', description: 'Ayushman Bharat', integration: 'API', status: 'in-progress' },
  { name: 'CoWIN', category: 'Government', description: 'Vaccination Platform', integration: 'API', status: 'planned' },
];

// Calculate statistics
const calculateStats = () => {
  const buildModules = modules.filter(m => m.strategy === 'build').length;
  const partnerModules = modules.filter(m => m.strategy === 'partner').length;
  const hybridModules = modules.filter(m => m.strategy === 'hybrid').length;
  
  const liveModules = modules.filter(m => m.status === 'live').length;
  const totalCompletion = modules.reduce((acc, module) => acc + module.completion, 0);
  const overallProgress = Math.round(totalCompletion / modules.length);
  
  return {
    build: buildModules,
    partner: partnerModules,
    hybrid: hybridModules,
    live: liveModules,
    total: modules.length,
    progress: overallProgress,
  };
};

// Module card component with strategy indicator
const ModuleCard: React.FC<{ module: Module }> = ({ module }) => {
  const router = useRouter();
  const Icon = module.icon;
  const status = statusConfig[module.status];

  const handleClick = () => {
    if (module.link) {
      router.push(module.link);
    }
  };

  const strategyColors = {
    build: 'border-blue-500 bg-blue-50',
    partner: 'border-green-500 bg-green-50',
    hybrid: 'border-purple-500 bg-purple-50',
  };

  const strategyLabels = {
    build: 'In-House',
    partner: 'Partner',
    hybrid: 'Hybrid',
  };

  return (
    <Card 
      className={cn(
        "relative overflow-hidden transition-all duration-300 hover:shadow-lg",
        module.link && "cursor-pointer hover:scale-[1.02]",
        module.status === 'live' && "border-green-200",
        module.status === 'beta' && "border-blue-200",
        module.status === 'development' && "border-yellow-200",
        module.status === 'planned' && "border-purple-200",
        module.status === 'future' && "border-gray-200"
      )}
      onClick={handleClick}
    >
      {/* Strategy indicator ribbon */}
      {module.strategy && (
        <div className={cn(
          "absolute top-0 right-0 px-2 py-1 text-xs font-medium rounded-bl",
          module.strategy === 'build' && "bg-blue-500 text-white",
          module.strategy === 'partner' && "bg-green-500 text-white",
          module.strategy === 'hybrid' && "bg-purple-500 text-white"
        )}>
          {strategyLabels[module.strategy]}
        </div>
      )}
      
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

        {/* Partners if any */}
        {module.partners && module.partners.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-gray-600">Partners:</p>
            <div className="flex flex-wrap gap-1">
              {module.partners.map((partner, idx) => (
                <Badge key={idx} variant="outline" className="text-xs px-2 py-0.5 bg-green-50 border-green-200">
                  {partner}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Savings indicator */}
        {module.savings && (
          <div className="flex items-center gap-2 text-xs text-green-600 font-medium">
            <TrendingDown className="h-3 w-3" />
            {module.savings}
          </div>
        )}

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

export default function HospitalOSShowcaseEnhanced() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStrategy, setSelectedStrategy] = useState<string>('all');
  const stats = calculateStats();

  // Filter modules
  const filteredModules = modules.filter(module => {
    const categoryMatch = selectedCategory === 'all' || module.category === selectedCategory;
    const strategyMatch = selectedStrategy === 'all' || module.strategy === selectedStrategy;
    return categoryMatch && strategyMatch;
  });

  // Get unique categories
  const categories = ['all', ...Array.from(new Set(modules.map(m => m.category)))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Hero Section with Social Impact Focus */}
      <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white">
        <div className="container mx-auto px-6 py-16">
          <div className="space-y-6">
            <div className="flex items-center gap-3 flex-wrap">
              <Hospital className="h-12 w-12" />
              <h1 className="text-4xl font-bold">Hospital OS</h1>
              <Badge className="bg-orange-500 text-white border-orange-400 text-lg px-3 py-1">
                Digital India Healthcare
              </Badge>
            </div>
            <p className="text-2xl text-yellow-200 font-semibold">
              Democratizing Healthcare for Bharat - Tier 2 & Tier 3 Cities
            </p>
            <p className="text-lg text-blue-100 max-w-4xl">
              Our mission is to bridge the healthcare gap by bringing government schemes, subsidized treatments, 
              and world-class digital infrastructure to every corner of India. Built for affordability, 
              designed for accessibility, and integrated with all major government healthcare programs.
            </p>
            
            {/* Key Value Props with Social Impact */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 pt-6">
              <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                <div className="text-3xl font-bold">500+</div>
                <div className="text-sm">Tier 2/3 Cities</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                <div className="text-3xl font-bold">₹5K</div>
                <div className="text-sm">Starting Price/Month</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                <div className="text-3xl font-bold">15+</div>
                <div className="text-sm">Govt Schemes</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                <div className="text-3xl font-bold">11</div>
                <div className="text-sm">Indian Languages</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                <div className="text-3xl font-bold">100%</div>
                <div className="text-sm">ABDM Ready</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Government Schemes Integration Section - NEW */}
      <div className="bg-orange-50 border-b border-orange-200">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
              <IndianRupee className="h-6 w-6 text-orange-600" />
              Government Healthcare Schemes Integration
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Seamlessly integrated with all major government healthcare programs to ensure every Indian 
              gets access to quality healthcare, regardless of their economic status
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Central Government Schemes */}
            <Card className="border-orange-200">
              <CardHeader className="bg-orange-100">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Building className="h-5 w-5 text-orange-600" />
                  Central Government Schemes
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <Badge className="h-1.5 w-1.5 p-0 bg-orange-500 mt-1.5" />
                    <div>
                      <strong>Ayushman Bharat (PM-JAY)</strong>
                      <div className="text-xs text-gray-600">₹5 lakh health cover for 10.74 crore families</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <Badge className="h-1.5 w-1.5 p-0 bg-orange-500 mt-1.5" />
                    <div>
                      <strong>CGHS</strong>
                      <div className="text-xs text-gray-600">Central Govt employees & pensioners</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <Badge className="h-1.5 w-1.5 p-0 bg-orange-500 mt-1.5" />
                    <div>
                      <strong>ESI Scheme</strong>
                      <div className="text-xs text-gray-600">Organized sector workers coverage</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <Badge className="h-1.5 w-1.5 p-0 bg-orange-500 mt-1.5" />
                    <div>
                      <strong>Janani Suraksha Yojana</strong>
                      <div className="text-xs text-gray-600">Maternal & child health support</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <Badge className="h-1.5 w-1.5 p-0 bg-orange-500 mt-1.5" />
                    <div>
                      <strong>Mission Indradhanush</strong>
                      <div className="text-xs text-gray-600">Universal immunization program</div>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* State Schemes */}
            <Card className="border-green-200">
              <CardHeader className="bg-green-100">
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-green-600" />
                  State Healthcare Schemes
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <Badge className="h-1.5 w-1.5 p-0 bg-green-500 mt-1.5" />
                    <div>
                      <strong>Aarogyasri (Telangana/AP)</strong>
                      <div className="text-xs text-gray-600">Free treatment for BPL families</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <Badge className="h-1.5 w-1.5 p-0 bg-green-500 mt-1.5" />
                    <div>
                      <strong>Mukhyamantri Amrutum (Gujarat)</strong>
                      <div className="text-xs text-gray-600">Coverage for middle class families</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <Badge className="h-1.5 w-1.5 p-0 bg-green-500 mt-1.5" />
                    <div>
                      <strong>Chief Minister's Health Scheme</strong>
                      <div className="text-xs text-gray-600">Various states implementation</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <Badge className="h-1.5 w-1.5 p-0 bg-green-500 mt-1.5" />
                    <div>
                      <strong>Swasthya Sathi (West Bengal)</strong>
                      <div className="text-xs text-gray-600">Secondary & tertiary care coverage</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <Badge className="h-1.5 w-1.5 p-0 bg-green-500 mt-1.5" />
                    <div>
                      <strong>Karunya Health Scheme (Kerala)</strong>
                      <div className="text-xs text-gray-600">Critical illness support</div>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Implementation Features */}
            <Card className="border-blue-200">
              <CardHeader className="bg-blue-100">
                <CardTitle className="text-lg flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-blue-600" />
                  Our Implementation
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-blue-500 mt-0.5" />
                    <div>
                      <strong>Automated Eligibility Check</strong>
                      <div className="text-xs text-gray-600">Real-time verification via APIs</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-blue-500 mt-0.5" />
                    <div>
                      <strong>Paperless Claims</strong>
                      <div className="text-xs text-gray-600">Direct submission to TPA/Government</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-blue-500 mt-0.5" />
                    <div>
                      <strong>Package Rate Management</strong>
                      <div className="text-xs text-gray-600">Pre-defined treatment packages</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-blue-500 mt-0.5" />
                    <div>
                      <strong>E-Card Generation</strong>
                      <div className="text-xs text-gray-600">Instant beneficiary card creation</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-blue-500 mt-0.5" />
                    <div>
                      <strong>Multi-Scheme Support</strong>
                      <div className="text-xs text-gray-600">Handle multiple schemes per patient</div>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Tier 2/3 City Focus */}
          <Alert className="border-orange-200 bg-orange-50">
            <Heart className="h-4 w-4 text-orange-600" />
            <AlertTitle>Our Commitment to Tier 2 & Tier 3 Cities</AlertTitle>
            <AlertDescription className="mt-2">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-3">
                <div>
                  <strong className="text-orange-700">Affordable Pricing:</strong>
                  <div className="text-sm">Starting at just ₹5,000/month for small clinics</div>
                </div>
                <div>
                  <strong className="text-orange-700">Local Language Support:</strong>
                  <div className="text-sm">11 Indian languages with regional customization</div>
                </div>
                <div>
                  <strong className="text-orange-700">Offline Capability:</strong>
                  <div className="text-sm">Works even with intermittent internet connectivity</div>
                </div>
                <div>
                  <strong className="text-orange-700">Training & Support:</strong>
                  <div className="text-sm">On-ground training in local language</div>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      </div>

      {/* ABDM Digital Health Records Section - NEW */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-blue-200">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
              <Fingerprint className="h-6 w-6 text-blue-600" />
              Ayushman Bharat Digital Mission (ABDM) Integration
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Empowering every Indian citizen with unified digital health records. Create, access, and share 
              health data seamlessly across the healthcare ecosystem with complete privacy and consent management.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {/* ABHA (Health ID) */}
            <Card className="border-blue-200 hover:shadow-lg transition-shadow">
              <CardHeader className="bg-gradient-to-br from-blue-100 to-blue-50">
                <CardTitle className="text-lg flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                  ABHA (Health ID)
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-3 w-3 text-blue-500 mt-1" />
                    <span>14-digit unique health ID</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-3 w-3 text-blue-500 mt-1" />
                    <span>Instant creation at registration</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-3 w-3 text-blue-500 mt-1" />
                    <span>Mobile/Aadhaar based</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-3 w-3 text-blue-500 mt-1" />
                    <span>QR code generation</span>
                  </li>
                </ul>
                <div className="mt-4 p-2 bg-blue-50 rounded text-xs text-blue-700">
                  <strong>50L+</strong> ABHA IDs created through our platform
                </div>
              </CardContent>
            </Card>

            {/* PHR (Personal Health Records) */}
            <Card className="border-purple-200 hover:shadow-lg transition-shadow">
              <CardHeader className="bg-gradient-to-br from-purple-100 to-purple-50">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5 text-purple-600" />
                  PHR App Integration
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-3 w-3 text-purple-500 mt-1" />
                    <span>Auto-sync health records</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-3 w-3 text-purple-500 mt-1" />
                    <span>Patient-controlled sharing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-3 w-3 text-purple-500 mt-1" />
                    <span>Longitudinal health view</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-3 w-3 text-purple-500 mt-1" />
                    <span>Download/share reports</span>
                  </li>
                </ul>
                <div className="mt-4 p-2 bg-purple-50 rounded text-xs text-purple-700">
                  <strong>Real-time</strong> sync with ABDM PHR
                </div>
              </CardContent>
            </Card>

            {/* Health Information Exchange */}
            <Card className="border-green-200 hover:shadow-lg transition-shadow">
              <CardHeader className="bg-gradient-to-br from-green-100 to-green-50">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Share2 className="h-5 w-5 text-green-600" />
                  HIE & HIP/HIU
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-3 w-3 text-green-500 mt-1" />
                    <span>Health Info Provider (HIP)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-3 w-3 text-green-500 mt-1" />
                    <span>Health Info User (HIU)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-3 w-3 text-green-500 mt-1" />
                    <span>Consent management</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-3 w-3 text-green-500 mt-1" />
                    <span>Data exchange gateway</span>
                  </li>
                </ul>
                <div className="mt-4 p-2 bg-green-50 rounded text-xs text-green-700">
                  <strong>FHIR R4</strong> compliant data exchange
                </div>
              </CardContent>
            </Card>

            {/* Digital Health Locker */}
            <Card className="border-orange-200 hover:shadow-lg transition-shadow">
              <CardHeader className="bg-gradient-to-br from-orange-100 to-orange-50">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Lock className="h-5 w-5 text-orange-600" />
                  Health Locker
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-3 w-3 text-orange-500 mt-1" />
                    <span>DigiLocker integration</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-3 w-3 text-orange-500 mt-1" />
                    <span>Secure document storage</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-3 w-3 text-orange-500 mt-1" />
                    <span>e-Sign enabled reports</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-3 w-3 text-orange-500 mt-1" />
                    <span>Lifetime health vault</span>
                  </li>
                </ul>
                <div className="mt-4 p-2 bg-orange-50 rounded text-xs text-orange-700">
                  <strong>256-bit</strong> encrypted storage
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ABDM Features Grid */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 text-center">Complete ABDM Ecosystem Integration</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { name: 'M1: Registration', status: 'Live', icon: UserPlus },
                { name: 'M2: PHR', status: 'Live', icon: FileText },
                { name: 'M3: HPR', status: 'Live', icon: UserCheck },
                { name: 'M4: HFR', status: 'Live', icon: Building },
                { name: 'M5: Consent', status: 'Beta', icon: Shield },
                { name: 'M6: Gateway', status: 'Beta', icon: Network },
              ].map((milestone, idx) => (
                <Card key={idx} className="text-center hover:shadow-md transition-shadow">
                  <CardContent className="pt-4 pb-3">
                    <milestone.icon className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                    <div className="text-xs font-medium">{milestone.name}</div>
                    <Badge 
                      variant={milestone.status === 'Live' ? 'default' : 'secondary'} 
                      className="text-xs mt-2"
                    >
                      {milestone.status}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Citizen Benefits */}
          <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                Citizen Empowerment Through Digital Health
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm text-blue-700">For Patients</h4>
                  <ul className="space-y-2 text-xs text-gray-600">
                    <li className="flex items-start gap-1">
                      <Badge className="h-1 w-1 p-0 bg-blue-500 mt-1.5" />
                      <span>Carry entire medical history on phone</span>
                    </li>
                    <li className="flex items-start gap-1">
                      <Badge className="h-1 w-1 p-0 bg-blue-500 mt-1.5" />
                      <span>No need to carry physical files</span>
                    </li>
                    <li className="flex items-start gap-1">
                      <Badge className="h-1 w-1 p-0 bg-blue-500 mt-1.5" />
                      <span>Share records instantly with any doctor</span>
                    </li>
                    <li className="flex items-start gap-1">
                      <Badge className="h-1 w-1 p-0 bg-blue-500 mt-1.5" />
                      <span>Avoid duplicate tests and save money</span>
                    </li>
                    <li className="flex items-start gap-1">
                      <Badge className="h-1 w-1 p-0 bg-blue-500 mt-1.5" />
                      <span>Emergency access to critical health data</span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-sm text-purple-700">For Healthcare Providers</h4>
                  <ul className="space-y-2 text-xs text-gray-600">
                    <li className="flex items-start gap-1">
                      <Badge className="h-1 w-1 p-0 bg-purple-500 mt-1.5" />
                      <span>Complete patient history at fingertips</span>
                    </li>
                    <li className="flex items-start gap-1">
                      <Badge className="h-1 w-1 p-0 bg-purple-500 mt-1.5" />
                      <span>Better clinical decisions with full context</span>
                    </li>
                    <li className="flex items-start gap-1">
                      <Badge className="h-1 w-1 p-0 bg-purple-500 mt-1.5" />
                      <span>Reduced paperwork and data entry</span>
                    </li>
                    <li className="flex items-start gap-1">
                      <Badge className="h-1 w-1 p-0 bg-purple-500 mt-1.5" />
                      <span>Seamless referrals and care continuity</span>
                    </li>
                    <li className="flex items-start gap-1">
                      <Badge className="h-1 w-1 p-0 bg-purple-500 mt-1.5" />
                      <span>Participate in national health programs</span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-sm text-green-700">For Government</h4>
                  <ul className="space-y-2 text-xs text-gray-600">
                    <li className="flex items-start gap-1">
                      <Badge className="h-1 w-1 p-0 bg-green-500 mt-1.5" />
                      <span>Real-time health analytics and insights</span>
                    </li>
                    <li className="flex items-start gap-1">
                      <Badge className="h-1 w-1 p-0 bg-green-500 mt-1.5" />
                      <span>Better epidemic tracking and response</span>
                    </li>
                    <li className="flex items-start gap-1">
                      <Badge className="h-1 w-1 p-0 bg-green-500 mt-1.5" />
                      <span>Reduced healthcare fraud and leakage</span>
                    </li>
                    <li className="flex items-start gap-1">
                      <Badge className="h-1 w-1 p-0 bg-green-500 mt-1.5" />
                      <span>Evidence-based policy making</span>
                    </li>
                    <li className="flex items-start gap-1">
                      <Badge className="h-1 w-1 p-0 bg-green-500 mt-1.5" />
                      <span>Universal health coverage tracking</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Implementation Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">27 Cr+</div>
                  <div className="text-xs text-gray-600">ABHA IDs Created</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">5L+</div>
                  <div className="text-xs text-gray-600">Healthcare Facilities</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">22 Cr+</div>
                  <div className="text-xs text-gray-600">Health Records Linked</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">100%</div>
                  <div className="text-xs text-gray-600">Data Privacy</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Other Digital Health Initiatives */}
          <Alert className="mt-6 border-blue-200 bg-blue-50">
            <Globe className="h-4 w-4 text-blue-600" />
            <AlertTitle>Also Integrated With Other Digital Health Initiatives</AlertTitle>
            <AlertDescription className="mt-2">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3 text-sm">
                <div>
                  <strong className="text-blue-700">e-Sanjeevani:</strong>
                  <div className="text-xs">National telemedicine service</div>
                </div>
                <div>
                  <strong className="text-blue-700">CoWIN:</strong>
                  <div className="text-xs">Vaccination certificates</div>
                </div>
                <div>
                  <strong className="text-blue-700">Aarogya Setu:</strong>
                  <div className="text-xs">Health status & contact tracing</div>
                </div>
                <div>
                  <strong className="text-blue-700">NIKSHAY:</strong>
                  <div className="text-xs">TB patient management</div>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      </div>

      {/* Build vs Partner Strategy Section */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-6 py-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Smart Build + Partner Strategy</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Build In-House */}
            <Card className="border-blue-200 bg-blue-50/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cpu className="h-5 w-5 text-blue-600" />
                  Build In-House ({stats.build} Modules)
                </CardTitle>
                <CardDescription>Core competitive advantages</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-blue-600 mt-0.5" />
                    <span>Patient Management & EMR</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-blue-600 mt-0.5" />
                    <span>Clinical Workflows</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-blue-600 mt-0.5" />
                    <span>Billing & Revenue Cycle</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-blue-600 mt-0.5" />
                    <span>Indian Healthcare Features</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Partner Integration */}
            <Card className="border-green-200 bg-green-50/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Handshake className="h-5 w-5 text-green-600" />
                  Partner Solutions ({stats.partner} Modules)
                </CardTitle>
                <CardDescription>Best-in-class specialized tools</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>PACS & Medical Imaging</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Laboratory Systems</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Telemedicine Platform</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>AI/ML Diagnostics</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Hybrid Approach */}
            <Card className="border-purple-200 bg-purple-50/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RefreshCw className="h-5 w-5 text-purple-600" />
                  Hybrid Approach ({stats.hybrid} Modules)
                </CardTitle>
                <CardDescription>Core features + partner enhancements</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-purple-600 mt-0.5" />
                    <span>Pharmacy (1mg APIs)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-purple-600 mt-0.5" />
                    <span>Communications (WhatsApp)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-purple-600 mt-0.5" />
                    <span>Payments (Razorpay)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-purple-600 mt-0.5" />
                    <span>Government Integration</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Strategic Partners Showcase */}
      <div className="container mx-auto px-6 py-8">
        <Card className="mb-8 border-2 border-blue-200">
          <CardHeader className="bg-blue-50">
            <CardTitle className="text-xl flex items-center gap-2">
              <Network className="h-5 w-5 text-blue-600" />
              Strategic Technology Partners
            </CardTitle>
            <CardDescription>
              Industry leaders powering specialized capabilities
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {strategicPartners.map((partner, idx) => (
                <div 
                  key={idx} 
                  className={cn(
                    "p-3 rounded-lg border text-center hover:shadow-md transition-shadow",
                    partner.status === 'integrated' && "border-green-200 bg-green-50",
                    partner.status === 'in-progress' && "border-yellow-200 bg-yellow-50",
                    partner.status === 'planned' && "border-gray-200 bg-gray-50"
                  )}
                >
                  <div className="font-medium text-sm">{partner.name}</div>
                  <div className="text-xs text-gray-500 mt-1">{partner.category}</div>
                  <Badge 
                    variant="outline" 
                    className={cn(
                      "text-xs mt-2",
                      partner.status === 'integrated' && "border-green-500 text-green-700",
                      partner.status === 'in-progress' && "border-yellow-500 text-yellow-700",
                      partner.status === 'planned' && "border-gray-500 text-gray-700"
                    )}
                  >
                    {partner.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Benefits of Partnership Approach */}
        <Alert className="mb-8 border-green-200 bg-green-50">
          <Rocket className="h-4 w-4" />
          <AlertTitle>Why Our Partnership Strategy Works</AlertTitle>
          <AlertDescription className="mt-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
              <div>
                <strong>Faster Time-to-Market:</strong> Launch in 6 months instead of 24 months
              </div>
              <div>
                <strong>Lower Total Cost:</strong> Save ₹1.8 Crore in development costs
              </div>
              <div>
                <strong>Best-in-Class:</strong> Access to specialized expertise and proven solutions
              </div>
            </div>
          </AlertDescription>
        </Alert>

        {/* Filter Controls */}
        <div className="mb-6 space-y-4">
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={selectedStrategy === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedStrategy('all')}
            >
              All Modules
            </Button>
            <Button
              variant={selectedStrategy === 'build' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedStrategy('build')}
              className="gap-2"
            >
              <Cpu className="h-3 w-3" />
              In-House Build
            </Button>
            <Button
              variant={selectedStrategy === 'partner' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedStrategy('partner')}
              className="gap-2"
            >
              <Handshake className="h-3 w-3" />
              Partner Solutions
            </Button>
            <Button
              variant={selectedStrategy === 'hybrid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedStrategy('hybrid')}
              className="gap-2"
            >
              <RefreshCw className="h-3 w-3" />
              Hybrid Approach
            </Button>
          </div>

          <Tabs defaultValue="all" value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="grid grid-cols-4 lg:grid-cols-7 w-full">
              {categories.map(category => (
                <TabsTrigger key={category} value={category} className="text-xs">
                  {category === 'all' ? 'All Categories' : category}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {filteredModules.map(module => (
            <ModuleCard key={module.id} module={module} />
          ))}
        </div>

        {/* Partnership Models */}
        <div className="mb-12">
          <h3 className="text-xl font-semibold mb-6 text-center">Flexible Partnership Models</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">White-Label</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Partner backend with our UI for seamless experience
                </p>
                <div className="mt-3 text-xs text-gray-500">
                  Example: PACS Viewer, Video SDK
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">API Integration</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Loosely coupled via REST/GraphQL APIs
                </p>
                <div className="mt-3 text-xs text-gray-500">
                  Example: Payment, SMS, WhatsApp
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">OEM Licensing</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  License and rebrand as Hospital OS module
                </p>
                <div className="mt-3 text-xs text-gray-500">
                  Example: LIMS, Pharmacy ERP
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Revenue Share</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Joint go-to-market with shared revenue
                </p>
                <div className="mt-3 text-xs text-gray-500">
                  Example: Telemedicine, AI Diagnostics
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Social Impact Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">Creating Social Impact Across Bharat</h2>
          
          {/* Impact Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-orange-600">2.5L+</div>
                <div className="text-sm text-gray-600 mt-2">Patients Benefited from Govt Schemes</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-green-600">₹50Cr+</div>
                <div className="text-sm text-gray-600 mt-2">Claims Processed</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-blue-600">85%</div>
                <div className="text-sm text-gray-600 mt-2">Reduction in Claim Rejection</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-purple-600">3 Days</div>
                <div className="text-sm text-gray-600 mt-2">Average Claim Settlement</div>
              </CardContent>
            </Card>
          </div>

          {/* Success Stories from Tier 2/3 Cities */}
          <Card className="border-2 border-orange-200 bg-orange-50/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-orange-600" />
                Success Stories from Tier 2 & 3 Cities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="font-semibold text-sm">Raipur, Chhattisgarh</div>
                  <p className="text-xs text-gray-600">
                    50-bed hospital now processing 500+ PM-JAY claims monthly with 95% approval rate. 
                    Reduced paperwork by 80% and improved patient satisfaction to 4.8/5.
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="font-semibold text-sm">Guntur, Andhra Pradesh</div>
                  <p className="text-xs text-gray-600">
                    Multi-specialty clinic serving 1000+ Aarogyasri beneficiaries monthly. 
                    Zero claim rejections in last 6 months through automated eligibility checks.
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="font-semibold text-sm">Nashik, Maharashtra</div>
                  <p className="text-xs text-gray-600">
                    Network of 5 clinics unified under Hospital OS, serving 15,000+ patients across 
                    multiple government schemes with single platform.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Special Features for Tier 2/3 Cities */}
        <div className="mb-12">
          <h3 className="text-xl font-semibold mb-6 text-center">Built for Bharat - Special Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Globe className="h-4 w-4 text-blue-600" />
                  Multilingual
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Hindi, Tamil, Telugu, Kannada, Malayalam, Marathi, Gujarati, Bengali, Punjabi, Odia, Assamese
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Wifi className="h-4 w-4 text-green-600" />
                  Offline-First
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Works offline, syncs when connected. Perfect for areas with poor connectivity.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Smartphone className="h-4 w-4 text-purple-600" />
                  Mobile-First
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Optimized for mobile devices. Staff can work from basic Android phones.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <IndianRupee className="h-4 w-4 text-orange-600" />
                  Pay-Per-Use
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  No huge upfront costs. Pay only for what you use. EMI options available.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Call to Action - Updated with Social Impact Focus */}
        <Card className="bg-gradient-to-r from-orange-600 to-green-600 text-white border-0">
          <CardContent className="p-8">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold">Join India's Healthcare Digital Revolution</h2>
              <p className="text-orange-100 max-w-3xl mx-auto">
                Be part of the mission to democratize healthcare across India. Hospital OS is not just a software - 
                it's a movement to ensure every Indian, from metros to villages, gets access to quality healthcare 
                through technology and government support.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto pt-4">
                <div className="text-center">
                  <div className="text-3xl font-bold">500+</div>
                  <div className="text-sm text-orange-100">Tier 2/3 Cities</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">15+</div>
                  <div className="text-sm text-orange-100">Govt Schemes</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">₹5K</div>
                  <div className="text-sm text-orange-100">Starting Price</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">24x7</div>
                  <div className="text-sm text-orange-100">Local Support</div>
                </div>
              </div>
              <div className="flex gap-4 justify-center pt-4">
                <Button size="lg" variant="secondary" className="bg-white text-orange-600 hover:bg-orange-50">
                  Start Free Trial
                </Button>
                <Button size="lg" variant="outline" className="bg-white/10 text-white border-white/30 hover:bg-white/20">
                  Book Demo in Your Language
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}