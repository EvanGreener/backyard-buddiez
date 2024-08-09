import { getUserAuth } from '@/lib/auth'
import {
    getNumCompletedChallenges,
    getNumSpeciesIdentified,
    getTopXGlobal,
    getUser,
} from '@/lib/db/queries'
import { Color } from '@/theme/colors'

export default async function LeaderboardsScreen() {
    const userAuth = await getUserAuth()
    const user = await getUser(userAuth.id)

    if (user) {
        const dailyChallengesCompleted = (
            await getNumCompletedChallenges(user)
        )[0].count

        let speciesIdentified = 0

        const countSpecies = await getNumSpeciesIdentified(user)
        countSpecies.forEach(() => {
            speciesIdentified += 1
        })

        const topXGlobal = await getTopXGlobal()

        return (
            <div className="p-4 flex flex-col items-center space-y-4 w-full">
                <div>
                    <div>
                        Daily Challenges completed: {dailyChallengesCompleted}
                    </div>
                    <div>Species Identified: {speciesIdentified}</div>
                    <div>
                        Points:{' '}
                        {speciesIdentified * 500 +
                            dailyChallengesCompleted * 100}
                    </div>
                </div>
                <div
                    className={
                        Color.BORDER_PRIMARY +
                        ' ' +
                        'border-4 border-green-400 rounded-md h-[29rem] overflow-y-scroll flex flex-col w-full'
                    }
                >
                    <div
                        className={
                            Color.BORDER_PRIMARY +
                            ' ' +
                            'p-2 flex w-full font-bold border-b-2 sticky top-0'
                        }
                    >
                        <span className="w-1/3">Rank</span>
                        <span className="w-1/3">User</span>
                        <span className="w-1/3">Points</span>
                    </div>
                    {topXGlobal.map((entry, i) => {
                        let bgColor = ''
                        if (i == 0) {
                            bgColor = 'bg-yellow-400'
                        } else if (i == 1) {
                            bgColor = 'bg-zinc-400'
                        } else if (i == 2) {
                            bgColor = 'bg-orange-700'
                        }

                        return (
                            <div
                                key={entry.user_id}
                                className={
                                    Color.BORDER_PRIMARY +
                                    ' ' +
                                    'p-2 flex w-full border-b-2' +
                                    ' ' +
                                    bgColor
                                }
                            >
                                <span className="w-1/4">{i + 1}</span>
                                <span className="w-2/4">
                                    {entry.display_name}
                                </span>
                                <span className="w-1/4">
                                    {entry.species_count * 500 +
                                        entry.challenge_count * 100}
                                </span>
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }
}
