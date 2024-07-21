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
                <div className="p-4 w-full ">{children}</div>
                <div className="bg-green-400 rounded-t-lg w-full flex justify-around fixed bottom-0 z-10">
                    <div className="relative p-4">
                        <Link href={HOME_ROUTE}>
                            <FaHome color={chooseColor(pathname, HOME_ROUTE)} />
                        </Link>
                        {showDCProgressNotif && (
                            <div className="absolute top-0 right-0 animate-bounce bg-red-300 rounded">
                                <MdOutlineFiberNew />
                            </div>
                        )}
                    </div>
                    <Link href={LEADERBOARDS_ROUTE} className="px-3 py-4">
                        <FaTrophy
                            color={chooseColor(pathname, LEADERBOARDS_ROUTE)}
                        />
                    </Link>
                    <Link href={BIRD_ID_ROUTE} className="px-3 py-4">
                        <FaPlus color={chooseColor(pathname, BIRD_ID_ROUTE)} />
                    </Link>
                    <div className="relative p-4">
                        <Link href={BIRDPEDIA_ROUTE}>
                            <FaBookBookmark
                                color={chooseColor(pathname, BIRDPEDIA_ROUTE)}
                            />
                        </Link>
                        {showNewSpeciesNotif && (
                            <div className="absolute top-0 right-0 animate-bounce bg-red-300 rounded">
                                <MdOutlineFiberNew />
                            </div>
                        )}
                    </div>

                    <Link href={SETTINGS_ROUTE} className="px-3 py-4">
                        <IoIosSettings
                            color={chooseColor(pathname, SETTINGS_ROUTE)}
                        />
                    </Link>
                </div>
            </MainContext.Provider>
        </IconContext.Provider>
    )
}

function chooseColor(pathname: string, route: string) {
    return pathname.startsWith(route) ? 'springgreen' : 'darkgreen'
}
