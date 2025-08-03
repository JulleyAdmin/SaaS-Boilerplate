import pino from 'pino';

import { Env } from './Env';

// Log levels for different environments
const logLevel = {
  development: 'debug',
  test: 'warn',
  production: 'info',
}[Env.NODE_ENV] || 'info';

// Pretty print configuration for development
const transport = Env.NODE_ENV === 'development'
  ? {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
        singleLine: false,
      },
    }
  : undefined;

// Create base logger instance
const baseLogger = pino({
  name: 'HospitalOS',
  level: logLevel,
  timestamp: pino.stdTimeFunctions.isoTime,
  transport,
  redact: {
    paths: [
      'password',
      'token',
      'authorization',
      'cookie',
      'ssn',
      'patientId',
      'email',
      'phone',
      '*.password',
      '*.token',
      '*.authorization',
      '*.cookie',
      '*.ssn',
      '*.patientId',
      '*.email',
      '*.phone',
    ],
    censor: '[REDACTED]',
  },
  serializers: {
    req: pino.stdSerializers.req,
    res: pino.stdSerializers.res,
    err: pino.stdSerializers.err,
  },
  formatters: {
    level: (label) => {
      return { level: label.toUpperCase() };
    },
  },
});

// Create child loggers for different modules
export const createLogger = (module: string) => {
  return baseLogger.child({ module });
};

// Specialized loggers for different domains
export const authLogger = createLogger('auth');
export const apiLogger = createLogger('api');
export const dbLogger = createLogger('database');
export const ssoLogger = createLogger('sso');
export const scheduleLogger = createLogger('schedule');
export const patientLogger = createLogger('patient');
export const departmentLogger = createLogger('department');
export const medicineLogger = createLogger('medicine');
export const hospitalNetworkLogger = createLogger('hospital-network');
export const performanceLogger = createLogger('performance');
export const securityLogger = createLogger('security');
export const testLogger = createLogger('test');

// Utility function to log API requests
export const logApiRequest = (req: any, res: any, responseTime: number) => {
  const logData = {
    method: req.method,
    url: req.url,
    statusCode: res.statusCode,
    responseTime: `${responseTime}ms`,
    userAgent: req.headers['user-agent'],
    ip: req.ip || req.connection?.remoteAddress,
    organizationId: req.auth?.orgId,
    userId: req.auth?.userId,
  };

  if (res.statusCode >= 400) {
    apiLogger.error(logData, 'API request failed');
  } else if (responseTime > 1000) {
    apiLogger.warn(logData, 'Slow API request');
  } else {
    apiLogger.info(logData, 'API request completed');
  }
};

// Utility function to log database queries
export const logDbQuery = (query: string, params: any[], duration: number) => {
  const logData = {
    query: query.substring(0, 100), // Truncate long queries
    paramCount: params.length,
    duration: `${duration}ms`,
  };

  if (duration > 1000) {
    dbLogger.warn(logData, 'Slow database query');
  } else {
    dbLogger.debug(logData, 'Database query executed');
  }
};

// Utility function to log security events
export const logSecurityEvent = (event: string, details: any) => {
  securityLogger.warn({ event, ...details }, `Security event: ${event}`);
};

// Utility function to log performance metrics
export const logPerformanceMetric = (metric: string, value: number, metadata?: any) => {
  performanceLogger.info({ metric, value, ...metadata }, `Performance metric: ${metric}`);
};

// Export main logger for general use
export const logger = baseLogger;
