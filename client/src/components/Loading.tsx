import Image from 'next/image'
export default function LoadingGIF() {
    return (
        <div className="h-full w-full flex justify-center items-center">
            <Image
                src="/dodo-airlines-animal-crossing.gif"
                width={110}
                height={110}
                alt="loading gif"
                unoptimized
            />
        </div>
    )
}
