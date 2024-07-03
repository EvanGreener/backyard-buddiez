import { SearchResult } from '@/types/action-types'
import Image from 'next/image'
import Button from './Button'

interface AddSelectionType {
    selectedBird: SearchResult
    isAddingBird: boolean
    addSelectionHandler: () => void
}

export default function AddSelection({
    selectedBird,
    isAddingBird,
    addSelectionHandler,
}: AddSelectionType) {
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

            <Button
                type="button"
                onClickHandler={addSelectionHandler}
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
        </div>
    )
}
