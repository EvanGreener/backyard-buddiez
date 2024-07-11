'use client'

import Button from '@/components/Button'
import Form from '@/components/Form'
import LoadData from '@/components/LoadData'
import SearchBar from '@/components/SearchBar'
import SearchResultsSelect from '@/components/SearchResultsSelect'
import Toast from '@/components/Toast'
import { AuthContext } from '@/contexts/AuthContext'
import { HomeContext } from '@/contexts/HomeContext'
import searchBirdsWikidata from '@/lib/actions'
import { addSighting, getAllSightings } from '@/lib/firestore-services'
import { Color } from '@/theme/colors'
import { SearchResult } from '@/types/action-types'
import { UserData } from '@/types/db-types'
import Image from 'next/image'
import {
    FormEventHandler,
    useContext,
    useEffect,
    useRef,
    useState,
    SetStateAction,
    Dispatch,
} from 'react'

export default function BirdID() {
    const [birdInput, setBirdInput] = useState<string>('')
    const [searchResults, setSearchResults] = useState<SearchResult[]>([])
    const [isFetchingBirdData, setIsFetchingData] = useState<boolean>(false)
    const [isAddingBird, setIsAddingBird] = useState<boolean>(false)
    const [addedBirdSuccess, setaddedBirdSuccess] = useState<boolean>(false)
    const [selectedBird, setSelectedBird] = useState<SearchResult>()
    const [dCIDPicked, setDCIDPicked] = useState<string>()
    const searchRef = useRef<HTMLInputElement>(null)
    const { currentUserData, currentUserAuth, setCurrentUserData } =
        useContext(AuthContext)
    const { setShowNewSpeciesNotif, setShowDCProgressNotif } =
        useContext(HomeContext)

    const handleOnInputChange: FormEventHandler<HTMLInputElement> = (event) => {
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
    const selectResult = (result: SearchResult) => {
        setSelectedBird(result)
    }

    const addNewSighting = async (dc0: boolean, dc1: boolean, dc2: boolean) => {
        if (selectedBird) {
            let newSpecies = false

            const entries = await getAllSightings(currentUserData)
            if (entries) {
                // Create unique array of ids
                const ids = [
                    ...new Set(
                        entries.map((entry) => {
                            return entry.speciesId
                        })
                    ),
                ]

                newSpecies = !ids.includes(selectedBird.speciesId)
            }

            await addSighting(
                selectedBird,
                currentUserData,
                currentUserAuth,
                newSpecies,
                dc0,
                dc1,
                dc2
            )

            newSpecies &&
                currentUserData &&
                setCurrentUserData &&
                setCurrentUserData({
                    ...currentUserData,
                    speciesIdentified: currentUserData?.speciesIdentified + 1,
                })
            setShowNewSpeciesNotif && setShowNewSpeciesNotif(newSpecies)
            setShowDCProgressNotif && setShowDCProgressNotif(dc0 || dc1 || dc2)
            setSelectedBird(undefined)
            setIsAddingBird(false)
            setaddedBirdSuccess(true)
            setTimeout(() => setaddedBirdSuccess(false), 5000)
        }
    }

    const formHandler = (formData: FormData): void => {
        const dc0 = formData.get('dc0')?.toString() == 'on'
        const dc1 = formData.get('dc1')?.toString() == 'on'
        const dc2 = formData.get('dc2')?.toString() == 'on'
        setIsAddingBird(true)
        addNewSighting(dc0, dc1, dc2)
    }

    useEffect(() => {
        let ignoreSearchResults = false
        async function searchBirds() {
            setIsFetchingData(true)
            const birds = await searchBirdsWikidata(birdInput)
            if (!ignoreSearchResults) {
                setSearchResults(birds)
            }
            setIsFetchingData(false)
        }

        searchBirds()

        return () => {
            ignoreSearchResults = true
        }
    }, [
        birdInput,
        currentUserAuth,
        currentUserData,
        isAddingBird,
        selectedBird,
        setCurrentUserData,
        setShowNewSpeciesNotif,
    ])

    return (
        <div className="flex flex-col items-center space-y-6 h-full">
            <SearchBar
                handleOnInputChange={handleOnInputChange}
                searchRef={searchRef}
                placeholder={"ex: 'blue jay'"}
            />

            <div className="grow ">
                <LoadData
                    conditionLoad={isFetchingBirdData}
                    conditionShowData={searchResults.length > 0}
                    conditionNoResults={birdInput.length > 0}
                >
                    <SearchResultsSelect
                        searchResults={searchResults}
                        clearInput={clearInput}
                        selectResult={selectResult}
                    />
                </LoadData>
            </div>

            {selectedBird && (
                <Form action={formHandler}>
                    <AddSelection
                        selectedBird={selectedBird}
                        isAddingBird={isAddingBird}
                        currentUserData={currentUserData}
                    />
                </Form>
            )}

            {addedBirdSuccess && (
                <Toast
                    color={Color.SUCCESS}
                    messages={['Succesfully added/logged bird sighting!']}
                />
            )}
        </div>
    )
}

interface AddSelectionType {
    selectedBird: SearchResult
    isAddingBird: boolean
    currentUserData: UserData | null
}

function AddSelection({
    selectedBird,
    isAddingBird,
    currentUserData,
}: AddSelectionType) {
    if (currentUserData) {
        const { dailyChallenges } = currentUserData

        const checkBoxClasses = 'accent-green-500 w-6 h-6'
        return (
            <div className="flex flex-col space-y-6 ">
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

                <div className="border-4 border-green-400 rounded-md m-4 p-2 space-y-6">
                    {dailyChallenges.map((dailyChallenge, i) => {
                        const { dc, birdsIDd, dCID } = dailyChallenge
                        const { title, numBirds } = dc
                        if (birdsIDd < numBirds) {
                            return (
                                <div
                                    key={dCID}
                                    className="flex space-x-2 justify-between"
                                >
                                    <label htmlFor={'dc' + i}>{title}</label>
                                    <input
                                        type="checkbox"
                                        name={'dc' + i}
                                        id={'dc' + i}
                                        className={checkBoxClasses}
                                    />
                                </div>
                            )
                        }
                    })}
                </div>

                <Button type="submit" disabled={!selectedBird}>
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
            </div>
        )
    }
}
