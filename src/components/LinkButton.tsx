import Link from 'next/link'
import { Color } from '@/theme/colors'

interface ILinkButton {
    href: string
    children: JSX.Element
}

export default async function LinkButton({ href, children }: ILinkButton) {
    return (
        <Link
            href={href}
            className={Color.PRIMARY + ' ' + 'p-2 rounded flex items-center'}
        >
            {children}
        </Link>
    )
}
