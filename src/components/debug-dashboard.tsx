'use client';

import { useState, useEffect } from 'react';
import { X, Download, Trash2, Filter, Bug } from 'lucide-react';
import { logger, LogEntry, LogLevel } from '@/utils/client-logger';
import { networkInterceptor } from '@/utils/network-interceptor';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

export function DebugDashboard() {
  const [isOpen, setIsOpen] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [levelFilter, setLevelFilter] = useState<LogLevel | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [refreshInterval, setRefreshInterval] = useState<number | null>(1000);

  // Refresh logs
  useEffect(() => {
    const updateLogs = () => {
      const filter: any = {};
      if (levelFilter !== 'all') {
        filter.level = levelFilter;
      }
      if (categoryFilter) {
        filter.category = categoryFilter;
      }
      setLogs(logger.getLogs(filter));
    };

    updateLogs();

    if (refreshInterval) {
      const interval = setInterval(updateLogs, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [levelFilter, categoryFilter, refreshInterval]);

  // Keyboard shortcut
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'B') {
        e.preventDefault();
        setIsOpen(!isOpen);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isOpen]);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90"
        title="Open Debug Dashboard (Ctrl+Shift+B)"
      >
        <Bug className="h-6 w-6" />
      </button>
    );
  }

  const getLevelColor = (level: LogLevel) => {
    switch (level) {
      case 'debug': return 'outline';
      case 'info': return 'default';
      case 'warn': return 'secondary';
      case 'error': return 'destructive';
    }
  };

  const getCategoryColor = (category: string) => {
    if (category.includes('ERROR')) return 'destructive';
    if (category.includes('API')) return 'default';
    if (category.includes('PATIENT')) return 'secondary';
    if (category.includes('NETWORK')) return 'outline';
    return 'default';
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      fractionalSecondDigits: 3
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
      <Card className="fixed bottom-0 left-0 right-0 top-1/3 m-4 flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-xl font-bold">Debug Dashboard</CardTitle>
          <div className="flex items-center gap-2">
            <Select value={refreshInterval?.toString() || 'manual'} onValueChange={(value) => {
              setRefreshInterval(value === 'manual' ? null : parseInt(value));
            }}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Refresh rate" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="manual">Manual</SelectItem>
                <SelectItem value="500">500ms</SelectItem>
                <SelectItem value="1000">1s</SelectItem>
                <SelectItem value="5000">5s</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              onClick={() => logger.clearLogs()}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Clear
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => logger.downloadLogs()}
            >
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden p-0">
          <div className="border-b p-4">
            <div className="flex gap-4">
              <Select value={levelFilter} onValueChange={(value) => setLevelFilter(value as any)}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Filter level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="debug">Debug</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="warn">Warning</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                </SelectContent>
              </Select>
              <Input
                placeholder="Filter by category..."
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="max-w-xs"
              />
              <div className="ml-auto text-sm text-muted-foreground">
                {logs.length} entries | {networkInterceptor.getPendingRequests().length} pending requests
              </div>
            </div>
          </div>
          <ScrollArea className="h-full">
            <div className="p-4">
              {logs.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  No logs to display
                </div>
              ) : (
                <div className="space-y-2">
                  {logs.map((log, index) => (
                    <div
                      key={index}
                      className="rounded-lg border p-3 font-mono text-sm"
                    >
                      <div className="flex items-start gap-2">
                        <span className="text-muted-foreground text-xs">
                          {formatTimestamp(log.timestamp)}
                        </span>
                        <Badge variant={getLevelColor(log.level)} className="text-xs">
                          {log.level.toUpperCase()}
                        </Badge>
                        <Badge variant={getCategoryColor(log.category)} className="text-xs">
                          {log.category}
                        </Badge>
                        <span className="flex-1 break-all">
                          {log.message}
                        </span>
                      </div>
                      {log.data && (
                        <div className="mt-2 rounded bg-muted p-2 text-xs">
                          <pre className="whitespace-pre-wrap break-all">
                            {JSON.stringify(log.data, null, 2)}
                          </pre>
                        </div>
                      )}
                      {log.stack && log.level === 'error' && (
                        <div className="mt-2 rounded bg-destructive/10 p-2 text-xs text-destructive">
                          <pre className="whitespace-pre-wrap break-all">
                            {log.stack}
                          </pre>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}