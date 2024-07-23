import { getUserAuth } from '@/lib/auth'
import { getUser, getAllUserSightings } from '@/lib/db/queries'
import { User } from '@/types/db-types'

export async function GET(request: Request) {
    const userAuth = await getUserAuth()
    const user: User | undefined = await getUser(userAuth.id)
    if (user) {
        const allSightings = await getAllUserSightings(user)
        return Response.json(allSightings, { status: 200 })
    }
}
