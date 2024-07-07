export default function InputLabel({
    inputId,
    text,
}: {
    inputId: string
    text: string
}) {
    return <label htmlFor={inputId}>{text}</label>
}
