import { FormEventHandler, RefObject } from 'react'
import InputLabel from './InputLabel'
import InputText from './InputText'

interface SearchBarType {
    handleOnInputChange: FormEventHandler<HTMLInputElement>
    searchRef: RefObject<HTMLInputElement>
    placeholder: string
}

export default function SearchBar({
    handleOnInputChange,
    searchRef,
    placeholder,
}: SearchBarType) {
    return (
        <div className="">
            <InputLabel inputId="bird" text="Search bird: " />
            <InputText
                placeholder={placeholder}
                onInput={handleOnInputChange}
                inputRef={searchRef}
            />
        </div>
    )
}
