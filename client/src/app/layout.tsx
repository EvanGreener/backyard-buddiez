import { Metadata } from 'next'
import './globals.css'
import Image from 'next/image'
import AuthContextProvider from '@/components/AuthContextProvider'

export const metadata: Metadata = {
    title: 'Backyard Buddiez',
}
export default function LoginSignInLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
            <body>
                <AuthContextProvider>{children}</AuthContextProvider>
            </body>
        </html>
    )
}
