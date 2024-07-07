import { Color } from '@/theme/colors'

interface ToastType {
    color: Color
    messages: string[]
}

export default function Toast({ color, messages }: ToastType) {
    return (
        <div className={color + ' animate-bounce p-4 rounded'}>
            {messages.map((msg, index) => {
                return <div key={index}>{msg}</div>
            })}
        </div>
    )
}
