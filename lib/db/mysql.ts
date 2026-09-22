import mysql from 'mysql2/promise';

let pool: mysql.Pool | null = null;

export function getDbPool(): mysql.Pool {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DATABASE_HOST || 'localhost',
      port: Number(process.env.DATABASE_PORT || 3306),
      user: process.env.DATABASE_USER || 'root',
      password: process.env.DATABASE_PASSWORD || '',
      database: process.env.DATABASE_NAME || 'grievance_ai',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 10000,
      charset: 'utf8mb4',
    });
  }
  return pool;
}

interface MySqlErrorLike {
  code?: string;
  message?: string;
}

/**
 * Execute a parameterized SQL query with automatic error wrapping.
 */
export async function query<T = unknown>(
  sql: string,
  params: (string | number | boolean | null | undefined)[] = []
): Promise<T> {
  try {
    const db = getDbPool();
    const [rows] = await db.query(sql, params);
    return rows as T;
  } catch (error: unknown) {
    const err = error as MySqlErrorLike;
    if (err?.code === 'ECONNREFUSED') {
      throw new Error(
        'Database connection refused. Please verify that MySQL is started in your XAMPP Control Panel on port 3306.'
      );
    }
    if (err?.code === 'ER_BAD_DB_ERROR') {
      throw new Error(
        "Database 'grievance_ai' does not exist. Please run database/schema.sql in phpMyAdmin."
      );
    }
    if (err?.code === 'ER_NO_SUCH_TABLE') {
      throw new Error(
        'Required database tables not found. Please run database/schema.sql in phpMyAdmin.'
      );
    }
    throw error;
  }
}

/**
 * Health check helper to test database connectivity.
 */
export async function checkDbConnection(): Promise<{
  connected: boolean;
  error?: string;
}> {
  try {
    const db = getDbPool();
    const connection = await db.getConnection();
    connection.release();
    return { connected: true };
  } catch (err: unknown) {
    const error = err as MySqlErrorLike;
    return {
      connected: false,
      error:
        error?.code === 'ECONNREFUSED'
          ? 'MySQL is not running. Please start MySQL in XAMPP.'
          : error?.message || 'Database connection error',
    };
  }
}
