interface ButtonType {
    children: React.ReactNode
    type: 'submit' | 'reset' | 'button' | undefined
}

export default function Button({ children, type }: ButtonType) {
    return (
        <button type={type} className="bg-sky-300 p-2 rounded ">
            {children}
        </button>
    )
}
