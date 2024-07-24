import { eq } from 'drizzle-orm'
import { db } from './db'
import { users } from './schema'
import { User } from '@/types/db-types'

export async function changeDisplayName(displayName: string, user: User) {
    return await db
        .update(users)
        .set({
            display_name: displayName,
        })
        .where(eq(users.id, user.id))
}
