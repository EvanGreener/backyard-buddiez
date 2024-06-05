interface TextBoxType {
    type: string
    placeholder: string
    required: boolean
    name: string
}
export default function InputText({
    type,
    placeholder,
    required,
    name,
}: TextBoxType) {
    return (
        <input
            name={name}
            className="p-2 rounded"
            type={type}
            placeholder={placeholder}
            required={required}
        />
    )
}
