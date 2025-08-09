'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

// Demo authentication context for bypassing Clerk in demo mode
interface DemoAuthContext {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    emailAddress: string;
  } | null;
  organization: {
    id: string;
    name: string;
    slug: string;
  } | null;
  isSignedIn: boolean;
}

const demoAuthContext = createContext<DemoAuthContext>({
  user: null,
  organization: null,
  isSignedIn: false,
});

export const useDemoAuth = () => useContext(demoAuthContext);

export function DemoAuthProvider({ children }: { children: React.ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [authState, setAuthState] = useState<DemoAuthContext>({
    user: null,
    organization: null,
    isSignedIn: false,
  });

  useEffect(() => {
    // Initialize demo auth state
    const demoUser = {
      id: 'demo-user-123',
      firstName: 'Demo',
      lastName: 'User',
      emailAddress: 'demo@hospital.com',
    };

    const demoOrg = {
      id: 'demo-org-456',
      name: 'Demo General Hospital',
      slug: 'demo-hospital',
    };

    setAuthState({
      user: demoUser,
      organization: demoOrg,
      isSignedIn: true,
    });

    setIsInitialized(true);
  }, []);

  if (!isInitialized) {
    return <div>Loading demo...</div>;
  }

  return (
    <demoAuthContext.Provider value={authState}>
      {children}
    </demoAuthContext.Provider>
  );
}

// Demo auth hook that mimics Clerk's useAuth
export function useDemoUser() {
  const { user, isSignedIn } = useDemoAuth();
  return { user, isSignedIn };
}

// Demo organization hook that mimics Clerk's useOrganization
export function useDemoOrganization() {
  const { organization } = useDemoAuth();
  return { organization };
}