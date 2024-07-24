'use client'

import Button from '@/components/Button'
import LoadData from '@/components/LoadData'
import Modal from '@/components/Modal'
import { MainContext } from '@/contexts/HomeContext'
import { BIRDPEDIA_ROUTE } from '@/lib/routes'
import { Color } from '@/theme/colors'
import { BirdDetailed, BirdSightingInfo } from '@/types/action-types'
import { Sighting, User } from '@/types/db-types'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
    Dispatch,
    SetStateAction,
    useContext,
    useEffect,
    useState,
} from 'react'
import { FaArrowCircleUp, FaArrowCircleDown } from 'react-icons/fa'

interface IBirdpedia {
    sightings: Sighting[]
    birdDetailsSorted: BirdDetailed[]
    user: User
}

export default function Birdpedia({
    sightings,
    birdDetailsSorted,
    user,
}: IBirdpedia) {
    const [page, setPage] = useState<number>(0)
    const [selectedBirdDetails, setSelectedBirdDetails] =
        useState<BirdSightingInfo>()
    const { showNewSpeciesNotif, setShowNewSpeciesNotif } =
        useContext(MainContext)
    const router = useRouter()

    const birdsPerPage = 12
    const prevBtnDisabled = page == 0
    const nextBtnDisabled =
        !birdDetailsSorted ||
        birdDetailsSorted.slice(
            (page + 1) * birdsPerPage,
            (page + 1) * birdsPerPage + birdsPerPage
        ).length < 1
    const entriesShown = birdDetailsSorted
        ? birdDetailsSorted.slice(
              page * birdsPerPage,
              page * birdsPerPage + birdsPerPage
          )
        : undefined

    useEffect(() => {
        if (showNewSpeciesNotif && setShowNewSpeciesNotif) {
            setShowNewSpeciesNotif(false)
        }
    }, [setShowNewSpeciesNotif, showNewSpeciesNotif])

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
        lastSeen: Date
        commonName: string
        name: string
        imgURI: string
        rangeMapImg: string
    }) {
        return (
            <div
                onClick={() =>
                    setSelectedBirdDetails({
                        commonName,
                        imgURI,
                        lastSeen,
                        name,
                        rangeMapImg,
                        speciesId,
                        timesSeen,
                    })
                }
                className="cursor-pointer"
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
                conditionLoad={false}
                conditionShowData={entriesShown && entriesShown.length > 0}
                conditionNoResults={entriesShown && entriesShown.length == 0}
                noResultsMessage="Tap the '+' tab and ID your first bird, then come back to this page!"
            >
                <div className="flex flex-col items-center">
                    {entriesShown && (
                        <div className="flex flex-col items-center">
                            <PrevBtn />
                            {/* Entries */}
                            <div className="grow">
                                <div className="overflow-y-scroll h-[29rem] border-4 border-green-400 grid grid-cols-3 grid-rows-4 gap-10 p-4 my-4 rounded-md">
                                    {entriesShown.map((entry) => {
                                        const {
                                            commonName,
                                            imgURI,
                                            speciesId,
                                            name,
                                            rangeMapImg,
                                        } = entry

                                        const { timesSeen, lastSeen } =
                                            calculateTimesSeenAndLastSeen(
                                                speciesId,
                                                sightings
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
                                                    rangeMapImg={rangeMapImg}
                                                />
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                            <NextBtn />
                        </div>
                    )}
                </div>
            </LoadData>
            {selectedBirdDetails && (
                <BirdSightingInfoModal
                    selectedBirdDetails={selectedBirdDetails}
                    setSelectedBirdDetails={setSelectedBirdDetails}
                />
            )}
        </div>
    )
}

function calculateTimesSeenAndLastSeen(
    speciesId: string,
    sightings: Sighting[]
) {
    let lastSeen = new Date(0)
    const timesSeen = sightings.filter((s) => s.species_id == speciesId).length

    const sortedSightings = [...sightings].sort(
        (s1, s2) => s1.seen_at.getTime() - s2.seen_at.getTime()
    )

    for (let i = sortedSightings.length - 1; i >= 0; i--) {
        if (sortedSightings[i].species_id === speciesId) {
            lastSeen = sortedSightings[i].seen_at
            break
        }
    }

    return { timesSeen, lastSeen }
}
interface IBirdSightingInfoModal {
    selectedBirdDetails: BirdSightingInfo
    setSelectedBirdDetails: Dispatch<
        SetStateAction<BirdSightingInfo | undefined>
    >
}

function BirdSightingInfoModal({
    selectedBirdDetails,
    setSelectedBirdDetails,
}: IBirdSightingInfoModal) {
    const { commonName, imgURI, lastSeen, name, rangeMapImg, timesSeen } =
        selectedBirdDetails

    const dateOptions: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }
    const lastSeenFormatted = lastSeen.toLocaleDateString('en-US', dateOptions)

    return (
        <Modal
            showCondition={selectedBirdDetails !== undefined}
            clickOutsideHandler={() => setSelectedBirdDetails(undefined)}
        >
            <div className="p-4">
                <div className="">
                    <p className="text-xl">{name}</p>
                    <p className="">{commonName}</p>
                </div>
                <div>
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
        </Modal>
    )
}
