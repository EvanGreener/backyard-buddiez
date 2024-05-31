import { Metadata } from 'next'
import './globals.css'
import Image from 'next/image'

export const metadata: Metadata = {
    title: 'Backyard Buddiez - Login',
}
export default function LoginSignInLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
            <body>
                <main>{children}</main>
            </body>
        </html>
    )
}
