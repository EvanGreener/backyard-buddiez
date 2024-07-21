import { SupabaseClient } from '@supabase/supabase-js'
import { redirect } from 'next/navigation'
import { LOGIN_SIGN_UP } from '../routes'
import { db } from './db'
import { users } from './schema'
import { eq } from 'drizzle-orm'

export async function checkUserExists(
    supabase: SupabaseClient<any, 'public', any>
) {
    const { data, error } = await supabase.auth.getUser()
    const { user } = data
    if (!error && user) {
        const userDB = await db.query.users.findFirst({
            where: (users, { eq }) => eq(users.id, user.id),
        })

        if (!userDB) {
            // Add new user
            const newUser = await db
                .insert(users)
                .values({
                    id: user.id,
                    email: user.email,
                })
                .returning()
            return newUser[0]
        }

        return userDB
    } else {
        redirect(LOGIN_SIGN_UP)
    }
}
