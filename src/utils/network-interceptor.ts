import { NetworkLogger, logger } from './client-logger';

// Type definitions
interface RequestInfo {
  id: string;
  method: string;
  url: string;
  headers: Record<string, string>;
  body?: any;
  startTime: number;
}

interface ResponseInfo {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body?: any;
  duration: number;
}

class NetworkInterceptor {
  private requests: Map<string, RequestInfo> = new Map();
  private enabled = true;
  private originalFetch: typeof fetch | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.originalFetch = window.fetch;
      this.interceptFetch();
    }
  }

  private generateRequestId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private interceptFetch() {
    if (typeof window === 'undefined' || !this.originalFetch) return;

    window.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
      if (!this.enabled || !this.originalFetch) {
        return this.originalFetch!.call(window, input, init);
      }

      const requestId = this.generateRequestId();
      const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;
      const method = init?.method || 'GET';
      const startTime = performance.now();

      // Store request info
      const requestInfo: RequestInfo = {
        id: requestId,
        method,
        url,
        headers: this.extractHeaders(init?.headers),
        body: await this.extractBody(init?.body),
        startTime,
      };

      this.requests.set(requestId, requestInfo);

      // Log request
      NetworkLogger.request(method, url, requestInfo.body);

      try {
        // Make the actual request - bind to window to preserve context
        const response = await this.originalFetch!.call(window, input, init);
        const duration = performance.now() - startTime;

        // Clone response to read body without consuming it
        const responseClone = response.clone();
        let responseBody: any;

        try {
          const contentType = response.headers.get('content-type');
          if (contentType?.includes('application/json')) {
            responseBody = await responseClone.json();
          } else if (contentType?.includes('text/')) {
            responseBody = await responseClone.text();
          }
        } catch (error) {
          logger.debug('NETWORK_INTERCEPTOR', 'Failed to parse response body', { error });
        }

        // Create response info
        const responseInfo: ResponseInfo = {
          status: response.status,
          statusText: response.statusText,
          headers: this.extractHeaders(response.headers),
          body: responseBody,
          duration,
        };

        // Log response
        NetworkLogger.response(method, url, response.status, duration, responseBody);

        // Track API performance
        if (url.startsWith('/api/')) {
          this.trackApiPerformance(url, method, duration, response.status);
        }

        // Clean up stored request
        this.requests.delete(requestId);

        return response;
      } catch (error) {
        const duration = performance.now() - startTime;
        
        // Log error
        NetworkLogger.error(method, url, error, duration);

        // Track failed request
        this.trackApiError(url, method, error);

        // Clean up stored request
        this.requests.delete(requestId);

        throw error;
      }
    };
  }

  private extractHeaders(headers?: HeadersInit): Record<string, string> {
    const result: Record<string, string> = {};

    if (headers instanceof Headers) {
      headers.forEach((value, key) => {
        result[key] = value;
      });
    } else if (Array.isArray(headers)) {
      headers.forEach(([key, value]) => {
        result[key] = value;
      });
    } else if (headers) {
      Object.assign(result, headers);
    }

    return result;
  }

  private async extractBody(body?: BodyInit | null): Promise<any> {
    if (!body) return undefined;

    if (typeof body === 'string') {
      try {
        return JSON.parse(body);
      } catch {
        return body;
      }
    }

    if (body instanceof FormData) {
      const formDataObj: Record<string, any> = {};
      body.forEach((value, key) => {
        formDataObj[key] = value;
      });
      return formDataObj;
    }

    if (body instanceof Blob) {
      return { type: 'Blob', size: body.size, mimeType: body.type };
    }

    return body;
  }

  private trackApiPerformance(url: string, method: string, duration: number, status: number) {
    // Track slow API calls
    if (duration > 1000) {
      logger.warn('API_PERFORMANCE', `Slow API call: ${method} ${url} took ${duration}ms`, {
        url,
        method,
        duration,
        status,
      });
    }

    // Track specific endpoints
    if (url.includes('/api/patients')) {
      logger.info('PATIENT_API_METRICS', `Patient API call completed`, {
        endpoint: url,
        method,
        duration,
        status,
      });
    }
  }

  private trackApiError(url: string, method: string, error: any) {
    logger.error('API_ERROR', `API call failed: ${method} ${url}`, {
      url,
      method,
      error: error.message || error,
      stack: error.stack,
    });
  }

  // Public methods
  enable() {
    this.enabled = true;
    logger.info('NETWORK_INTERCEPTOR', 'Network interceptor enabled');
  }

  disable() {
    this.enabled = false;
    logger.info('NETWORK_INTERCEPTOR', 'Network interceptor disabled');
  }

  getPendingRequests(): RequestInfo[] {
    return Array.from(this.requests.values());
  }

  clearPendingRequests() {
    this.requests.clear();
  }
}

// Create and export singleton instance only on client side
export const networkInterceptor = typeof window !== 'undefined' ? new NetworkInterceptor() : ({
  enable: () => {},
  disable: () => {},
  getPendingRequests: () => [],
  clearPendingRequests: () => {},
} as NetworkInterceptor);

// Export types
export type { RequestInfo, ResponseInfo };