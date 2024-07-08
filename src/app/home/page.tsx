'use client'

import LoadData from '@/components/LoadData'
import { AuthContext } from '@/contexts/AuthContext'
import {
    DailyChallengeDoc,
    getUserDailyChallengeInfo,
} from '@/lib/firestore-services'
import { UserData } from '@/types/db-types'
import { useContext, useEffect, useState } from 'react'
import { FaStopwatch } from 'react-icons/fa'
import { IconContext } from 'react-icons'
import ProgressBar from '@/components/ProgressBar'
import { Color } from '@/theme/colors'
import { IoIosCheckmarkCircle } from 'react-icons/io'

export default function Home() {
    const { currentUserData } = useContext(AuthContext)
    const [loadingDCs, setLoadingDCs] = useState(true)
    const [DCsInfo, setDCInfo] = useState<DailyChallengeDoc[]>()

    const [hoursTillReset, setHoursTillReset] = useState<number>(99)
    const [minutesTillReset, setMinutesTillReset] = useState<number>(99)
    const [secondsTillReset, setSecondsTillReset] = useState<number>(99)

    useEffect(() => {
        async function loadDCInfo(currentUserData: UserData) {
            const dcInfo = await getUserDailyChallengeInfo(currentUserData)
            setDCInfo(dcInfo)
        }
        setLoadingDCs(true)
        if (currentUserData) {
            loadDCInfo(currentUserData)
            setInterval(() => {
                const currentTime = new Date()
                const resetTime =
                    new Date(
                        currentTime.getUTCFullYear(),
                        currentTime.getUTCMonth(),
                        currentTime.getUTCDate()
                    ).getTime() +
                    1000 * 60 * 60 * 24

                const diffHours =
                    (resetTime - currentTime.getTime()) / (1000 * 60 * 60)
                const diffMinutes = (diffHours - Math.floor(diffHours)) * 60
                const diffSeconds = (diffMinutes - Math.floor(diffMinutes)) * 60

                setHoursTillReset(Math.floor(diffHours))
                setMinutesTillReset(Math.floor(diffMinutes))
                setSecondsTillReset(Math.floor(diffSeconds))
            }, 250)
            setLoadingDCs(false)
        }
    }, [currentUserData])

    function DailyChallengeProgress() {
        return (
            <IconContext.Provider
                value={{ size: '1.25rem', style: { display: 'inline' } }}
            >
                <div className="flex flex-col items-center p-6 space-y-2 h-full border-4 border-green-400 rounded">
                    <div className="text-xl">Daily Challenge Progress</div>
                    <span
                        className={
                            'font-bold w-full flex justify-end' +
                            ' ' +
                            (hoursTillReset == 0 ? 'text-red' : 'text-black')
                        }
                    >
                        <FaStopwatch />
                        {hoursTillReset < 10
                            ? `0${hoursTillReset}`
                            : hoursTillReset}
                        :
                        {minutesTillReset < 10
                            ? `0${minutesTillReset}`
                            : minutesTillReset}
                        :
                        {secondsTillReset < 10
                            ? `0${secondsTillReset}`
                            : secondsTillReset}
                    </span>
                    <div className="flex flex-col space-y-2 ">
                        {currentUserData?.dailyChallenges.map((dcProgress) => {
                            const dcInfo = DCsInfo?.find(
                                (dc) => dc.id === dcProgress.dCID
                            )
                            const complete =
                                dcProgress.birdsIDd == dcInfo?.dc.numBirds
                            return (
                                <div key={dcProgress.dCID}>
                                    <div>{dcInfo?.dc.title}</div>
                                    <div className="flex flex-wrap justify-end space-x-2 items-center">
                                        <ProgressBar
                                            value={dcProgress.birdsIDd}
                                            max={dcInfo?.dc.numBirds}
                                            fillColor={
                                                complete
                                                    ? Color.SUCCESS
                                                    : Color.PRIMARY
                                            }
                                        />
                                        {complete ? (
                                            <IoIosCheckmarkCircle />
                                        ) : (
                                            <span>
                                                <span className="font-bold text-xl">
                                                    {dcProgress.birdsIDd}
                                                </span>
                                                /{dcInfo?.dc.numBirds}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </IconContext.Provider>
        )
    }

    return (
        <div className="flex flex-col items-center space-y-10">
            <LoadData conditionLoad={currentUserData == null}>
                <div className="flex flex-col items-center">
                    <div className="text-2xl pb-4">
                        Welcome back
                        <span className="text-emerald-400">
                            {' ' + currentUserData?.displayName}
                        </span>
                        <div className="text-base">
                            Species Identified:
                            <span className="font-bold text-black">
                                {' ' + currentUserData?.speciesIdentified}
                            </span>
                        </div>
                    </div>
                </div>
                <LoadData conditionLoad={loadingDCs}>
                    <DailyChallengeProgress />
                </LoadData>
            </LoadData>
        </div>
    )
}
