'use client'

import { firebaseApp } from '@/config/config'
import { AuthContext } from '@/contexts/AuthContext'
import {
    addUserIfNotExists,
    getUserData,
    updateUsers as updateUser,
} from '@/lib/firestore-services'
import {
    HOME_ROUTE,
    LOGIN_EMAIL_ROUTE,
    CREATE_PROFILE_ROUTE,
    ROOT_LOGIN,
    SIGN_UP_EMAIL_ROUTE,
} from '@/lib/routes'
import { BBUser } from '@/types/db-types'
import { User, getAuth, onAuthStateChanged } from 'firebase/auth'
import { usePathname, useRouter } from 'next/navigation'
import { ReactNode, useEffect, useState } from 'react'
import LoadingGIF from './Loading'

export default function AuthContextProvider({
    children,
}: {
    children: ReactNode
}) {
    const auth = getAuth(firebaseApp)
    const [currentUserAuth, setCurrentUserAuth] = useState<User | null>(null)
    const [currentUserData, setCurrentUserData] = useState<BBUser | null>(null)
    const [fetchingUser, setFetchingUser] = useState<boolean>(true)
    const pathname = usePathname()
    const router = useRouter()

    useEffect(() => {
        console.log('AuthContextProvider useffect')
        setFetchingUser(true)

        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            console.log('onAuthStateChanged')

            if (user) {
                console.log('Signed in')
                // User related stuff
                addUserIfNotExists(user)
                updateUser(user, router)

                setCurrentUserAuth(user)
                if (!currentUserData) {
                    getUserData(user).then((userData) => {
                        if (userData) {
                            setCurrentUserData(userData)
                        }
                    })
                }
                if (currentUserData) {
                    // Middleware logic
                    if (
                        (pathname == LOGIN_EMAIL_ROUTE ||
                            pathname == SIGN_UP_EMAIL_ROUTE ||
                            pathname == ROOT_LOGIN) &&
                        currentUserData.profileCreated
                    ) {
                        router.push(HOME_ROUTE)
                    } else if (!currentUserData.profileCreated) {
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
            {fetchingUser && <LoadingGIF />}
            {!fetchingUser && children}
        </AuthContext.Provider>
    )
}
