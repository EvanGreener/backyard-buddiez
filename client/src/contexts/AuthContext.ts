import { firebaseApp } from '@/config/firebase-config'
import { BBUser } from '@/types/db-types'
import { User, getAuth, onAuthStateChanged } from 'firebase/auth'
import React, { Dispatch, ReactNode, SetStateAction } from 'react'

const auth = getAuth(firebaseApp)

interface AuthContextType {
    currentUserAuth: User | null
    currentUserData: BBUser | null
    setCurrentUserData: Dispatch<SetStateAction<BBUser | null>> | null
}

export const AuthContext = React.createContext<AuthContextType>({
    currentUserAuth: null,
    currentUserData: null,
    setCurrentUserData: null,
})
