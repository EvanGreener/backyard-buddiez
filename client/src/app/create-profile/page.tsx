'use client'

import Button from '@/components/Button'
import Form from '@/components/Form'
import InputLabel from '@/components/InputLabel'
import InputText from '@/components/InputText'
import { AuthContext } from '@/contexts/AuthContext'
import { createProfile } from '@/lib/firestore-services'
import { useContext, useState } from 'react'
import { useFormStatus } from 'react-dom'

export default function CreateProfilePage() {
    const { currentUserAuth, setCurrentUserData } = useContext(AuthContext)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const { pending } = useFormStatus()

    const submit = (formData: FormData) => {
        const displayName = formData.get('displayName')?.toString()

        if (displayName && setCurrentUserData) {
            createProfile(
                currentUserAuth,
                displayName,
                setCurrentUserData
            ).then(() => {
                console.log('created profile')
            })
        } else {
            setErrorMessage('Display name required')
        }
    }

    return (
        <Form action={submit}>
            <div className="space-x-2">
                <InputLabel inputId={'displayName'} text={'Display name:'} />
                <InputText
                    id="displayName"
                    placeholder={"ex: 'CombativeGuppy42'"}
                    name={'displayName'}
                    required
                />
            </div>
            <div className="flex flex-col items-center space-y-2">
                <p className="">Profile pic {'(WIP)'} </p>
                <input type="file" disabled />
            </div>

            <Button type="submit" disabled={pending}>
                Submit
            </Button>
            {errorMessage && <p> {errorMessage} </p>}
        </Form>
    )
}
