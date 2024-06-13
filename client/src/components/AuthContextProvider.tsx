'use client'

import { firebaseApp } from '@/config/config'
import { AuthContext } from '@/contexts/AuthContext'
import { addUserIfNotExists, getUserData } from '@/lib/firestore-services'
import {
    HOME_ROUTE,
    LOGIN_EMAIL_ROUTE,
    CREATE_PROFILE_ROUTE,
    ROOT_LOGIN,
    SIGN_UP_EMAIL_ROUTE,
} from '@/lib/routes'
import { BBUser } from '@/types/db-types'
import { User, getAuth, onAuthStateChanged } from 'firebase/auth'
import { collection, doc, getDoc } from 'firebase/firestore'
import { usePathname, useRouter } from 'next/navigation'
import { ReactNode, useEffect, useState } from 'react'

export default function AuthContextProvider({
    children,
}: {
    children: ReactNode
}) {
    const auth = getAuth(firebaseApp)
    const [currentUserAuth, setCurrentUserAuth] = useState<User | null>(null)
    const [currentUserData, setCurrentUserData] = useState<BBUser | null>(null)
    const pathname = usePathname()
    const router = useRouter()

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log('Signed in')
                // User related stuff
                addUserIfNotExists(user)
                setCurrentUserAuth(user)
                if (!currentUserData) {
                    getUserData(user).then((userData) => {
                        if (userData) {
                            setCurrentUserData(userData)
                        }
                    })
                }
                console.log(currentUserData)

                // Middleware logic
                if (
                    pathname == LOGIN_EMAIL_ROUTE ||
                    pathname == SIGN_UP_EMAIL_ROUTE ||
                    pathname == ROOT_LOGIN
                ) {
                    router.push(HOME_ROUTE)
                } else if (currentUserData && !currentUserData.profileCreated) {
                    router.push(CREATE_PROFILE_ROUTE)
                } else if (
                    currentUserData &&
                    pathname == CREATE_PROFILE_ROUTE
                ) {
                    router.push(HOME_ROUTE)
                }
            } else {
                setCurrentUserAuth(null)
                setCurrentUserData(null)
                // Middleware logic
                if (pathname == HOME_ROUTE) {
                    router.push(ROOT_LOGIN)
                }
            }
        })

        return () => unsubscribeAuth()
    }, [auth, pathname, currentUserData])

    return (
        <AuthContext.Provider
            value={{
                currentUserAuth,
                currentUserData,
                setCurrentUserData,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}
