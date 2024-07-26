'use client'

import { MainContext } from '@/contexts/HomeContext'
import {
    HOME_ROUTE,
    LEADERBOARDS_ROUTE,
    BIRD_ID_ROUTE,
    BIRDPEDIA_ROUTE,
    SETTINGS_ROUTE,
} from '@/lib/routes'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { IconContext } from 'react-icons'
import { FaHome } from 'react-icons/fa'
import { FaPlus, FaBookBookmark } from 'react-icons/fa6'
import { IoIosSettings } from 'react-icons/io'
import { MdOutlineFiberNew } from 'react-icons/md'
import { FaTrophy } from 'react-icons/fa6'
import LinkButton from '@/components/LinkButton'
import { Color } from '@/theme/colors'

export default function MainProvider({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()
    const [showNewSpeciesNotif, setShowNewSpeciesNotif] = useState(false)
    const [showDCProgressNotif, setShowDCProgressNotif] = useState(false)
    return (
        <IconContext.Provider value={{ size: '1.5rem' }}>
            <MainContext.Provider
                value={{
                    showNewSpeciesNotif,
                    setShowNewSpeciesNotif,
                    showDCProgressNotif,
                    setShowDCProgressNotif,
                }}
            >
                <div className="p-4 h-full w-full">{children}</div>
                <div className="p-2 bg-green-400 rounded-t-lg w-full flex justify-around fixed bottom-0 z-10">
                    <div className="relative ">
                        <LinkButton href={HOME_ROUTE} color={Color.SUCCESS}>
                            <FaHome color={chooseColor(pathname, HOME_ROUTE)} />
                        </LinkButton>
                        {showDCProgressNotif && (
                            <div className="absolute top-0 right-0 animate-bounce bg-red-300 rounded">
                                <MdOutlineFiberNew />
                            </div>
                        )}
                    </div>
                    <LinkButton href={LEADERBOARDS_ROUTE} color={Color.SUCCESS}>
                        <FaTrophy
                            color={chooseColor(pathname, LEADERBOARDS_ROUTE)}
                        />
                    </LinkButton>
                    <LinkButton href={BIRD_ID_ROUTE} color={Color.SUCCESS}>
                        <FaPlus color={chooseColor(pathname, BIRD_ID_ROUTE)} />
                    </LinkButton>
                    <div className="relative ">
                        <LinkButton
                            href={BIRDPEDIA_ROUTE}
                            color={Color.SUCCESS}
                        >
                            <FaBookBookmark
                                color={chooseColor(pathname, BIRDPEDIA_ROUTE)}
                            />
                        </LinkButton>
                        {showNewSpeciesNotif && (
                            <div className="absolute top-0 right-0 animate-bounce bg-red-300 rounded">
                                <MdOutlineFiberNew />
                            </div>
                        )}
                    </div>

                    <LinkButton href={SETTINGS_ROUTE} color={Color.SUCCESS}>
                        <IoIosSettings
                            color={chooseColor(pathname, SETTINGS_ROUTE)}
                        />
                    </LinkButton>
                </div>
            </MainContext.Provider>
        </IconContext.Provider>
    )
}

function chooseColor(pathname: string, route: string) {
    return pathname.startsWith(route) ? 'springgreen' : 'darkgreen'
}
