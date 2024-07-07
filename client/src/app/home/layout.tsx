'use client'
import {
    BIRDPEDIA_ROUTE,
    BIRD_ID_ROUTE,
    HOME_ROUTE,
    SETTINGS_ROUTE,
} from '@/lib/routes'
import Link from 'next/link'
import { FaHome, FaPlus } from 'react-icons/fa'
import { PiBirdFill } from 'react-icons/pi'
import { MdChecklist, MdOutlineFiberNew } from 'react-icons/md'
import { IconContext } from 'react-icons'
import { IoIosSettings } from 'react-icons/io'
import { usePathname, useRouter } from 'next/navigation'
import { FaBookBookmark } from 'react-icons/fa6'
import { HomeContext } from '@/contexts/HomeContext'
import { useState } from 'react'

export default function HomeLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    const pathname = usePathname()
    const [showNewSpeciesNotif, setShowNewSpeciesNotif] = useState(false)
    return (
        <IconContext.Provider value={{ size: '1.5rem' }}>
            <HomeContext.Provider
                value={{ showNewSpeciesNotif, setShowNewSpeciesNotif }}
            >
                <div className="h-full flex flex-col items-center ">
                    <div className="grow p-4 w-full">{children}</div>
                    <div className="bg-green-400 w-full flex place-content-around">
                        <Link href={HOME_ROUTE} className="p-4">
                            <FaHome color={chooseColor(pathname, HOME_ROUTE)} />
                        </Link>
                        <Link href={BIRD_ID_ROUTE} className="p-4">
                            <FaPlus
                                color={chooseColor(pathname, BIRD_ID_ROUTE)}
                            />
                        </Link>
                        <div className="relative p-4">
                            <Link href={BIRDPEDIA_ROUTE}>
                                <FaBookBookmark
                                    color={chooseColor(
                                        pathname,
                                        BIRDPEDIA_ROUTE
                                    )}
                                />
                            </Link>
                            {showNewSpeciesNotif && (
                                <div className="absolute top-0 right-0 animate-bounce bg-red-300 rounded">
                                    <MdOutlineFiberNew />
                                </div>
                            )}
                        </div>

                        <Link href={SETTINGS_ROUTE} className="p-4">
                            <IoIosSettings
                                color={chooseColor(pathname, SETTINGS_ROUTE)}
                            />
                        </Link>
                    </div>
                </div>
            </HomeContext.Provider>
        </IconContext.Provider>
    )
}

function chooseColor(pathname: string, route: string) {
    return pathname == route ? 'springgreen' : 'darkgreen'
}
