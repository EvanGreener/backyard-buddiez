import { getUserAuth } from '@/lib/auth'
import {
    getNumCompletedChallenges,
    getNumSpeciesIdentified,
    getTopXGlobal,
    getUser,
} from '@/lib/db/queries'
import { Color } from '@/theme/colors'
import Image from 'next/image'

export default async function LeaderboardsScreen() {
    const userAuth = await getUserAuth()
    const user = await getUser(userAuth.id)

    if (user) {
        const topXGlobal = await getTopXGlobal()
        let top3Global = topXGlobal.slice(0, 3)
        let temp = top3Global[0]
        top3Global[0] = top3Global[1]
        top3Global[1] = temp

        return (
            <div className="p-4 flex flex-col items-center w-full">
                <div className="text-lg font-bold mb-4">Leaderboard</div>
                <div className="flex items-end justify-evenly w-full">
                    {topXGlobal.slice(0, 3).map((u, i) => {
                        let bgColor = 'bg-orange-700'
                        let height = 'h-12'
                        if (i == 0) {
                            bgColor = 'bg-zinc-400'
                            height = 'h-16'
                        } else if (i == 1) {
                            bgColor = 'bg-yellow-400'
                            height = 'h-20'
                        }

                        return (
                            <div
                                key={u.user_id}
                                className="flex flex-col items-center w-16 text-xs"
                            >
                                <div className="w-14 break-words text-wrap">
                                    {u.display_name}
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Image
                                        width={14}
                                        height={14}
                                        src={'/logo.svg'}
                                        alt="Points icon"
                                    />
                                    <div>
                                        {u.species_count * 500 +
                                            u.challenge_count * 100}
                                    </div>
                                </div>
                                <div
                                    className={
                                        bgColor +
                                        ' ' +
                                        height +
                                        ' ' +
                                        'w-12 rounded-t-lg'
                                    }
                                ></div>
                            </div>
                        )
                    })}
                </div>
                <div
                    className={
                        Color.SECTION +
                        ' ' +
                        ' rounded-lg h-[24rem] overflow-y-scroll flex flex-col w-full'
                    }
                >
                    {topXGlobal.slice(3).map((entry, i) => {
                        return (
                            <div
                                key={entry.user_id}
                                className={
                                    Color.BORDER_PRIMARY +
                                    ' ' +
                                    'p-2 flex w-full border-b-2'
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
