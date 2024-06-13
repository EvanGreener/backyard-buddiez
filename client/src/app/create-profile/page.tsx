'use client'

import Button from '@/components/Button'
import Form from '@/components/Form'
import InputLabel from '@/components/InputLabel'
import InputText from '@/components/InputText'
import { AuthContext } from '@/contexts/AuthContext'
import { createProfile } from '@/lib/firestore-services'
import { HOME_ROUTE } from '@/lib/routes'
import { useRouter } from 'next/navigation'
import { useContext, useState } from 'react'

export default function CreateProfilePage() {
    const currentUser = useContext(AuthContext)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const router = useRouter()

    const submit = (formData: FormData) => {
        const displayName = formData.get('displayName')?.toString()

        if (displayName) {
            createProfile(currentUser, displayName).then(() => {
                router.push(HOME_ROUTE)
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

            <Button type="submit">Submit</Button>
            {errorMessage && <p> {errorMessage} </p>}
        </Form>
    )
}
