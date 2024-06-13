import { Timestamp } from 'firebase/firestore'

export interface BBUser {
    displayName: string
    points: number
    createdAt: Timestamp
    profileCreated: boolean
}
