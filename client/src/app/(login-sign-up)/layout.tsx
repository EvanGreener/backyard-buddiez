import { Metadata } from 'next'
import '../globals.css'
import Image from 'next/image'

export const metadata: Metadata = {
    title: 'Backyard Buddiez - Login',
}
export default function LoginSignInLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <div className="space-y-10">
            <div className="text-center text-2xl">Backyard Buddiez</div>
            <div className="grow">
                <div className="flex grow items-center justify-center">
                    <Image
                        src={'/logo.svg'}
                        width={200}
                        height={200}
                        alt="SPLASH"
                    />
                </div>
            </div>

            {children}
        </div>
    )
}
