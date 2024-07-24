import { getUserAuth } from '@/lib/auth'
import { db } from '@/lib/db/db'
import { getUser } from '@/lib/db/queries'
import { users } from '@/lib/db/schema'
import { changeDisplayName } from '@/lib/db/updates'
import { User } from '@/types/db-types'
import { eq } from 'drizzle-orm'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const displayName = searchParams.get('display_name')
    const userAuth = await getUserAuth()
    const user: User | undefined = await getUser(userAuth.id)
    if (displayName && user) {
        await changeDisplayName(displayName, user)

        await db
            .update(users)
            .set({ profile_created: true })
            .where(eq(users.id, user.id))

        return new Response('Success', { status: 200 })
    } else {
        return new Response('Error', { status: 400 })
    }
}
