interface TextBoxType {
    type: string
    placeholder: string
}
export default function InputText({ type, placeholder }: TextBoxType) {
    return (
        <input className="p-2 rounded" type={type} placeholder={placeholder} />
    )
}
