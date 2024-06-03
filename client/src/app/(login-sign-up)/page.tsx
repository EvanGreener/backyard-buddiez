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
import { MouseEventHandler, useState } from 'react'
import { firebaseConfig } from '@/config/firebase-config'
import { initializeApp } from 'firebase/app'

export default function Login() {
    const [errorMsg, setErrorMsg] = useState('')

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
                onClickHandler={async () => {
                    await signInGoogle(setErrorMsg)
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
            <div className="text-red-600">{errorMsg && <p>{errorMsg}</p>}</div>
        </div>
    )
}
