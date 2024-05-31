'use client'

import LoginButton from '@/components/LoginButton'
import LoginEmailPassForm from '@/components/LoginEmailPassForm'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Button from '@/components/Button'

export default function Login() {
    return (
        <div className="container flex flex-col items-center justify-end space-y-6 ">
            <Button>
                <Link href={'/sign-up-email'}>Sign up with Email/Password</Link>
                <Image
                    className="inline ml-2"
                    src={'/mail.png'}
                    width={25}
                    height={25}
                    alt="provider logo"
                />
            </Button>
            <Button>
                <Link href={'/login-email'}>Login with Email/Password</Link>
                <Image
                    className="inline ml-2"
                    src={'/mail.png'}
                    width={25}
                    height={25}
                    alt="provider logo"
                />
            </Button>
            <Button>
                <span onClick={() => {}}>Login with Google</span>
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
