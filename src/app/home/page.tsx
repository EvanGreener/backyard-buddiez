'use client'

import LoadData from '@/components/LoadData'
import { AuthContext } from '@/contexts/AuthContext'
import { useContext, useEffect, useState } from 'react'
import { FaStopwatch } from 'react-icons/fa'
import { IconContext } from 'react-icons'
import ProgressBar from '@/components/ProgressBar'
import { Color } from '@/theme/colors'
import { IoIosCheckmarkCircle } from 'react-icons/io'

export default function Home() {
    const { currentUserData, reFetchUser, setReFetchUser } =
        useContext(AuthContext)
    const [loadingDCs, setLoadingDCs] = useState(true)
    const [hoursTillReset, setHoursTillReset] = useState<number>(99)
    const [minutesTillReset, setMinutesTillReset] = useState<number>(99)
    const [secondsTillReset, setSecondsTillReset] = useState<number>(99)

    useEffect(() => {
        setLoadingDCs(true)
        if (currentUserData) {
            setInterval(() => {
                let lastUpdatedTime = currentUserData.dCsLastUpdated.toDate()
                lastUpdatedTime = new Date(
                    lastUpdatedTime.getUTCFullYear(),
                    lastUpdatedTime.getUTCMonth(),
                    lastUpdatedTime.getUTCDate()
                )
                let currentTime = new Date()
                currentTime = new Date(
                    currentTime.getTime() +
                        currentTime.getTimezoneOffset() * 60 * 1000
                )
                const resetTime =
                    new Date(
                        currentTime.getUTCFullYear(),
                        currentTime.getUTCMonth(),
                        currentTime.getUTCDate()
                    ).getTime() +
                    1000 * 60 * 60 * 24

                if (
                    new Date(resetTime - 1000 * 60 * 60 * 24) > lastUpdatedTime
                ) {
                    setReFetchUser && setReFetchUser(!reFetchUser)
                }

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
    }, [currentUserData, reFetchUser, setReFetchUser])

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
                            const { dCID, dc, birdsIDd } = dcProgress
                            const { title, numBirds } = dc
                            const complete = birdsIDd == numBirds
                            return (
                                <div key={dCID}>
                                    <div>{title}</div>
                                    <div className="flex flex-wrap justify-end space-x-2 justify-between">
                                        <ProgressBar
                                            value={birdsIDd}
                                            max={numBirds}
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
                                                    {birdsIDd}
                                                </span>
                                                /{numBirds}
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
                        <div className="text-base">
                            Daily Challenges completed:
                            <span className="font-bold text-black">
                                {' ' + currentUserData?.dCsCompleted}
                            </span>
                        </div>
                        <div className="text-base">
                            Points:
                            <span className="font-bold text-black">
                                {' ' +
                                    (currentUserData
                                        ? currentUserData?.speciesIdentified *
                                              500 +
                                          currentUserData?.dCsCompleted * 100
                                        : '0')}
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
