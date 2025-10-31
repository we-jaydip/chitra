// ✅ Detect if the code is running in a browser or Node.js environment
// (React Native for web may trigger window object)
const isBrowser = typeof window !== 'undefined';

// Declare variables for PostgreSQL Pool
let Pool: any = null;
let pool: any = null;

// ✅ Only import PostgreSQL & dotenv when running in Node.js backend
// (Importing in browser would cause errors)
if (!isBrowser) {
  try {
    const pg = require('pg');          // PostgreSQL client library
    const dotenv = require('dotenv');  // Loads environment variables from .env
    dotenv.config();                   // Initialize dotenv

    Pool = pg.Pool;                    // Get the Pool class from pg

    // ✅ Database configuration (with safe defaults)
    const dbConfig = {
      user: process.env.DB_USER || 'postgres',               // Database username
      host: process.env.DB_HOST || 'localhost',              // Database host
      database: process.env.DB_NAME || 'image_editor_app',   // Database name
      password: String(process.env.DB_PASSWORD || ''),       // Force password as string (fixes "must be a string" error)
      port: parseInt(process.env.DB_PORT || '5432', 10),     // Convert port from string to number
      ssl: process.env.NODE_ENV === 'production'
        ? { rejectUnauthorized: false }                      // Enable SSL in production
        : false,                                             // Disable SSL in development
    };

    // 🧩 Log database configuration (for debugging only)
    console.log('🧩 Database Config:', {
      host: dbConfig.host,
      user: dbConfig.user,
      passwordType: typeof dbConfig.password, // Should always be 'string'
      hasPassword: !!dbConfig.password,        // Boolean check
      database: dbConfig.database,
      port: dbConfig.port,
    });

    // ✅ Create a new connection pool
    pool = new Pool(dbConfig);
  } catch (error) {
    // Catch error if 'pg' is not available or dotenv not found
    console.warn('⚠️ PostgreSQL not available (non-Node environment):', error);
  }
}

/* -------------------------------------------------------------------------- */
/*                         DATABASE CONNECTION HELPER                         */
/* -------------------------------------------------------------------------- */

// ✅ Function to connect to the PostgreSQL database
export async function connectToDatabase() {
  // Block database calls from browser
  if (isBrowser || !pool) {
    throw new Error('Database not available in browser environment');
  }

  try {
    // Connect to the database
    const client = await pool.connect();
    console.log('✅ Connected to PostgreSQL database');
    return client;
  } catch (error) {
    console.error('❌ Error connecting to database:', error);
    throw error;
  }
}

/* -------------------------------------------------------------------------- */
/*                                DATA MODELS                                 */
/* -------------------------------------------------------------------------- */

// ✅ Define TypeScript interfaces for consistent structure
export interface User {
  id: string;
  phone_number: string;
  created_at: string;
  updated_at: string;
  language?: string;
}

export interface Session {
  id: string;
  user_id: string;
  token: string;
  expires_at: string;
  created_at: string;
}

/* -------------------------------------------------------------------------- */
/*                            USER MANAGEMENT LOGIC                           */
/* -------------------------------------------------------------------------- */

// ✅ Create new user
export async function createUser(phoneNumber: string): Promise<User> {
  // In browser, return mock data (for development/testing)
  if (isBrowser || !pool) {
    return {
      id: 'mock-user-' + Date.now(),
      phone_number: phoneNumber,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }

  // In Node.js, insert user into PostgreSQL
  const client = await connectToDatabase();
  try {
    const result = await client.query(
      `
        INSERT INTO users (phone_number, created_at, updated_at)
        VALUES ($1, NOW(), NOW())
        RETURNING *
      `,
      [phoneNumber]
    );
    return result.rows[0]; // Return inserted user data
  } finally {
    client.release(); // Release connection back to pool
  }
}

// ✅ Get user by phone number
export async function getUserByPhone(phoneNumber: string): Promise<User | null> {
  if (isBrowser || !pool) return null;

  const client = await connectToDatabase();
  try {
    const result = await client.query(
      'SELECT * FROM users WHERE phone_number = $1',
      [phoneNumber]
    );
    return result.rows[0] || null;
  } finally {
    client.release();
  }
}

/* -------------------------------------------------------------------------- */
/*                          SESSION MANAGEMENT LOGIC                          */
/* -------------------------------------------------------------------------- */

// ✅ Create new session (used for login/OTP verification)
export async function createSession(userId: string, token: string): Promise<Session> {
  if (isBrowser || !pool) {
    // Return a fake session when running in browser
    return {
      id: 'mock-session-' + Date.now(),
      user_id: userId,
      token,
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
      created_at: new Date().toISOString(),
    };
  }

  const client = await connectToDatabase();
  try {
    const result = await client.query(
      `
        INSERT INTO sessions (user_id, token, expires_at, created_at)
        VALUES ($1, $2, NOW() + INTERVAL '30 days', NOW())
        RETURNING *
      `,
      [userId, token]
    );
    return result.rows[0];
  } finally {
    client.release();
  }
}

/* -------------------------------------------------------------------------- */
/*                         DATABASE INITIALIZATION                            */
/* -------------------------------------------------------------------------- */

// ✅ Create tables if they don’t exist
export async function initializeDatabase(): Promise<void> {
  if (isBrowser || !pool) {
    console.log('Database initialization skipped in browser environment');
    return;
  }

  const client = await connectToDatabase();
  try {
    // Create UUID generator extension (needed for gen_random_uuid)
    await client.query(`
      CREATE EXTENSION IF NOT EXISTS "pgcrypto";
    `);

    // Create users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        phone_number VARCHAR(15) UNIQUE NOT NULL,
        language VARCHAR(10),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // Create sessions table
    await client.query(`
      CREATE TABLE IF NOT EXISTS sessions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        token VARCHAR(255) UNIQUE NOT NULL,
        expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    console.log('✅ Database tables initialized successfully');
  } finally {
    client.release();
  }
}
