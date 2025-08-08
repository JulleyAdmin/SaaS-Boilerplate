// Client-side logger for UI debugging and monitoring

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  category: string;
  message: string;
  data?: any;
  stack?: string;
}

class ClientLogger {
  private logs: LogEntry[] = [];
  private maxLogs = 1000;
  private consoleEnabled = true;
  private remoteEnabled = false;
  private logLevel: LogLevel = process.env.NODE_ENV === 'production' ? 'info' : 'debug';

  constructor() {
    if (typeof window !== 'undefined') {
      // Store logger instance globally for debugging
      (window as any).__HMS_LOGGER__ = this;
      
      // Listen for unhandled errors
      window.addEventListener('error', (event) => {
        this.error('UNHANDLED_ERROR', event.error?.message || event.message, {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          error: event.error,
        });
      });

      // Listen for unhandled promise rejections
      window.addEventListener('unhandledrejection', (event) => {
        this.error('UNHANDLED_REJECTION', 'Unhandled promise rejection', {
          reason: event.reason,
        });
      });
    }
  }

  private shouldLog(level: LogLevel): boolean {
    const levels: LogLevel[] = ['debug', 'info', 'warn', 'error'];
    const currentLevelIndex = levels.indexOf(this.logLevel);
    const messageLevelIndex = levels.indexOf(level);
    return messageLevelIndex >= currentLevelIndex;
  }

  private formatMessage(entry: LogEntry): string {
    return `[${entry.timestamp}] [${entry.level.toUpperCase()}] [${entry.category}] ${entry.message}`;
  }

  private log(level: LogLevel, category: string, message: string, data?: any) {
    if (!this.shouldLog(level)) return;

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      category,
      message,
      data,
      stack: level === 'error' ? new Error().stack : undefined,
    };

    // Store in memory
    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // Console output
    if (this.consoleEnabled) {
      const formattedMessage = this.formatMessage(entry);
      const consoleMethod = level === 'debug' ? 'log' : level;
      
      if (data) {
        console[consoleMethod](formattedMessage, data);
      } else {
        console[consoleMethod](formattedMessage);
      }
    }

