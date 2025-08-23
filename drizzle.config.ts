import * as dotenv from 'dotenv'
import type { Config } from 'drizzle-kit'
dotenv.config()

// Get database URL with priority: Netlify URLs first, then fallback to DATABASE_URL
function getDatabaseUrl(): string {
  return process.env.NETLIFY_DATABASE_URL || 
         process.env.NETLIFY_DATABASE_URL_UNPOOLED || 
         process.env.DATABASE_URL || 
         ''
}

export default {
  driver: 'pg',
  schema: './db/schema.ts',
  out: './db/migrations',
  dbCredentials: { connectionString: getDatabaseUrl() },
} satisfies Config
