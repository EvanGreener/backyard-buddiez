import LinkButton from '@/components/LinkButton'
import Image from 'next/image'
import Features from '@/app/Features'
import { LOGIN_SIGN_UP_ROUTE } from '@/lib/routes'

export default async function LandingPage() {
    return (
        <>
            <nav
                className={
                    'bg-green-600/50 flex items-center p-4 sticky w-full fixed top-0'
                }
            >
                <span className="text-2xl font-['Brush_Script_MT']">
                    Backayrd Buddiez
                </span>
                <span className="grow"></span>
                <span className="flex-end">
                    <LinkButton href={LOGIN_SIGN_UP_ROUTE}>
                        <span>Login</span>
                    </LinkButton>
                </span>
            </nav>
            <div className="flex flex-col mt-12 space-y-10 items-center justify-center">
                <Image src={'/logo.svg'} width={200} height={200} alt="Logo" />
                <Features />
            </div>
        </>
    )
}
