// Demo Authentication Provider
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { DEMO_USER } from './mockDataProvider';

// Types
interface DemoUser {
  id: string;
  email: string;
  name: string;
  role: string;
  department: string;
  permissions: string[];
  avatar: string;
}

interface DemoAuthContextType {
  isLoaded: boolean;
  isSignedIn: boolean;
  user: DemoUser | null;
  signIn: (email?: string, password?: string) => Promise<void>;
  signOut: () => Promise<void>;
  orgId: string;
  orgRole: string;
  orgSlug: string;
  organization: {
    id: string;
    name: string;
    slug: string;
  } | null;
}

// Create context
const DemoAuthContext = createContext<DemoAuthContextType | undefined>(undefined);

// Provider component
export function DemoAuthProvider({ children }: { children: ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [user, setUser] = useState<DemoUser | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Check if demo mode is enabled
  const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

  // Auto sign-in for demo mode
  useEffect(() => {
    if (!isDemoMode) return;

    const initDemoAuth = async () => {
      // Simulate loading delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Check if user should be signed in
      const storedAuth = localStorage.getItem('demo_auth');
      const shouldAutoSignIn = process.env.NEXT_PUBLIC_BYPASS_AUTH === 'true';

      if (storedAuth || shouldAutoSignIn) {
        setUser(DEMO_USER);
        setIsSignedIn(true);
        
        // Store auth state
        localStorage.setItem('demo_auth', JSON.stringify(DEMO_USER));
      }

      setIsLoaded(true);
    };

    initDemoAuth();
  }, [isDemoMode]);

  // Redirect logic
  useEffect(() => {
    if (!isLoaded) return;

    const publicPaths = ['/sign-in', '/sign-up', '/', '/about', '/pricing'];
    const isPublicPath = publicPaths.some(path => pathname?.startsWith(path));

    if (!isSignedIn && !isPublicPath && isDemoMode) {
      router.push('/sign-in');
    } else if (isSignedIn && (pathname === '/sign-in' || pathname === '/sign-up')) {
      router.push('/dashboard');
    }
  }, [isLoaded, isSignedIn, pathname, router, isDemoMode]);

  // Sign in function
  const signIn = async (email?: string, password?: string) => {
    if (!isDemoMode) return;

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Set user data
    setUser(DEMO_USER);
    setIsSignedIn(true);

    // Store auth state
    localStorage.setItem('demo_auth', JSON.stringify(DEMO_USER));

    // Redirect to dashboard
    router.push('/dashboard');
  };

  // Sign out function
  const signOut = async () => {
    if (!isDemoMode) return;

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Clear user data
    setUser(null);
    setIsSignedIn(false);

    // Clear auth state
    localStorage.removeItem('demo_auth');

    // Redirect to sign-in
    router.push('/sign-in');
  };

  // Mock organization data
  const organization = isSignedIn ? {
    id: 'org_demo_hospital',
    name: 'Demo General Hospital',
    slug: 'demo-hospital'
  } : null;

  const value: DemoAuthContextType = {
    isLoaded,
    isSignedIn,
    user,
    signIn,
    signOut,
    orgId: organization?.id || '',
    orgRole: user?.role || '',
    orgSlug: organization?.slug || '',
    organization
  };

  return (
    <DemoAuthContext.Provider value={value}>
      {children}
    </DemoAuthContext.Provider>
  );
}

// Hook to use demo auth
export function useDemoAuth() {
  const context = useContext(DemoAuthContext);
  if (context === undefined) {
    throw new Error('useDemoAuth must be used within a DemoAuthProvider');
  }
  return context;
}

// Clerk compatibility wrapper
export function useAuth() {
  const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';
  
  if (isDemoMode) {
    const demoAuth = useDemoAuth();
    return {
      isLoaded: demoAuth.isLoaded,
      isSignedIn: demoAuth.isSignedIn,
      userId: demoAuth.user?.id || null,
      sessionId: demoAuth.isSignedIn ? 'demo_session_' + Date.now() : null,
      orgId: demoAuth.orgId,
      orgRole: demoAuth.orgRole,
      orgSlug: demoAuth.orgSlug,
      signOut: demoAuth.signOut,
      getToken: async () => 'demo_token_' + Date.now(),
      has: (permission: string) => demoAuth.user?.permissions.includes(permission) || false
    };
  }

  // In production, this would return the actual Clerk useAuth hook
  // For now, return a mock for type safety
  return {
    isLoaded: false,
    isSignedIn: false,
    userId: null,
    sessionId: null,
    orgId: null,
    orgRole: null,
    orgSlug: null,
    signOut: async () => {},
    getToken: async () => null,
    has: () => false
  };
}

// Clerk compatibility wrapper for useUser
export function useUser() {
  const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';
  
  if (isDemoMode) {
    const demoAuth = useDemoAuth();
    return {
      isLoaded: demoAuth.isLoaded,
      isSignedIn: demoAuth.isSignedIn,
      user: demoAuth.user ? {
        id: demoAuth.user.id,
        primaryEmailAddress: {
          emailAddress: demoAuth.user.email
        },
        fullName: demoAuth.user.name,
        firstName: demoAuth.user.name.split(' ')[0],
        lastName: demoAuth.user.name.split(' ')[1] || '',
        imageUrl: demoAuth.user.avatar,
        publicMetadata: {
          role: demoAuth.user.role,
          department: demoAuth.user.department
        }
      } : null
    };
  }

  // In production, return actual Clerk useUser
  return {
    isLoaded: false,
    isSignedIn: false,
    user: null
  };
}

// Clerk compatibility wrapper for useOrganization
export function useOrganization() {
  const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';
  
  if (isDemoMode) {
    const demoAuth = useDemoAuth();
    return {
      isLoaded: demoAuth.isLoaded,
      organization: demoAuth.organization,
      membership: demoAuth.organization ? {
        id: 'mem_demo',
        role: demoAuth.orgRole,
        publicMetadata: {}
      } : null
    };
  }

  // In production, return actual Clerk useOrganization
  return {
    isLoaded: false,
    organization: null,
    membership: null
  };
}

// SignIn component for demo mode
export function DemoSignIn() {
  const { signIn } = useDemoAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await signIn();
    setIsLoading(false);
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Demo Sign In</h2>
        <p className="mt-2 text-sm text-gray-600">
          Click sign in to access the demo with pre-configured data
        </p>
      </div>

      <form onSubmit={handleSignIn} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            defaultValue="admin@demo.hospital.com"
            disabled
            className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            defaultValue="••••••••"
            disabled
            className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-500"
          />
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
          <p className="text-xs text-blue-700">
            <strong>Demo Mode:</strong> Authentication is bypassed. Click sign in to continue.
          </p>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Signing in...' : 'Sign In to Demo'}
        </button>
      </form>

      <div className="mt-6 border-t pt-6">
        <div className="text-sm text-gray-600">
          <p className="font-semibold mb-2">Demo Features Available:</p>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li>50+ sample patients with medical history</li>
            <li>100+ appointments across departments</li>
            <li>20+ doctors with specializations</li>
            <li>Real-time dashboard statistics</li>
            <li>Prescription management</li>
            <li>Lab test results</li>
            <li>Billing and payments</li>
            <li>Emergency and ICU modules</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// Demo banner component
export function DemoBanner() {
  const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';
  const [isVisible, setIsVisible] = useState(true);

  if (!isDemoMode || !isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">🎭 Demo Mode Active</span>
          <span className="text-xs opacity-90">
            All data is simulated for demonstration purposes
          </span>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="text-white hover:text-gray-200 text-xl leading-none"
        >
          ×
        </button>
      </div>
    </div>
  );
}