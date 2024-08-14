'use client'

import Button from '@/components/Button'
import Form from '@/components/Form'
import InputLabel from '@/components/InputLabel'
import InputText from '@/components/InputText'
import {
    CREATE_PROFILE_API_ROUTE,
    GET_CURRENT_USER_ROUTE,
    HOME_ROUTE,
} from '@/lib/routes'
import { Color } from '@/theme/colors'
import { User } from '@/types/db-types'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { useFormStatus } from 'react-dom'

export default function CreateProfileScreen() {
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const { pending } = useFormStatus()
    const inputRef = useRef<HTMLInputElement>(null)
    const router = useRouter()

    useEffect(() => {
        async function checkProfileCreated() {
            const res = await fetch(GET_CURRENT_USER_ROUTE)
            const user: User = await res.json()
            console.log(user.profile_created)
            if (user.profile_created) {
                router.push(HOME_ROUTE)
            }
        }
        checkProfileCreated()
    }, [router])

    const submit = async (formData: FormData) => {
        const displayName = formData.get('displayName')?.toString()

        if (displayName) {
            const response = await fetch(
                CREATE_PROFILE_API_ROUTE + `?display_name=${displayName}`
            )
            if (response.status === 200) {
                router.push(HOME_ROUTE)
            } else if (response.status === 400) {
                setErrorMessage('Something went wrong')
            }
        } else {
            setErrorMessage('Display name required')
        }
    }

    return (
        <div className="p-4">
            <Form action={submit}>
                <p className={Color.TEXT_PRIMARY + ' ' + 'text-lg font-bold'}>
                    {"Let's Create Your Profile"}
                </p>
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
