'use client'

import { firebaseApp } from '@/config/config'
import { AuthContext } from '@/contexts/AuthContext'
import {
    addUserIfNotExists,
    getUserData,
    resetDailyChallenges,
    updateUser,
} from '@/lib/firestore-services'
import {
    HOME_ROUTE,
    LOGIN_EMAIL_ROUTE,
    CREATE_PROFILE_ROUTE,
    ROOT_LOGIN,
    SIGN_UP_EMAIL_ROUTE,
} from '@/lib/routes'
import { UserData } from '@/types/db-types'
import { User, getAuth, onAuthStateChanged } from 'firebase/auth'
import { usePathname, useRouter } from 'next/navigation'
import { ReactNode, useEffect, useState } from 'react'
import LoadData from './LoadData'

export default function AuthContextProvider({
    children,
}: {
    children: ReactNode
}) {
    const auth = getAuth(firebaseApp)
    const [currentUserAuth, setCurrentUserAuth] = useState<User | null>(null)
    const [currentUserData, setCurrentUserData] = useState<UserData | null>(
        null
    )
    const [fetchingUser, setFetchingUser] = useState(true)
    const [redirected, setRedirected] = useState(true)
    const pathname = usePathname()
    const router = useRouter()

    useEffect(() => {
        setFetchingUser(true)
        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log('Signed in')
                // User related stuff
                addUserIfNotExists(user).then((isNewUser) => {
                    !isNewUser && updateUser(user, router)
                })
                setCurrentUserAuth(user)

                getUserData(user).then((userData) => {
                    if (userData) {
                        setCurrentUserData(userData)
                        //Reset daily challenges
                        resetDailyChallenges(user, userData)

                        // Middleware logic
                        if (
                            (pathname == LOGIN_EMAIL_ROUTE ||
                                pathname == SIGN_UP_EMAIL_ROUTE ||
                                pathname == ROOT_LOGIN) &&
                            userData.profileCreated
                        ) {
                            router.push(HOME_ROUTE)
                        } else if (!userData.profileCreated) {
                            router.push(CREATE_PROFILE_ROUTE)
                        } else if (pathname == CREATE_PROFILE_ROUTE) {
                            router.push(HOME_ROUTE)
                        } else {
                            setRedirected(false)
                        }
                    } else {
                        console.error('Error getting user')
                    }
                })
            } else {
                setCurrentUserAuth(null)
                setCurrentUserData(null)
                // Middleware logic
                if (pathname.includes(HOME_ROUTE)) {
                    router.push(ROOT_LOGIN)
                } else {
                    setRedirected(false)
                }
            }
        })
        setFetchingUser(false)

        return () => {
            unsubscribeAuth()
        }
    }, [auth, pathname, router])

    return (
        <AuthContext.Provider
            value={{
                currentUserAuth,
                currentUserData,
                setCurrentUserData,
                redirected,
            }}
        >
            <LoadData conditionLoad={fetchingUser}>{children}</LoadData>
        </AuthContext.Provider>
    )
}
