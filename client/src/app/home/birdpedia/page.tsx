'use client'

import Button from '@/components/Button'
import LoadData from '@/components/LoadData'
import { AuthContext } from '@/contexts/AuthContext'
import { getMultipleBirdsInfo as getBirdInfos } from '@/lib/actions'
import { getAllSightings } from '@/lib/firestore-services'
import { BIRDPEDIA_ROUTE } from '@/lib/routes'
import { BirdInfo } from '@/types/action-types'
import { Sighting } from '@/types/db-types'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useContext, useEffect, useState } from 'react'
import { FaArrowCircleDown, FaArrowCircleUp } from 'react-icons/fa'
import { Timestamp } from 'firebase/firestore'
import { HomeContext } from '@/contexts/HomeContext'

export default function Birdpedia() {
    const [isFetchingBirdData, setIsFetchingData] = useState<boolean>(true)
    const [allEntries, setAllEntries] = useState<Sighting[]>()
    const [allBirdInfos, setAllBirdInfos] = useState<BirdInfo[]>()
    const [page, setPage] = useState<number>(0)
    const router = useRouter()
    const { currentUserData } = useContext(AuthContext)
    const { showNewSpeciesNotif, setShowNewSpeciesNotif } =
        useContext(HomeContext)

    const birdsPerPage = 12
    const prevBtnDisabled = page == 0
    const nextBtnDisabled =
        !allBirdInfos ||
        allBirdInfos.slice(
            (page + 1) * birdsPerPage,
            (page + 1) * birdsPerPage + birdsPerPage
        ).length < 1
    const entriesShown = allBirdInfos
        ? allBirdInfos.slice(
              page * birdsPerPage,
              page * birdsPerPage + birdsPerPage
          )
        : undefined

    if (showNewSpeciesNotif && setShowNewSpeciesNotif) {
        setShowNewSpeciesNotif(false)
    }

    useEffect(() => {
        async function getEntriesData() {
            // Get user sightings from firestore
            const entries = await getAllSightings(currentUserData)
            if (entries) {
                setAllEntries(entries)

                // Create unique array of ids
                const ids = [
                    ...new Set(
                        entries.map((entry) => {
                            return entry.speciesId
                        })
                    ),
                ]

                // Get bird data from wikidata
                const birdInfos = await getBirdInfos(ids)
                const birdInfosSorted = birdInfos.sort((a, b) => {
                    return a.commonName.localeCompare(b.commonName)
                })

                setAllBirdInfos(birdInfosSorted)
            }
        }

        setIsFetchingData(true)
        if (!allEntries) {
            getEntriesData()
        }
        setIsFetchingData(false)
    }, [currentUserData, allEntries])

    function PrevBtn() {
        return (
            <Button
                disabled={prevBtnDisabled}
                onClickHandler={() => {
                    !prevBtnDisabled && setPage(page - 1)
                }}
            >
                <FaArrowCircleUp
                    color={prevBtnDisabled ? 'grey' : 'springgreen'}
                    opacity={prevBtnDisabled ? '50%' : '100%'}
                />
            </Button>
        )
    }

    function NextBtn() {
        return (
            <Button
                disabled={nextBtnDisabled}
                onClickHandler={() => {
                    !nextBtnDisabled && setPage(page + 1)
                }}
            >
                <FaArrowCircleDown
                    color={nextBtnDisabled ? 'grey' : 'springgreen'}
                    opacity={nextBtnDisabled ? '50%' : '100%'}
                />
            </Button>
        )
    }

    function Entry({
        speciesId,
        timesSeen,
        lastSeen,
        commonName,
        name,
        imgURI,
        rangeMapImg,
    }: {
        speciesId: string
        timesSeen: number
        lastSeen: Timestamp
        commonName: string
        name: string
        imgURI: string
        rangeMapImg: string
    }) {
        return (
            <div
                onClick={() =>
                    router.push(
                        BIRDPEDIA_ROUTE +
                            `/${speciesId}?timesSeen=${timesSeen}&lastSeen=${lastSeen.toMillis()}&commonName=${commonName}` +
                            `&name=${name}&imgURI=${imgURI}&rangeMapImg=${rangeMapImg}`
                    )
                }
            >
                <Image
                    src={imgURI}
                    width={64}
                    height={64}
                    placeholder="blur"
                    blurDataURL="/loading.gif"
                    alt={'Image URI unavailible'}
                    style={{
                        borderRadius: '25%',
                    }}
                />
                <p className="text-xs">
                    {commonName.length < 10
                        ? commonName
                        : commonName.slice(0, 10) + '...'}
                </p>
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center px-8">
            <LoadData
                conditionLoad={isFetchingBirdData}
                conditionShowData={entriesShown && entriesShown.length > 0}
                conditionNoResults={entriesShown && entriesShown.length == 0}
                noResultsMessage="Tap the bird icon and ID your first bird, then come back to this page!"
            >
                <div className="flex flex-col items-center">
                    {entriesShown ? (
                        <div className="flex flex-col items-center">
                            <PrevBtn />
                            {/* Entries */}
                            <div className="grow">
                                <div className="overflow-y-scroll h-[29rem] border-2 border-green-400 grid grid-cols-3 grid-rows-4 gap-10 p-4 my-4 rounded">
                                    {entriesShown.map((entry) => {
                                        const {
                                            commonName,
                                            imgURI,
                                            speciesId,
                                            name,
                                            rangeMapImg,
                                        } = entry

                                        if (allEntries) {
                                            const { timesSeen, lastSeen } =
                                                calculateTimesSeenAndLastSeen(
                                                    speciesId,
                                                    allEntries
                                                )

                                            return (
                                                <div key={speciesId}>
                                                    <Entry
                                                        speciesId={speciesId}
                                                        timesSeen={timesSeen}
                                                        lastSeen={lastSeen}
                                                        commonName={commonName}
                                                        name={name}
                                                        imgURI={imgURI}
                                                        rangeMapImg={
                                                            rangeMapImg
                                                        }
                                                    />
                                                </div>
                                            )
                                        }
                                    })}
                                </div>
                            </div>
                            <NextBtn />
                        </div>
                    ) : (
                        <div></div>
                    )}
                </div>
            </LoadData>
        </div>
    )
}

function calculateTimesSeenAndLastSeen(
    speciesId: string,
    allEntries: Sighting[]
) {
    const timesSeen = allEntries?.filter((e) => e.speciesId == speciesId).length

    //Get the most recent sighting of 'speciesId' and get the time seen
    let lastSeen = allEntries[0].timeSeen
    for (let i = allEntries.length - 1; i >= 0; i--) {
        if (allEntries[i].speciesId == speciesId) {
            lastSeen = allEntries[i].timeSeen
            break
        }
    }

    return { timesSeen, lastSeen }
}
