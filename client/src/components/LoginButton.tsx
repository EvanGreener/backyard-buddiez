import Link from 'next/link'

export interface LoginButtonType {
    href: string
    provider: string
    imagePath: string
}

export default function LoginButton({
    href,
    provider,
    imagePath,
}: LoginButtonType) {
    return (
        <div>
            <Link className="bg-sky-300 m-2 p-2 rounded " href={href}>
                Login {provider}
            </Link>
        </div>
    )
}
