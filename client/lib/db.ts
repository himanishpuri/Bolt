import { Pool } from "pg"

// Create a singleton database connection pool
let pool: Pool | null = null

export function getPool(): Pool {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL

    if (!connectionString) {
      throw new Error("DATABASE_URL environment variable is not set")
    }

    pool = new Pool({
      connectionString,
      ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
    })
  }

  return pool
}

export async function query(text: string, params?: any[]): Promise<any> {
  const pool = getPool()
  try {
    const result = await pool.query(text, params)
    return result.rows
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}

export async function transaction<T>(callback: (client: any) => Promise<T>): Promise<T> {
  const pool = getPool()
  const client = await pool.connect()

  try {
    await client.query("BEGIN")
    const result = await callback(client)
    await client.query("COMMIT")
    return result
  } catch (error) {
    await client.query("ROLLBACK")
    throw error
  } finally {
    client.release()
  }
}

// Close the pool when the application shuts down
process.on("SIGINT", () => {
  if (pool) {
    pool.end()
  }
})
