'use client'

import Button from '@/components/Button'
import { AuthContext } from '@/contexts/AuthContext'
import { getMultipleBirdsInfo } from '@/lib/actions'
import { getAllBirdpediaEntries } from '@/lib/firestore-services'
import { BirdInfo } from '@/types/action-types'
import { BirdpediaEntry } from '@/types/db-types'
import { set } from 'firebase/database'
import Image from 'next/image'
import { useContext, useEffect, useState } from 'react'
import { FaArrowCircleDown, FaArrowCircleUp } from 'react-icons/fa'

export default function Birdpedia() {
    const [isFetchingBirdData, setIsFetchingData] = useState<boolean>(false)
    const [allEntries, setAllEntries] = useState<BirdpediaEntry[]>()
    const [allBirdInfos, setBirdInfos] = useState<BirdInfo[]>()
    const [entriesShown, setentriesShown] = useState<BirdInfo[]>()
    const [page, setPage] = useState<number>(0)
    const { currentUserData } = useContext(AuthContext)
    const birdsPerPage = 20
    const prevBtnDisabled = page == 0
    const nextBtnDisabled = !entriesShown || entriesShown?.length < birdsPerPage
    useEffect(() => {
        setIsFetchingData(true)
        // Get seen birds (distinct) by page from db
        getAllBirdpediaEntries(currentUserData).then((entries) => {
            if (entries) {
                setAllEntries(entries)
                const ids = [
                    ...new Set(
                        entries.map((entry) => {
                            return entry.speciesId
                        })
                    ),
                ]

                // Get info about results from wikidata
                getMultipleBirdsInfo(ids).then((birdInfos) => {
                    setBirdInfos(birdInfos)

                    setentriesShown(
                        birdInfos.slice(
                            page * birdsPerPage,
                            page * birdsPerPage + birdsPerPage
                        )
                    )
                })
            }
        })

        setIsFetchingData(false)
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
                        <div className="overflow-y-scroll h-[28rem] border-2 border-green-400 grid grid-cols-3 gap-12 p-4 my-4">
                            {entriesShown ? (
                                entriesShown.map((entry) => {
                                    return (
                                        <div>
                                            <Image
                                                src={entry.imgURI}
                                                width={64}
                                                height={64}
                                                alt={'Image URI unavailible'}
                                                style={{ borderRadius: '25%' }}
                                            />
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
