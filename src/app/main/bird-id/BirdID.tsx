'use client'

import InputLabel from '@/components/InputLabel'
import InputText from '@/components/InputText'
import LoadData from '@/components/LoadData'
import { MainContext } from '@/contexts/MainContext'
import { BirdBasic } from '@/types/action-types'
import {
    DailyChallenge,
    Sighting,
    User,
    UserDailyChallenge,
} from '@/types/db-types'
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
import {
    ADD_SIGHTINGS_ROUTE,
    GET_ALL_USER_SIGHTINGS_ROUTE,
    SEARCH_BIRDS_ROUTE,
} from '@/lib/routes'
import Form from '@/components/Form'
import Button from '@/components/Button'
import { Color } from '@/theme/colors'
import { IoIosCheckmarkCircle } from 'react-icons/io'
import { getAllUserSightings } from '@/lib/db/queries'
import Toast from '@/components/Toast'
import { MdOutlineLocationOff } from 'react-icons/md'
import { MdOutlineLocationOn } from 'react-icons/md'
import { FaMagnifyingGlass } from 'react-icons/fa6'
import { IconContext } from 'react-icons'

interface IBirdID {
    user: User
    dailyChallenges: DailyChallenge[]
    userDailyChallenges: UserDailyChallenge[]
}
interface Location {
    lat: number
    long: number
}
export default function BirdID({
    user,
    dailyChallenges,
    userDailyChallenges,
}: IBirdID) {
    // States
    const [birdInput, setBirdInput] = useState<string>('')
    const [searchResults, setSearchResults] = useState<BirdBasic[]>()
    const [isFetchingBirdData, setIsFetchingData] = useState<boolean>(false)
    const [isAddingBird, setIsAddingBird] = useState<boolean>(false)
    const [addedBirdSuccess, setAddedBirdSuccess] = useState<boolean>(false)
    const [selectedBird, setSelectedBird] = useState<BirdBasic>()
    const [locationOn, setLocationOn] = useState(false)
    // Contexts
    const {
        setShowDCProgressNotif,
        setShowNewSpeciesNotif,
        setLoadingNewPage,
    } = useContext(MainContext)
    // Refs
    const searchRef = useRef<HTMLInputElement>(null)
    const location = useRef<Location>()
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
    const addNewSighting = async (dc0: boolean, dc1: boolean, dc2: boolean) => {
        if (selectedBird) {
            let newSpecies = false

            const sightings: Sighting[] = await (
                await fetch(GET_ALL_USER_SIGHTINGS_ROUTE)
            ).json()

            // Create unique array of ids
            const ids = [
                ...new Set(
                    sightings.map((sighting) => {
                        return sighting.species_id
                    })
                ),
            ]

            newSpecies = !ids.includes(selectedBird.speciesId)

            let dcIDs: number[] = []
            dc0 && dcIDs.push(userDailyChallenges[0].daily_challenge_id)
            dc1 && dcIDs.push(userDailyChallenges[1].daily_challenge_id)
            dc2 && dcIDs.push(userDailyChallenges[2].daily_challenge_id)

            await fetch(ADD_SIGHTINGS_ROUTE, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    dcIDs,
                    speciesId: selectedBird.speciesId,
                    lat: location.current?.lat,
                    long: location.current?.long,
                }),
            })

            setShowNewSpeciesNotif && setShowNewSpeciesNotif(newSpecies)
            setShowDCProgressNotif && setShowDCProgressNotif(dc0 || dc1 || dc2)
            setSelectedBird(undefined)
            setIsAddingBird(false)
            setAddedBirdSuccess(true)
            setTimeout(() => setAddedBirdSuccess(false), 5000)
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
        setLoadingNewPage && setLoadingNewPage(false)

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

        const watchID = navigator.geolocation.watchPosition((position) => {
            setLocationOn(true)
            const { latitude, longitude } = position.coords
            location.current = { lat: latitude, long: longitude }
        })


        return () => {
            ignoreSearchResults = true
            navigator.geolocation.clearWatch(watchID)
        }
    }, [birdInput])

    return (
        <div className="flex flex-col items-center space-y-6 h-full">
            <div className="flex items-center space-x-2">
                <IconContext.Provider
                    value={{ size: '2rem', color: '#172554' }}
                >
                    <SearchBar onInput={handleOnInput} searchRef={searchRef} />
                    {location.current === undefined && <MdOutlineLocationOff />}
                </IconContext.Provider>
            </div>

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

            {selectedBird && (
                <Form action={formHandler}>
                    <AddSelection
                        selectedBird={selectedBird}
                        isAddingBird={isAddingBird}
                        user={user}
                        userDailyChallenges={userDailyChallenges}
                        dailyChallenges={dailyChallenges}
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

interface ISearchBar {
    onInput: FormEventHandler<HTMLInputElement>
    searchRef: RefObject<HTMLInputElement>
    placeholder?: string
}
export function SearchBar({
    onInput,
    searchRef,
    placeholder = 'What did you spot?',
}: ISearchBar) {
    return (
        <div className="flex items-center px-2 bg-white rounded">
            <FaMagnifyingGlass size={'1rem'} />
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
        <div
            className={
                'flex flex-col space-y-2 h-[32rem] w-full sm:w-auto overflow-y-scroll divide-y divide-sky-700'
            }
        >
            {searchResults.map((sr) => {
                return (
                    <div
                        key={sr.speciesId}
                        className={
                            'p-2 flex space-x-2 hover:bg-black/50 items-center'
                        }
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
                        <div className="grow flex justify-end">
                            <Button
                                onClickHandler={() => {
                                    selectResult(sr)
                                    clearInput()
                                    setSearchResults(undefined)
                                }}
                            >
                                <IoIosCheckmarkCircle
                                    color={Color.SPECIAL_ICON_LIGHT}
                                />
                            </Button>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
interface AddSelectionType {
    selectedBird: BirdBasic
    isAddingBird: boolean
    user: User
    userDailyChallenges: UserDailyChallenge[]
    dailyChallenges: DailyChallenge[]
    location?: Location
}

function AddSelection({
    selectedBird,
    isAddingBird,
    user,
    userDailyChallenges,
    dailyChallenges,
    location,
}: AddSelectionType) {
    if (user) {
        const checkBoxClasses = 'accent-orange-400 w-6 h-6'
        return (
            <div
                className={
                    Color.SECTION +
                    ' ' +
                    ' rounded-lg p-4 flex flex-col space-y-6 items-center w-full'
                }
            >
                <div className="flex space-x-2 items-center">
                    <Image
                        src={selectedBird.imgURI}
                        height={90}
                        width={90}
                        alt="Image URI unavailible"
                        placeholder="blur"
                        blurDataURL="/loading.gif"
                        style={{ borderRadius: '25%' }}
                    />
                    <span className="align-middle italic">
                        {selectedBird.name}
                    </span>
                </div>

                <div className={'rounded-lg my-4 space-y-6 w-11/12 sm:w-auto'}>
                    {userDailyChallenges.map((udc, i) => {
                        const { daily_challenge_id, birds_found } = udc
                        const { challenge_text, birds_to_find } =
                            dailyChallenges.find(
                                (dc) => dc.id === daily_challenge_id
                            )!
                        if (birds_found < birds_to_find) {
                            return (
                                <div
                                    key={daily_challenge_id}
                                    className="flex space-x-2 justify-between"
                                >
                                    <label htmlFor={'dc' + i}>
                                        {challenge_text}
                                    </label>
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
