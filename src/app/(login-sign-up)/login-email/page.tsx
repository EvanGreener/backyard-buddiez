'use client'

import Button from '@/components/Button'
import Form from '@/components/Form'
import InputText from '@/components/InputText'
import { signInEmail } from '@/lib/auth'
import { useState } from 'react'
import { useFormStatus } from 'react-dom'

export default function LoginEmail() {
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
        <Form action={submit}>
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
        </Form>
    )
}
