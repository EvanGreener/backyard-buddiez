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
import LoadingGIF from './Loading'
import { doc, getFirestore, onSnapshot } from 'firebase/firestore'
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
    const [fetchingUser, setFetchingUser] = useState<boolean>(true)
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

                let userDataT: UserData | undefined
                getUserData(user).then((userData) => {
                    if (userData) {
                        userDataT = userData
                        setCurrentUserData(userData)
                        //Reset daily challenges
                        resetDailyChallenges(user, userData)
                    }
                })

                if (userDataT) {
                    // Middleware logic
                    if (
                        (pathname == LOGIN_EMAIL_ROUTE ||
                            pathname == SIGN_UP_EMAIL_ROUTE ||
                            pathname == ROOT_LOGIN) &&
                        userDataT.profileCreated
                    ) {
                        router.push(HOME_ROUTE)
                    } else if (!userDataT.profileCreated) {
                        router.push(CREATE_PROFILE_ROUTE)
                    } else if (pathname == CREATE_PROFILE_ROUTE) {
                        router.push(HOME_ROUTE)
                    }
                }
            } else {
                setCurrentUserAuth(null)
                setCurrentUserData(null)
                // Middleware logic
                if (pathname.includes(HOME_ROUTE)) {
                    router.push(ROOT_LOGIN)
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
            }}
        >
            <LoadData conditionLoad={fetchingUser}>{children}</LoadData>
        </AuthContext.Provider>
    )
}
