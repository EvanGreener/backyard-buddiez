'use client'

import { IconContext } from 'react-icons'
import { FaMagnifyingGlass } from 'react-icons/fa6'
import { FaBookBookmark } from 'react-icons/fa6'
import { FaClock } from 'react-icons/fa'

import { FaTrophy } from 'react-icons/fa6'

import Link from 'next/link'

interface Section {
    id: string
    headline: string
    icon: JSX.Element
    text: JSX.Element | string
}

const sections: Section[] = [
    {
        id: 'id-birds',
        headline: 'ID birds',
        icon: <FaMagnifyingGlass />,
        text: (
            <span>
                Use an app like{' '}
                <Link
                    className="italic text-indigo-500"
                    href="https://merlin.allaboutbirds.org/download/"
                >
                    Merlin
                </Link>{' '}
                to identify a bird you&apos;ve spotted, then enter the name of
                the bird you&apos;ve IDd and the app will automatically add your
                sighting. The app will let you know if your{' '}
                <Link className="italic text-indigo-500" href="#birdpedia">
                    Birdpedia
                </Link>{' '}
                gained a new entry!
            </span>
        ),
    },
    {
        id: 'birdpedia',
        headline: 'Browse your Birdpedia',
        icon: <FaBookBookmark />,
        text: "Look back on all the previous birds you've IDd. Click on one get information and various statistics on it!",
    },
    {
        id: 'compete',
        headline: 'Compete against your friends',
        icon: <FaTrophy />,
        text: (
            <span>
                By identifying birds and completing the{' '}
                <Link
                    className="italic text-indigo-500"
                    href="#daily-challenges"
                >
                    daily challenges
                </Link>
                , you earn points. You get 500 points for each new bird you ID
                and 100 points for every daily challenge you complete. See how
                you stack up against your friends and the world!
            </span>
        ),
    },
    {
        id: 'daily-challenges',
        headline: 'Take on daily challenges',
        icon: <FaClock />,
        text:
            'When you ID a bird, if your sighting fit one or more of the daily challenges ' +
            'you can check off those challenges before adding your sighting! Your daily ' +
            'challenge progress will updated and shown on the home screen!',
    },
]

export default function Features() {
    return (
        <IconContext.Provider value={{ size: '3.5rem', color: 'darkgreen' }}>
            <div className="w-full">
                {sections.map((section, i) => {
                    const { id, headline, icon, text } = section

                    const evenSection = i % 2 === 0
                    const bgColor = evenSection ? 'bg-green-400' : ''
                    return (
                        <section
                            key={id}
                            id={id}
                            className={
                                bgColor +
                                ' ' +
                                'w-full p-4 flex flex-col space-y-2 text-center items-center'
                            }
                        >
                            <div className="text-lg font-bold">{headline}</div>
                            {evenSection ? (
                                <div className="flex place-items-center space-x-6">
                                    <span className="grow">{icon}</span>
                                    <span className="text-justify">{text}</span>
                                </div>
                            ) : (
                                <div className="flex place-items-center space-x-6">
                                    <span className="text-justify">{text}</span>
                                    <span className="grow">{icon}</span>
                                </div>
                            )}
                        </section>
                    )
                })}
            </div>
        </IconContext.Provider>
    )
}
