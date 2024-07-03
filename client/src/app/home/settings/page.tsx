'use client'

import Button from '@/components/Button'
import { logout } from '@/lib/auth'
import { ROOT_LOGIN } from '@/lib/routes'
import { Color } from '@/theme/colors'
import { useRouter } from 'next/navigation'

export default function Settings() {
    const router = useRouter()
    return (
        <div className="h-full flex flex-col items-center space-y-2">
            <p className="text-xl">Settings</p>
            {/* <div className="grow"></div> */}
            <Button
                type={'button'}
                onClickHandler={() => {
                    logout().then(() => {
                        router.push(ROOT_LOGIN)
                    })
                }}
                color={Color.PRIMARY}
            >
                Sign out
            </Button>
        </div>
    )
}
