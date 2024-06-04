'use client'

import Link from 'next/link'
import Image from 'next/image'
import Button from '@/components/Button'
import { signInGoogle } from '@/lib/auth'

export default function RootLogin() {
    return (
        <div className="container flex flex-col items-center justify-end space-y-6 ">
            <Button type="button">
                <Link href={'/sign-up-email'}>Sign up with Email/Password</Link>
                <Image
                    className="inline ml-2"
                    src={'/mail.png'}
                    width={25}
                    height={25}
                    alt="provider logo"
                />
            </Button>
            <Button type="button">
                <Link href={'/login-email'}>Login with Email/Password</Link>
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
                    signInGoogle()
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
