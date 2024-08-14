import { getUserAuth } from '@/lib/auth'
import { getUser } from '@/lib/db/queries'
import { User } from '@/types/db-types'

export async function GET() {
    const userAuth = await getUserAuth()
    const user: User | undefined = await getUser(userAuth.id)
    if (user) {
        return Response.json({ user }, { status: 200 })
    }
    console.error('Error getting current user ')
    return Response.json('Something went wrong ...', { status: 400 })
}
