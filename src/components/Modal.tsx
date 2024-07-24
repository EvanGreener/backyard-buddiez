'use client'

import { Color } from '@/theme/colors'
import { Dispatch, SetStateAction } from 'react'

interface IModal {
    showCondition: boolean
    clickOutsideHandler: () => void
    children: JSX.Element
}
export default function Modal({
    showCondition,
    clickOutsideHandler,
    children,
}: IModal) {
    return (
        showCondition && (
            <div
                className="absolute top-0 left-0 h-full w-full bg-black/50 z-20 flex justify-center items-center"
                onClick={clickOutsideHandler}
            >
                <div
                    className={
                        Color.BACKGROUND +
                        ' ' +
                        'rounded-md max-h-[29rem] w-10/12 sm:w-1/2 overflow-y-scroll flex flex-col items-center space-y-4'
                    }
                    onClick={(e) => {
                        e.stopPropagation()
                    }}
                >
                    {children}
                </div>
            </div>
        )
    )
}
