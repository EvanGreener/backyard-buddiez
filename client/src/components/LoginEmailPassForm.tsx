'use client'

import { signInEmail } from '@/lib/auth'
import { useState } from 'react'
import { useFormStatus } from 'react-dom'
import Button from './Button'
import InputText from './InputText'

export default function LoginEmailPassForm() {
    const { pending } = useFormStatus()
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    const submit = (formData: FormData) => {
        const email = formData.get('email')?.toString()
        const password = formData.get('password')?.toString()

        if (email && password) {
            signInEmail(email, password)
        } else {
            setErrorMessage('Email and password required')
        }
    }

    return (
        <form
            action={submit}
            className="flex flex-col items-center space-y-6 pb-6  w-full"
        >
            <InputText name="email" type="email" placeholder="Email" required />
            <InputText
                name="password"
                type="password"
                placeholder="password"
                required
            />
            <Button type="submit" disabled={pending}>
                Login
            </Button>
            {errorMessage && <p> {errorMessage} </p>}
        </form>
    )
}
