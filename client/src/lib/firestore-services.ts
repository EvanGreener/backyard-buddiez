import { db } from './auth'

import { BBUser } from '@/types/db-types'
import { User } from 'firebase/auth'
import { collection, doc, getDoc, Timestamp, setDoc } from 'firebase/firestore'

export async function addUserIfNotExists(currentUser: User) {
    // Check if user exists in db
    const usersRef = collection(db, 'users')
    const docRef = doc(usersRef, currentUser.uid)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) {
        // Create new user in db
        const newUser: BBUser = {
            displayName: 'ChangeYourDisplayNname123',
            points: 0,
            createdAt: Timestamp.fromDate(new Date()),
            profileCreated: false,
        }

        await setDoc(doc(usersRef, currentUser.uid), newUser)
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
        }

        return userDataBB
    }
    return null
}
