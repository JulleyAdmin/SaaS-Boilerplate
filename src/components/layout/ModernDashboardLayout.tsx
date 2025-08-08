'use client';

import { useUser } from '@clerk/nextjs';
import {
  Activity,
  AlertCircle,
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
  Menu,
  MessageSquare,
  Package,
  Pill,
  Plus,
  Settings,
  Shield,
  Stethoscope,
  TestTube,
  UserCog,
  Users,
  Webhook,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
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
    {
      title: t('Navigation.dashboard'),
      href: '/dashboard',
      icon: Home,
    },
    // Doctor Dashboard - visible to all users for development
    {
      title: 'Doctor Dashboard',
      href: '/dashboard/doctor',
      icon: Stethoscope,
      badge: isDoctor ? 'primary' : undefined,
    },
    {
      title: t('Navigation.patient_management'),
      icon: Users,
      children: [
        {
          title: t('Navigation.patients'),
          href: '/dashboard/patients',
          icon: Users,
        },
        {
          title: t('Navigation.appointments'),
          href: '/dashboard/appointments',
          icon: Calendar,
        },
        {
          title: t('Navigation.medical_records'),
          href: '/dashboard/medical-records',
          icon: FileText,
          roles: ['Doctor', 'Nurse', 'Admin'],
        },
        {
          title: t('Navigation.family_management'),
          href: '/dashboard/families',
          icon: Heart,
        },
      ],
    },
    {
      title: t('Navigation.clinical_operations'),
      icon: Stethoscope,
      children: [
        {
          title: t('Navigation.consultations'),
          href: '/dashboard/consultations',
          icon: Stethoscope,
          roles: ['Doctor'],
        },
        {
          title: t('Navigation.prescriptions'),
          href: '/dashboard/prescriptions',
          icon: Pill,
        },
        {
          title: t('Navigation.lab_results'),
          href: '/dashboard/lab-results',
          icon: TestTube,
        },
        {
          title: t('Navigation.vital_signs'),
          href: '/dashboard/vitals',
          icon: Activity,
          roles: ['Doctor', 'Nurse'],
        },
        {
          title: t('Navigation.emergency_care'),
          href: '/dashboard/emergency',
          icon: AlertCircle,
          badge: 'urgent',
        },
      ],
    },
    {
      title: t('Navigation.ward_management'),
      icon: Bed,
      roles: ['Nurse', 'Ward-Sister', 'Nursing-Supervisor'],
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
    {
      title: t('Navigation.icu_management'),
      icon: Hospital,
      roles: ['ICU-Specialist', 'ICU-Nurse', 'Doctor', 'Admin'],
      children: [
        {
          title: t('Navigation.icu_dashboard'),
          href: '/dashboard/icu',
          icon: LayoutDashboard,
        },
        {
          title: t('Navigation.critical_care'),
          href: '/dashboard/icu/critical-care',
          icon: Heart,
        },
        {
          title: t('Navigation.ventilator_mgmt'),
          href: '/dashboard/icu/ventilators',
          icon: Activity,
        },
      ],
    },
    // Pharmacy - temporarily visible to all for development
    {
      title: t('Navigation.pharmacy'),
      icon: Package,
      // roles: ['Pharmacist', 'Chief-Pharmacist', 'Pharmacy-Assistant'], // Disabled for development
      children: [
        {
          title: 'Pharmacy Dashboard',
          href: '/dashboard/pharmacy',
          icon: LayoutDashboard,
        },
        {
          title: t('Navigation.prescription_queue'),
          href: '/dashboard/pharmacy/prescriptions',
          icon: Pill,
        },
        {
          title: 'Medication Dispensing',
          href: '/dashboard/pharmacy/dispense',
          icon: Package,
        },
        {
          title: 'Drug Interaction Checker',
          href: '/dashboard/pharmacy/interactions',
          icon: Shield,
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
    // Laboratory - temporarily visible to all for development
    {
      title: t('Navigation.laboratory'),
      icon: FlaskConical,
      // roles: ['Lab-Technician', 'Pathologist', 'Microbiologist'], // Disabled for development
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
    {
      title: t('Navigation.reception'),
      icon: Users,
      roles: ['Receptionist', 'Front-Desk-Executive'],
      children: [
        {
          title: t('Navigation.queue_management'),
          href: '/dashboard/queue',
          icon: Users,
        },
        {
          title: t('Navigation.patient_registration'),
          href: '/dashboard/registration',
          icon: UserCog,
        },
        {
          title: t('Navigation.token_generation'),
          href: '/dashboard/tokens',
          icon: FileText,
        },
      ],
    },
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
          title: 'Create Hospital Bill',
          href: '/dashboard/billing/create-hospital',
          icon: FileText,
        },
        {
          title: t('Navigation.patient_billing'),
          href: '/dashboard/billing/patients',
          icon: CreditCard,
        },
        {
          title: 'Invoice Management',
          href: '/dashboard/billing/invoices',
          icon: FileText,
        },
        {
          title: 'Billing Analytics',
          href: '/dashboard/billing/analytics',
          icon: BarChart3,
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
          title: t('Navigation.financial_reports'),
          href: '/dashboard/reports/financial',
          icon: BarChart3,
          adminOnly: true,
        },
      ],
    },
    {
      title: t('Navigation.staff_management'),
      icon: UserCog,
      adminOnly: true,
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
          title: t('Navigation.schedules'),
          href: '/dashboard/schedules',
          icon: Calendar,
        },
        {
          title: t('Navigation.attendance'),
          href: '/dashboard/attendance',
          icon: ClipboardList,
        },
      ],
    },
    {
      title: t('Navigation.reports_analytics'),
      icon: BarChart3,
      children: [
        {
          title: t('Navigation.clinical_reports'),
          href: '/dashboard/reports/clinical',
          icon: FileText,
        },
        {
          title: t('Navigation.operational_reports'),
          href: '/dashboard/reports/operational',
          icon: BarChart3,
        },
        {
          title: t('Navigation.analytics_dashboard'),
          href: '/dashboard/analytics',
          icon: Activity,
        },
      ],
    },
    {
      title: t('Navigation.communication'),
      icon: MessageSquare,
      children: [
        {
          title: t('Navigation.notifications'),
          href: '/dashboard/notifications',
          icon: MessageSquare,
        },
        {
          title: t('Navigation.whatsapp_templates'),
          href: '/dashboard/communication/whatsapp',
          icon: MessageSquare,
        },
        {
          title: t('Navigation.announcements'),
          href: '/dashboard/announcements',
          icon: FileText,
        },
      ],
    },
    {
      title: t('Navigation.system'),
      icon: Settings,
      children: [
        {
          title: t('Navigation.security'),
          href: '/dashboard/security',
          icon: Shield,
        },
        {
          title: 'SSO Management',
          href: '/dashboard/sso-management',
          icon: Shield,
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
        {
          title: t('Navigation.settings'),
          href: '/dashboard/settings',
          icon: Settings,
        },
      ],
    },
    {
      title: 'User Management',
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
    // Development & Testing - Only show in development environment
    ...(process.env.NODE_ENV === 'development' ? [{
      title: 'Development & Testing',
      icon: TestTube,
      adminOnly: true,
      children: [
        {
          title: 'Demo Features',
          href: '/dashboard/demo',
          icon: TestTube,
        },
        {
          title: 'Test Features',
          href: '/dashboard/test-features',
          icon: FlaskConical,
        },
        {
          title: 'Dev Info',
          href: '/dashboard/dev-info',
          icon: FileText,
        },
      ],
    }] : []),
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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Get user role from metadata
  const userRole = (user?.publicMetadata?.role as UserRole) || 'Support-Staff';

  // Get navigation items based on role
  const navigationItems = getNavigationItems(t, userRole);

  // Hospital-specific header info for Indian healthcare context
  const hospitalInfo = {
    name: "Sanjeevani Hospital & Medical Centre",
    department: userRole.replace('-', ' '),
    emergency: "108", // Indian emergency medical services number
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
          'fixed inset-y-0 left-0 z-40 transform bg-background border-r transition-all duration-200 ease-in-out lg:static lg:translate-x-0',
          sidebarCollapsed ? 'w-16' : 'w-64',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        )}
      >
        <div className="flex h-full flex-col">
          {/* Sidebar header */}
          <div className="flex h-16 items-center justify-between border-b px-4">
            <Link href="/dashboard" className={cn("flex items-center space-x-2", sidebarCollapsed && "justify-center")}>
              <Hospital className="size-6" />
              {!sidebarCollapsed && <span className="font-bold">HospitalOS</span>}
            </Link>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="icon"
                className="hidden lg:flex"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                <Menu className="size-5" />
              </Button>
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

          {/* Navigation */}
          <ScrollArea className="flex-1 py-2">
            <nav className="space-y-1 px-2">
              {navigationItems.map((item, index) => (
                <NavItem key={index} item={item} pathname={pathname} collapsed={sidebarCollapsed} />
              ))}
            </nav>
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
                  <span>© 2024 Sanjeevani Hospital & Medical Centre</span>
                  <span>•</span>
                  <span>NABH Accredited</span>
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
 * Navigation item component
 */
function NavItem({ item, pathname, collapsed = false }: { item: NavItem; pathname: string; collapsed?: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const isActive = item.href === pathname;
  const hasActiveChild = item.children?.some(child => child.href === pathname);

  if (item.href && !item.children) {
    return (
      <Link
        href={item.href}
        className={cn(
          'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent',
          isActive && 'bg-accent text-accent-foreground',
          collapsed && 'justify-center px-2'
        )}
        title={collapsed ? item.title : undefined}
      >
        <item.icon className="size-4 flex-shrink-0" />
        {!collapsed && (
          <>
            <span className="truncate">{item.title}</span>
            {item.badge && (
              <span className="ml-auto rounded-full bg-destructive px-2 py-0.5 text-xs text-destructive-foreground">
                {item.badge}
              </span>
            )}
          </>
        )}
      </Link>
    );
  }

  if (collapsed) {
    // In collapsed mode, show only the icon with tooltip
    return (
      <div
        className={cn(
          'flex items-center justify-center rounded-lg px-2 py-2 text-sm font-medium transition-colors hover:bg-accent cursor-pointer',
          hasActiveChild && 'bg-accent/50',
        )}
        title={item.title}
      >
        <item.icon className="size-4" />
      </div>
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
