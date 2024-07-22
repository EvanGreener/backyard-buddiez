'use client'

import InputLabel from '@/components/InputLabel'
import InputText from '@/components/InputText'
import LoadData from '@/components/LoadData'
import { MainContext } from '@/contexts/HomeContext'
import { BirdBasic } from '@/types/action-types'
import { User } from '@/types/db-types'
import {
    Dispatch,
    FormEventHandler,
    RefObject,
    SetStateAction,
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react'
import Image from 'next/image'
import searchBirdsWikidata from '@/lib/wikidata'
import { SEARCH_BIRDS_ROUTE } from '@/lib/routes'

interface IBirdID {
    user: User
}
export default function BirdID({ user }: IBirdID) {
    // States
    const [birdInput, setBirdInput] = useState<string>('')
    const [searchResults, setSearchResults] = useState<BirdBasic[]>()
    const [isFetchingBirdData, setIsFetchingData] = useState<boolean>(false)
    const [isAddingBird, setIsAddingBird] = useState<boolean>(false)
    const [addedBirdSuccess, setaddedBirdSuccess] = useState<boolean>(false)
    const [selectedBird, setSelectedBird] = useState<BirdBasic>()
    // Contexts
    const { setShowDCProgressNotif, setShowNewSpeciesNotif } =
        useContext(MainContext)
    // Refs
    const searchRef = useRef<HTMLInputElement>(null)
    // Event handlers
    const handleOnInput: FormEventHandler<HTMLInputElement> = (event) => {
        const input = event.currentTarget.value
        setSelectedBird(undefined)
        setBirdInput(input.toLowerCase())
    }
    const clearInput = () => {
        if (searchRef.current) {
            searchRef.current.value = ''
            setBirdInput('')
        }
    }
    const selectResult = (result: BirdBasic) => {
        setSelectedBird(result)
    }

    useEffect(() => {
        let ignoreSearchResults = false
        async function searchBirds() {
            if (birdInput.length > 0) {
                setIsFetchingData(true)
                const res = await fetch(
                    SEARCH_BIRDS_ROUTE + `?bird_input=${birdInput}`
                )
                const birds: BirdBasic[] = await res.json()
                if (!ignoreSearchResults) {
                    setSearchResults(birds)
                }
                setIsFetchingData(false)
            }
        }

        searchBirds()

        return () => {
            ignoreSearchResults = true
        }
    }, [birdInput])
    return (
        <div className="flex flex-col items-center space-y-6 h-full">
            <SearchBar onInput={handleOnInput} searchRef={searchRef} />
            <LoadData
                conditionLoad={isFetchingBirdData}
                conditionShowData={
                    searchResults !== undefined && searchResults.length > 0
                }
                conditionNoResults={
                    birdInput.length > 0 &&
                    searchResults !== undefined &&
                    searchResults.length == 0
                }
            >
                {searchResults !== undefined && (
                    <SearchResults
                        clearInput={clearInput}
                        searchResults={searchResults}
                        selectResult={selectResult}
                        setSearchResults={setSearchResults}
                    />
                )}
            </LoadData>
        </div>
    )
}

interface ISearchBar {
    onInput: FormEventHandler<HTMLInputElement>
    searchRef: RefObject<HTMLInputElement>
    placeholder?: string
}
export function SearchBar({
    onInput,
    searchRef,
    placeholder = "ex: 'blue jay'",
}: ISearchBar) {
    return (
        <div>
            <InputLabel inputId="bird" text="Search bird: " />
            <InputText
                placeholder={placeholder}
                onInput={onInput}
                inputRef={searchRef}

            />
        </div>
    )
}

interface ISearchResults {
    searchResults: BirdBasic[]
    clearInput: () => void
    selectResult: (result: any) => void
    setSearchResults: Dispatch<SetStateAction<BirdBasic[] | undefined>>
}
export function SearchResults({
    searchResults,
    clearInput,
    selectResult,
    setSearchResults,
}: ISearchResults) {
    return (
        <div className="border-4 border-green-400 rounded-md flex flex-col space-y-2 h-[29rem] overflow-y-scroll">
            {searchResults.map((sr) => {
                return (
                    <button
                        key={sr.speciesId}
                        className="p-2 flex space-x-2 hover:bg-black/50"
                        onClick={() => {
                            selectResult(sr)
                            clearInput()
                            setSearchResults(undefined)
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
                        <div>
                            <div className="text-left text-lg">{sr.name}</div>
                            <div className="text-left text-gray-600">
                                {sr.commonName}
                            </div>
                        </div>
                    </button>
                )
            })}
        </div>
    )
}
