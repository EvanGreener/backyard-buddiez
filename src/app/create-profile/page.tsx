'use client'

import Button from '@/components/Button'
import Form from '@/components/Form'
import InputLabel from '@/components/InputLabel'
import InputText from '@/components/InputText'
import {
    CHANGE_DISPLAY_NAME_ROUTE,
    HOME_ROUTE,
} from '@/lib/routes'
import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'
import { useFormStatus } from 'react-dom'

export default function CreateProfileScreen() {
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const { pending } = useFormStatus()
    const inputRef = useRef<HTMLInputElement>(null)
    const router = useRouter()

    const submit = async (formData: FormData) => {
        const displayName = formData.get('displayName')?.toString()

        if (displayName) {
            // await changeDisplayName(displayName, user)
            const response = await fetch(
                CHANGE_DISPLAY_NAME_ROUTE + `?display_name=${displayName}`
            )
            if (response.status === 200) {
                router.push(HOME_ROUTE)
            }
            setErrorMessage('Something went wrong')
        } else {
            setErrorMessage('Display name required')
        }
    }

    return (
        <div className="p-4">
            <Form action={submit}>
                <div className="space-x-2">
                    <InputLabel
                        inputId={'displayName'}
                        text={'Display name:'}
                    />
                    <InputText
                        id="displayName"
                        placeholder={"ex: 'SadMummy59'"}
                        name={'displayName'}
                        inputRef={inputRef}
                        required
                    />
                </div>

                <Button
                    type="submit"
                    disabled={
                        pending ||
                        (inputRef.current !== null &&
                            inputRef.current.value.length < 6)
                    }
                >
                    Submit
                </Button>
                {errorMessage && <p> {errorMessage} </p>}
            </Form>
        </div>
    )
}
