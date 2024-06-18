'use client'

import Link from 'next/link'
import Image from 'next/image'
import Button from '@/components/Button'
import { signInGoogle } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import {
    CREATE_PROFILE_ROUTE,
    LOGIN_EMAIL_ROUTE,
    SIGN_UP_EMAIL_ROUTE,
} from '@/lib/routes'

export default function RootLogin() {
    const router = useRouter()
    return (
        <div className="container flex flex-col items-center justify-end space-y-6 ">
            <Button
                type="button"
                onClickHandler={() => {
                    router.push(SIGN_UP_EMAIL_ROUTE)
                }}
            >
                Sign up with Email/Password
                <Image
                    className="inline ml-2"
                    src={'/mail.png'}
                    width={25}
                    height={25}
                    alt="provider logo"
                />
            </Button>
            <Button
                type="button"
                onClickHandler={() => {
                    router.push(LOGIN_EMAIL_ROUTE)
                }}
            >
                Login with Email/Password
                <Image
                    className="inline ml-2"
                    src={'/mail.png'}
                    width={25}
                    height={25}
                    alt="provider logo"
                />
            </Button>
            <Button
                type="submit"
                onClickHandler={(event) => {
                    event.preventDefault()
                    signInGoogle().then(() => {
                        router.push(CREATE_PROFILE_ROUTE)
                    })
                }}
            >
                <span>Login with Google</span>
                <Image
                    className="inline ml-2"
                    src={'/Google__G__logo.svg.png'}
                    width={25}
                    height={25}
                    alt="provider logo"
                />
            </Button>
        </div>
    )
}
