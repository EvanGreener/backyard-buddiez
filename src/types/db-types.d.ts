import {users} from '@/lib/db/schema'
export type User = typeof users.$inferSelect
