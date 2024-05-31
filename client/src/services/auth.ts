'use server'

import { initializeApp } from 'firebase/app'
import { firebaseConfig } from '@/config/firebase-config'
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
import { getFirestore } from 'firebase/firestore'
import { redirect } from 'next/navigation'

const firebaseApp = initializeApp(firebaseConfig)
const db = getFirestore(firebaseApp)
const provider = new GoogleAuthProvider()
const auth = getAuth()

export async function signInGoogle() {
    await signInWithRedirect(auth, provider)
    const result = await getRedirectResult(auth)
    try {
        if (result) {
            const credential = GoogleAuthProvider.credentialFromResult(result)

            if (credential) {
                const token = credential.accessToken
                redirect('/home')
            }
        }
    } catch (error: any) {
        return getErrorMessage(error)
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
    const errorCode = error.code
    const errorMessage = error.message
    // The email of the user's account used.
    const email = error.customData.email
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error)

    return `${errorCode}: ${errorMessage}`
}
