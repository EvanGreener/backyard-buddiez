import { ReactNode } from 'react'

export default function Form({
    children,
    action,
}: {
    children: ReactNode
    action: (formData: FormData) => void
}) {
    return (
        <form
            action={action}
            className="flex flex-col items-center space-y-6 pb-6  w-full"
        >
            {children}
        </form>
    )
}
