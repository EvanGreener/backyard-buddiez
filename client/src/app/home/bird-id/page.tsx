'use client'

import AddSelection from '@/components/AddSelection'
import Button from '@/components/Button'
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
    const { currentUserData, currentUserAuth, setCurrentUserData } =
        useContext(AuthContext)
    const { setShowNewSpeciesNotif } = useContext(HomeContext)

    const handleOnInputChange: FormEventHandler<HTMLInputElement> = (event) => {
        const input = event.currentTarget.value
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

        async function addNewSighting() {
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
                    newSpecies
                )

                newSpecies &&
                    currentUserData &&
                    setCurrentUserData &&
                    setCurrentUserData({
                        ...currentUserData,
                        speciesIdentified:
                            currentUserData?.speciesIdentified + 1,
                    })
                setShowNewSpeciesNotif && setShowNewSpeciesNotif(newSpecies)
                setSelectedBird(undefined)
                setIsAddingBird(false)
                setaddedBirdSuccess(true)
                setTimeout(() => setaddedBirdSuccess(false), 5000)
            }
        }

        searchBirds()
        if (isAddingBird) {
            addNewSighting()
        }

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
                <AddSelection
                    selectedBird={selectedBird}
                    isAddingBird={isAddingBird}
                    addSelectionHandler={() => setIsAddingBird(true)}
                />
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
