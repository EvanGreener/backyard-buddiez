import { Metadata } from 'next'
import './globals.css'
import Image from 'next/image'
import AuthContextProvider from '@/components/AuthContextProvider'
import { Inter } from 'next/font/google'

const inter = Inter({
    subsets: ['latin'],
    display: 'swap',
})

export const metadata: Metadata = {
    title: 'Backyard Buddiez',
}
export default function LoginSignInLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en" className={inter.className}>
            <body>
                <AuthContextProvider>{children}</AuthContextProvider>
            </body>
        </html>
    )
}
