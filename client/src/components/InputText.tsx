import { ChangeEventHandler, FormEventHandler } from 'react'

interface TextBoxType {
    type?: string
    placeholder: string
    required?: boolean
    name: string
    id?: string
    onInput?: FormEventHandler<HTMLInputElement>
}
export default function InputText({
    type,
    placeholder,
    required,
    name,
    id,
    onInput,
}: TextBoxType) {
    return (
        <input
            name={name}
            className="p-2 rounded"
            type={type}
            placeholder={placeholder}
            required={required}
            id={id}
            onInput={onInput}
        />
    )
}
