import MainProvider from './MainProvider'

export default function MainLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <div className="h-full flex flex-col items-center ">
            <MainProvider>{children}</MainProvider>
        </div>
    )
}
