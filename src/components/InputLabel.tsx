export default function InputLabel({
    inputId,
    text,
    className,
}: {
    inputId: string
    text: string
    className?: string
}) {
    return (
        <label htmlFor={inputId} className={className}>
            {text}
        </label>
    )
}
