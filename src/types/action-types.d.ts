export interface BirdBasic {
    speciesId: string
    imgURI: string
    name: string
    commonName: string
}

export interface BirdDetailed extends BirdBasic {
    rangeMapImg: string
}

export interface BirdSightingInfo extends BirdDetailed {
    timesSeen: number
    lastSeen: Date
    lastSeenLocation: {
        lat: number | null
        long: number | null
    }
}
