'use client'

import LoadData from '@/components/LoadData'
import { AuthContext } from '@/contexts/AuthContext'
import { getTopXGlobal } from '@/lib/firestore-services'
import { BBUser } from '@/types/db-types'
import { useContext, useEffect, useState } from 'react'

export default function Home() {
    const { currentUserData } = useContext(AuthContext)
    const [topUsers, setTopUsers] = useState<BBUser[]>()

    function Leaderboard() {
        return (
            <div className=" border-4 border-green-400 rounded h-[29rem] overflow-y-scroll flex flex-col">
                <div className="p-2 flex w-full font-bold border-b-2 border-green-400 sticky top-0">
                    <span className="w-1/3">User</span>
                    <span className="w-2/3">Unique Species Identified</span>
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
                                <span className="w-3/4">
                                    {userData.displayName}
                                </span>
                                <span className="w-1/4">
                                    {userData.speciesIdentified}
                                </span>
                            </div>
                        )
                    })}
            </div>
        )
    }
    useEffect(() => {
        async function loadTopUsers() {
            setTopUsers(await getTopXGlobal())
        }

        loadTopUsers()
    }, [])

    console.log(topUsers)
    return (
        <div className="flex flex-col space-y-4">
            <LoadData conditionLoad={currentUserData == null}>
                <div className="flex flex-col items-center">
                    <div className="text-xl">
                        Welcome back
                        <span className="text-emerald-400">
                            {' ' + currentUserData?.displayName}
                        </span>
                    </div>
                    <div className="">
                        Species Identified:
                        <span className="font-bold text-black">
                            {' ' + currentUserData?.speciesIdentified}
                        </span>
                    </div>
                </div>
            </LoadData>
            <LoadData conditionLoad={topUsers == undefined}>
                <Leaderboard />
            </LoadData>
        </div>
    )
}
