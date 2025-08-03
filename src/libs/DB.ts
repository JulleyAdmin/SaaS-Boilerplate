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

// Global storage for PGLite to survive hot reloads
const globalForDb = globalThis as unknown as {
  pgliteClient?: PGlite;
  pgliteDrizzle?: PgliteDatabase<typeof schema>;
};

async function initializeDatabase() {
  console.log('Initializing database connection...');

  if (process.env.NEXT_PHASE !== PHASE_PRODUCTION_BUILD && Env.DATABASE_URL) {
    console.log('Using PostgreSQL database');
    const client = new Client({
      connectionString: Env.DATABASE_URL,
    });

    try {
      await client.connect();
      const drizzle = drizzlePg(client, { schema });

      // Run migrations
      await migratePg(drizzle, {
        migrationsFolder: path.join(process.cwd(), 'migrations'),
      });

      console.log('PostgreSQL database connected and migrations completed');
      return drizzle;
    } catch (error) {
      console.error('Failed to connect to PostgreSQL:', error);
      throw error;
    }
  } else {
    console.log('Using PGLite in-memory database');
    // Use PGLite for development without DATABASE_URL
    if (!globalForDb.pgliteClient) {
      globalForDb.pgliteClient = new PGlite();
      await globalForDb.pgliteClient.waitReady;
      globalForDb.pgliteDrizzle = drizzlePglite(globalForDb.pgliteClient, { schema });
    }

    // Run migrations
    await migratePglite(globalForDb.pgliteDrizzle!, {
      migrationsFolder: path.join(process.cwd(), 'migrations'),
    });

    console.log('PGLite database initialized and migrations completed');
    return globalForDb.pgliteDrizzle;
  }
}

// Get database instance with lazy initialization
export async function getDb() {
  if (!dbInstance) {
    if (!initPromise) {
      initPromise = initializeDatabase();
    }
    dbInstance = await initPromise;
  }
  return dbInstance;
}

// For backward compatibility - will be undefined until first getDb() call
export let db: any;

// Initialize db on first module load
getDb().then((database) => {
  db = database;
}).catch((error) => {
  console.error('Failed to initialize database:', error);
});
