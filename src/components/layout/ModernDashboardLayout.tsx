'use client';

import { useUser } from '@clerk/nextjs';
import {
  Activity,
  AlertCircle,
  ArrowRightLeft,
  BarChart3,
  Bed,
  Building,
  Calendar,
  ClipboardList,
  CreditCard,
  FileText,
  FlaskConical,
  Heart,
  Home,
  Hospital,
  Key,
  LayoutDashboard,
  Megaphone,
  Menu,
  MessageSquare,
  Monitor,
  Network,
  Package,
  Pill,
  Plus,
  Send,
  Settings,
  Share2,
  Shield,
  Stethoscope,
  Target,
  TestTube,
  TrendingUp,
  Truck,
  UserCog,
  UserPlus,
  Users,
  Webhook,
  X,
  ChevronLeft,
  ChevronRight,
  Video,
  Phone,
  Tablet,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useState, useRef, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { DashboardHeader } from '@/features/dashboard/DashboardHeader';
import { cn } from '@/lib/utils';
import type { UserRole } from '@/types/hms';

type NavItem = {
  title: string;
  href?: string;
  icon: any;
  badge?: string;
  children?: NavItem[];
  roles?: UserRole[];
  adminOnly?: boolean;
};

/**
 * Get navigation items based on user role - COMPREHENSIVE HMS NAVIGATION
 */
function getNavigationItems(t: any, userRole: UserRole): NavItem[] {
  const isDoctor = userRole.includes('Doctor') || userRole.includes('Surgeon') || userRole.includes('Specialist');
  const isNurse = userRole.includes('Nurse') || userRole === 'Midwife';
  const isReception = userRole === 'Receptionist' || userRole === 'Front-Desk-Executive';
  const isPharmacy = userRole.includes('Pharmacist');
  const isLab = userRole.includes('Lab') || userRole.includes('Technician');
  const isAdmin = userRole === 'Admin' || userRole === 'Hospital-Administrator' || userRole === 'Medical-Superintendent';
  const isICUStaff = userRole === 'ICU-Specialist' || userRole === 'ICU-Nurse';

  const allItems: NavItem[] = [
    // 1. Home - Starting point
    {
      title: 'Home',
      href: '/dashboard',
      icon: Home,
    },
    
    // Hospital OS Overview - New showcase page
    {
      title: 'Hospital OS',
      href: '/dashboard/hospital-os',
      icon: Hospital,
      badge: 'New',
    },
    
    // 2. Reception & Registration - First patient touchpoint
    {
      title: t('Navigation.reception'),
      icon: Users,
      children: [
        {
          title: t('Navigation.patient_registration'),
          href: '/dashboard/registration',
          icon: UserPlus,
        },
        {
          title: t('Navigation.queue_management'),
          href: '/dashboard/queue',
          icon: Users,
        },
        {
          title: t('Navigation.token_generation'),
          href: '/dashboard/tokens',
          icon: FileText,
        },
      ],
    },
    
    // 3. Emergency Services - Critical care path
    {
      title: 'Emergency Services',
      icon: AlertCircle,
      children: [
        {
          title: 'Emergency Care',
          href: '/dashboard/emergency',
          icon: AlertCircle,
          badge: 'urgent',
        },
        {
          title: 'ICU Live Monitoring',
          href: '/dashboard/icu',
          icon: Monitor,
          badge: 'live',
        },
      ],
    },
    
    // 4. Telemedicine & Digital Health - Virtual care delivery
    {
      title: 'Telemedicine & Digital Health',
      icon: Video,
      children: [
        {
          title: 'Telemedicine Dashboard',
          href: '/dashboard/telemedicine',
          icon: Video,
          badge: 'new',
        },
        {
          title: 'Video Consultations',
          href: '/dashboard/telemedicine/consultations',
          icon: Video,
        },
        {
          title: 'Digital Prescriptions',
          href: '/dashboard/prescriptions?type=digital',
          icon: FileText,
        },
        {
          title: 'Remote Monitoring',
          href: '/dashboard/telemedicine/monitoring',
          icon: Tablet,
        },
        {
          title: 'Telemedicine Billing',
          href: '/dashboard/billing?type=telemedicine',
          icon: CreditCard,
        },
      ],
    },
    
    // 5. Network & Collaboration - Multi-hospital coordination
    {
      title: 'Network & Collaboration',
      icon: Network,
      children: [
        {
          title: 'Network Dashboard',
          href: '/dashboard/network',
          icon: Network,
          badge: 'new',
        },
        {
          title: 'Referral Management',
          href: '/dashboard/network/referrals',
          icon: ArrowRightLeft,
        },
        {
          title: 'Patient Transfers',
          href: '/dashboard/network/transfers',
          icon: Send,
        },
        {
          title: 'Network Doctors',
          href: '/dashboard/network/doctors',
          icon: Users,
        },
        {
          title: 'Shared Resources',
          href: '/dashboard/network/resources',
          icon: Share2,
        },
      ],
    },
    
    // 6. Patient Management - Core patient data
    {
      title: 'Patient Management',
      icon: Users,
      children: [
        {
          title: 'Patients',
          href: '/dashboard/patients',
          icon: Users,
        },
        {
          title: 'Appointments',
          href: '/dashboard/appointments',
          icon: Calendar,
        },
        {
          title: 'Medical Records',
          href: '/dashboard/medical-records',
          icon: FileText,
        },
        {
          title: 'Families',
          href: '/dashboard/families',
          icon: Heart,
        },
      ],
    },
    
    // 7. Clinical Services - Doctor/consultation workflow
    {
      title: 'Clinical Services',
      icon: Stethoscope,
      children: [
        {
          title: 'Doctor Dashboard',
          href: '/dashboard/doctor',
          icon: Stethoscope,
          badge: isDoctor ? 'primary' : undefined,
        },
        {
          title: 'Consultations',
          href: '/dashboard/consultations',
          icon: Stethoscope,
        },
        {
          title: 'Prescriptions',
          href: '/dashboard/prescriptions',
          icon: Pill,
        },
        {
          title: 'Vital Signs',
          href: '/dashboard/vitals',
          icon: Activity,
        },
      ],
    },
    
    // 6. Ward & Nursing - Inpatient care
    {
      title: t('Navigation.ward_management'),
      icon: Bed,
      children: [
        {
          title: t('Navigation.bed_management'),
          href: '/dashboard/beds',
          icon: Bed,
        },
        {
          title: t('Navigation.medication_admin'),
          href: '/dashboard/medication-administration',
          icon: Pill,
        },
        {
          title: t('Navigation.nursing_notes'),
          href: '/dashboard/nursing-notes',
          icon: ClipboardList,
        },
      ],
    },
    
    // 7. Diagnostics - Lab and imaging
    {
      title: t('Navigation.laboratory'),
      icon: FlaskConical,
      children: [
        {
          title: 'Lab Dashboard',
          href: '/dashboard/lab',
          icon: LayoutDashboard,
        },
        {
          title: t('Navigation.test_queue'),
          href: '/dashboard/lab/queue',
          icon: TestTube,
        },
        {
          title: t('Navigation.results_entry'),
          href: '/dashboard/lab/results',
          icon: FileText,
        },
        {
          title: t('Navigation.lab_reports'),
          href: '/dashboard/lab/reports',
          icon: BarChart3,
        },
      ],
    },
    
    // 8. Pharmacy - Medication management
    {
      title: t('Navigation.pharmacy'),
      icon: Package,
      children: [
        {
          title: 'Pharmacy Dashboard',
          href: '/dashboard/pharmacy',
          icon: LayoutDashboard,
        },
        {
          title: 'Prescription Queue',
          href: '/dashboard/pharmacy/prescriptions',
          icon: Pill,
        },
        {
          title: 'Medication Dispensing',
          href: '/dashboard/pharmacy/dispense',
          icon: Package,
        },
        {
          title: t('Navigation.inventory'),
          href: '/dashboard/pharmacy/inventory',
          icon: Package,
        },
        {
          title: t('Navigation.purchase_orders'),
          href: '/dashboard/pharmacy/orders',
          icon: FileText,
        },
      ],
    },
    
    // 9. Billing & Finance - Payment and insurance
    {
      title: t('Navigation.billing_finance'),
      icon: CreditCard,
      children: [
        {
          title: 'Billing Management',
          href: '/dashboard/billing',
          icon: CreditCard,
        },
        {
          title: 'Patient Billing',
          href: '/dashboard/billing/patients',
          icon: CreditCard,
        },
        {
          title: t('Navigation.insurance_claims'),
          href: '/dashboard/billing/insurance',
          icon: Shield,
        },
        {
          title: t('Navigation.government_schemes'),
          href: '/dashboard/government-schemes',
          icon: Building,
        },
        {
          title: 'Invoice Management',
          href: '/dashboard/billing/invoices',
          icon: FileText,
        },
        {
          title: 'Hospital Invoice',
          href: '/dashboard/billing/create-hospital',
          icon: FileText,
        },
        {
          title: 'Billing Analytics',
          href: '/dashboard/billing/analytics',
          icon: BarChart3,
        },
        {
          title: t('Navigation.financial_reports'),
          href: '/dashboard/reports/financial',
          icon: BarChart3,
          adminOnly: true,
        },
      ],
    },
    
    // 10. Reports & Analytics - Business intelligence
    {
      title: t('Navigation.reports_analytics'),
      icon: BarChart3,
      children: [
        {
          title: t('Navigation.analytics_dashboard'),
          href: '/dashboard/analytics',
          icon: Activity,
        },
        {
          title: t('Navigation.financial_reports'),
          href: '/dashboard/reports/financial',
          icon: BarChart3,
        },
        {
          title: 'Clinical Reports',
          href: '/dashboard/reports/clinical',
          icon: FileText,
        },
        {
          title: 'Operational Reports',
          href: '/dashboard/reports/operational',
          icon: TrendingUp,
        },
      ],
    },
    
    // 11. HR & Administration - Staff management
    {
      title: 'HR & Administration',
      icon: UserCog,
      children: [
        {
          title: t('Navigation.team_members'),
          href: '/dashboard/team',
          icon: Users,
        },
        {
          title: t('Navigation.departments'),
          href: '/dashboard/departments',
          icon: Building,
        },
        {
          title: 'Staff Scheduling',
          href: '/dashboard/staff/scheduling',
          icon: Calendar,
        },
        {
          title: 'Leave Management',
          href: '/dashboard/staff/leave',
          icon: FileText,
        },
      ],
    },
    
    // 12. CRM & Marketing - Patient acquisition
    {
      title: 'CRM & Marketing',
      icon: Megaphone,
      children: [
        {
          title: 'Lead Management',
          href: '/dashboard/crm/leads',
          icon: Users,
        },
        {
          title: 'Campaigns',
          href: '/dashboard/crm/campaigns',
          icon: Megaphone,
        },
        {
          title: 'Patient Segments',
          href: '/dashboard/crm/segments',
          icon: Users,
        },
        {
          title: 'CRM Analytics',
          href: '/dashboard/crm/analytics',
          icon: BarChart3,
        },
      ],
    },
    
    // 13. Community & CSR - Social responsibility
    {
      title: 'Community & CSR',
      icon: Heart,
      children: [
        {
          title: 'CSR Programs',
          href: '/dashboard/csr/programs',
          icon: Heart,
        },
        {
          title: 'Community Events',
          href: '/dashboard/csr/events',
          icon: Calendar,
        },
        {
          title: 'Volunteers',
          href: '/dashboard/csr/volunteers',
          icon: Users,
        },
        {
          title: 'Impact Reports',
          href: '/dashboard/csr/impact',
          icon: TrendingUp,
        },
      ],
    },
    
    // 14. Patient Portal - Self-service
    {
      title: 'Patient Portal',
      icon: Target,
      children: [
        {
          title: 'Health Goals',
          href: '/dashboard/health-goals',
          icon: Target,
        },
        {
          title: 'Give Feedback',
          href: '/dashboard/feedback',
          icon: MessageSquare,
        },
        {
          title: 'My Preferences',
          href: '/dashboard/preferences',
          icon: Settings,
        },
      ],
    },
    
    // 15. User & Profile - Account management
    {
      title: 'Account',
      icon: UserCog,
      children: [
        {
          title: 'User Profile',
          href: '/dashboard/user-profile',
          icon: Users,
        },
        {
          title: 'Organization Profile',
          href: '/dashboard/organization-profile',
          icon: Building,
        },
      ],
    },
    
    // 16. System & Settings - Technical configuration
    {
      title: t('Navigation.system'),
      icon: Settings,
      children: [
        {
          title: t('Navigation.settings'),
          href: '/dashboard/settings',
          icon: Settings,
        },
        {
          title: t('Navigation.security'),
          href: '/dashboard/security',
          icon: Shield,
        },
        {
          title: 'SSO Management',
          href: '/dashboard/sso-management',
          icon: Shield,
          adminOnly: true,
        },
        {
          title: t('Navigation.audit_logs'),
          href: '/dashboard/audit-logs',
          icon: FileText,
          adminOnly: true,
        },
        {
          title: t('Navigation.api_keys'),
          href: '/dashboard/api-keys',
          icon: Key,
          adminOnly: true,
        },
        {
          title: t('Navigation.webhooks'),
          href: '/dashboard/webhooks',
          icon: Webhook,
          adminOnly: true,
        },
      ],
    },
  ];

  // Filter items based on role
  return allItems.filter((item) => {
    // Admin sees everything
    if (isAdmin) {
      return true;
    }

    // Check if item is admin-only
    if (item.adminOnly) {
      return false;
    }

    // Check role-based access
    if (item.roles && item.roles.length > 0) {
      const hasRole = item.roles.some((role) => {
        if (role === 'Doctor') {
          return isDoctor;
        }
        if (role === 'Nurse') {
          return isNurse;
        }
        if (role === 'Receptionist') {
          return isReception;
        }
        if (role === 'Pharmacist') {
          return isPharmacy;
        }
        if (role === 'Lab-Technician') {
          return isLab;
        }
        if (role === 'ICU-Specialist' || role === 'ICU-Nurse') {
          return isICUStaff;
        }
        return userRole === role;
      });
      if (!hasRole) {
        return false;
      }
    }

    // Filter children
    if (item.children) {
      item.children = item.children.filter((child) => {
        if (isAdmin) {
          return true;
        }
        if (child.adminOnly) {
          return false;
        }
        if (child.roles && child.roles.length > 0) {
          return child.roles.some((role) => {
            if (role === 'Doctor') {
              return isDoctor;
            }
            if (role === 'Nurse') {
              return isNurse;
            }
            if (role === 'Admin') {
              return isAdmin;
            }
            return userRole === role;
          });
        }
        return true;
      });
      // Remove parent if no children after filtering
      if (item.children.length === 0) {
        return false;
      }
    }

    return true;
  });
}

export function ModernDashboardLayout({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const t = useTranslations();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    // Load collapsed state from localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sidebarCollapsed');
      return saved === 'true';
    }
    return false;
  });

  // Save collapsed state to localStorage
  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', String(sidebarCollapsed));
  }, [sidebarCollapsed]);

  // Get user role from metadata
  const userRole = (user?.publicMetadata?.role as UserRole) || 'Support-Staff';

  // Debug logging for user role
  console.log('🔍 Debug - User Role:', userRole);
  console.log('🔍 Debug - User Metadata:', user?.publicMetadata);

  // Get navigation items based on role
  const navigationItems = getNavigationItems(t, userRole);
  console.log('🔍 Debug - Navigation Items Count:', navigationItems.length);

  // Hospital-specific header info for Indian healthcare context
  const hospitalInfo = {
    name: "Demo Hospital & Medical Centre",
    department: userRole.replace('-', ' '),
    emergency: "108", // Indian emergency medical services number
    subtitle: "Powered by Julley Online"
  };

  return (
    <div className="flex h-screen">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 transform bg-background border-r transition-all duration-300 ease-in-out lg:static lg:translate-x-0',
          sidebarCollapsed ? 'w-20' : 'w-64',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          'shadow-xl'
        )}
      >
        <div className="flex h-full flex-col">
          <TooltipProvider delayDuration={0}>
            {/* Sidebar header */}
            <div className="flex h-16 items-center justify-between border-b px-4 bg-gradient-to-r from-cyan-50 to-blue-50">
              <Link href="/dashboard" className={cn(
                "flex items-center",
                sidebarCollapsed ? "justify-center" : "space-x-2"
              )}>
                <div className="relative">
                  <Hospital className={cn(
                    "text-cyan-600 transition-all",
                    sidebarCollapsed ? "size-8" : "size-6"
                  )} />
                  {sidebarCollapsed && (
                    <span className="absolute -bottom-1 -right-1 h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  )}
                </div>
                {!sidebarCollapsed && (
                  <div className="flex flex-col">
                    <span className="font-bold text-sm">HospitalOS</span>
                    <span className="text-xs text-muted-foreground">by Julley Online</span>
                  </div>
                )}
              </Link>
              <div className="flex items-center space-x-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hidden lg:flex hover:bg-white/50"
                      onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                    >
                      {sidebarCollapsed ? (
                        <ChevronRight className="size-4" />
                      ) : (
                        <ChevronLeft className="size-4" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    {sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                  </TooltipContent>
                </Tooltip>
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden"
                  onClick={() => setSidebarOpen(false)}
                >
                  <X className="size-5" />
                </Button>
              </div>
            </div>
          </TooltipProvider>

          {/* Navigation */}
          <ScrollArea className="flex-1 py-2">
            <TooltipProvider delayDuration={0}>
              <nav className="space-y-1 px-2">
                {navigationItems.map((item, index) => (
                  <NavItem key={index} item={item} pathname={pathname} collapsed={sidebarCollapsed} />
                ))}
              </nav>
            </TooltipProvider>
          </ScrollArea>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="h-16 border-b bg-background">
          <div className="flex h-full items-center px-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden mr-2"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="size-5" />
            </Button>
            <DashboardHeader hospitalInfo={hospitalInfo} />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto py-6">
            {children}
          </div>
          
          {/* Dashboard Footer */}
          <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto py-4 px-6">
              <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-muted-foreground">
                <div className="flex items-center space-x-4">
                  <span>© 2025 Hospital OS by Julley Online Pvt Ltd</span>
                  <span>•</span>
                  <span>T-Hub Incubated</span>
                </div>
                <div className="flex items-center space-x-4 mt-2 sm:mt-0">
                  <span className="flex items-center space-x-1">
                    <Heart className="size-3 text-red-500" />
                    <span>Emergency: 108 | Ambulance: 102</span>
                  </span>
                </div>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}

/**
 * Navigation item component with enhanced collapsed state support
 */
function NavItem({ item, pathname, collapsed = false }: { item: NavItem; pathname: string; collapsed?: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const isActive = item.href === pathname;
  const hasActiveChild = item.children?.some(child => child.href === pathname);

  // Handle simple navigation items
  if (item.href && !item.children) {
    if (collapsed) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href={item.href}
              className={cn(
                'flex items-center justify-center rounded-lg px-2 py-2 text-sm font-medium transition-all hover:bg-accent',
                isActive && 'bg-accent text-accent-foreground',
                'relative group'
              )}
            >
              <item.icon className="size-4" />
              {item.badge && (
                <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-destructive" />
              )}
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right" className="flex items-center gap-2">
            <span>{item.title}</span>
            {item.badge && (
              <span className="rounded-full bg-destructive px-2 py-0.5 text-xs text-destructive-foreground">
                {item.badge}
              </span>
            )}
          </TooltipContent>
        </Tooltip>
      );
    }

    return (
      <Link
        href={item.href}
        className={cn(
          'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent',
          isActive && 'bg-accent text-accent-foreground'
        )}
      >
        <item.icon className="size-4 flex-shrink-0" />
        <span className="truncate">{item.title}</span>
        {item.badge && (
          <span className="ml-auto rounded-full bg-destructive px-2 py-0.5 text-xs text-destructive-foreground">
            {item.badge}
          </span>
        )}
      </Link>
    );
  }

  // Handle items with children in collapsed mode
  if (collapsed && item.children) {
    return (
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <Tooltip>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <button
                className={cn(
                  'flex items-center justify-center rounded-lg px-2 py-2 text-sm font-medium transition-all hover:bg-accent w-full',
                  hasActiveChild && 'bg-accent/50',
                  popoverOpen && 'bg-accent',
                  'relative group'
                )}
              >
                <item.icon className="size-4" />
                {hasActiveChild && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-1 rounded-r bg-primary" />
                )}
              </button>
            </PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent side="right">
            {item.title}
          </TooltipContent>
        </Tooltip>
        <PopoverContent 
          side="right" 
          align="start"
          className="w-56 p-2"
          sideOffset={8}
        >
          <div className="space-y-1">
            <div className="px-2 py-1.5 text-sm font-semibold">
              {item.title}
            </div>
            {item.children.map((child, index) => (
              <Link
                key={index}
                href={child.href || '#'}
                className={cn(
                  'flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-accent',
                  child.href === pathname && 'bg-accent text-accent-foreground'
                )}
                onClick={() => setPopoverOpen(false)}
              >
                <child.icon className="size-3.5" />
                <span>{child.title}</span>
                {child.badge && (
                  <span className="ml-auto rounded-full bg-destructive px-1.5 py-0.5 text-xs text-destructive-foreground">
                    {child.badge}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <div>
      <button
        onClick={() => setExpanded(!expanded)}
        className={cn(
          'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent',
          hasActiveChild && 'bg-accent/50',
        )}
      >
        <item.icon className="size-4 flex-shrink-0" />
        <span className="truncate">{item.title}</span>
        <svg
          className={cn(
            'ml-auto h-4 w-4 transition-transform flex-shrink-0',
            expanded && 'rotate-180',
          )}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {expanded && item.children && (
        <div className="ml-6 mt-1 space-y-1">
          {item.children.map((child, index) => (
            <NavItem key={index} item={child} pathname={pathname} collapsed={false} />
          ))}
        </div>
      )}
    </div>
  );
}
