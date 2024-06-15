'use client'

import Button from '@/components/Button'
import Form from '@/components/Form'
import InputLabel from '@/components/InputLabel'
import InputText from '@/components/InputText'
import searchBirds from '@/lib/actions'
import { SearchResult } from '@/types/action-types'
import Image, { ImageLoader, ImageLoaderProps } from 'next/image'
import { FormEventHandler, useEffect, useState } from 'react'

export default function BirdID() {
    const [birdInput, setBirdInput] = useState<string>('')
    const [inputValid, setInputValid] = useState<boolean>(false)
    const [searchResults, setSearchResults] = useState<SearchResult[]>([])
    const [isFetching, setIsFetching] = useState<boolean>(false)
    const [selectedBird, setSelectedBird] = useState<SearchResult>()

    let setInputTimeout = setTimeout(() => setBirdInput(birdInput), 500)

    const handleOnInput: FormEventHandler<HTMLInputElement> = (event) => {
        const input = event.currentTarget.value
        clearTimeout(setInputTimeout)
        if (input.length >= 3) {
            console.log(input)
            setInputTimeout = setTimeout(() => setBirdInput(input), 500)
        }
    }
    const addBirdToBirdpedia = () => {}

    useEffect(() => {
        console.log('useeffect')
        setIsFetching(true)
        searchBirds(birdInput).then((resultsJson) => {
            const birds: SearchResult[] = resultsJson.results.bindings.map(
                (bird: any): SearchResult => {
                    return {
                        id: bird.id.value,
                        name: bird.birdName.value,
                        imgURI: bird.birdImg.value,
                    }
                }
            )
            setSearchResults(birds)
            setIsFetching(false)
        })
    }, [birdInput])

    return (
        <div className="flex flex-col items-center space-y-6 h-full">
            <div className="space-x-2">
                <InputLabel inputId="bird" text="Bird to id: " />
                <InputText
                    id="bird"
                    placeholder={'ex: bluejay'}
                    name={'bird'}
                    onInput={handleOnInput}
                />
            </div>
            <div className="grow ">
                {!isFetching && searchResults.length > 0 && (
                    <div className="border-2 border-green-400 max-h-auto flex flex-col space-y-2 h-[28rem] overflow-y-scroll">
                        {searchResults.map((sr) => {
                            return (
                                <button
                                    key={sr.id}
                                    className="p-2 flex space-x-2 hover:bg-black/50"
                                    onClick={() => {
                                        setSelectedBird(sr)
                                        setSearchResults([])
                                    }}
                                >
                                    <Image
                                        src={sr.imgURI}
                                        height={90}
                                        width={90}
                                        sizes=""
                                        alt="img-uri"
                                        placeholder="empty"
                                        style={{ borderRadius: '25%' }}
                                    />
                                    <span className="align-middle">
                                        {sr.name}
                                    </span>
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
                        overrideSrc={selectedBird.imgURI}
                        height={90}
                        width={90}
                        sizes=""
                        alt="img-uri"
                        placeholder="empty"
                    />
                    <span className="align-middle">{selectedBird.name}</span>
                </div>
            )}
            <Button
                type="button"
                onClickHandler={addBirdToBirdpedia}
                disabled={!selectedBird}
            >
                Add bird to Birdpedia
            </Button>
        </div>
    )
}
