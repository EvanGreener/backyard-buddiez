import { getUserAuth } from '@/lib/auth'
import { getUser } from '@/lib/db/queries'
import { changeDisplayName } from '@/lib/db/updates'
import { User } from '@/types/db-types'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const displayName = searchParams.get('display_name')
    const userAuth = await getUserAuth()
    const user: User | undefined = await getUser(userAuth.id)
    if (displayName && user) {
        await changeDisplayName(displayName, user)
        return new Response('Success', { status: 200 })
    } else {
        return new Response('Error', { status: 400 })
    }
}
