'use client'

import { AuthContext } from '@/contexts/AuthContext'
import { HOME_ROUTE } from '@/lib/routes'
import { useRouter } from 'next/navigation'
import { useContext, useEffect } from 'react'

export default function Home() {
    const { currentUserData, setCurrentUserData } = useContext(AuthContext)
    return (
        <div className="grow">
            <div>Welcome back {currentUserData?.displayName}! </div>
            <div>Points {currentUserData?.points}</div>
            <div>Challenge checklist</div>
        </div>
    )
}
