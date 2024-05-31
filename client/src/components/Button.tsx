export default function Button({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return <div className="bg-sky-300 p-2 rounded ">{children}</div>
}
