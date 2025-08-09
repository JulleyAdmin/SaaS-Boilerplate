// API Interceptor for Demo Mode
import { mockDataProvider, DEMO_USER } from './mockDataProvider';

// Types
interface InterceptorConfig {
  enabled: boolean;
  delay?: number;
  errorRate?: number;
}

interface MockResponse {
  data?: any;
  error?: any;
  status: number;
  headers?: Record<string, string>;
}

// API Response simulator with realistic delays
const simulateDelay = (min: number = 100, max: number = 500): Promise<void> => {
  const delay = Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise(resolve => setTimeout(resolve, delay));
};

// API Interceptor Class
class DemoApiInterceptor {
  private config: InterceptorConfig = {
    enabled: process.env.NEXT_PUBLIC_DEMO_MODE === 'true',
    delay: 200,
    errorRate: 0.02 // 2% error rate for realism
  };

  // Check if demo mode is enabled
  isEnabled(): boolean {
    return this.config.enabled;
  }

  // Intercept fetch requests
  async interceptFetch(url: string, options?: RequestInit): Promise<Response> {
    if (!this.isEnabled()) {
      return fetch(url, options);
    }

    // Parse the URL
    const urlObj = new URL(url, window.location.origin);
    const pathname = urlObj.pathname;

    // Simulate network delay
    await simulateDelay(100, 300);

    // Route to appropriate mock handler
    const mockResponse = await this.handleApiRoute(pathname, options);

    // Create a mock Response object
    return new Response(JSON.stringify(mockResponse.data || mockResponse.error), {
      status: mockResponse.status,
      headers: {
        'Content-Type': 'application/json',
        ...mockResponse.headers
      }
    });
  }

  // Handle API routes
  private async handleApiRoute(pathname: string, options?: RequestInit): Promise<MockResponse> {
    const method = options?.method || 'GET';

    // Auth routes
    if (pathname.startsWith('/api/auth')) {
      return this.handleAuthRoutes(pathname, method, options);
    }

    // Patient routes
    if (pathname.startsWith('/api/patients')) {
      return this.handlePatientRoutes(pathname, method, options);
    }

    // Appointment routes
    if (pathname.startsWith('/api/appointments')) {
      return this.handleAppointmentRoutes(pathname, method, options);
    }

    // Doctor routes
    if (pathname.startsWith('/api/doctors')) {
      return this.handleDoctorRoutes(pathname, method, options);
    }

    // Department routes
    if (pathname.startsWith('/api/departments')) {
      return this.handleDepartmentRoutes(pathname, method, options);
    }

    // Prescription routes
    if (pathname.startsWith('/api/prescriptions')) {
      return this.handlePrescriptionRoutes(pathname, method, options);
    }

    // Lab test routes
    if (pathname.startsWith('/api/lab-tests')) {
      return this.handleLabTestRoutes(pathname, method, options);
    }

    // Billing routes
    if (pathname.startsWith('/api/billing')) {
      return this.handleBillingRoutes(pathname, method, options);
    }

    // Dashboard routes
    if (pathname.startsWith('/api/dashboard')) {
      return this.handleDashboardRoutes(pathname, method, options);
    }

    // Default 404
    return {
      error: { message: 'Route not found' },
      status: 404
    };
  }

  // Auth route handlers
  private handleAuthRoutes(pathname: string, method: string, options?: RequestInit): MockResponse {
    if (pathname === '/api/auth/login' && method === 'POST') {
      return {
        data: {
          user: DEMO_USER,
          token: 'demo-jwt-token-' + Date.now(),
          expiresIn: 3600
        },
        status: 200
      };
    }

    if (pathname === '/api/auth/me' && method === 'GET') {
      return {
        data: { user: DEMO_USER },
        status: 200
      };
    }

    if (pathname === '/api/auth/logout' && method === 'POST') {
      return {
        data: { message: 'Logged out successfully' },
        status: 200
      };
    }

    return {
      error: { message: 'Auth route not found' },
      status: 404
    };
  }

