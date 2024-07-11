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
    newSpecies: boolean,
    dc0: boolean,
    dc1: boolean,
    dc2: boolean
) {
    if (!currentUserData || !currentUser) {
        console.log('User not signed in')
        return
    }

    console.log('got user')

    if (newSpecies || dc0 || dc1 || dc2) {
        const usersRef = collection(db, 'users')
        const docRef = doc(usersRef, currentUser?.uid)

        const userDataCopy = currentUserData
        userDataCopy.dailyChallenges[0].birdsIDd += dc0 ? 1 : 0
        userDataCopy.dailyChallenges[1].birdsIDd += dc1 ? 1 : 0
        userDataCopy.dailyChallenges[2].birdsIDd += dc2 ? 1 : 0

        let dCsCompleted = 0
        userDataCopy.dailyChallenges.forEach((dc) => {
            dCsCompleted += dc.birdsIDd >= dc.dc.numBirds ? 1 : 0
        })

        await updateDoc(docRef, {
            dCsCompleted: increment(dCsCompleted),
            dailyChallenges: userDataCopy.dailyChallenges,
            speciesIdentified: newSpecies ? increment(1) : increment(0),
        })
    }

    const sightingsRef = doc(db, 'sightings', currentUserData.sightingsId)

    const newSighting = {
        speciesId: selectedBird.speciesId,
        timeSeen: Timestamp.now(),
    }

    console.log('adding new sighting')

    await updateDoc(sightingsRef, {
        sightings: arrayUnion(newSighting),
    })

    return dc0 || dc1 || dc2
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
    let allDCIDs: DailyChallengeProgress[] = []
    const DCsSnapshot = await getDocs(collection(db, 'daily-challenges'))
    DCsSnapshot.forEach((DCDoc) => {
        const { title, numBirds } = DCDoc.data()
        allDCIDs.push({
            dCID: DCDoc.id,
            dc: {
                title: title,
                numBirds: numBirds,
            },
            birdsIDd: 0,
        })
    })
    shuffle(allDCIDs)

    return allDCIDs.slice(0, 3)
}

export async function resetDailyChallenges(
    currentUser: User,
    currentUserData: UserData
) {
    let lastUpdatedDate = currentUserData.dCsLastUpdated.toDate()
    let currentDate = Timestamp.now().toDate()

    lastUpdatedDate = new Date(
        lastUpdatedDate.getUTCFullYear(),
        lastUpdatedDate.getUTCMonth(),
        lastUpdatedDate.getUTCDate()
    )
    currentDate = new Date(
        currentDate.getUTCFullYear(),
        currentDate.getUTCMonth(),
        currentDate.getUTCDate()
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
