'use client'

import { signUpEmail } from '@/lib/auth'
import { useFormStatus } from 'react-dom'
import { useState } from 'react'
import Form from '@/components/Form'
import Button from '@/components/Button'
import InputText from '@/components/InputText'
import SignUpEmailPassForm from '@/components/SignUpEmailPassForm'

export default function SignUpEmail() {
    const { pending } = useFormStatus()
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    const submit = (formData: FormData) => {
        const email = formData.get('email')?.toString()
        const password = formData.get('password')?.toString()
        const password2 = formData.get('password2')?.toString()

        if (email && password) {
            if (password == password2) {
                signUpEmail(email, password)
            } else {
                setErrorMessage("Passwords don't match")
            }
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
            <InputText
                name="password2"
                type="password"
                placeholder="confirm password"
                required
            />
            <Button type="submit" disabled={pending}>
                Sign Up!
            </Button>
            {errorMessage && <p> {errorMessage} </p>}
        </Form>
    )
}
