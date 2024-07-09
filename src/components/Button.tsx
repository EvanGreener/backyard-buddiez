import { Color } from '@/theme/colors'
import { MouseEventHandler } from 'react'

interface ButtonType {
    children: React.ReactNode
    type?: 'submit' | 'reset' | 'button'
    onClickHandler?: MouseEventHandler<HTMLButtonElement>
    disabled?: boolean
    color?: Color
}

export default function Button({
    children,
    onClickHandler,
    disabled,
    type = 'button',
    color = Color.PRIMARY,
}: ButtonType) {
    const buttonClass = color + ' p-2 rounded'
    return (
        <button
            type={type}
            className={buttonClass}
            onClick={onClickHandler}
            disabled={disabled}
        >
            {children}
        </button>
    )
}
