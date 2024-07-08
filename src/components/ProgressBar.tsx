import { Color } from '@/theme/colors'

interface ProgressBarType {
    value: number
    max?: number
    fillColor: Color
}

export default function ProgressBar({
    value,
    max = 3,
    fillColor,
}: ProgressBarType) {
    return (
        <span className={`bg-black/50 rounded-full w-60 h-4`}>
            <span
                style={{
                    width: `${(value / max) * 100}%`,
                }}
                className={`${fillColor} flex h-full rounded-full`}
            >
                {' '}
            </span>
        </span>
    )
}
