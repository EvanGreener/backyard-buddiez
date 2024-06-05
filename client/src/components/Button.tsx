import { MouseEventHandler } from 'react'

interface ButtonType {
    children: React.ReactNode
    type: 'submit' | 'reset' | 'button' | undefined
    onClickHandler?: MouseEventHandler<HTMLButtonElement> | undefined
    disabled?: boolean
}

export default function Button({
    children,
    type,
    onClickHandler,
    disabled,
}: ButtonType) {
    return (
        <button
            type={type}
            className="bg-sky-300 p-2 rounded "
            onClick={onClickHandler}
            disabled={disabled}
        >
            {children}
        </button>
    )
}
