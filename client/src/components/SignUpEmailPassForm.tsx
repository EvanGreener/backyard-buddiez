"use client"

import Button from './Button'
import InputText from './InputText'
import { signUpEmail } from '@/lib/auth'
import { useFormStatus } from 'react-dom'
import { useState } from 'react'

export default function SignUpEmailPassForm() {
    const { pending } = useFormStatus()
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    const submit = (formData: FormData) => {
        const email = formData.get('email')?.toString()
        const password = formData.get('password')?.toString()

        if (email && password) {
            signUpEmail(email, password)
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
                Sign Up!
            </Button>
            {errorMessage && <p> {errorMessage} </p>}
        </form>
    )
}
