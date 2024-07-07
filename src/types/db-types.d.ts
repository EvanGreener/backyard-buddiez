import { Timestamp } from 'firebase/firestore'

export interface Sighting {
    speciesId: string
    timeSeen: Timestamp
}

export interface BBUser {
    displayName: string
    createdAt: Timestamp
    profileCreated: boolean
    sightingsId: string
    speciesIdentified: number
}