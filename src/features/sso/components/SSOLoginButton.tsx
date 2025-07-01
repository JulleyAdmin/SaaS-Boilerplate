'use client';

import { Building2 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

type SSOLoginButtonProps = {
  organizationId: string;
  connectionName?: string;
  className?: string;
  variant?: 'default' | 'outline' | 'secondary';
  size?: 'default' | 'sm' | 'lg';
};

export function SSOLoginButton({
  organizationId,
  connectionName = 'SSO',
  className,
  variant = 'outline',
  size = 'default',
}: SSOLoginButtonProps) {
  const handleSSOLogin = () => {
    const baseUrl = window.location.origin;
    const redirectUri = `${baseUrl}/api/auth/sso/callback`;
    const ssoUrl = `/api/auth/sso/authorize?tenant=${organizationId}&redirect_uri=${encodeURIComponent(redirectUri)}`;

    window.location.href = ssoUrl;
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleSSOLogin}
      className={className}
    >
      <Building2 className="mr-2 size-4" />
      Continue with
      {' '}
      {connectionName}
      <Badge variant="secondary" className="ml-2">SSO</Badge>
    </Button>
  );
}
