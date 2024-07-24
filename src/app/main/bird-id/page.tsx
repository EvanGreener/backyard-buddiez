import { getUserAuth } from '@/lib/auth'
import {
    getDailyChallenges,
    getUser,
    getUserDailyChallenges,
} from '@/lib/db/queries'
import BirdID from './BirdID'

export default async function BirdIDScreen() {
    const userAuth = await getUserAuth()
    const user = await getUser(userAuth.id)

    if (user) {
        const userDailyChallenges = (await getUserDailyChallenges(user))!
        const dailyChallenges = await getDailyChallenges(userDailyChallenges)
        return (
            <BirdID
                user={user}
                userDailyChallenges={userDailyChallenges}
                dailyChallenges={dailyChallenges}
            />
        )
    }
}
