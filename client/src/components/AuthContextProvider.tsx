'use client'

import { firebaseApp } from '@/config/firebase-config'
import { AuthContext } from '@/contexts/AuthContext'
import {
    HOME_ROUTE,
    LOGIN_EMAIL_ROUTE,
    ROOT_LOGIN,
    SIGN_UP_EMAIL_ROUTE,
} from '@/lib/routes'
import { User, getAuth } from 'firebase/auth'
import { usePathname, useRouter } from 'next/navigation'
import { ReactNode, useEffect, useState } from 'react'

export default function AuthContextProvider({
    children,
}: {
    children: ReactNode
}) {
    const auth = getAuth(firebaseApp)
    const [currentUser, setCurrentUser] = useState<User | null>(null)
    const pathname = usePathname()
    const router = useRouter()

    useEffect(() => {
        console.log('in useEffect')
        const unsubscribeAuth = auth.onAuthStateChanged((user) => {
            if (user) {
                console.log('signed in')
                setCurrentUser(user)
                // Middleware logic
                if (
                    pathname == LOGIN_EMAIL_ROUTE ||
                    pathname == SIGN_UP_EMAIL_ROUTE ||
                    pathname == ROOT_LOGIN
                ) {
                    router.push(HOME_ROUTE)
                }
                // Middleware logic
            } else {
                console.log('not signed in')
                setCurrentUser(user)
                // Middleware logic
                if (pathname == HOME_ROUTE) {
                    router.push(ROOT_LOGIN)
                }
                // Middleware logic
            }
        })

        return () => unsubscribeAuth()
    }, [router, auth, pathname])

    return (
        <AuthContext.Provider value={currentUser}>
            {children}
        </AuthContext.Provider>
    )
}
