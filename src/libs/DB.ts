import path from 'node:path';

import { PGlite } from '@electric-sql/pglite';
import { drizzle as drizzlePg } from 'drizzle-orm/node-postgres';
import { migrate as migratePg } from 'drizzle-orm/node-postgres/migrator';
import { drizzle as drizzlePglite, type PgliteDatabase } from 'drizzle-orm/pglite';
import { migrate as migratePglite } from 'drizzle-orm/pglite/migrator';
import { PHASE_PRODUCTION_BUILD } from 'next/dist/shared/lib/constants';
import { Client } from 'pg';

import * as schema from '@/models/Schema';

import { Env } from './Env';

// Database instance and initialization promise
let dbInstance: any = null;
let initPromise: Promise<any> | null = null;
let connectionHealthy = false;

// Global storage for PGLite to survive hot reloads
const globalForDb = globalThis as unknown as {
  pgliteClient?: PGlite;
  pgliteDrizzle?: PgliteDatabase<typeof schema>;
};

// Demo mode optimizations
const isDemoMode = process.env.DEMO_MODE === 'true';

// Health check function
export function isConnectionHealthy(): boolean {
  return connectionHealthy;
}

// Enhanced error handling and retry logic
async function withRetry<T>(operation: () => Promise<T>, maxRetries = 3): Promise<T> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      console.error(`Database operation attempt ${attempt} failed:`, error);
      if (attempt === maxRetries) {
        throw error;
      }
      // Wait before retry (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
    }
  }
  throw new Error('All retry attempts failed');
}

async function initializeDatabase() {
  console.log('Initializing database connection...');
  
  try {
    if (process.env.NEXT_PHASE !== PHASE_PRODUCTION_BUILD && Env.DATABASE_URL && !isDemoMode) {
      console.log('Using PostgreSQL database');
      
      const client = new Client({
        connectionString: Env.DATABASE_URL,
        connectionTimeoutMillis: 5000,
        idleTimeoutMillis: 30000,
        max: 10,
      });

      await withRetry(async () => {
        await client.connect();
        connectionHealthy = true;
      });

      const drizzle = drizzlePg(client, { schema });

      // Run migrations with retry
      await withRetry(async () => {
        await migratePg(drizzle, {
          migrationsFolder: path.join(process.cwd(), 'migrations'),
        });
      });

      console.log('PostgreSQL database connected and migrations completed');
      
      // Set up connection monitoring
      client.on('error', (err) => {
        console.error('PostgreSQL client error:', err);
        connectionHealthy = false;
      });

      return drizzle;
    } else {
      console.log('Using PGLite file-based database (Demo/Development mode)');
      
      // Enhanced PGLite configuration for demo
      if (!globalForDb.pgliteClient) {
        globalForDb.pgliteClient = new PGlite({
          dataDir: path.join(process.cwd(), '.pglite-demo'),
          options: {
            'max_connections': isDemoMode ? '5' : '20',
            'shared_buffers': isDemoMode ? '8MB' : '32MB',
            'work_mem': isDemoMode ? '2MB' : '4MB',
          }
        });
        
        await globalForDb.pgliteClient.waitReady;
        connectionHealthy = true;
        globalForDb.pgliteDrizzle = drizzlePglite(globalForDb.pgliteClient, { schema });
      }

      // Run migrations with retry
      await withRetry(async () => {
        await migratePglite(globalForDb.pgliteDrizzle!, {
          migrationsFolder: path.join(process.cwd(), 'migrations'),
        });
      });

      console.log('PGLite database initialized and migrations completed');
      return globalForDb.pgliteDrizzle;
    }
  } catch (error) {
    console.error('Database initialization failed:', error);
    connectionHealthy = false;
    throw error;
  }
}

// Enhanced database getter with health monitoring
export async function getDb() {
  if (!dbInstance || !connectionHealthy) {
    if (!initPromise) {
      initPromise = initializeDatabase();
    }
    dbInstance = await initPromise;
  }
  return dbInstance;
}

// Health check endpoint helper
export async function healthCheck() {
  try {
    const database = await getDb();
    
    if (isDemoMode || !Env.DATABASE_URL) {
      // PGLite health check
      await database.execute('SELECT 1');
    } else {
      // PostgreSQL health check
      await database.execute('SELECT 1');
    }
    
    return { healthy: true, type: isDemoMode ? 'PGLite' : 'PostgreSQL' };
  } catch (error) {
    console.error('Database health check failed:', error);
    connectionHealthy = false;
    return { healthy: false, error: error.message };
  }
}

// Graceful shutdown
export async function closeConnection() {
  if (globalForDb.pgliteClient) {
    try {
      await globalForDb.pgliteClient.close();
      console.log('Database connection closed gracefully');
    } catch (error) {
      console.error('Error closing database connection:', error);
    }
  }
  connectionHealthy = false;
  dbInstance = null;
  initPromise = null;
}

// For backward compatibility - will be undefined until first getDb() call
export let db: any;

// Initialize db on first module load with enhanced error handling
if (isDemoMode) {
  // For demo mode, initialize immediately
  getDb().then((database) => {
    db = database;
    console.log('Demo database initialized successfully');
  }).catch((error) => {
    console.error('Failed to initialize demo database:', error);
    // In demo mode, this is non-fatal
  });
} else {
  // For non-demo mode, use lazy initialization
  getDb().then((database) => {
    db = database;
  }).catch((error) => {
    console.error('Failed to initialize database:', error);
  });
}

// Cleanup on process exit
process.on('SIGINT', closeConnection);
process.on('SIGTERM', closeConnection);
process.on('exit', closeConnection);
