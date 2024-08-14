'use client'

import { MainContext } from '@/contexts/MainContext'
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
    const [loadingNewPage, setLoadingNewPage] = useState(false)

    const showLoadingBar = () => {
        setLoadingNewPage(true)
    }

    return (
        <IconContext.Provider value={{ size: '1.5rem' }}>
            <MainContext.Provider
                value={{
                    showNewSpeciesNotif,
                    setShowNewSpeciesNotif,
                    showDCProgressNotif,
                    setShowDCProgressNotif,
                    loadingNewPage,
                    setLoadingNewPage,
                }}
            >
                {loadingNewPage && (
                    <div className="absolute top-0 w-full h-2 z-20 bg-black/50">
                        <div className="w-1/2 h-2 bg-sky-400 animate-loadbar"></div>
                    </div>
                )}
                <div className={Color.BACKGROUND + ' ' + 'p-4 h-full w-full'}>
                    {children}
                </div>
                <div
                    className={
                        Color.TABS +
                        ' ' +
                        'p-1 rounded-t-lg w-full flex justify-around items-end h-12 fixed bottom-0 z-10'
                    }
                >
                    <div className="relative ">
                        <LinkButton
                            onClick={() => {
                                if (pathname !== HOME_ROUTE) {
                                    showLoadingBar()
                                }
                            }}
                            href={HOME_ROUTE}
                            color={Color.TABS}
                        >
                            <FaHome color={chooseColor(pathname, HOME_ROUTE)} />
                        </LinkButton>
                        {showDCProgressNotif && (
                            <div className="absolute top-0 right-0 animate-bounce bg-red-300 rounded">
                                <MdOutlineFiberNew />
                            </div>
                        )}
                    </div>
                    <LinkButton
                        onClick={() => {
                            if (pathname !== LEADERBOARDS_ROUTE) {
                                showLoadingBar()
                            }
                        }}
                        href={LEADERBOARDS_ROUTE}
                        color={Color.TABS}
                    >
                        <FaTrophy
                            color={chooseColor(pathname, LEADERBOARDS_ROUTE)}
                        />
                    </LinkButton>
                    <LinkButton
                        onClick={() => {
                            if (pathname !== BIRD_ID_ROUTE) {
                                showLoadingBar()
                            }
                        }}
                        href={BIRD_ID_ROUTE}
                        color={Color.TABS}
                    >
                        <FaPlus
                            color={chooseColor(
                                pathname,
                                BIRD_ID_ROUTE,
                                Color.SPECIAL_ICON_DARK,
                                Color.ICON_LIGHT
                            )}
                            size={'2.5rem'}
                        />
                    </LinkButton>
                    <div className="relative ">
                        <LinkButton
                            onClick={() => {
                                if (pathname !== BIRDPEDIA_ROUTE) {
                                    showLoadingBar()
                                }
                            }}
                            href={BIRDPEDIA_ROUTE}
                            color={Color.TABS}
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

                    <LinkButton
                        onClick={() => {
                            if (pathname !== SETTINGS_ROUTE) {
                                showLoadingBar()
                            }
                        }}
                        href={SETTINGS_ROUTE}
                        color={Color.TABS}
                    >
                        <IoIosSettings
                            color={chooseColor(pathname, SETTINGS_ROUTE)}
                        />
                    </LinkButton>
                </div>
            </MainContext.Provider>
        </IconContext.Provider>
    )
}

function chooseColor(
    pathname: string,
    route: string,
    on: string = Color.ICON_DARK,
    off: string = Color.ICON_LIGHT
) {
    return pathname.startsWith(route) ? on : off
}
