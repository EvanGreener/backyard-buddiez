import { Timestamp } from 'firebase/firestore'

export interface BirdpediaEntry {
    speciesId: string
    timesSeen: number
    lastSeen: Timestamp
}

export interface BBUser {
    displayName: string
    points: number
    createdAt: Timestamp
    profileCreated: boolean
    birdpediaId: string
}
