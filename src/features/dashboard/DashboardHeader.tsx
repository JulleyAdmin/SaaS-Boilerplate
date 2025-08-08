'use client';

import { UserButton } from '@clerk/nextjs';
import { Moon, Sun } from 'lucide-react';
import Link from 'next/link';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Logo } from '@/templates/Logo';

export const DashboardHeader = (props: {
  hospitalInfo: {
    name: string;
    department: string;
    emergency: string;
  };
}) => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center justify-between w-full">
      {/* Left side - Logo and Hospital Info */}
      <div className="flex items-center">
        <Link href="/dashboard" className="max-sm:hidden">
          <Logo />
        </Link>

        <div className="ml-6 max-lg:hidden">
          <div className="flex items-center space-x-6 text-sm">
            <div className="flex items-center space-x-2 text-muted-foreground">
              <span className="font-medium">{props.hospitalInfo.name}</span>
            </div>
            <div className="flex items-center space-x-2 text-muted-foreground">
              <span>Department:</span>
              <span className="font-medium">{props.hospitalInfo.department}</span>
            </div>
            <div className="flex items-center space-x-2 text-red-600">
              <span className="font-medium">Emergency: {props.hospitalInfo.emergency}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - User Controls */}
      <div className="flex items-center">
        <ul className="flex items-center gap-x-1.5 [&_li[data-fade]:hover]:opacity-100 [&_li[data-fade]]:opacity-60">
          <li data-fade>
            <div className="lg:hidden">
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <span>{props.hospitalInfo.department}</span>
                <span>•</span>
                <span className="text-red-600">Emergency: {props.hospitalInfo.emergency}</span>
              </div>
            </div>
          </li>

          {/* Theme Toggle */}
          <li data-fade>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="size-8"
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              <Sun className="size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </li>

          <li>
            <Separator orientation="vertical" className="h-4" />
          </li>

          <li>
            <UserButton
              userProfileMode="navigation"
              userProfileUrl="/dashboard/user-profile"
              appearance={{
                elements: {
                  rootBox: 'px-2 py-1.5',
                },
              }}
            />
          </li>
        </ul>
      </div>
    </div>
  );
};
