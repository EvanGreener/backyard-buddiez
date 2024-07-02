import { SearchResultContext } from '@/contexts/SearchResultContext'
import { SearchResult } from '@/types/action-types'
import { RefObject, useContext } from 'react'
import Image from 'next/image'

interface SearchResultsType {
    searchResults: SearchResult[]
    clearInput: () => void
    selectResult: (result: any) => void
}

export default function SearchResults({
    searchResults,
    clearInput,
    selectResult,
}: SearchResultsType) {
    return (
        <div className="border-2 border-green-400 flex flex-col space-y-2 h-[29rem] overflow-y-scroll">
            {searchResults.map((sr) => {
                return (
                    <button
                        key={sr.speciesId}
                        className="p-2 flex space-x-2 hover:bg-black/50"
                        onClick={() => {
                            selectResult(sr)
                            clearInput()
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
