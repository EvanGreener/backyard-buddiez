import Link from 'next/link'
import Image from 'next/image'
import Button from './Button'
export interface LoginButtonType {
    href: string
}

export default function LoginButton({ href }: LoginButtonType) {
    return (
        <Button>
            <Link href={href}>Login </Link>
        </Button>
    )
}
