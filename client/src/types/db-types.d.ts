import { Timestamp } from 'firebase/firestore'

export interface UserApp {
    displayName: string
    points: number
    createdAt: Timestamp
    profileCreated: boolean
}
