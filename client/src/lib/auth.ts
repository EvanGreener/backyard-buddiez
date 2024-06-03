import { initializeApp } from 'firebase/app'
import { firebaseApp, firebaseConfig } from '@/config/firebase-config'
import {
    signInWithRedirect,
    getRedirectResult,
    GoogleAuthProvider,
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
} from 'firebase/auth'
import next from 'next'
import {
    Timestamp,
    collection,
    doc,
    getDoc,
    getFirestore,
    setDoc,
} from 'firebase/firestore'
import { redirect } from 'next/navigation'
import { User } from '@/types/db-types'
import { HOME_ROUTE } from './routes'
import { Dispatch, SetStateAction } from 'react'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import { NextRequest } from 'next/server'

const auth = getAuth(firebaseApp)
const db = getFirestore(firebaseApp)

export function signInGoogle() {
    const provider = new GoogleAuthProvider()
    provider.addScope('https://www.googleapis.com/auth/datastore')
    provider.addScope('https://www.googleapis.com/auth/cloud-platform')
    try {
        signInWithRedirect(auth, provider)
    } catch (error: any) {
        console.log(getErrorMessage(error))
    }
}

export async function googleRedirectResult(router: AppRouterInstance) {
    try {
        const result = await getRedirectResult(auth)
        if (result) {
            const currentUser = result.user

            // Check if user exists in db
            const usersRef = collection(db, 'users')
            const docRef = doc(usersRef, currentUser.uid)
            const docSnap = await getDoc(docRef)

            if (!docSnap.exists()) {
                // Create new user in db
                const newUser: User = {
                    displayName: 'ChangeYourDisplayNname123',
                    points: 0,
                    createdAt: Timestamp.fromDate(new Date()),
                }

                await setDoc(doc(usersRef, currentUser.uid), newUser)
            }

            router.push(HOME_ROUTE)
        }
    } catch (error: any) {
        console.log(getErrorMessage(error))
    }
}

export async function signUpEmail(email: string, password: string) {
    try {
        const credential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        )
    } catch (error) {
        return getErrorMessage(error)
    }
}

export async function signInEmail(email: string, password: string) {
    try {
        const credential = await signInWithEmailAndPassword(
            auth,
            email,
            password
        )
    } catch (error: any) {
        return getErrorMessage(error)
    }
}

export async function logout() {
    try {
        await signOut(auth)
    } catch (error) {
        return getErrorMessage(error)
    }
}

function getErrorMessage(error: any) {
    // Handle Errors here.

    return `${error}`
}
