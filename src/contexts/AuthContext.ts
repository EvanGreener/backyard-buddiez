import { firebaseApp } from '@/config/config'
import { UserData } from '@/types/db-types'
import { User, getAuth, onAuthStateChanged } from 'firebase/auth'
import { Dispatch, ReactNode, SetStateAction, createContext } from 'react'

const auth = getAuth(firebaseApp)

interface AuthContextType {
    currentUserAuth: User | null
    currentUserData: UserData | null
    setCurrentUserData: Dispatch<SetStateAction<UserData | null>> | null
}

export const AuthContext = createContext<AuthContextType>({
    currentUserAuth: null,
    currentUserData: null,
    setCurrentUserData: null,
})