    // Remote logging (if enabled)
    if (this.remoteEnabled && level === 'error') {
      this.sendToRemote(entry);
    }
  }

  private async sendToRemote(entry: LogEntry) {
    try {
      await fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry),
      });
    } catch (error) {
      console.error('Failed to send log to remote:', error);
    }
  }

  // Public logging methods
  debug(category: string, message: string, data?: any) {
    this.log('debug', category, message, data);
  }

  info(category: string, message: string, data?: any) {
    this.log('info', category, message, data);
  }

  warn(category: string, message: string, data?: any) {
    this.log('warn', category, message, data);
  }

  error(category: string, message: string, data?: any) {
    this.log('error', category, message, data);
  }

  // Performance tracking
  startTimer(name: string): () => void {
    const start = performance.now();
    return () => {
      const duration = performance.now() - start;
      this.debug('PERFORMANCE', `${name} took ${duration.toFixed(2)}ms`, { duration });
      return duration;
    };
  }

  // API tracking
  trackApiCall(method: string, url: string, status?: number, duration?: number, error?: any) {
    const category = 'API_CALL';
    const message = `${method} ${url} - ${status || 'pending'}`;
    
    if (error) {
      this.error(category, message, { method, url, status, duration, error });
    } else if (status && status >= 400) {
      this.warn(category, message, { method, url, status, duration });
    } else {
      this.info(category, message, { method, url, status, duration });
    }
  }

  // Component lifecycle tracking
  componentMounted(componentName: string, props?: any) {
    this.debug('COMPONENT', `${componentName} mounted`, { props });
  }

  componentUpdated(componentName: string, changes?: any) {
    this.debug('COMPONENT', `${componentName} updated`, { changes });
  }

  componentError(componentName: string, error: Error, errorInfo?: any) {
    this.error('COMPONENT', `${componentName} error: ${error.message}`, {
      error,
      errorInfo,
    });
  }

  // User action tracking
  userAction(action: string, target?: string, data?: any) {
    this.info('USER_ACTION', `${action}${target ? ` on ${target}` : ''}`, data);
  }

  // Get logs for debugging
  getLogs(filter?: { level?: LogLevel; category?: string; limit?: number }): LogEntry[] {
    let filtered = this.logs;

    if (filter?.level) {
      filtered = filtered.filter(log => log.level === filter.level);
    }

    if (filter?.category) {
      filtered = filtered.filter(log => log.category === filter.category);
    }

    if (filter?.limit) {
      filtered = filtered.slice(-filter.limit);
    }

    return filtered;
  }

  // Clear logs
  clearLogs() {
    this.logs = [];
    this.info('LOGGER', 'Logs cleared');
  }

  // Export logs for debugging
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  // Download logs as file
  downloadLogs() {
    const data = this.exportLogs();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hms-logs-${new Date().toISOString()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // Configuration
  setLogLevel(level: LogLevel) {
    this.logLevel = level;
    this.info('LOGGER', `Log level set to ${level}`);
  }

  enableConsole(enabled: boolean) {
    this.consoleEnabled = enabled;
  }

  enableRemoteLogging(enabled: boolean) {
    this.remoteEnabled = enabled;
  }
}

// Create singleton instance only on client side
export const logger = typeof window !== 'undefined' ? new ClientLogger() : ({
  debug: () => {},
  info: () => {},
  warn: () => {},
  error: () => {},
  startTimer: () => () => 0,
  trackApiCall: () => {},
  componentMounted: () => {},
  componentUpdated: () => {},
  componentError: () => {},
  userAction: () => {},
  getLogs: () => [],
  clearLogs: () => {},
  exportLogs: () => '[]',
  downloadLogs: () => {},
  setLogLevel: () => {},
  enableConsole: () => {},
  enableRemoteLogging: () => {},
} as ClientLogger);

// Specific loggers for different parts of the application
export const PatientLogger = {
  search: (params: any, resultCount: number) => {
    logger.info('PATIENT_SEARCH', `Searching patients`, { params, resultCount });
  },

  select: (patientId: string, patientName: string) => {
    logger.info('PATIENT_SELECT', `Selected patient: ${patientName}`, { patientId });
  },

  create: (patientData: any) => {
    logger.info('PATIENT_CREATE', 'Creating new patient', { patientData });
  },

  update: (patientId: string, updates: any) => {
    logger.info('PATIENT_UPDATE', `Updating patient ${patientId}`, { updates });
  },

  error: (operation: string, error: any) => {
    logger.error('PATIENT_ERROR', `Patient ${operation} failed`, { error });
  },
};

export const NetworkLogger = {
  request: (method: string, url: string, body?: any) => {
    logger.debug('NETWORK_REQUEST', `${method} ${url}`, { body });
  },

  response: (method: string, url: string, status: number, duration: number, data?: any) => {
    logger.debug('NETWORK_RESPONSE', `${method} ${url} - ${status} (${duration}ms)`, { 
      status, 
      duration, 
      data 
    });
  },

  error: (method: string, url: string, error: any, duration?: number) => {
    logger.error('NETWORK_ERROR', `${method} ${url} failed`, { 
      error, 
      duration 
    });
  },
};

export const UILogger = {
  render: (component: string, duration: number) => {
    if (duration > 100) {
      logger.warn('UI_RENDER', `Slow render: ${component} took ${duration}ms`, { duration });
    } else {
      logger.debug('UI_RENDER', `${component} rendered in ${duration}ms`, { duration });
    }
  },

  interaction: (element: string, action: string, data?: any) => {
    logger.info('UI_INTERACTION', `${action} on ${element}`, data);
  },

  navigation: (from: string, to: string) => {
    logger.info('UI_NAVIGATION', `Navigating from ${from} to ${to}`);
  },
};

// Export types
export type { LogEntry, LogLevel };