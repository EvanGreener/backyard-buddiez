'use client'

import Button from '@/components/Button'
import LoadData from '@/components/LoadData'
import Modal from '@/components/Modal'
import { MainContext } from '@/contexts/MainContext'
import { Color } from '@/theme/colors'
import { BirdDetailed, BirdSightingInfo } from '@/types/action-types'
import { Sighting, User } from '@/types/db-types'
import Image from 'next/image'
import {
    Dispatch,
    SetStateAction,
    useContext,
    useEffect,
    useState,
} from 'react'
import { FaArrowCircleUp, FaArrowCircleDown } from 'react-icons/fa'
import {
    AdvancedMarker,
    APIProvider,
    Map,
    Pin,
} from '@vis.gl/react-google-maps'

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
    const { showNewSpeciesNotif, setShowNewSpeciesNotif, setLoadingNewPage } =
        useContext(MainContext)

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
        setLoadingNewPage && setLoadingNewPage(false)

        if (showNewSpeciesNotif && setShowNewSpeciesNotif) {
            setShowNewSpeciesNotif(false)
        }
    }, [setShowNewSpeciesNotif, showNewSpeciesNotif])

    function PrevBtn() {
        return (
            <Button
                color={Color.BACKGROUND}
                disabled={prevBtnDisabled}
                onClickHandler={() => {
                    !prevBtnDisabled && setPage(page - 1)
                }}
            >
                <FaArrowCircleUp
                    color={prevBtnDisabled ? 'grey' : Color.SPECIAL_ICON_LIGHT}
                    opacity={prevBtnDisabled ? '50%' : '100%'}
                />
            </Button>
        )
    }

    function NextBtn() {
        return (
            <Button
                color={Color.BACKGROUND}
                disabled={nextBtnDisabled}
                onClickHandler={() => {
                    !nextBtnDisabled && setPage(page + 1)
                }}
            >
                <FaArrowCircleDown
                    color={nextBtnDisabled ? 'grey' : Color.SPECIAL_ICON_LIGHT}
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
        lastSeenLocation,
    }: {
        speciesId: string
        timesSeen: number
        lastSeen: Date
        commonName: string
        name: string
        imgURI: string
        rangeMapImg: string
        lastSeenLocation: {
            lat: number | null
            long: number | null
        }
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
                        lastSeenLocation,
                    })
                }
                className="cursor-pointer"
            >
                <Image
                    src={imgURI}
                    width={45}
                    height={40}
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
        <div className="flex flex-col items-center">
            <LoadData
                conditionLoad={false}
                conditionShowData={entriesShown && entriesShown.length > 0}
                conditionNoResults={entriesShown && entriesShown.length == 0}
                noResultsMessage="Tap the '+' tab and ID your first bird, then come back to this page!"
            >
                <div className="flex flex-col items-center ">
                    {entriesShown && (
                        <div className="flex flex-col items-center">
                            <p className="font-bold text-xl">Birdpedia</p>
                            {!prevBtnDisabled && <PrevBtn />}
                            {/* Entries */}
                            <div className="grow ">
                                <div
                                    className={
                                        Color.SECTION +
                                        ' ' +
                                        'overflow-y-scroll h-[26rem] grid grid-cols-4 grid-rows-4 gap-4 p-4 my-4 rounded-lg'
                                    }
                                >
                                    {entriesShown.map((entry) => {
                                        const {
                                            commonName,
                                            imgURI,
                                            speciesId,
                                            name,
                                            rangeMapImg,
                                        } = entry

                                        const {
                                            timesSeen,
                                            lastSeen,
                                            lastSeenLocation,
                                        } = getSightingInfo(
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
                                                    lastSeenLocation={
                                                        lastSeenLocation
                                                    }
                                                />
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                            {!nextBtnDisabled && <NextBtn />}
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

function getSightingInfo(speciesId: string, sightings: Sighting[]) {
    let lastSeen = new Date(0)
    const timesSeen = sightings.filter((s) => s.species_id == speciesId).length

    const sortedSightings = [...sightings].sort(
        (s1, s2) => s1.seen_at.getTime() - s2.seen_at.getTime()
    )

    let lat: number | null = -1
    let long: number | null = -1
    for (let i = sortedSightings.length - 1; i >= 0; i--) {
        if (sortedSightings[i].species_id === speciesId) {
            lastSeen = sortedSightings[i].seen_at
            lat = sortedSightings[i].lat
            long = sortedSightings[i].long
            break
        }
    }
    const lastSeenLocation = { lat, long }

    return { timesSeen, lastSeen, lastSeenLocation }
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
    const {
        commonName,
        imgURI,
        lastSeen,
        name,
        rangeMapImg,
        timesSeen,
        lastSeenLocation,
    } = selectedBirdDetails

    const { lat, long } = lastSeenLocation

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
            <div className="p-4 flex flex-col items-center space-y-4">
                <Image
                    src={imgURI ? imgURI : ''}
                    width={240}
                    height={64}
                    placeholder="blur"
                    blurDataURL="/loading.gif"
                    alt={'Image URI unavailible'}
                    style={{ borderRadius: '25%' }}
                />
                <div className="">
                    <p className="text-xl">{name}</p>
                    <p className="">{commonName}</p>
                    <p className="">Sightings: {timesSeen}</p>
                    <p className="">Last seen: {lastSeenFormatted}</p>
                </div>

                <APIProvider
                    apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
                >
                    {lat !== null && long !== null ? (
                        <Map
                            style={{
                                height: 240,
                                borderRadius: '2rem',
                            }}
                            defaultCenter={{ lat: lat, lng: long }}
                            defaultZoom={8}
                            mapId={'e7161059cd0d73b'}
                            gestureHandling={'greedy'}
                            disableDefaultUI={true}
                        >
                            <AdvancedMarker position={{ lat: lat, lng: long }}>
                                <Pin />
                            </AdvancedMarker>
                        </Map>
                    ) : (
                        <div> Location data not available </div>
                    )}
                </APIProvider>
            </div>
        </Modal>
    )
}
