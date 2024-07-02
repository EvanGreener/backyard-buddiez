'use client'

import Button from '@/components/Button'
import InputLabel from '@/components/InputLabel'
import InputText from '@/components/InputText'
import { AuthContext } from '@/contexts/AuthContext'
import searchBirdsWikidata from '@/lib/actions'
import { addSighting } from '@/lib/firestore-services'
import { SearchResult } from '@/types/action-types'
import Image from 'next/image'
import {
    FormEventHandler,
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react'

export default function BirdID() {
    const [birdInput, setBirdInput] = useState<string>('')
    const [searchResults, setSearchResults] = useState<SearchResult[]>([])
    const [isFetchingBirdData, setIsFetchingData] = useState<boolean>(false)
    const [isAddingBird, setIsAddingBird] = useState<boolean>(false)
    const [addedBirdSuccess, setaddedBirdSuccess] = useState<boolean>(false)
    const [selectedBird, setSelectedBird] = useState<SearchResult>()
    const searchRef = useRef<HTMLInputElement>(null)
    const { currentUserData } = useContext(AuthContext)

    const handleOnInputChange: FormEventHandler<HTMLInputElement> = (event) => {
        const input = event.currentTarget.value
        console.log(input)
        setBirdInput(input.toLowerCase())
    }

    useEffect(() => {
        async function addBirdToBirdpedia() {
            if (selectedBird) {
                await addSighting(selectedBird, currentUserData)
                setSelectedBird(undefined)
                setIsAddingBird(false)
                setaddedBirdSuccess(true)
                setTimeout(() => setaddedBirdSuccess(false), 5000)
            }
        }

        async function searchBirds() {
            setIsFetchingData(true)
            const birds = await searchBirdsWikidata(birdInput)
            setSearchResults(birds)
            setIsFetchingData(false)
        }

        console.log('useeffect')
        searchBirds()
        if (isAddingBird) {
            addBirdToBirdpedia()
        }
    }, [birdInput, isAddingBird, currentUserData, selectedBird])

    return (
        <div className="flex flex-col items-center space-y-6 h-full">
            <div className="">
                <InputLabel inputId="bird" text="Search bird: " />
                <InputText
                    id="bird"
                    placeholder={'ex: blue jay'}
                    name={'bird'}
                    onInput={handleOnInputChange}
                    inputRef={searchRef}
                />
            </div>
            <div className="grow ">
                {isFetchingBirdData && (
                    <Image
                        src={'/loading.gif'}
                        height={90}
                        width={90}
                        alt="loading ..."
                        quality={50}
                        unoptimized
                    />
                )}
                {!isFetchingBirdData && searchResults.length > 0 && (
                    <div className="border-2 border-green-400 flex flex-col space-y-2 h-[29rem] overflow-y-scroll">
                        {searchResults.map((sr) => {
                            return (
                                <button
                                    key={sr.speciesId}
                                    className="p-2 flex space-x-2 hover:bg-black/50"
                                    onClick={() => {
                                        setSelectedBird(sr)
                                        if (searchRef.current) {
                                            searchRef.current.value = ''
                                            setBirdInput('')
                                        }
                                    }}
                                >
                                    <Image
                                        src={sr.imgURI}
                                        height={90}
                                        width={90}
                                        alt="Image URI unavailible"
                                        style={{ borderRadius: '25%' }}
                                        placeholder="blur"
                                        blurDataURL="/loading.gif"
                                        quality={50}
                                        priority
                                    />
                                    <div className="">
                                        <div className="text-left text-lg">
                                            {sr.name}
                                        </div>
                                        <div className="text-left text-gray-600">
                                            {sr.commonName}
                                        </div>
                                    </div>
                                </button>
                            )
                        })}
                    </div>
                )}
            </div>
            {selectedBird && (
                <div className="flex space-x-2 ">
                    <Image
                        src={selectedBird.imgURI}
                        height={90}
                        width={90}
                        alt="Image URI unavailible"
                        placeholder="blur"
                        blurDataURL="/loading.gif"
                        style={{ borderRadius: '25%' }}
                    />
                    <span className="align-middle">{selectedBird.name}</span>
                </div>
            )}
            {selectedBird && (
                <Button
                    type="button"
                    onClickHandler={() => setIsAddingBird(true)}
                    disabled={!selectedBird}
                >
                    {isAddingBird ? (
                        <Image
                            src={'/loading.gif'}
                            height={48}
                            width={48}
                            alt="loading ..."
                            quality={50}
                            unoptimized
                        />
                    ) : (
                        <span> Add bird to Birdpedia</span>
                    )}
                </Button>
            )}
            {addedBirdSuccess && (
                <div className="bg-green-400 animate-bounce p-4 rounded ">
                    Succesfully added/logged bird sighting!
                    <br /> Check your Birdpedia!
                </div>
            )}
        </div>
    )
}
