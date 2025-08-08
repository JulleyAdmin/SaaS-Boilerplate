'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider } from 'next-themes';
import { useState, useEffect } from 'react';
import { networkInterceptor } from '@/utils/network-interceptor';
import { logger } from '@/utils/client-logger';

type ProvidersProps = {
  children: React.ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            retry: (failureCount, error: any) => {
              // Don't retry on 4xx errors
              if (error?.status >= 400 && error?.status < 500) {
                return false;
              }
              return failureCount < 3;
            },
          },
        },
      }),
  );

  // Initialize logging and monitoring
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Enable network interceptor
      networkInterceptor.enable();
      
      // Set log level based on environment
      if (process.env.NODE_ENV === 'development') {
        logger.setLogLevel('debug');
        logger.info('SYSTEM', 'Hospital Management System initialized', {
          environment: process.env.NODE_ENV,
          timestamp: new Date().toISOString(),
        });
      }
      
      // Add keyboard shortcut for debug panel
      const handleKeyPress = (e: KeyboardEvent) => {
        // Ctrl/Cmd + Shift + D to download logs
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'D') {
          e.preventDefault();
          logger.downloadLogs();
        }
        // Ctrl/Cmd + Shift + L to log current state
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'L') {
          e.preventDefault();
          console.log('=== HMS Debug Info ===');
          console.log('Recent Logs:', logger.getLogs({ limit: 20 }));
          console.log('Pending Requests:', networkInterceptor.getPendingRequests());
        }
      };
      
      window.addEventListener('keydown', handleKeyPress);
      
      return () => {
        window.removeEventListener('keydown', handleKeyPress);
      };
    }
  }, []);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <QueryClientProvider client={queryClient}>
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
