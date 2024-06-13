import { firebaseApp } from '@/config/config'
import {
    getRedirectResult,
    GoogleAuthProvider,
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    signInWithPopup,
} from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { HOME_ROUTE } from './routes'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'

const auth = getAuth(firebaseApp)
export const db = getFirestore(firebaseApp)

export function signInGoogle() {
    const provider = new GoogleAuthProvider()
    provider.addScope('https://www.googleapis.com/auth/datastore')
    provider.addScope('https://www.googleapis.com/auth/cloud-platform')
    try {
        signInWithPopup(auth, provider)
    } catch (error: any) {
        console.log(getErrorMessage(error))
    }
}

export async function googleRedirectResult(router: AppRouterInstance) {
    try {
        const result = await getRedirectResult(auth)
        if (result) {
            const currentUser = result.user

            router.push(HOME_ROUTE)
        }
    } catch (error: any) {
        console.log(getErrorMessage(error))
    }
}

export async function signUpEmail(email: string, password: string) {
    try {
        await createUserWithEmailAndPassword(auth, email, password)
    } catch (error) {
        return getErrorMessage(error)
    }
}

export async function signInEmail(email: string, password: string) {
    try {
        await signInWithEmailAndPassword(auth, email, password)
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
