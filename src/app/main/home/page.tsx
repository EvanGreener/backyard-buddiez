import { getUserAuth } from '@/lib/auth'
import { refreshDailyChallenges } from '@/lib/db/inserts'
import {
    getDailyChallenges,
    getNumCompletedChallenges,
    getNumSpeciesIdentified,
    getUser,
    getUserDailyChallenges,
} from '@/lib/db/queries'
import { CREATE_PROFILE_ROUTE, ERROR_ROUTE } from '@/lib/routes'
import { redirect } from 'next/navigation'
import DailyChallengeProgress from './DailyChallengeProgress'
import { Color } from '@/theme/colors'
import Image from 'next/image'

export default async function HomeScreen() {
    const userAuth = await getUserAuth()
    const user = await getUser(userAuth.id)

    if (user && !user.profile_created) {
        redirect(CREATE_PROFILE_ROUTE)
    } else if (user) {
        await refreshDailyChallenges(user)

        const userDailyChallenges = (await getUserDailyChallenges(user)) ?? []
        const dailyChallenges =
            (await getDailyChallenges(userDailyChallenges)) ?? []

        const dailyChallengesCompleted = (
            await getNumCompletedChallenges(user)
        )[0].count

        let speciesIdentified = 0

        const countSpecies = await getNumSpeciesIdentified(user)
        countSpecies.forEach(() => {
            speciesIdentified += 1
        })

        return (
            <div className="flex flex-col items-center space-y-6 w-full">
                <div className="flex flex-col items-center space-y-6">
                    <div className="flex w-full justify-between items-center">
                        <div>
                            <div className="text-xs">Welcome, </div>
                            <div
                                className={Color.TEXT_PRIMARY + ' ' + 'italic'}
                            >
                                {user.display_name}
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Image
                                width={24}
                                height={24}
                                src={'/logo.svg'}
                                alt="Points icon"
                            />
                            <div>
                                {speciesIdentified * 500 +
                                    dailyChallengesCompleted * 100}
                            </div>
                        </div>
                    </div>
                    <DailyChallengeProgress
                        user={user}
                        userDailyChallenges={userDailyChallenges}
                        dailyChallenges={dailyChallenges}
                    />
                </div>
            </div>
        )
    }
    console.error('Error: user does not exist in DB')
    redirect(ERROR_ROUTE)
}
