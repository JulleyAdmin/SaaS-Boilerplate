import { auth } from '@clerk/nextjs/server';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function withSSOAuth(handler: (req: NextRequest, ...args: any[]) => Promise<NextResponse>) {
  return async (req: NextRequest, ...args: any[]) => {
    try {
      const { userId, orgId } = auth();

      if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      // For organization-scoped endpoints, verify organization access
      const pathname = req.nextUrl.pathname;
      const orgIdMatch = pathname.match(/\/organizations\/([^/]+)/);

      if (orgIdMatch) {
        const pathOrgId = orgIdMatch[1];
        if (orgId !== pathOrgId) {
          return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }
      }

      return await handler(req, ...args);
    } catch (error) {
      console.error('SSO middleware error:', error);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  };
}

export function createSSORedirectUrl(organizationId: string, baseUrl?: string): string {
  const base = baseUrl || (typeof window !== 'undefined' ? window.location.origin : '');
  const redirectUri = `${base}/api/auth/sso/callback`;

  return `/api/auth/sso/authorize?tenant=${organizationId}&redirect_uri=${encodeURIComponent(redirectUri)}`;
}
