'use client'

import ProgressBar from '@/components/ProgressBar'
import { MainContext } from '@/contexts/HomeContext'
import { Color } from '@/theme/colors'
import { DailyChallenge, User, UserDailyChallenge } from '@/types/db-types'
import { useContext, useEffect, useState } from 'react'
import { IconContext } from 'react-icons'
import { FaStopwatch } from 'react-icons/fa6'
import { IoIosCheckmarkCircle } from 'react-icons/io'

interface IDailyChallengeProgress {
    user: User
    userDailyChallenges: UserDailyChallenge[]
    dailyChallenges: DailyChallenge[]
}

export default function DailyChallengeProgress({
    user,
    userDailyChallenges,
    dailyChallenges,
}: IDailyChallengeProgress) {
    const [hoursTillReset, setHoursTillReset] = useState<number>(99)
    const [minutesTillReset, setMinutesTillReset] = useState<number>(99)
    const [secondsTillReset, setSecondsTillReset] = useState<number>(99)
    const { showDCProgressNotif, setShowDCProgressNotif } =
        useContext(MainContext)

    useEffect(() => {
        if (showDCProgressNotif && setShowDCProgressNotif) {
            setShowDCProgressNotif(false)
        }

        setInterval(() => {
            const { dcs_last_updated } = user
            const currentTime = new Date()
            const currentDate = new Date(
                Date.UTC(
                    currentTime.getUTCFullYear(),
                    currentTime.getUTCMonth(),
                    currentTime.getUTCDate()
                )
            )

            const resetTime = new Date(
                Date.UTC(
                    currentTime.getUTCFullYear(),
                    currentTime.getUTCMonth(),
                    currentTime.getUTCDate()
                ) +
                    1000 * 60 * 60 * 24
            )

            const diffHours =
                (resetTime.getTime() - currentTime.getTime()) / (1000 * 60 * 60)
            const diffMinutes = (diffHours - Math.floor(diffHours)) * 60
            const diffSeconds = (diffMinutes - Math.floor(diffMinutes)) * 60

            setHoursTillReset(Math.floor(diffHours))
            setMinutesTillReset(Math.floor(diffMinutes))
            setSecondsTillReset(Math.floor(diffSeconds))

            if (
                currentDate.getTime() > dcs_last_updated!.getTime() ||
                (Math.floor(diffHours) == 0 &&
                    Math.floor(diffMinutes) == 0 &&
                    Math.floor(diffSeconds) == 0)
            ) {
                window.location.reload()
            }
        }, 1000)
    }, [setShowDCProgressNotif, showDCProgressNotif, user])
    return (
        <IconContext.Provider
            value={{ size: '1.25rem', style: { display: 'inline' } }}
        >
            <div className="flex flex-col items-center p-6 space-y-2 rounded-lg border-green-400 border-4">
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
                    {userDailyChallenges.map((udc, i) => {
                        const { id, birds_found, daily_challenge_id } = udc
                        const { birds_to_find, challenge_text } =
                            dailyChallenges.find(
                                (dc) => dc.id === daily_challenge_id
                            )!

                        const complete = birds_to_find == birds_found

                        return (
                            <div key={id}>
                                <div>{challenge_text}</div>
                                <div className="flex flex-wrap justify-end space-x-2 justify-between items-center">
                                    <ProgressBar
                                        value={birds_found}
                                        max={birds_to_find}
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
                                                {birds_found}
                                            </span>
                                            /{birds_to_find}
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
