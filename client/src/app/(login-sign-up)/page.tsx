'use client'

import LoginButton from '@/components/LoginButton'
import LoginEmailPassForm from '@/components/LoginEmailPassForm'
import Link from 'next/link'
import { redirect, useRouter } from 'next/navigation'
import Image from 'next/image'
import Button from '@/components/Button'
import { signInGoogle } from '@/lib/auth'
import { useFormState, useFormStatus } from 'react-dom'
import { homeRoute } from '@/lib/routes'
import { MouseEventHandler } from 'react'
import { firebaseConfig } from '@/config/firebase-config'
import { initializeApp } from 'firebase/app'

export default function Login() {
    initializeApp(firebaseConfig)

    const [message, dispatch] = useFormState(signInGoogle, undefined)

    const { pending } = useFormStatus()
    const googleClick: MouseEventHandler<HTMLButtonElement> = (event) => {
        if (pending) {
            event.preventDefault()
        }
    }

    return (
        <form
            action={dispatch}
            className="container flex flex-col items-center justify-end space-y-6 "
        >
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
            <Button type="submit" onClickHandler={googleClick}>
                <span>Login with Google</span>
                <Image
                    className="inline ml-2"
                    src={'/Google__G__logo.svg.png'}
                    width={25}
                    height={25}
                    alt="provider logo"
                />
            </Button>
            <div>{message && <p>{message}</p>}</div>
        </form>
    )
}
