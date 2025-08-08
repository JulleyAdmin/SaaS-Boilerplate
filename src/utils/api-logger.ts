import { NextRequest } from 'next/server';
import pino from 'pino';

// Create a pino logger instance with pretty printing for development
const logger = process.env.DEMO_MODE === 'true' ? {
  info: () => {},
  debug: () => {},
  error: () => {},
  warn: () => {},
} : pino({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  transport: process.env.NODE_ENV !== 'production' ? {
    target: 'pino-pretty',
    options: {
      colorize: true,
      ignore: 'pid,hostname',
      translateTime: 'HH:MM:ss.l',
    }
  } : undefined,
});

// Type definitions for API logging
export interface ApiLogContext {
  method: string;
  path: string;
  userId?: string;
  orgId?: string;
  params?: Record<string, any>;
  body?: Record<string, any>;
  error?: Error | unknown;
  duration?: number;
  statusCode?: number;
}

// Middleware for API endpoint logging
export function logApiRequest(request: NextRequest, context: Partial<ApiLogContext>) {
  const startTime = Date.now();
  
  const logContext: ApiLogContext = {
    method: request.method,
    path: request.url,
    ...context,
  };

  // Log the incoming request
  logger.info({
    type: 'API_REQUEST',
    ...logContext,
    timestamp: new Date().toISOString(),
  }, `API Request: ${logContext.method} ${logContext.path}`);

  return {
    end: (statusCode: number, response?: any, error?: Error) => {
      const duration = Date.now() - startTime;
      
      const finalContext = {
        ...logContext,
        duration,
        statusCode,
        error: error ? {
          message: error.message,
          stack: error.stack,
          name: error.name,
        } : undefined,
      };

      if (error || statusCode >= 400) {
        logger.error({
          type: 'API_ERROR',
          ...finalContext,
          timestamp: new Date().toISOString(),
        }, `API Error: ${logContext.method} ${logContext.path} - ${statusCode}`);
      } else {
        logger.info({
          type: 'API_RESPONSE',
          ...finalContext,
          timestamp: new Date().toISOString(),
        }, `API Response: ${logContext.method} ${logContext.path} - ${statusCode} (${duration}ms)`);
      }
    }
  };
}

// Specific loggers for different API operations
export const PatientApiLogger = {
  search: (params: any, resultCount: number, duration: number) => {
    logger.debug({
      type: 'PATIENT_SEARCH',
      params,
      resultCount,
      duration,
      timestamp: new Date().toISOString(),
    }, `Patient search: found ${resultCount} results in ${duration}ms`);
  },

  create: (patientData: any, patientId: string) => {
    logger.info({
      type: 'PATIENT_CREATE',
      patientId,
      patientCode: patientData.patientCode,
      timestamp: new Date().toISOString(),
    }, `Patient created: ${patientData.firstName} ${patientData.lastName} (${patientData.patientCode})`);
  },

  update: (patientId: string, changes: any) => {
    logger.info({
      type: 'PATIENT_UPDATE',
      patientId,
      changes: Object.keys(changes),
      timestamp: new Date().toISOString(),
    }, `Patient updated: ${patientId}`);
  },

  error: (operation: string, error: Error, context?: any) => {
    logger.error({
      type: 'PATIENT_ERROR',
      operation,
      error: {
        message: error.message,
        stack: error.stack,
        name: error.name,
      },
      context,
      timestamp: new Date().toISOString(),
    }, `Patient operation error: ${operation} - ${error.message}`);
  },
};

// Performance monitoring
export function logPerformance(operation: string, fn: () => Promise<any>) {
  return async () => {
    const start = Date.now();
    try {
      const result = await fn();
      const duration = Date.now() - start;
      
      if (duration > 1000) {
        logger.warn({
          type: 'PERFORMANCE_WARNING',
          operation,
          duration,
          timestamp: new Date().toISOString(),
        }, `Slow operation: ${operation} took ${duration}ms`);
      }
      
      return result;
    } catch (error) {
      const duration = Date.now() - start;
      logger.error({
        type: 'PERFORMANCE_ERROR',
        operation,
        duration,
        error: error instanceof Error ? {
          message: error.message,
          stack: error.stack,
        } : error,
        timestamp: new Date().toISOString(),
      }, `Operation failed: ${operation} after ${duration}ms`);
      throw error;
    }
  };
}

// Database query logging
export const DatabaseLogger = {
  query: (query: string, params?: any[], duration?: number) => {
    logger.debug({
      type: 'DB_QUERY',
      query,
      params,
      duration,
      timestamp: new Date().toISOString(),
    }, `Database query executed${duration ? ` in ${duration}ms` : ''}`);
  },

  error: (query: string, error: Error, params?: any[]) => {
    logger.error({
      type: 'DB_ERROR',
      query,
      params,
      error: {
        message: error.message,
        stack: error.stack,
      },
      timestamp: new Date().toISOString(),
    }, `Database error: ${error.message}`);
  },
};

export default logger;