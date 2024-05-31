import Image from 'next/image'

export default function SplashScreen() {
    return (
        <div className="flex h-full items-center justify-center">
            <Image src={'/logo.svg'} width={100} height={100} alt="SPLASH" />
        </div>
    )
}
