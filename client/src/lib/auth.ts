'use server'

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
    doc,
    getDoc,
    getFirestore,
    setDoc,
} from 'firebase/firestore'
import { redirect } from 'next/navigation'
import { User } from '@/types/db-types'
import { homeRoute } from './routes'

const db = getFirestore(firebaseApp)

export async function signInGoogle() {
    const provider = new GoogleAuthProvider()
    const auth = getAuth(firebaseApp)
    try {
        await signInWithRedirect(auth, provider)
        const result = await getRedirectResult(auth)
        if (result) {
            // const credential = GoogleAuthProvider.credentialFromResult(result)

            const currentUser = result.user

            // Check if user exists in db
            const usersRef = doc(db, 'users')
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

            redirect(homeRoute)
        }
    } catch (error: any) {
        return getErrorMessage(error)
    }
}

export async function signUpEmail(email: string, password: string) {
    const auth = getAuth(firebaseApp)

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
    const auth = getAuth(firebaseApp)

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
    const auth = getAuth(firebaseApp)

    try {
        await signOut(auth)
    } catch (error) {
        return getErrorMessage(error)
    }
}

function getErrorMessage(error: any) {
    // Handle Errors here.
    const errorCode = error.code
    const errorMessage = error.message
    // The email of the user's account used.
    const email = error.customData.email
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error)

    return `${errorMessage}`
}
