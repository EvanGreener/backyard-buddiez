import { Color } from '@/theme/colors'
import { MouseEventHandler } from 'react'

interface ButtonType {
    children: React.ReactNode
    type: 'submit' | 'reset' | 'button' | undefined
    onClickHandler?: MouseEventHandler<HTMLButtonElement> | undefined
    disabled?: boolean
    color?: Color
}

export default function Button({
    children,
    type,
    onClickHandler,
    disabled,
    color = Color.PRIMARY,
}: ButtonType) {
    return (
        <button
            type={type}
            className={color + ' p-2 rounded'}
            onClick={onClickHandler}
            disabled={disabled}
        >
            {children}
        </button>
    )
}
