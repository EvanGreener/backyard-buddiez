import LoadingGIF from '@/components/LoadingGIF'
import { getUserAuth } from '@/lib/auth'
import { refreshDailyChallenges } from '@/lib/db/inserts'
import {
    getDailyChallenges,
    getUser,
    getUserDailyChallenges,
} from '@/lib/db/queries'
import { CREATE_PROFILE_API_ROUTE, ERROR_ROUTE } from '@/lib/routes'
import { User } from '@/types/db-types'
import { redirect } from 'next/navigation'
import DailyChallengeProgress from './DailyChallengeProgress'

export default async function HomeScreen() {
    const userAuth = await getUserAuth()
    const user = await getUser(userAuth.id)

    if (user && !user.profile_created) {
        redirect(CREATE_PROFILE_API_ROUTE)
    } else if (user) {
        await refreshDailyChallenges(user)

        const userDailyChallenges = (await getUserDailyChallenges(user)) ?? []
        const dailyChallenges =
            (await getDailyChallenges(userDailyChallenges)) ?? []

        return (
            <div className="flex flex-col items-center space-y-6">
                <>
                    <div className="text-2xl">
                        Welcome{' '}
                        <span className="italic text-emerald-400">
                            {user.display_name}
                        </span>
                    </div>
                </>
                <DailyChallengeProgress
                    user={user}
                    userDailyChallenges={userDailyChallenges}
                    dailyChallenges={dailyChallenges}
                />
            </div>
        )
    }
    redirect(ERROR_ROUTE)
}