  // Patient route handlers
  private handlePatientRoutes(pathname: string, method: string, options?: RequestInit): MockResponse {
    const idMatch = pathname.match(/\/api\/patients\/([^\/]+)/);
    
    if (pathname === '/api/patients' && method === 'GET') {
      const patients = mockDataProvider.generatePatients(50);
      return {
        data: {
          patients,
          total: patients.length,
          page: 1,
          pageSize: 50
        },
        status: 200
      };
    }

    if (pathname === '/api/patients' && method === 'POST') {
      const body = options?.body ? JSON.parse(options.body as string) : {};
      const newPatient = {
        id: 'pat-' + Date.now(),
        registrationNumber: 'PAT' + String(Date.now()).slice(-6),
        ...body,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      return {
        data: { patient: newPatient },
        status: 201
      };
    }

    if (idMatch && method === 'GET') {
      const patient = mockDataProvider.getPatientById(idMatch[1]);
      if (patient) {
        return {
          data: { patient },
          status: 200
        };
      }
      return {
        error: { message: 'Patient not found' },
        status: 404
      };
    }

    if (idMatch && method === 'PUT') {
      const patient = mockDataProvider.getPatientById(idMatch[1]);
      if (patient) {
        const body = options?.body ? JSON.parse(options.body as string) : {};
        const updatedPatient = {
          ...patient,
          ...body,
          updatedAt: new Date()
        };
        return {
          data: { patient: updatedPatient },
          status: 200
        };
      }
      return {
        error: { message: 'Patient not found' },
        status: 404
      };
    }

    if (idMatch && method === 'DELETE') {
      return {
        data: { message: 'Patient deleted successfully' },
        status: 200
      };
    }

    if (pathname === '/api/patients/search' && method === 'GET') {
      const url = new URL(pathname, window.location.origin);
      const query = url.searchParams.get('q') || '';
      const results = mockDataProvider.searchPatients(query);
      return {
        data: { results },
        status: 200
      };
    }

    return {
      error: { message: 'Patient route not found' },
      status: 404
    };
  }

  // Appointment route handlers
  private handleAppointmentRoutes(pathname: string, method: string, options?: RequestInit): MockResponse {
    const idMatch = pathname.match(/\/api\/appointments\/([^\/]+)/);

    if (pathname === '/api/appointments' && method === 'GET') {
      const appointments = mockDataProvider.generateAppointments(100);
      return {
        data: {
          appointments,
          total: appointments.length,
          page: 1,
          pageSize: 100
        },
        status: 200
      };
    }

    if (pathname === '/api/appointments' && method === 'POST') {
      const body = options?.body ? JSON.parse(options.body as string) : {};
      const newAppointment = {
        id: 'apt-' + Date.now(),
        ...body,
        status: 'scheduled',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      return {
        data: { appointment: newAppointment },
        status: 201
      };
    }

    if (pathname === '/api/appointments/today' && method === 'GET') {
      const appointments = mockDataProvider.getTodayAppointments();
      return {
        data: { appointments },
        status: 200
      };
    }

    if (idMatch && method === 'GET') {
      const appointments = mockDataProvider.generateAppointments(100);
      const appointment = appointments.find(a => a.id === idMatch[1]);
      if (appointment) {
        return {
          data: { appointment },
          status: 200
        };
      }
      return {
        error: { message: 'Appointment not found' },
        status: 404
      };
    }

    if (idMatch && method === 'PUT') {
      const appointments = mockDataProvider.generateAppointments(100);
      const appointment = appointments.find(a => a.id === idMatch[1]);
      if (appointment) {
        const body = options?.body ? JSON.parse(options.body as string) : {};
        const updatedAppointment = {
          ...appointment,
          ...body,
          updatedAt: new Date()
        };
        return {
          data: { appointment: updatedAppointment },
          status: 200
        };
      }
      return {
        error: { message: 'Appointment not found' },
        status: 404
      };
    }

    if (idMatch && method === 'DELETE') {
      return {
        data: { message: 'Appointment cancelled successfully' },
        status: 200
      };
    }

    if (pathname.includes('/patient/') && method === 'GET') {
      const patientIdMatch = pathname.match(/\/patient\/([^\/]+)/);
      if (patientIdMatch) {
        const appointments = mockDataProvider.getAppointmentsByPatient(patientIdMatch[1]);
        return {
          data: { appointments },
          status: 200
        };
      }
    }

    if (pathname.includes('/doctor/') && method === 'GET') {
      const doctorIdMatch = pathname.match(/\/doctor\/([^\/]+)/);
      if (doctorIdMatch) {
        const appointments = mockDataProvider.getAppointmentsByDoctor(doctorIdMatch[1]);
        return {
          data: { appointments },
          status: 200
        };
      }
    }

    return {
      error: { message: 'Appointment route not found' },
      status: 404
    };
  }

  // Doctor route handlers
  private handleDoctorRoutes(pathname: string, method: string, options?: RequestInit): MockResponse {
    const idMatch = pathname.match(/\/api\/doctors\/([^\/]+)/);

    if (pathname === '/api/doctors' && method === 'GET') {
      const doctors = mockDataProvider.generateDoctors(20);
      return {
        data: {
          doctors,
          total: doctors.length
        },
        status: 200
      };
    }

    if (idMatch && method === 'GET') {
      const doctors = mockDataProvider.generateDoctors(20);
      const doctor = doctors.find(d => d.id === idMatch[1]);
      if (doctor) {
        return {
          data: { doctor },
          status: 200
        };
      }
      return {
        error: { message: 'Doctor not found' },
        status: 404
      };
    }

    if (pathname === '/api/doctors/available' && method === 'GET') {
      const doctors = mockDataProvider.generateDoctors(20);
      const available = doctors.filter(d => d.status === 'available');
      return {
        data: { doctors: available },
        status: 200
      };
    }

    return {
      error: { message: 'Doctor route not found' },
      status: 404
    };
  }

  // Department route handlers
  private handleDepartmentRoutes(pathname: string, method: string, options?: RequestInit): MockResponse {
    if (pathname === '/api/departments' && method === 'GET') {
      const departments = mockDataProvider.generateDepartments();
      return {
        data: {
          departments,
          total: departments.length
        },
        status: 200
      };
    }

    const idMatch = pathname.match(/\/api\/departments\/([^\/]+)/);
    if (idMatch && method === 'GET') {
      const departments = mockDataProvider.generateDepartments();
      const department = departments.find(d => d.id === idMatch[1]);
      if (department) {
        return {
          data: { department },
          status: 200
        };
      }
      return {
        error: { message: 'Department not found' },
        status: 404
      };
    }

    return {
      error: { message: 'Department route not found' },
      status: 404
    };
  }

  // Prescription route handlers
  private handlePrescriptionRoutes(pathname: string, method: string, options?: RequestInit): MockResponse {
    if (pathname === '/api/prescriptions' && method === 'GET') {
      const prescriptions = mockDataProvider.generatePrescriptions(75);
      return {
        data: {
          prescriptions,
          total: prescriptions.length
        },
        status: 200
      };
    }

    if (pathname === '/api/prescriptions' && method === 'POST') {
      const body = options?.body ? JSON.parse(options.body as string) : {};
      const newPrescription = {
        id: 'rx-' + Date.now(),
        ...body,
        status: 'active',
        createdAt: new Date()
      };
      return {
        data: { prescription: newPrescription },
        status: 201
      };
    }

    const idMatch = pathname.match(/\/api\/prescriptions\/([^\/]+)/);
    if (idMatch && method === 'GET') {
      const prescriptions = mockDataProvider.generatePrescriptions(75);
      const prescription = prescriptions.find(p => p.id === idMatch[1]);
      if (prescription) {
        return {
          data: { prescription },
          status: 200
        };
      }
      return {
        error: { message: 'Prescription not found' },
        status: 404
      };
    }

    return {
      error: { message: 'Prescription route not found' },
      status: 404
    };
  }

  // Lab test route handlers
  private handleLabTestRoutes(pathname: string, method: string, options?: RequestInit): MockResponse {
    if (pathname === '/api/lab-tests' && method === 'GET') {
      const labTests = mockDataProvider.generateLabTests(60);
      return {
        data: {
          labTests,
          total: labTests.length
        },
        status: 200
      };
    }

    if (pathname === '/api/lab-tests' && method === 'POST') {
      const body = options?.body ? JSON.parse(options.body as string) : {};
      const newLabTest = {
        id: 'lab-' + Date.now(),
        ...body,
        status: 'pending',
        createdAt: new Date()
      };
      return {
        data: { labTest: newLabTest },
        status: 201
      };
    }

    const idMatch = pathname.match(/\/api\/lab-tests\/([^\/]+)/);
    if (idMatch && method === 'GET') {
      const labTests = mockDataProvider.generateLabTests(60);
      const labTest = labTests.find(t => t.id === idMatch[1]);
      if (labTest) {
        return {
          data: { labTest },
          status: 200
        };
      }
      return {
        error: { message: 'Lab test not found' },
        status: 404
      };
    }

    return {
      error: { message: 'Lab test route not found' },
      status: 404
    };
  }

  // Billing route handlers
  private handleBillingRoutes(pathname: string, method: string, options?: RequestInit): MockResponse {
    if (pathname === '/api/billing' && method === 'GET') {
      const billingRecords = mockDataProvider.generateBillingRecords(40);
      return {
        data: {
          billingRecords,
          total: billingRecords.length
        },
        status: 200
      };
    }

    if (pathname === '/api/billing' && method === 'POST') {
      const body = options?.body ? JSON.parse(options.body as string) : {};
      const newBilling = {
        id: 'bill-' + Date.now(),
        ...body,
        status: 'pending',
        createdAt: new Date()
      };
      return {
        data: { billing: newBilling },
        status: 201
      };
    }

    const idMatch = pathname.match(/\/api\/billing\/([^\/]+)/);
    if (idMatch && method === 'GET') {
      const billingRecords = mockDataProvider.generateBillingRecords(40);
      const billing = billingRecords.find(b => b.id === idMatch[1]);
      if (billing) {
        return {
          data: { billing },
          status: 200
        };
      }
      return {
        error: { message: 'Billing record not found' },
        status: 404
      };
    }

    if (idMatch && pathname.includes('/pay') && method === 'POST') {
      return {
        data: {
          message: 'Payment processed successfully',
          transactionId: 'txn-' + Date.now(),
          status: 'paid'
        },
        status: 200
      };
    }

    return {
      error: { message: 'Billing route not found' },
      status: 404
    };
  }

  // Dashboard route handlers
  private handleDashboardRoutes(pathname: string, method: string, options?: RequestInit): MockResponse {
    if (pathname === '/api/dashboard/stats' && method === 'GET') {
      const stats = mockDataProvider.getDashboardStats();
      return {
        data: stats,
        status: 200
      };
    }

    if (pathname === '/api/dashboard/recent-activities' && method === 'GET') {
      return {
        data: {
          activities: [
            { id: 1, type: 'admission', message: 'New patient admitted to ICU', time: '5 minutes ago', priority: 'high' },
            { id: 2, type: 'appointment', message: 'Dr. Smith completed consultation', time: '10 minutes ago', priority: 'normal' },
            { id: 3, type: 'lab', message: 'Critical lab results for Patient #1234', time: '15 minutes ago', priority: 'critical' },
            { id: 4, type: 'discharge', message: 'Patient discharged from Ward B', time: '20 minutes ago', priority: 'normal' },
            { id: 5, type: 'emergency', message: 'Emergency case arrived', time: '25 minutes ago', priority: 'high' }
          ]
        },
        status: 200
      };
    }

    if (pathname === '/api/dashboard/notifications' && method === 'GET') {
      return {
        data: {
          notifications: [
            { id: 1, title: 'Staff Meeting', message: 'Department heads meeting at 3 PM', read: false },
            { id: 2, title: 'System Update', message: 'Scheduled maintenance tonight at 11 PM', read: false },
            { id: 3, title: 'New Protocol', message: 'Updated COVID-19 protocols effective immediately', read: true }
          ]
        },
        status: 200
      };
    }

    return {
      error: { message: 'Dashboard route not found' },
      status: 404
    };
  }

  // Initialize interceptor
  init() {
    if (!this.isEnabled()) return;

    // Store original fetch
    const originalFetch = window.fetch;

    // Override global fetch
    window.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
      const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
      
      // Only intercept API calls
      if (url.startsWith('/api/')) {
        return this.interceptFetch(url, init);
      }

      // Pass through non-API calls
      return originalFetch(input, init);
    };

    console.log('🎭 Demo API Interceptor initialized');
  }
}

// Export singleton instance
export const demoApiInterceptor = new DemoApiInterceptor();

// Auto-initialize in browser
if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_DEMO_MODE === 'true') {
  demoApiInterceptor.init();
}