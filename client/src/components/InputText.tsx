interface TextBoxType {
    type?: string
    placeholder: string
    required?: boolean
    name: string
    id?: string
}
export default function InputText({
    type,
    placeholder,
    required,
    name,
    id,
}: TextBoxType) {
    return (
        <input
            name={name}
            className="p-2 rounded"
            type={type}
            placeholder={placeholder}
            required={required}
            id={id}
        />
    )
}
