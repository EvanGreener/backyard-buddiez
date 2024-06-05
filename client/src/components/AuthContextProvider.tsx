'use client'

import { firebaseApp } from '@/config/firebase-config'
import { AuthContext } from '@/contexts/AuthContext'
import { addUserToDB } from '@/lib/auth'
import {
    HOME_ROUTE,
    LOGIN_EMAIL_ROUTE,
    ROOT_LOGIN,
    SIGN_UP_EMAIL_ROUTE,
} from '@/lib/routes'
import { User, getAuth, onAuthStateChanged } from 'firebase/auth'
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
        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log('Signed in')

                setCurrentUser(user)

                addUserToDB(user)

                // Middleware logic
                if (
                    pathname == LOGIN_EMAIL_ROUTE ||
                    pathname == SIGN_UP_EMAIL_ROUTE ||
                    pathname == ROOT_LOGIN
                ) {
                    router.push(HOME_ROUTE)
                }
            } else {
                setCurrentUser(null)

                // Middleware logic
                if (pathname == HOME_ROUTE) {
                    router.push(ROOT_LOGIN)
                }
            }
        })

        return () => unsubscribeAuth()
    }, [auth, pathname])

    return (
        <AuthContext.Provider value={currentUser}>
            {children}
        </AuthContext.Provider>
    )
}
