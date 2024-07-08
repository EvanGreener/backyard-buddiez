'use client'

import { getTopXGlobal } from '@/lib/firestore-services'
import { UserData } from '@/types/db-types'
import { useContext, useEffect, useState } from 'react'
import LoadData from '@/components/LoadData'

export default function Leaderboards() {
    const [topUsers, setTopUsers] = useState<UserData[]>()
    const [loadingLB, setLoadingLB] = useState(true)

    function GlobalLeaderboard() {
        return (
            <div className="flex flex-col space-y-2">
                <div className="text-2xl w-full text-center">
                    Global Leaderboard
                </div>
                <div className=" border-4 border-green-400 rounded h-[29rem] overflow-y-scroll flex flex-col">
                    <div className="p-2 flex w-full font-bold border-b-2 border-green-400 sticky top-0">
                        <span className="w-1/3">Rank</span>
                        <span className="w-1/3">User</span>
                        <span className="w-1/3">Unique Species Identified</span>
                    </div>
                    {topUsers &&
                        topUsers.map((userData, i) => {
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
                                    key={userData.sightingsId}
                                    className={
                                        'p-2 flex w-full border-b-2 border-green-400 ' +
                                        bgColor
                                    }
                                >
                                    <span className="w-1/4">{i + 1}</span>
                                    <span className="w-2/4">
                                        {userData.displayName}
                                    </span>
                                    <span className="w-1/4">
                                        {userData.speciesIdentified}
                                    </span>
                                </div>
                            )
                        })}
                </div>
            </div>
        )
    }

    useEffect(() => {
        async function loadTopUsers() {
            setTopUsers(await getTopXGlobal())
        }

        setLoadingLB(true)
        loadTopUsers()
        setLoadingLB(false)
    }, [])

    return (
        <LoadData conditionLoad={loadingLB}>
            <GlobalLeaderboard />
        </LoadData>
    )
}
