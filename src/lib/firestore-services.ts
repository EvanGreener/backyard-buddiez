import { firebaseApp } from '@/config/config'
import { SearchResult } from '@/types/action-types'

import {
    UserData,
    DailyChallenge,
    DailyChallengeProgress,
    Sighting,
} from '@/types/db-types'
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
    where,
    serverTimestamp,
    documentId,
} from 'firebase/firestore'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import { Dispatch, SetStateAction } from 'react'
import { shuffle } from './utils'

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

        // Give new daily challenges to user
        const dailyChallenges = await getNewDailyChallenges()

        // Create new user in db
        const newUser = {
            displayName: 'ChangeYourDisplayName123',
            createdAt: serverTimestamp(),
            profileCreated: false,
            sightingsId: newSightingsRef.id,
            speciesIdentified: 0,

            dCsCompleted: 0,
            dCsLastUpdated: serverTimestamp(),
            dailyChallenges: dailyChallenges,
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

        if (userData.dCsCompleted === undefined) {
            console.log(userData)

            const dailyChallenges = await getNewDailyChallenges()
            await updateDoc(docRef, {
                dCsLastUpdated: serverTimestamp(),
                dailyChallenges: dailyChallenges,
                dCsCompleted: 0,
            })
        }
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
    const userDataBB: UserData = {
        displayName: userData.displayName,
        createdAt: userData.createdAt,
        profileCreated: userData.profileCreated,
        sightingsId: userData.sightingsId,
        speciesIdentified: userData.speciesIdentified,
        dCsCompleted: userData.DCsCompleted,
        dCsLastUpdated: userData.dCsLastUpdated,
        dailyChallenges: userData.dailyChallenges,
    }

    return userDataBB
}

export async function createProfile(
    currentUser: User | null,
    displayName: string,
    setCurrentUserData: Dispatch<SetStateAction<UserData | null>>
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
    currentUserData: UserData | null,
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

    const newSighting = {
        speciesId: selectedBird.speciesId,
        timeSeen: serverTimestamp(),
    }

    console.log('adding new sighting')

    await updateDoc(sightingsRef, {
        sightings: arrayUnion(newSighting),
    })
}

export async function getAllSightings(currentUserData: UserData | null) {
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

    let topUsers: UserData[] = []
    const querySnapshot = await getDocs(q)
    querySnapshot.forEach((userDoc) => {
        const userData: UserData = convertDocToUserData(userDoc.data())
        topUsers.push(userData)
    })

    return topUsers
}

export async function getNewDailyChallenges() {
    let allDCIDs: string[] = []
    const DCsSnapshot = await getDocs(collection(db, 'daily-challenges'))
    DCsSnapshot.forEach((DCDoc) => {
        allDCIDs.push(DCDoc.id)
    })
    shuffle(allDCIDs)
    allDCIDs = allDCIDs.slice(0, 3)

    const dailyChallenges: DailyChallengeProgress[] = [
        {
            dCID: allDCIDs[0],
            birdsIDd: 0,
        },
        {
            dCID: allDCIDs[1],
            birdsIDd: 0,
        },
        {
            dCID: allDCIDs[2],
            birdsIDd: 0,
        },
    ]

    return dailyChallenges
}

export async function resetDailyChallenges(
    currentUser: User,
    currentUserData: UserData
) {
    let lastUpdatedDate = currentUserData.dCsLastUpdated.toDate()
    let currentDate = Timestamp.now().toDate()

    lastUpdatedDate = new Date(
        lastUpdatedDate.getFullYear(),
        lastUpdatedDate.getMonth(),
        lastUpdatedDate.getDate()
    )
    currentDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate()
    )

    if (lastUpdatedDate.getTime() !== currentDate.getTime()) {
        const newChallenges = await getNewDailyChallenges()

        const usersRef = collection(db, 'users')
        const docRef = doc(usersRef, currentUser.uid)

        await updateDoc(docRef, {
            dCsLastUpdated: serverTimestamp(),
            dailyChallenges: newChallenges,
        })
        return true
    }
    return false
}

export interface DailyChallengeDoc {
    id: string
    dc: DailyChallenge
}

export async function getUserDailyChallengeInfo(currentUserData: UserData) {
    const dailyChallengeProgress = currentUserData.dailyChallenges
    const DCIDs = dailyChallengeProgress.map((dc) => {
        return dc.dCID
    })

    let dailyChallenges: DailyChallengeDoc[] = []
    const DCsRef = collection(db, 'daily-challenges')
    const q = query(DCsRef, where(documentId(), 'in', DCIDs))
    const querySnapshot = await getDocs(q)
    querySnapshot.forEach((DCDoc) => {
        const { numBirds, title } = DCDoc.data()
        dailyChallenges.push({
            id: DCDoc.id,
            dc: {
                numBirds,
                title,
            },
        })
    })

    return dailyChallenges
}
