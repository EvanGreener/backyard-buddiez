import { firebaseApp } from '@/config/firebase-config'
import { User, getAuth, onAuthStateChanged } from 'firebase/auth'
import React, { ReactNode } from 'react'

const auth = getAuth(firebaseApp)

export const AuthContext = React.createContext<User | null>(null)
