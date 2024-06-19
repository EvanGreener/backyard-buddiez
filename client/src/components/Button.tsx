import { MouseEventHandler } from 'react'

export enum ButtonClass {
    PRIMARY = 'bg-sky-300 p-2 rounded',
    CAUTION = 'bg-red-300 p-2 rounded',
}

interface ButtonType {
    children: React.ReactNode
    type: 'submit' | 'reset' | 'button' | undefined
    onClickHandler?: MouseEventHandler<HTMLButtonElement> | undefined
    disabled?: boolean
    buttonClass?: ButtonClass
}

export default function Button({
    children,
    type,
    onClickHandler,
    disabled,
    buttonClass = ButtonClass.PRIMARY,
}: ButtonType) {
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
