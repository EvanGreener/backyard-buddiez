'use client'

import Link from 'next/link'
import { Color } from '@/theme/colors'
import Button from './Button'
import { useRouter } from 'next/navigation'

interface ILinkButton {
    href: string
    color?: Color
    children: JSX.Element
    onClick?: () => void
}

export default function LinkButton({
    href,
    color = Color.BUTTON,
    children,
    onClick,
}: ILinkButton) {
    const router = useRouter()
    return (
        <Button
            onClickHandler={() => {
                onClick && onClick()
                router.push(href)
            }}
            color={color}
            roundedFull
        >
            {children}
        </Button>
    )
}
