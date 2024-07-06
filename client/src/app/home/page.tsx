'use client'

import LoadData from '@/components/LoadData'
import { AuthContext } from '@/contexts/AuthContext'
import { useContext, useEffect } from 'react'

export default function Home() {
    const { currentUserData } = useContext(AuthContext)

    function Leaderboard() {}
    useEffect(() => {}, [])
    return (
        <div>
            <LoadData conditionLoad={currentUserData == null}>
                <div className="text-xl">
                    Welcome back
                    <span className="text-emerald-400">
                        {' ' + currentUserData?.displayName}
                    </span>
                </div>
                <div>Leaderboard to be added soon</div>
            </LoadData>
        </div>
    )
}
