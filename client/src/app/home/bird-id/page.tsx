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
    const [searchResults, setSearchResults] = useState<SearchResult[]>([])
    const [isFetching, setIsFetching] = useState<boolean>(false)
    const [selectedBird, setSelectedBird] = useState<SearchResult>()

    const handleOnInput: FormEventHandler<HTMLInputElement> = (event) => {
        const input = event.currentTarget.value
        if (input.length >= 3) {
            console.log(input)
            setBirdInput(input.toLowerCase())
        }
    }
    const addBirdToBirdpedia = () => {
        
    }

    useEffect(() => {
        console.log('useeffect')
        setIsFetching(true)
        searchBirds(birdInput).then((resultsJson) => {
            const birds: SearchResult[] = resultsJson.results.bindings.map(
                (bird: any): SearchResult => {
                    return {
                        id: bird.id.value,
                        name: bird.birdName.value,
                        imgURI: bird.birdImg.value.replace('http', 'https'),
                    }
                }
            )
            setSearchResults(birds)
            setIsFetching(false)
        })
    }, [birdInput])

    return (
        <div className="flex flex-col items-center space-y-6 h-full">
            <div className="">
                <InputLabel inputId="bird" text="Search bird: " />
                <InputText
                    id="bird"
                    placeholder={'ex: blue jay'}
                    name={'bird'}
                    onInput={handleOnInput}
                />
            </div>
            <div className="grow ">
                {isFetching && (
                    <Image
                        src={'/loading.gif'}
                        height={90}
                        width={90}
                        alt="loading ..."
                        quality={50}
                    />
                )}
                {!isFetching && searchResults.length > 0 && (
                    <div className="border-2 border-green-400  flex flex-col space-y-2 h-[28rem] overflow-y-scroll">
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
                                        alt="img-uri"
                                        style={{ borderRadius: '25%' }}
                                        placeholder="blur"
                                        blurDataURL="/loading.gif"
                                        quality={50}
                                        priority
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
                        height={90}
                        width={90}
                        alt="img-uri"
                        style={{ borderRadius: '25%' }}
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
