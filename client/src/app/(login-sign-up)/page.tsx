'use client'

import LoginButton from '@/components/LoginButton'
import LoginEmailPassForm from '@/components/LoginEmailPassForm'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Button from '@/components/Button'
import { signInGoogle } from '@/services/auth'
import { useFormState } from 'react-dom'

export default function Login() {
    const [errorMessage, dispatch] = useFormState(signInGoogle, undefined)
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
            <Button type="submit">
                <span>Login with Google</span>
                <Image
                    className="inline ml-2"
                    src={'/Google__G__logo.svg.png'}
                    width={25}
                    height={25}
                    alt="provider logo"
                />
            </Button>
            <div>{errorMessage && <p>{errorMessage}</p>}</div>
        </form>
    )
}
