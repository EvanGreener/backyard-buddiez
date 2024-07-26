'use client'
import { Color } from '@/theme/colors'
import { MouseEventHandler, useState } from 'react'

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
    const [buttonClicked, setButtonClicked] = useState(false)

    let buttonClass = color + ' ' + 'p-2 rounded'
    buttonClass = buttonClicked
        ? 'animate-pop' + ' ' + buttonClass
        : buttonClass
    return (
        <button
            type={type}
            className={buttonClass}
            onClick={(e) => {
                setButtonClicked(true)
                onClickHandler && onClickHandler(e)
            }}
            disabled={disabled}
            onAnimationEnd={() => {
                setButtonClicked(false)
            }}
        >
            {children}
        </button>
    )
}
