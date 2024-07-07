import { firebaseApp } from '@/config/config'
import { SearchResult } from '@/types/action-types'

import { BBUser, Sighting } from '@/types/db-types'
import { User } from 'firebase/auth'
import {
    collection,
    doc,
    getDoc,
    Timestamp,
    setDoc,
    updateDoc,
    addDoc,
    arrayUnion,
    deleteField,
    getFirestore,
    increment,
    orderBy,
    limit,
    query,
    getDocs,
    DocumentData,
} from 'firebase/firestore'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import { Dispatch, SetStateAction } from 'react'

const db = getFirestore(firebaseApp)

export async function addUserIfNotExists(currentUser: User) {
    // Check if user exists in db
    const usersRef = collection(db, 'users')
    const docRef = doc(usersRef, currentUser.uid)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) {
        // Create new sightings array for user
        const newSightingsRef = await addDoc(collection(db, 'sightings'), {
            uid: currentUser.uid,
            sightings: [],
        })
        // Create new user in db
        const newUser: BBUser = {
            displayName: 'ChangeYourDisplayName123',
            createdAt: Timestamp.fromDate(new Date()),
            profileCreated: false,
            sightingsId: newSightingsRef.id,
            speciesIdentified: 0,
        }

        await setDoc(doc(usersRef, currentUser.uid), newUser)
        return true
    }
    return false
}

export async function updateUser(currentUser: User, router: AppRouterInstance) {
    const usersRef = collection(db, 'users')
    const docRef = doc(usersRef, currentUser.uid)
    const userData = (await getDoc(docRef)).data()
    if (userData) {
        if (!userData.sightingsId) {
            const newSightingsRef = await addDoc(collection(db, 'sightings'), {
                uid: currentUser.uid,
                sightings: [],
            })

            await updateDoc(docRef, {
                birdpediaId: deleteField(), // birdpediaId Now replaced with sightingsId
                sightingsId: newSightingsRef.id,
            })
        }

        if (!userData.speciesIdentified) {
            await updateDoc(docRef, {
                points: deleteField(), // Now replaced with speciesIdentified
                speciesIdentified: 0,
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
        return convertDocToUserData(userData)
    }
    return null
}

export function convertDocToUserData(userData: DocumentData) {
    const userDataBB: BBUser = {
        displayName: userData.displayName,
        createdAt: userData.createdAt,
        profileCreated: userData.profileCreated,
        sightingsId: userData.sightingsId,
        speciesIdentified: userData.speciesIdentified,
    }

    return userDataBB
}

export async function createProfile(
    currentUser: User | null,
    displayName: string,
    setCurrentUserData: Dispatch<SetStateAction<BBUser | null>>
) {
    if (!currentUser) {
        console.log('User not signed in')

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

export async function addSighting(
    selectedBird: SearchResult,
    currentUserData: BBUser | null,
    currentUser: User | null,
    newSpecies: boolean
) {
    if (!currentUserData || !currentUser) {
        console.log('User not signed in')
        return
    }

    console.log('got user')

    if (newSpecies) {
        const usersRef = collection(db, 'users')
        const docRef = doc(usersRef, currentUser?.uid)

        await updateDoc(docRef, {
            speciesIdentified: increment(1),
        })
        console.log('new speices')
    }

    const sightingsRef = doc(db, 'sightings', currentUserData.sightingsId)

    const newSighting: Sighting = {
        speciesId: selectedBird.speciesId,
        timeSeen: Timestamp.fromDate(new Date()),
    }

    console.log('adding new sighting')

    await updateDoc(sightingsRef, {
        sightings: arrayUnion(newSighting),
    })
}

export async function getAllSightings(currentUserData: BBUser | null) {
    if (!currentUserData) {
        console.log('User not signed in')
        return
    }

    const sightings = (
        await getDoc(doc(db, 'sightings', currentUserData.sightingsId))
    ).data()

    if (sightings) {
        const allSightings: Sighting[] = sightings.sightings.map(
            (sighting: Sighting) => {
                return sighting
            }
        )

        return allSightings
    }
}

export async function getTopXGlobal(top: number = 20) {
    const usersRef = collection(db, 'users')
    const q = query(usersRef, orderBy('speciesIdentified', 'desc'), limit(top))

    let topUsers: BBUser[] = []
    const querySnapshot = await getDocs(q)
    querySnapshot.forEach((user) => {
        const userData: BBUser = convertDocToUserData(user.data())
        topUsers.push(userData)
    })

    return topUsers
}
