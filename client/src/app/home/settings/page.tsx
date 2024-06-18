'use client'

import Button from '@/components/Button'
import { logout } from '@/lib/auth'
import { ROOT_LOGIN } from '@/lib/routes'
import { useRouter } from 'next/navigation'

export default function Settings() {
    const router = useRouter()
    return (
        <div className="flex flex-col items-center spacing-y-2">
            <p className="text-xl">Settings</p>
            <Button
                type={'button'}
                onClickHandler={() => {
                    logout().then(() => {
                        router.push(ROOT_LOGIN)
                    })
                }}
            >
                Sign out
            </Button>{' '}
        </div>
    )
}
