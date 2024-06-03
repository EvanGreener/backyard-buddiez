'use client'

import LoginButton from '@/components/LoginButton'
import LoginEmailPassForm from '@/components/LoginEmailPassForm'
import Link from 'next/link'
import { redirect, useRouter } from 'next/navigation'
import Image from 'next/image'
import Button from '@/components/Button'
import { googleRedirectResult, signInGoogle } from '@/lib/auth'
import { useFormState, useFormStatus } from 'react-dom'
import { HOME_ROUTE } from '@/lib/routes'
import { MouseEventHandler, useContext, useEffect, useState } from 'react'
import { firebaseApp, firebaseConfig } from '@/config/firebase-config'
import { initializeApp } from 'firebase/app'
import { getAuth, getRedirectResult } from 'firebase/auth'
import {
    doc,
    getDoc,
    Timestamp,
    setDoc,
    getFirestore,
} from 'firebase/firestore'
import { User } from '@/types/db-types'
import { AuthContext } from '@/contexts/AuthContext'

export default function RootLogin() {
    const router = useRouter()

    useEffect(() => {
        // Will redirect again if sign in through google was successful
        googleRedirectResult(router)
    }, [])

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
                onClickHandler={async (event) => {
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
