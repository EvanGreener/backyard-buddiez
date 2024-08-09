'use client'

import Link from 'next/link'
import { Color } from '@/theme/colors'
import Button from './Button'
import { useRouter } from 'next/navigation'

interface ILinkButton {
    href: string
    color?: Color
    children: JSX.Element
}

export default function LinkButton({
    href,
    color = Color.BUTTON,
    children,
}: ILinkButton) {
    const router = useRouter()
    return (
        <Button
            onClickHandler={() => router.push(href)}
            color={color}
            roundedFull
        >
            {children}
        </Button>
    )
}
