import { FormEventHandler, RefObject } from 'react'

interface InputTextType {
    type?: string
    placeholder: string
    required?: boolean
    name?: string
    id?: string
    onInput?: FormEventHandler<HTMLInputElement>
    inputRef?: RefObject<HTMLInputElement>
}
export default function InputText({
    type,
    placeholder,
    required,
    name,
    id,
    onInput,
    inputRef,
}: InputTextType) {
    return (
        <input
            name={name}
            className="p-2 rounded"
            type={type}
            placeholder={placeholder}
            required={required}
            id={id}
            onInput={onInput}
            ref={inputRef}
        />
    )
}
