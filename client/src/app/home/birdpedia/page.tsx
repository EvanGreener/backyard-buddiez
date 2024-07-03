'use client'

import Button from '@/components/Button'
import { AuthContext } from '@/contexts/AuthContext'
import { getMultipleBirdsInfo } from '@/lib/actions'
import { getAllBirdpediaEntries } from '@/lib/firestore-services'
import { BIRDPEDIA_ROUTE } from '@/lib/routes'
import { BirdInfo } from '@/types/action-types'
import { BirdpediaEntry } from '@/types/db-types'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useContext, useEffect, useState } from 'react'
import { FaArrowCircleDown, FaArrowCircleUp } from 'react-icons/fa'

export default function Birdpedia() {
    const [isFetchingBirdData, setIsFetchingData] = useState<boolean>(true)
    const [allEntries, setAllEntries] = useState<BirdpediaEntry[]>()
    const [allBirdInfos, setAllBirdInfos] = useState<BirdInfo[]>()
    const [entriesShown, setEntriesShown] = useState<BirdInfo[]>()
    const [prevBtnDisabled, setPrevBtnDisabled] = useState<boolean>(true)
    const [nextBtnDisabled, setNextBtnDisabled] = useState<boolean>(true)
    const [page, setPage] = useState<number>(0)
    const router = useRouter()

    const { currentUserData } = useContext(AuthContext)
    const birdsPerPage = 12

    useEffect(() => {
        async function setBtnsAndEntriesShown(
            birdInfos: BirdInfo[] | undefined,
            boolNextBtn: boolean
        ) {
            setPrevBtnDisabled(page == 0)
            setNextBtnDisabled(
                boolNextBtn ||
                    !birdInfos ||
                    birdInfos.slice(
                        (page + 1) * birdsPerPage,
                        (page + 1) * birdsPerPage + birdsPerPage
                    ).length < 1
            )
            birdInfos &&
                setEntriesShown(
                    birdInfos.slice(
                        page * birdsPerPage,
                        page * birdsPerPage + birdsPerPage
                    )
                )
        }

        async function getAndsetEntriesAndButtons() {
            const entries = await getAllBirdpediaEntries(currentUserData)
            if (entries) {
                setAllEntries(entries)

                const ids = [
                    ...new Set(
                        entries.map((entry) => {
                            return entry.speciesId
                        })
                    ),
                ]

                const birdInfos = await getMultipleBirdsInfo(ids)
                const birdInfosSorted = birdInfos.sort((a, b) => {
                    return a.commonName.localeCompare(b.commonName)
                })

                setAllBirdInfos(birdInfosSorted)
                setBtnsAndEntriesShown(birdInfosSorted, false)
            }
        }

        setIsFetchingData(true)
        if (!allEntries && !allBirdInfos) {
            getAndsetEntriesAndButtons()
        } else {
            setBtnsAndEntriesShown(allBirdInfos, !entriesShown)
        }
        setIsFetchingData(false)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page])
    return (
        <div className="flex flex-col items-center px-8">
            {isFetchingBirdData ? (
                <Image
                    src={'/loading.gif'}
                    height={90}
                    width={90}
                    alt="loading ..."
                    quality={50}
                    unoptimized
                />
            ) : (
                <div className="flex flex-col items-center">
                    <Button
                        type={'button'}
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
                    <div className="grow">
                        <div className="overflow-y-scroll h-[29rem] border-2 border-green-400 grid grid-cols-3 grid-rows-4 gap-10 p-4 my-4">
                            {entriesShown ? (
                                entriesShown.map((entry) => {
                                    const {
                                        commonName,
                                        imgURI,
                                        speciesId,
                                        name,
                                        rangeMapImg,
                                    } = entry
                                    console.log(rangeMapImg)

                                    if (!allEntries) {
                                        return
                                    }

                                    const timesSeen = allEntries?.filter(
                                        (e) => e.speciesId == speciesId
                                    ).length
                                    let lastSeen = allEntries[0].timeSeen
                                    for (
                                        let i = allEntries.length - 1;
                                        i >= 0;
                                        i--
                                    ) {
                                        if (
                                            allEntries[i].speciesId == speciesId
                                        ) {
                                            lastSeen = allEntries[i].timeSeen
                                            break
                                        }
                                    }

                                    return (
                                        <div
                                            key={speciesId}
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
                                                style={{ borderRadius: '25%' }}
                                            />
                                            <p className="text-xs">
                                                {commonName.length < 10
                                                    ? commonName
                                                    : commonName.slice(0, 10) +
                                                      '...'}
                                            </p>
                                        </div>
                                    )
                                })
                            ) : (
                                <div></div>
                            )}
                        </div>
                    </div>
                    <Button
                        type={'button'}
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
                </div>
            )}
        </div>
    )
}
