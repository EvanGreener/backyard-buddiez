import ClientSide from '@/components/ClientSide'
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
        let topXGlobal = await getTopXGlobal()
        // topXGlobal.push({
        //     user_id: 'awdawdsd',
        //     display_name: 'TestUser123',
        //     challenge_count: 1,
        //     species_count: 2,
        // })
        // topXGlobal.push({
        //     user_id: 'awdawdsd',
        //     display_name: 'TestUser456',
        //     challenge_count: 2,
        //     species_count: 1,
        // })
        // topXGlobal.push({
        //     user_id: 'awdawdsd',
        //     display_name: 'TestUser123',
        //     challenge_count: 0,
        //     species_count: 1,
        // })
        let top3Global = topXGlobal.slice(0, 3)
        console.log(top3Global.map((u) => u.total_points))
        let temp = top3Global[0]
        top3Global[0] = top3Global[1]
        top3Global[1] = temp

        return (
            <div className="px-4 flex flex-col items-center w-full">
                <ClientSide />
                <div className="text-xl font-bold mb-4">Leaderboard</div>
                <div className="flex items-end justify-evenly w-full">
                    {top3Global.map((u, i) => {
                        let bgColor = 'bg-orange-400'
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
                        'rounded-lg h-[24rem] overflow-y-scroll flex flex-col w-full space-y-4 p-4'
                    }
                >
                    {topXGlobal.slice(3).map((entry, i) => {
                        return (
                            <div
                                key={entry.user_id}
                                className={
                                    Color.SUB_SECTION +
                                    ' ' +
                                    'p-2 flex w-full rounded-lg items-center'
                                }
                            >
                                <div className="text-lg">{i + 4}</div>

                                <div
                                    className={
                                        Color.SUB_SECTION +
                                        ' ' +
                                        'p-2 flex w-full rounded-lg justify-between'
                                    }
                                >
                                    <div className="">{entry.display_name}</div>
                                    <div className="flex items-center space-x-2">
                                        <Image
                                            width={14}
                                            height={14}
                                            src={'/logo.svg'}
                                            alt="Points icon"
                                        />
                                        <div className="">
                                            {entry.total_points}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }
}
