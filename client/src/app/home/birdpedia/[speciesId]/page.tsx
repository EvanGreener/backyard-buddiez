'use client'

import { Timestamp } from 'firebase/firestore'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'

export interface SpeciesInfoType {
    params: {
        speciesId: string
    }
}

export default async function SpeciesInfo({}: SpeciesInfoType) {
    const searchParams = useSearchParams()
    const timesSeen = searchParams.get('timesSeen')
    const lastSeen = Timestamp.fromMillis(Number(searchParams.get('lastSeen')))
    const commonName = searchParams.get('commonName')
    const name = searchParams.get('name')
    const imgURI = searchParams.get('imgURI')
    const rangeMapImg = searchParams.get('rangeMapImg')

    const dateOptions: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    } // Customize as needed
    const lastSeenFormatted = lastSeen
        .toDate()
        .toLocaleDateString('en-US', dateOptions)
    return (
        <div className="h-[36rem] flex flex-col items-center px-8 space-y-4 overflow-y-scroll">
            <div className="w-full">
                <p className="text-xl text-left">{name}</p>
                <p className="text-left">{commonName}</p>
            </div>
            <div className="w-full">
                <p className="">Sightings: {timesSeen}</p>
                <p className="">Last seen: {lastSeenFormatted}</p>
            </div>
            <Image
                src={imgURI ? imgURI : ''}
                width={240}
                height={64}
                placeholder="blur"
                blurDataURL="/loading.gif"
                alt={'Image URI unavailible'}
                style={{ borderRadius: '25%' }}
            />

            {rangeMapImg && rangeMapImg.length > 0 && (
                <Image
                    src={rangeMapImg}
                    width={240}
                    height={64}
                    placeholder="blur"
                    blurDataURL="/loading.gif"
                    alt={'Image URI unavailible'}
                    style={{ borderRadius: '25%' }}
                />
            )}
        </div>
    )
}
