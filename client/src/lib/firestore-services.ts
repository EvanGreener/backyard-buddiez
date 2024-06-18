import { SearchResult } from '@/types/action-types'
import { db } from './auth'

import { BBUser } from '@/types/db-types'
import { User } from 'firebase/auth'
import {
    collection,
    doc,
    getDoc,
    Timestamp,
    setDoc,
    updateDoc,
    addDoc,
} from 'firebase/firestore'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import { Dispatch, SetStateAction } from 'react'

export async function addUserIfNotExists(
    currentUser: User,
    router: AppRouterInstance,
    setCurrentUserData: Dispatch<SetStateAction<BBUser | null>>
) {
    // Check if user exists in db
    const usersRef = collection(db, 'users')
    const docRef = doc(usersRef, currentUser.uid)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) {
        // Create new birdpedia for user
        const newBirdpediaRef = await addDoc(collection(db, 'birdpedias'), {
            entries: [],
        })
        // Create new user in db
        const newUser: BBUser = {
            displayName: 'ChangeYourDisplayNname123',
            points: 0,
            createdAt: Timestamp.fromDate(new Date()),
            profileCreated: false,
            birdpediaId: newBirdpediaRef.id,
        }

        await setDoc(doc(usersRef, currentUser.uid), newUser)
        return true
    }
    return false
}

export async function updateUsers(
    currentUser: User,
    router: AppRouterInstance
) {
    const usersRef = collection(db, 'users')
    const docRef = doc(usersRef, currentUser.uid)
    const userData = (await getDoc(docRef)).data()
    if (userData) {
        if (!userData.birdpediaId) {
            const newBirdpediaRef = await addDoc(collection(db, 'birdpedias'), {
                entries: [],
            })

            await updateDoc(docRef, {
                birdpediaId: newBirdpediaRef.id,
            })
        }

        router.refresh()
    }
}

export async function getUserData(currentUser: User) {
    const usersRef = collection(db, 'users')
    const docRef = doc(usersRef, currentUser.uid)
    const userData = (await getDoc(docRef)).data()

    if (userData) {
        const userDataBB: BBUser = {
            displayName: userData.displayName,
            points: userData.points,
            createdAt: userData.createdAt,
            profileCreated: userData.profileCreated,
            birdpediaId: userData.birdpediaId,
        }

        return userDataBB
    }
    return null
}

export async function createProfile(
    currentUser: User | null,
    displayName: string,
    setCurrentUserData: Dispatch<SetStateAction<BBUser | null>>
) {
    if (!currentUser) {
        return
    }

    const usersRef = collection(db, 'users')
    const docRef = doc(usersRef, currentUser.uid)

    await updateDoc(docRef, {
        displayName: displayName,
        profileCreated: true,
    })
    const userData = await getUserData(currentUser)
    setCurrentUserData(userData)
}

export async function addSighting(selectedBird: SearchResult) {
    if (selectedBird) {
    }
}
