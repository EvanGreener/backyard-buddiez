import { getUserAuth } from '@/lib/auth'
import { getUser } from '@/lib/db/queries'
import BirdID from './BirdID'

export default async function BirdIDScreen() {
    const userAuth = await getUserAuth()
    const user = await getUser(userAuth.id)

    if (user) {
        return <BirdID user={user} />
    }
}
