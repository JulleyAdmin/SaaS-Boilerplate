'use client';

import {
  Activity,
  BrainCircuit,
  Building,
  Building2,
  Calendar,
  Camera,
  CheckCircle2,
  ChevronRight,
  Cpu,
  CreditCard,
  Eye,
  FileText,
  Fingerprint,
  Flag,
  Handshake,
  Heart,
  HeartHandshake,
  Home,
  Hospital,
  Layers,
  Lightbulb,
  Lock,
  MapPin,
  Microscope,
  Network,
  Phone,
  Pill,
  RefreshCw,
  Rocket,
  Share2,
  Siren,
  Star,
  Stethoscope,
  Target,
  TrendingDown,
  UserCheck,
  Users,
  Video,
  Workflow,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

// Module types and interfaces
type ModuleStatus = 'live' | 'beta' | 'development' | 'planned' | 'future';
type ModuleStrategy = 'build' | 'partner' | 'hybrid';

type Module = {
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
};

type Partner = {
  name: string;
  logo?: string;
  category: string;
  description: string;
  integration: string;
  status: 'integrated' | 'in-progress' | 'planned';
};

type SolutionPackage = {
  id: string;
  name: string;
  target: string;
  price: string;
  features: string[];
  modules: string[];
  icon: React.ElementType;
  color: string;
  popular?: boolean;
};

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

// Complete modules list
const modules: Module[] = [
  // Clinical Modules
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
];

// Strategic partners
const strategicPartners: Partner[] = [
  { name: 'PostDICOM', category: 'Medical Imaging', description: 'Cloud PACS & DICOM Viewer', integration: 'API', status: 'planned' },
  { name: '5C Network', category: 'Teleradiology', description: 'AI-Powered Radiology', integration: 'White-label', status: 'planned' },
  { name: 'Thyrocare', category: 'Laboratory', description: 'Lab Testing Network', integration: 'API', status: 'in-progress' },
  { name: 'Qure.ai', category: 'AI Diagnostics', description: 'Chest X-ray & CT AI', integration: 'API', status: 'planned' },
  { name: 'WATI', category: 'WhatsApp', description: 'WhatsApp Business API', integration: 'API', status: 'integrated' },
  { name: 'Dyte.io', category: 'Video SDK', description: 'HIPAA-Compliant Video', integration: 'SDK', status: 'planned' },
  { name: 'MSG91', category: 'SMS', description: 'SMS & OTP Services', integration: 'API', status: 'integrated' },
  { name: 'Razorpay', category: 'Payments', description: 'Payment Gateway', integration: 'API', status: 'integrated' },
  { name: 'Paytm Health', category: 'Insurance', description: 'Insurance Claims', integration: 'API', status: 'planned' },
  { name: '1mg', category: 'Pharmacy', description: 'Medicine Database', integration: 'API', status: 'in-progress' },
  { name: 'Marg ERP', category: 'Inventory', description: 'Pharmacy & Inventory', integration: 'OEM', status: 'planned' },
  { name: 'ABDM', category: 'Government', description: 'Ayushman Bharat', integration: 'API', status: 'in-progress' },
];

// Solution packages
const solutionPackages: SolutionPackage[] = [
  {
    id: 'clinic-essential',
    name: 'Clinic Essential',
    target: 'Small Clinics (1-5 Doctors)',
    price: '₹5,000/month',
    features: [
      'Patient Management',
      'Appointments',
      'Basic Billing',
      'Prescription',
      'SMS Integration',
      'Government Schemes',
    ],
    modules: ['patient-management', 'appointments', 'billing-revenue'],
    icon: Home,
    color: 'blue',
  },
  {
    id: 'clinic-pro',
    name: 'Clinic Pro',
    target: 'Medium Clinics (5-15 Doctors)',
    price: '₹15,000/month',
    features: [
      'Everything in Essential',
      'Pharmacy Management',
      'Lab Integration',
      'WhatsApp Automation',
      'Queue Management',
      'Analytics Dashboard',
    ],
    modules: ['patient-management', 'appointments', 'billing-revenue', 'pharmacy', 'laboratory'],
    icon: Building2,
    color: 'green',
    popular: true,
  },
  {
    id: 'hospital-standard',
    name: 'Hospital Standard',
    target: '50-100 Bed Hospitals',
    price: '₹50,000/month',
    features: [
      'Everything in Pro',
      'Emergency & ICU',
      'Ward Management',
      'Inventory Control',
      'Staff Management',
      'ABDM Integration',
    ],
    modules: ['patient-management', 'appointments', 'billing-revenue', 'pharmacy', 'laboratory', 'emergency', 'icu-monitoring'],
    icon: Hospital,
    color: 'purple',
  },
  {
    id: 'hospital-enterprise',
    name: 'Hospital Enterprise',
    target: '100+ Bed Hospitals',
    price: 'Custom Pricing',
    features: [
      'Everything in Standard',
      'PACS & Radiology',
      'OT Management',
      'Blood Bank',
      'Telemedicine',
      'AI Analytics',
      'Custom Integrations',
    ],
    modules: ['all'],
    icon: Building,
    color: 'orange',
  },
];

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

  const strategyLabels = {
    build: 'In-House',
    partner: 'Partner',
    hybrid: 'Hybrid',
  };

  return (
    <Card
      className={cn(
        'relative overflow-hidden transition-all duration-300 hover:shadow-lg',
        module.link && 'cursor-pointer hover:scale-[1.02]',
        module.status === 'live' && 'border-green-200',
        module.status === 'beta' && 'border-blue-200',
        module.status === 'development' && 'border-yellow-200',
        module.status === 'planned' && 'border-purple-200',
        module.status === 'future' && 'border-gray-200',
      )}
      onClick={handleClick}
    >
      {module.strategy && (
        <div className={cn(
          'absolute top-0 right-0 px-2 py-1 text-xs font-medium rounded-bl',
          module.strategy === 'build' && 'bg-blue-500 text-white',
          module.strategy === 'partner' && 'bg-green-500 text-white',
          module.strategy === 'hybrid' && 'bg-purple-500 text-white',
        )}
        >
          {strategyLabels[module.strategy]}
        </div>
      )}

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              'p-2 rounded-lg',
              module.status === 'live' && 'bg-green-100 text-green-700',
              module.status === 'beta' && 'bg-blue-100 text-blue-700',
              module.status === 'development' && 'bg-yellow-100 text-yellow-700',
              module.status === 'planned' && 'bg-purple-100 text-purple-700',
              module.status === 'future' && 'bg-gray-100 text-gray-700',
            )}
            >
              <Icon className="size-5" />
            </div>
            <div>
              <CardTitle className="flex items-center gap-2 text-lg">
                {module.name}
                {module.link && <ChevronRight className="size-4 text-gray-400" />}
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
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-600">
            <span>Completion</span>
            <span className="font-medium">
              {module.completion}
              %
            </span>
          </div>
          <Progress value={module.completion} className="h-2" />
        </div>

        {module.partners && module.partners.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-gray-600">Partners:</p>
            <div className="flex flex-wrap gap-1">
              {module.partners.slice(0, 2).map((partner, idx) => (
                <Badge key={idx} variant="outline" className="border-green-200 bg-green-50 px-2 py-0.5 text-xs">
                  {partner}
                </Badge>
              ))}
              {module.partners.length > 2 && (
                <Badge variant="outline" className="bg-gray-50 px-2 py-0.5 text-xs">
                  +
                  {module.partners.length - 2}
                  {' '}
                  more
                </Badge>
              )}
            </div>
          </div>
        )}

        {module.savings && (
          <div className="flex items-center gap-2 text-xs font-medium text-green-600">
            <TrendingDown className="size-3" />
            {module.savings}
          </div>
        )}

        <div className="flex items-center justify-between border-t pt-2">
          <Badge
            variant="outline"
            className={cn(
              'text-xs',
              module.priority === 'critical' && 'border-red-200 bg-red-50',
              module.priority === 'high' && 'border-orange-200 bg-orange-50',
              module.priority === 'medium' && 'border-yellow-200 bg-yellow-50',
              module.priority === 'low' && 'border-gray-200 bg-gray-50',
            )}
          >
            {module.priority}
            {' '}
            priority
          </Badge>
          {module.estimatedDate && (
            <span className="text-xs text-gray-500">
              ETA:
              {' '}
              {module.estimatedDate}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default function HospitalOSShowcaseTabbed() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStrategy, setSelectedStrategy] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('vision');

  // Filter modules
  const filteredModules = modules.filter((module) => {
    const categoryMatch = selectedCategory === 'all' || module.category === selectedCategory;
    const strategyMatch = selectedStrategy === 'all' || module.strategy === selectedStrategy;
    return categoryMatch && strategyMatch;
  });

  // Get unique categories
  const categories = ['all', ...Array.from(new Set(modules.map(m => m.category)))];

  // Calculate statistics
  const stats = {
    totalModules: modules.length,
    liveModules: modules.filter(m => m.status === 'live').length,
    buildModules: modules.filter(m => m.strategy === 'build').length,
    partnerModules: modules.filter(m => m.strategy === 'partner').length,
    hybridModules: modules.filter(m => m.strategy === 'hybrid').length,
    overallProgress: Math.round(modules.reduce((acc, m) => acc + m.completion, 0) / modules.length),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white">
        <div className="container mx-auto px-6 py-16">
          <div className="space-y-6">
            {/* Company Branding */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-white/20 p-2 backdrop-blur">
                  <Hospital className="size-8" />
                </div>
                <div>
                  <div className="text-sm font-medium text-blue-200">Powered by</div>
                  <h2 className="text-xl font-bold">Julley Online Pvt Ltd</h2>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge className="border-orange-400 bg-orange-500 px-3 py-1 text-white">
                  T-Hub Startup
                </Badge>
                <Badge className="border-yellow-400 bg-yellow-500 px-3 py-1 text-white">
                  Launching Q4 2025
                </Badge>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-5xl font-bold">Hospital OS</h1>
              <Badge className="border-white/30 bg-white/20 px-3 py-1 text-lg text-white">
                Digital India Healthcare Platform
              </Badge>
            </div>
            <p className="text-2xl font-semibold text-yellow-200">
              Democratizing Healthcare for Bharat - Tier 2 & Tier 3 Cities
            </p>
            <p className="max-w-4xl text-lg text-blue-100">
              A revolutionary healthcare operating system from Hyderabad's innovation hub,
              integrated with government schemes, built for affordability, designed for accessibility.
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4 pt-6 md:grid-cols-6">
              <div className="rounded-lg bg-white/10 p-4 backdrop-blur">
                <div className="text-3xl font-bold">500+</div>
                <div className="text-sm">Target Cities</div>
              </div>
              <div className="rounded-lg bg-white/10 p-4 backdrop-blur">
                <div className="text-3xl font-bold">₹5K</div>
                <div className="text-sm">Starting Price</div>
              </div>
              <div className="rounded-lg bg-white/10 p-4 backdrop-blur">
                <div className="text-3xl font-bold">15+</div>
                <div className="text-sm">Govt Schemes</div>
              </div>
              <div className="rounded-lg bg-white/10 p-4 backdrop-blur">
                <div className="text-3xl font-bold">11</div>
                <div className="text-sm">Languages</div>
              </div>
              <div className="rounded-lg bg-white/10 p-4 backdrop-blur">
                <div className="text-3xl font-bold">100%</div>
                <div className="text-sm">ABDM Ready</div>
              </div>
              <div className="rounded-lg bg-white/10 p-4 backdrop-blur">
                <div className="text-3xl font-bold">30+</div>
                <div className="text-sm">Modules</div>
              </div>
            </div>

            {/* Startup Credentials */}
            <div className="flex flex-wrap items-center gap-6 pt-4 text-sm text-blue-200">
              <div className="flex items-center gap-2">
                <Building className="size-4" />
                <span>Incubated at T-Hub, Hyderabad</span>
              </div>
              <div className="flex items-center gap-2">
                <Rocket className="size-4" />
                <span>Pre-Seed Stage Startup</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="size-4" />
                <span>Building for Bharat</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content with Tabs */}
      <div className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="mx-auto grid w-full grid-cols-2 lg:w-[600px]">
            <TabsTrigger value="vision" className="text-sm font-medium">
              <Eye className="mr-2 size-4" />
              Vision & Mission
            </TabsTrigger>
            <TabsTrigger value="solutions" className="text-sm font-medium">
              <Layers className="mr-2 size-4" />
              Solutions & Modules
            </TabsTrigger>
          </TabsList>

          {/* Vision & Mission Tab */}
          <TabsContent value="vision" className="space-y-8">
            {/* About Julley Online */}
            <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Building className="size-6 text-blue-600" />
                  About Julley Online Pvt Ltd
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <div>
                      <h3 className="mb-2 text-lg font-semibold">Company Overview</h3>
                      <p className="text-sm text-gray-600">
                        Julley Online Pvt Ltd is a healthcare technology startup incubated at T-Hub,
                        Hyderabad - India's premier innovation ecosystem. Founded in early 2025, we are on a
                        mission to revolutionize healthcare delivery in India through cutting-edge technology
                        and deep integration with government healthcare programs.
                      </p>
                    </div>
                    <div>
                      <h3 className="mb-2 text-lg font-semibold">Our Roadmap</h3>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li className="flex items-start gap-2">
                          <Badge className="mt-1.5 size-1.5 bg-green-500 p-0" />
                          <span>
                            <strong>2025 Q1:</strong>
                            {' '}
                            Company founded at T-Hub
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Badge className="mt-1.5 size-1.5 bg-blue-500 p-0" />
                          <span>
                            <strong>2025 Q2:</strong>
                            {' '}
                            Pre-seed funding round
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Badge className="mt-1.5 size-1.5 bg-blue-500 p-0" />
                          <span>
                            <strong>2025 Q3:</strong>
                            {' '}
                            MVP development & pilot testing
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Badge className="mt-1.5 size-1.5 bg-orange-500 p-0" />
                          <span>
                            <strong>2025 Q4:</strong>
                            {' '}
                            Official product launch
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h3 className="mb-2 text-lg font-semibold">Why Hyderabad?</h3>
                      <p className="text-sm text-gray-600">
                        As India's healthcare and IT hub, Hyderabad provides the perfect ecosystem for
                        Hospital OS. With access to top talent, government support, and proximity to major
                        healthcare institutions, we're strategically positioned to scale across India.
                      </p>
                    </div>
                    <div>
                      <h3 className="mb-2 text-lg font-semibold">Our Advantages</h3>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="mt-0.5 size-4 text-green-500" />
                          <span>
                            <strong>T-Hub Network:</strong>
                            {' '}
                            Access to 2000+ startups and mentors
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="mt-0.5 size-4 text-green-500" />
                          <span>
                            <strong>Tech Expertise:</strong>
                            {' '}
                            Team from IITs, BITS, and top healthcare institutions
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="mt-0.5 size-4 text-green-500" />
                          <span>
                            <strong>Domain Knowledge:</strong>
                            {' '}
                            Healthcare professionals with 20+ years experience
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="mt-6 grid grid-cols-2 gap-4 border-t pt-6 md:grid-cols-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">5+</div>
                    <div className="text-xs text-gray-600">Founding Team</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">Q2 2025</div>
                    <div className="text-xs text-gray-600">Pre-Seed Target</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">3+</div>
                    <div className="text-xs text-gray-600">Pilot Partners</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">Q4 2025</div>
                    <div className="text-xs text-gray-600">Launch Date</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Standout Capabilities - What Makes Hospital OS Different */}
            <Card className="border-2 border-green-200 bg-gradient-to-r from-green-50 to-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Star className="size-6 text-green-600" />
                  Standout Capabilities - What Makes Hospital OS Different
                </CardTitle>
                <CardDescription>
                  Beyond basic HMS - unique features that transform healthcare delivery
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {/* CSR & Events Management */}
                  <Card className="border-pink-200 bg-pink-50/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base">
                        <HeartHandshake className="size-5 text-pink-600" />
                        CSR & Events Management
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="mt-0.5 size-4 text-pink-500" />
                          <span>Community health programs tracking</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="mt-0.5 size-4 text-pink-500" />
                          <span>Health camps & screening events</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="mt-0.5 size-4 text-pink-500" />
                          <span>Volunteer & donation management</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="mt-0.5 size-4 text-pink-500" />
                          <span>Social impact measurement & reporting</span>
                        </li>
                      </ul>
                      <Badge className="mt-3 border-pink-200 bg-pink-100 text-pink-700">
                        Comprehensive CSR
                      </Badge>
                    </CardContent>
                  </Card>

                  {/* Advanced CRM & Patient Engagement */}
                  <Card className="border-blue-200 bg-blue-50/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base">
                        <UserCheck className="size-5 text-blue-600" />
                        Advanced CRM & Patient Engagement
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="mt-0.5 size-4 text-blue-500" />
                          <span>360° patient journey tracking</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="mt-0.5 size-4 text-blue-500" />
                          <span>Automated patient engagement campaigns</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="mt-0.5 size-4 text-blue-500" />
                          <span>Loyalty programs & referral tracking</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="mt-0.5 size-4 text-blue-500" />
                          <span>Patient satisfaction analytics</span>
                        </li>
                      </ul>
                      <Badge className="mt-3 border-blue-200 bg-blue-100 text-blue-700">
                        Beyond EMR
                      </Badge>
                    </CardContent>
                  </Card>

                  {/* Hospital Network & Collaboration */}
                  <Card className="border-purple-200 bg-purple-50/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base">
                        <Network className="size-5 text-purple-600" />
                        Hospital Network & Collaboration
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="mt-0.5 size-4 text-purple-500" />
                          <span>Multi-hospital patient transfers</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="mt-0.5 size-4 text-purple-500" />
                          <span>Shared specialist consultations</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="mt-0.5 size-4 text-purple-500" />
                          <span>Resource sharing & capacity optimization</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="mt-0.5 size-4 text-purple-500" />
                          <span>Network-wide analytics & benchmarking</span>
                        </li>
                      </ul>
                      <Badge className="mt-3 border-purple-200 bg-purple-100 text-purple-700">
                        Network Ready
                      </Badge>
                    </CardContent>
                  </Card>

                  {/* Government Scheme Integration Excellence */}
                  <Card className="border-orange-200 bg-orange-50/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base">
                        <Building className="size-5 text-orange-600" />
                        Government Scheme Excellence
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="mt-0.5 size-4 text-orange-500" />
                          <span>15+ schemes with real-time eligibility</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="mt-0.5 size-4 text-orange-500" />
                          <span>Automated pre-authorization & claims</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="mt-0.5 size-4 text-orange-500" />
                          <span>Zero-rejection guarantee system</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="mt-0.5 size-4 text-orange-500" />
                          <span>Direct government settlement (3 days)</span>
                        </li>
                      </ul>
                      <Badge className="mt-3 border-orange-200 bg-orange-100 text-orange-700">
                        95% Success Rate
                      </Badge>
                    </CardContent>
                  </Card>

                  {/* Seamless Integrations Ecosystem */}
                  <Card className="border-green-200 bg-green-50/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base">
                        <Workflow className="size-5 text-green-600" />
                        Seamless Integrations Ecosystem
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="mt-0.5 size-4 text-green-500" />
                          <span>50+ pre-built API integrations</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="mt-0.5 size-4 text-green-500" />
                          <span>ABDM/HL7 FHIR native support</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="mt-0.5 size-4 text-green-500" />
                          <span>WhatsApp, SMS, payment gateways</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="mt-0.5 size-4 text-green-500" />
                          <span>Lab analyzers & medical devices</span>
                        </li>
                      </ul>
                      <Badge className="mt-3 border-green-200 bg-green-100 text-green-700">
                        Plug & Play
                      </Badge>
                    </CardContent>
                  </Card>

                  {/* AI-Powered Intelligence */}
                  <Card className="border-indigo-200 bg-indigo-50/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base">
                        <BrainCircuit className="size-5 text-indigo-600" />
                        AI-Powered Healthcare Intelligence
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="mt-0.5 size-4 text-indigo-500" />
                          <span>Predictive analytics for patient outcomes</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="mt-0.5 size-4 text-indigo-500" />
                          <span>AI-assisted diagnosis suggestions</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="mt-0.5 size-4 text-indigo-500" />
                          <span>Automated report generation</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="mt-0.5 size-4 text-indigo-500" />
                          <span>Voice-to-text clinical documentation</span>
                        </li>
                      </ul>
                      <Badge className="mt-3 border-indigo-200 bg-indigo-100 text-indigo-700">
                        AI Native
                      </Badge>
                    </CardContent>
                  </Card>
                </div>

                {/* Standout Stats */}
                <div className="mt-8 border-t border-gray-200 pt-6">
                  <h3 className="mb-4 text-center text-lg font-semibold">Our Differentiating Vision</h3>
                  <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-pink-600">Comprehensive</div>
                      <div className="text-sm text-gray-600">CSR Integration</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600">360°</div>
                      <div className="text-sm text-gray-600">Patient Engagement</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600">Network</div>
                      <div className="text-sm text-gray-600">Collaboration</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-orange-600">15+</div>
                      <div className="text-sm text-gray-600">Govt Schemes</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Vision, Mission, Objectives */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <Card className="border-2 border-blue-200">
                <CardHeader className="bg-blue-50">
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="size-5 text-blue-600" />
                    Our Vision
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <p className="text-gray-700">
                    To be India's leading healthcare technology platform, ensuring every citizen
                    from metro cities to remote villages has access to quality, affordable healthcare
                    through digital innovation and government program integration.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-green-200">
                <CardHeader className="bg-green-50">
                  <CardTitle className="flex items-center gap-2">
                    <Flag className="size-5 text-green-600" />
                    Our Mission
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <p className="text-gray-700">
                    Bridge the healthcare gap in tier-2 and tier-3 cities by providing an affordable,
                    multilingual, offline-capable digital platform that seamlessly integrates with
                    government schemes and empowers healthcare providers.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-orange-200">
                <CardHeader className="bg-orange-50">
                  <CardTitle className="flex items-center gap-2">
                    <Target className="size-5 text-orange-600" />
                    Key Objectives
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 size-4 text-orange-500" />
                      <span>Digitize 10,000+ healthcare facilities</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 size-4 text-orange-500" />
                      <span>Process 1M+ government scheme claims</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 size-4 text-orange-500" />
                      <span>Create 50M+ digital health records</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 size-4 text-orange-500" />
                      <span>Reduce healthcare costs by 40%</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Coverage & Impact */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Pan-India Coverage & Social Impact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Geographic Coverage */}
                <div>
                  <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                    <MapPin className="size-5 text-blue-600" />
                    Target Market Coverage
                  </h3>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                    <Card className="border-blue-200 bg-blue-50">
                      <CardContent className="pt-6">
                        <div className="text-2xl font-bold text-blue-600">5</div>
                        <div className="text-sm text-gray-600">Initial States</div>
                        <div className="mt-2 text-xs text-gray-500">
                          Telangana, AP, Karnataka
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="border-green-200 bg-green-50">
                      <CardContent className="pt-6">
                        <div className="text-2xl font-bold text-green-600">50+</div>
                        <div className="text-sm text-gray-600">Target Cities</div>
                        <div className="mt-2 text-xs text-gray-500">
                          Year 1 expansion
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="border-orange-200 bg-orange-50">
                      <CardContent className="pt-6">
                        <div className="text-2xl font-bold text-orange-600">100+</div>
                        <div className="text-sm text-gray-600">Target Facilities</div>
                        <div className="mt-2 text-xs text-gray-500">
                          First year goal
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="border-purple-200 bg-purple-50">
                      <CardContent className="pt-6">
                        <div className="text-2xl font-bold text-purple-600">50K+</div>
                        <div className="text-sm text-gray-600">Target Patients</div>
                        <div className="mt-2 text-xs text-gray-500">
                          Year 1 projection
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Social Impact */}
                <div>
                  <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                    <Heart className="size-5 text-red-600" />
                    Social Impact Metrics
                  </h3>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-gray-700">Healthcare Access</h4>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li className="flex items-start gap-2">
                          <Badge className="mt-1.5 size-1.5 bg-red-500 p-0" />
                          <span>70% reduction in travel for medical care</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Badge className="mt-1.5 size-1.5 bg-red-500 p-0" />
                          <span>24x7 emergency care availability</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Badge className="mt-1.5 size-1.5 bg-red-500 p-0" />
                          <span>Same-day appointment booking</span>
                        </li>
                      </ul>
                    </div>
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-gray-700">Cost Reduction</h4>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li className="flex items-start gap-2">
                          <Badge className="mt-1.5 size-1.5 bg-green-500 p-0" />
                          <span>40% lower out-of-pocket expenses</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Badge className="mt-1.5 size-1.5 bg-green-500 p-0" />
                          <span>Zero paperwork costs</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Badge className="mt-1.5 size-1.5 bg-green-500 p-0" />
                          <span>Eliminated duplicate tests</span>
                        </li>
                      </ul>
                    </div>
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-gray-700">Quality Improvement</h4>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li className="flex items-start gap-2">
                          <Badge className="mt-1.5 size-1.5 bg-blue-500 p-0" />
                          <span>85% faster diagnosis with AI</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Badge className="mt-1.5 size-1.5 bg-blue-500 p-0" />
                          <span>90% reduction in medical errors</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Badge className="mt-1.5 size-1.5 bg-blue-500 p-0" />
                          <span>100% treatment adherence tracking</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Target Impact Goals */}
                <div>
                  <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                    <Target className="size-5 text-blue-600" />
                    Projected Impact Goals
                  </h3>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-3">
                          <Hospital className="mt-1 size-5 text-blue-600" />
                          <div>
                            <h4 className="font-semibold">Tier-2 & Tier-3 Cities</h4>
                            <p className="mt-1 text-sm text-gray-600">
                              Target to help 50-100 bed hospitals increase government scheme claim approvals
                              from 60% to 95%+ with automated processing and zero manual errors.
                            </p>
                            <div className="mt-2 text-xs font-medium text-blue-600">
                              Goal: Process ₹50+ Cr claims, benefit 10,000+ families
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-green-50 to-green-100">
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-3">
                          <Network className="mt-1 size-5 text-green-600" />
                          <div>
                            <h4 className="font-semibold">Multi-Specialty Networks</h4>
                            <p className="mt-1 text-sm text-gray-600">
                              Aim to enable clinic networks to serve 1000+ scheme beneficiaries monthly
                              with automated eligibility checks and instant approvals.
                            </p>
                            <div className="mt-2 text-xs font-medium text-green-600">
                              Goal: 95% approval rate, 80% operational cost savings
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Government Integration */}
            <Card className="border-2 border-orange-200">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-green-50">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Building className="size-6 text-orange-600" />
                  Government Healthcare Ecosystem Integration
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {/* Schemes Integration */}
                  <div>
                    <h3 className="mb-4 font-semibold">Integrated Schemes</h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="mt-0.5 size-5 text-green-500" />
                        <div>
                          <div className="text-sm font-medium">Ayushman Bharat (PM-JAY)</div>
                          <div className="text-xs text-gray-600">₹5 lakh coverage for 10.74 crore families</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="mt-0.5 size-5 text-green-500" />
                        <div>
                          <div className="text-sm font-medium">State Healthcare Schemes</div>
                          <div className="text-xs text-gray-600">Aarogyasri, Mukhyamantri Amrutum, etc.</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="mt-0.5 size-5 text-green-500" />
                        <div>
                          <div className="text-sm font-medium">CGHS & ESI</div>
                          <div className="text-xs text-gray-600">Government employee coverage</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="mt-0.5 size-5 text-green-500" />
                        <div>
                          <div className="text-sm font-medium">Maternal & Child Programs</div>
                          <div className="text-xs text-gray-600">JSY, Mission Indradhanush</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ABDM Integration */}
                  <div>
                    <h3 className="mb-4 font-semibold">ABDM Digital Health</h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <Fingerprint className="mt-0.5 size-5 text-blue-500" />
                        <div>
                          <div className="text-sm font-medium">ABHA (Health ID)</div>
                          <div className="text-xs text-gray-600">14-digit unique health identifier</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <FileText className="mt-0.5 size-5 text-blue-500" />
                        <div>
                          <div className="text-sm font-medium">PHR Integration</div>
                          <div className="text-xs text-gray-600">Personal Health Records app sync</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Share2 className="mt-0.5 size-5 text-blue-500" />
                        <div>
                          <div className="text-sm font-medium">HIE/HIP/HIU</div>
                          <div className="text-xs text-gray-600">Health Information Exchange</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Lock className="mt-0.5 size-5 text-blue-500" />
                        <div>
                          <div className="text-sm font-medium">DigiLocker</div>
                          <div className="text-xs text-gray-600">Secure document storage</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Target Implementation Goals */}
                <div className="mt-6 grid grid-cols-2 gap-4 border-t pt-6 md:grid-cols-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">₹50Cr+</div>
                    <div className="text-xs text-gray-600">Target Claims</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">50K+</div>
                    <div className="text-xs text-gray-600">Target Patients</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">95%+</div>
                    <div className="text-xs text-gray-600">Target Approval</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">3 Days</div>
                    <div className="text-xs text-gray-600">Settlement Goal</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Why Hospital OS */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Lightbulb className="size-6 text-yellow-600" />
                  Why Choose Hospital OS?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-blue-600">Built for Bharat</h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 size-4 text-blue-500" />
                        <span>11 Indian languages with voice support</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 size-4 text-blue-500" />
                        <span>Offline-first architecture</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 size-4 text-blue-500" />
                        <span>Works on basic Android phones</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 size-4 text-blue-500" />
                        <span>Local support in every district</span>
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-semibold text-green-600">Affordable & Flexible</h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 size-4 text-green-500" />
                        <span>Pay-per-use pricing model</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 size-4 text-green-500" />
                        <span>No upfront investment</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 size-4 text-green-500" />
                        <span>EMI options available</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 size-4 text-green-500" />
                        <span>Free government scheme modules</span>
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-semibold text-orange-600">Complete Solution</h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 size-4 text-orange-500" />
                        <span>30+ integrated modules</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 size-4 text-orange-500" />
                        <span>Best-in-class partnerships</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 size-4 text-orange-500" />
                        <span>AI-powered diagnostics</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 size-4 text-orange-500" />
                        <span>Continuous updates & support</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Solutions & Modules Tab */}
          <TabsContent value="solutions" className="space-y-8">
            {/* Solution Packages */}
            <div>
              <h2 className="mb-6 text-center text-2xl font-bold">Solution Packages</h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                {solutionPackages.map(pkg => (
                  <Card
                    key={pkg.id}
                    className={cn(
                      'relative overflow-hidden',
                      pkg.popular && 'border-2 border-green-500 shadow-lg',
                    )}
                  >
                    {pkg.popular && (
                      <div className="absolute right-0 top-0 rounded-bl bg-green-500 px-3 py-1 text-xs font-medium text-white">
                        Most Popular
                      </div>
                    )}
                    <CardHeader>
                      <div className="mb-2 flex items-center justify-between">
                        <pkg.icon className={cn(
                          'h-8 w-8',
                          pkg.color === 'blue' && 'text-blue-600',
                          pkg.color === 'green' && 'text-green-600',
                          pkg.color === 'purple' && 'text-purple-600',
                          pkg.color === 'orange' && 'text-orange-600',
                        )}
                        />
                        <Badge variant="outline" className="text-xs">
                          {pkg.modules.length === 1 && pkg.modules[0] === 'all'
                            ? '30+ modules'
                            : `${pkg.modules.length} modules`}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg">{pkg.name}</CardTitle>
                      <CardDescription className="text-xs">{pkg.target}</CardDescription>
                      <div className="mt-3 text-2xl font-bold">
                        {pkg.price}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        {pkg.features.slice(0, 5).map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle2 className={cn(
                              'h-4 w-4 mt-0.5',
                              pkg.color === 'blue' && 'text-blue-500',
                              pkg.color === 'green' && 'text-green-500',
                              pkg.color === 'purple' && 'text-purple-500',
                              pkg.color === 'orange' && 'text-orange-500',
                            )}
                            />
                            <span className="text-gray-600">{feature}</span>
                          </li>
                        ))}
                        {pkg.features.length > 5 && (
                          <li className="pl-6 text-xs text-gray-500">
                            +
                            {pkg.features.length - 5}
                            {' '}
                            more features
                          </li>
                        )}
                      </ul>
                      <Button
                        className="mt-4 w-full"
                        variant={pkg.popular ? 'default' : 'outline'}
                      >
                        Get Started
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Build vs Partner Strategy */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Smart Build + Partner Strategy</CardTitle>
                <CardDescription>
                  Combining in-house innovation with best-in-class partnerships for faster delivery and lower costs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-3">
                  <Card className="border-blue-200 bg-blue-50/30">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base">
                        <Cpu className="size-5 text-blue-600" />
                        Build In-House (
                        {stats.buildModules}
                        {' '}
                        Modules)
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        <li>• Patient Management & EMR</li>
                        <li>• Clinical Workflows</li>
                        <li>• Billing & Revenue</li>
                        <li>• Indian Healthcare Features</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border-green-200 bg-green-50/30">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base">
                        <Handshake className="size-5 text-green-600" />
                        Partner Solutions (
                        {stats.partnerModules}
                        {' '}
                        Modules)
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        <li>• PACS & Medical Imaging</li>
                        <li>• Laboratory Systems</li>
                        <li>• Telemedicine Platform</li>
                        <li>• AI/ML Diagnostics</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border-purple-200 bg-purple-50/30">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base">
                        <RefreshCw className="size-5 text-purple-600" />
                        Hybrid Approach (
                        {stats.hybridModules}
                        {' '}
                        Modules)
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        <li>• Pharmacy (1mg APIs)</li>
                        <li>• Communications (WhatsApp)</li>
                        <li>• Payments (Razorpay)</li>
                        <li>• Government Integration</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                <Alert className="border-green-200 bg-green-50">
                  <Rocket className="size-4" />
                  <AlertTitle>Benefits of Our Partnership Strategy</AlertTitle>
                  <AlertDescription className="mt-2">
                    <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-3">
                      <div>
                        <strong>70% Faster:</strong>
                        {' '}
                        Launch in 6 months vs 24 months
                      </div>
                      <div>
                        <strong>60% Cheaper:</strong>
                        {' '}
                        Save ₹1.8 Cr in development
                      </div>
                      <div>
                        <strong>Best Quality:</strong>
                        {' '}
                        Proven, specialized solutions
                      </div>
                    </div>
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            {/* Strategic Partners */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Network className="size-5 text-blue-600" />
                  Strategic Technology Partners
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
                  {strategicPartners.map((partner, idx) => (
                    <div
                      key={idx}
                      className={cn(
                        'p-3 rounded-lg border text-center hover:shadow-md transition-shadow',
                        partner.status === 'integrated' && 'border-green-200 bg-green-50',
                        partner.status === 'in-progress' && 'border-yellow-200 bg-yellow-50',
                        partner.status === 'planned' && 'border-gray-200 bg-gray-50',
                      )}
                    >
                      <div className="text-sm font-medium">{partner.name}</div>
                      <div className="mt-1 text-xs text-gray-500">{partner.category}</div>
                      <Badge
                        variant="outline"
                        className={cn(
                          'text-xs mt-2',
                          partner.status === 'integrated' && 'border-green-500 text-green-700',
                          partner.status === 'in-progress' && 'border-yellow-500 text-yellow-700',
                          partner.status === 'planned' && 'border-gray-500 text-gray-700',
                        )}
                      >
                        {partner.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Module Filters */}
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedStrategy === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedStrategy('all')}
                >
                  All Modules (
                  {stats.totalModules}
                  )
                </Button>
                <Button
                  variant={selectedStrategy === 'build' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedStrategy('build')}
                  className="gap-2"
                >
                  <Cpu className="size-3" />
                  In-House (
                  {stats.buildModules}
                  )
                </Button>
                <Button
                  variant={selectedStrategy === 'partner' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedStrategy('partner')}
                  className="gap-2"
                >
                  <Handshake className="size-3" />
                  Partner (
                  {stats.partnerModules}
                  )
                </Button>
                <Button
                  variant={selectedStrategy === 'hybrid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedStrategy('hybrid')}
                  className="gap-2"
                >
                  <RefreshCw className="size-3" />
                  Hybrid (
                  {stats.hybridModules}
                  )
                </Button>
              </div>

              <Tabs defaultValue="all" value={selectedCategory} onValueChange={setSelectedCategory}>
                <TabsList className="grid w-full grid-cols-4 lg:grid-cols-5">
                  {categories.slice(0, 5).map(category => (
                    <TabsTrigger key={category} value={category} className="text-xs">
                      {category === 'all' ? 'All' : category}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            {/* Modules Grid */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredModules.map(module => (
                <ModuleCard key={module.id} module={module} />
              ))}
            </div>

            {/* Overall Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Platform Development Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Overall Completion</span>
                    <span className="text-2xl font-bold">
                      {stats.overallProgress}
                      %
                    </span>
                  </div>
                  <Progress value={stats.overallProgress} className="h-3" />
                  <div className="grid grid-cols-2 gap-4 pt-4 md:grid-cols-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{stats.liveModules}</div>
                      <div className="text-xs text-gray-600">Live Modules</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {modules.filter(m => m.status === 'beta').length}
                      </div>
                      <div className="text-xs text-gray-600">Beta Testing</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-600">
                        {modules.filter(m => m.status === 'development').length}
                      </div>
                      <div className="text-xs text-gray-600">In Development</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {modules.filter(m => m.status === 'planned').length}
                      </div>
                      <div className="text-xs text-gray-600">Planned</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Call to Action */}
        <Card className="mt-8 border-0 bg-gradient-to-r from-orange-600 to-green-600 text-white">
          <CardContent className="p-8">
            <div className="space-y-4 text-center">
              <div className="mb-4">
                <Badge className="mb-2 border-white/30 bg-white/20 px-4 py-1 text-sm text-white">
                  A Julley Online Innovation
                </Badge>
                <h2 className="text-2xl font-bold">Be Part of India's Healthcare Revolution</h2>
              </div>
              <p className="mx-auto max-w-3xl text-orange-100">
                Join Julley Online's mission to democratize healthcare across India. As a T-Hub incubated startup,
                we're launching Hospital OS in Q4 2025 to transform healthcare delivery in tier-2 and tier-3 cities.
              </p>

              {/* Launch Timeline */}
              <div className="mx-auto mt-6 max-w-2xl rounded-lg bg-white/10 p-4 backdrop-blur">
                <h3 className="mb-3 text-lg font-semibold">Development Timeline</h3>
                <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-3">
                  <div>
                    <div className="font-bold">Q2 2025</div>
                    <div className="text-orange-200">Product Development</div>
                  </div>
                  <div>
                    <div className="font-bold">Q3 2025</div>
                    <div className="text-orange-200">Pilot Testing</div>
                  </div>
                  <div>
                    <div className="font-bold">Q4 2025</div>
                    <div className="text-orange-200">Product Launch</div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center gap-4 pt-4">
                <Button size="lg" variant="secondary" className="bg-white text-orange-600 hover:bg-orange-50">
                  <Phone className="mr-2 size-4" />
                  Schedule Demo
                </Button>
                <Button size="lg" variant="outline" className="border-white/30 bg-white/10 text-white hover:bg-white/20">
                  <Star className="mr-2 size-4" />
                  Join Early Access
                </Button>
              </div>

              {/* Contact Information */}
              <div className="mt-6 border-t border-white/20 pt-6">
                <p className="text-sm text-orange-200">
                  <strong>Julley Online Pvt Ltd</strong>
                  {' '}
                  | T-Hub, Hyderabad |
                  <a href="mailto:contact@julleyonline.com" className="ml-1 underline">contact@julleyonline.com</a>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
