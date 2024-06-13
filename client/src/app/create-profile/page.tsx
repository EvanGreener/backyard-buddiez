'use client'

import Button from '@/components/Button'
import Form from '@/components/Form'
import InputLabel from '@/components/InputLabel'
import InputText from '@/components/InputText'

export default function CreateProfilePage() {
    return (
        <Form action={(formdata) => {}}>
            <div className="space-x-2">
                <InputLabel inputId={'displayName'} text={'Display name:'} />
                <InputText
                    id="displayName"
                    placeholder={"ex: 'CombativeGuppy42'"}
                    name={'displayName'}
                />
            </div>
            <div className="flex flex-col items-center space-y-2">
                <p className="">Profile pic {'(WIP)'} </p>
                <input type="file" disabled />
            </div>

            <Button type="submit">Submit</Button>
        </Form>
    )
}
