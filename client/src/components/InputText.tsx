import { ChangeEventHandler } from 'react'

interface TextBoxType {
    type?: string
    placeholder: string
    required?: boolean
    name: string
    id?: string
    onChange?: ChangeEventHandler<HTMLInputElement>
}
export default function InputText({
    type,
    placeholder,
    required,
    name,
    id,
    onChange,
}: TextBoxType) {
    return (
        <input
            name={name}
            className="p-2 rounded"
            type={type}
            placeholder={placeholder}
            required={required}
            id={id}
            onChange={onChange}
        />
    )
}
