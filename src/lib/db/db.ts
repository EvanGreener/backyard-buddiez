import 'dotenv/config'
import * as schema from './schema'

import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { migrate } from 'drizzle-orm/postgres-js/migrator'

const connectionString = process.env.DATABASE_URL

// Disable prefetch as it is not supported for "Transaction" pool mode
export const client = postgres(connectionString!, { prepare: false })
export const db = drizzle(client, { schema })

async function migrateTables() {
    await migrate(db, { migrationsFolder: 'drizzle' })
}
migrateTables()
