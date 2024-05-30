'use client'

import LoginButton from '@/components/LoginButton'
import LoginEmailPassForm from '@/components/LoginEmailPassForm'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Login() {
    return (
        <div className="h-full container flex flex-col items-center space-y-10">
            <div className="text-2xl">Backyard Buddiez</div>
            <div className="h-full container flex flex-col items-center justify-end space-y-8 ">
                <LoginEmailPassForm />
                <LoginButton
                    href={'/home'}
                    provider={'with Google'}
                    imagePath={''}
                />
            </div>
        </div>
    )
}
