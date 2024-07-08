import { Timestamp } from 'firebase/firestore'

export interface UserData {
    displayName: string
    createdAt: Timestamp
    profileCreated: boolean
    sightingsId: string
    speciesIdentified: number

    dCsCompleted: number
    dCsLastUpdated: Timestamp
    dailyChallenges: DailyChallengeProgress[]
}

export interface Sighting {
    speciesId: string
    timeSeen: Timestamp
}

export interface DailyChallengeProgress {
    dCID: string
    birdsIDd: number
}

export interface DailyChallenge {
    numBirds: number
    title: string
}
