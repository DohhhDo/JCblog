import { Pool } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-serverless'

import { env } from '~/env.mjs'

// Get database URL with priority: Netlify URLs first, then fallback to DATABASE_URL
function getDatabaseUrl(): string {
  // Prioritize NETLIFY_DATABASE_URL, then NETLIFY_DATABASE_URL_UNPOOLED, finally DATABASE_URL
  return env.NETLIFY_DATABASE_URL || env.NETLIFY_DATABASE_URL_UNPOOLED || env.DATABASE_URL
}

// create the connection
const pool = new Pool({ connectionString: getDatabaseUrl() })
export const db = drizzle(pool)
