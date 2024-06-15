'use client'

import { AuthContext } from '@/contexts/AuthContext'
import { HOME_ROUTE } from '@/lib/routes'
import { useRouter } from 'next/navigation'
import { useContext, useEffect } from 'react'

export default function Home() {
    const { currentUserData, setCurrentUserData } = useContext(AuthContext)
    return (
        <div>
            <div className="text-xl">
                Welcome back
                <span className="text-emerald-400">
                    {' '}
                    {currentUserData?.displayName}
                </span>
            </div>
            <div>Points {currentUserData?.points}</div>
            <div>Challenge checklist</div>
        </div>
    )
}
