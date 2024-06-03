import { Timestamp } from 'firebase/firestore'

export interface User {
    displayName: string
    points: number
    createdAt: Timestamp
}

