import { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
    title: 'Next.js',
}
export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
            <head></head>
            <body>
                <main className="h-full">{children}</main>
            </body>
        </html>
    )
}
