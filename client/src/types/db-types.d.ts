import { Timestamp } from 'firebase/firestore'

export interface BirdpediaEntry {
    userId: string
    speciesId: string
    timesSeen: number
    lastSeen: Timestamp
}

export interface BBUser {
    displayName: string
    points: number
    createdAt: Timestamp
    profileCreated: boolean
}
