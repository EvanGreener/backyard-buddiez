'use client'

import { AuthContext } from '@/contexts/AuthContext'
import { googleRedirectResult } from '@/lib/auth'
import { HOME_ROUTE } from '@/lib/routes'
import { useRouter } from 'next/navigation'
import { useContext, useEffect } from 'react'

export default function Home() {
    return (
        <div>
            <div>Random message of the day</div>
            <div>Dashbaord</div>
            <div>Tabs</div>
        </div>
    )
}
