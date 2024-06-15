'use client'
import {
    BIRDPEDIA_ROUTE,
    BIRD_ID_ROUTE,
    HOME_ROUTE,
    SETTINGS_ROUTE,
} from '@/lib/routes'
import Link from 'next/link'
import { FaHome } from 'react-icons/fa'
import { PiBirdFill } from 'react-icons/pi'
import { MdChecklist } from 'react-icons/md'
import { IconContext } from 'react-icons'
import { IoIosSettings } from 'react-icons/io'
import { usePathname, useRouter } from 'next/navigation'
import { FaBookBookmark } from 'react-icons/fa6'

export default function HomeLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    const pathname = usePathname()

    return (
        <IconContext.Provider value={{ size: '1.5rem' }}>
            <div className="h-full flex flex-col items-center ">
                <div className="py-4">{children}</div>
                <div className="bg-green-400 p-4 w-full flex place-content-around">
                    <Link href={HOME_ROUTE}>
                        <FaHome color={chooseColor(pathname, HOME_ROUTE)} />
                    </Link>
                    <Link href={BIRD_ID_ROUTE}>
                        <PiBirdFill
                            color={chooseColor(pathname, BIRD_ID_ROUTE)}
                        />
                    </Link>
                    <Link href={BIRDPEDIA_ROUTE}>
                        <FaBookBookmark
                            color={chooseColor(pathname, BIRDPEDIA_ROUTE)}
                        />
                    </Link>
                    <Link href={SETTINGS_ROUTE}>
                        <IoIosSettings
                            color={chooseColor(pathname, SETTINGS_ROUTE)}
                        />
                    </Link>
                </div>
            </div>
        </IconContext.Provider>
    )
}

function chooseColor(pathname: string, route: string) {
    return pathname == route ? 'springgreen' : 'darkgreen'
}
