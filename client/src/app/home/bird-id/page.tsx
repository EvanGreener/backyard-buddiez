'use client'
import Button from '@/components/Button'
import Form from '@/components/Form'
import InputLabel from '@/components/InputLabel'
import InputText from '@/components/InputText'
import { ChangeEventHandler, useState } from 'react'

export default function BirdID() {
    // const baseURL = 'https://api.ebird.org/v2/product/spplist/{{regionCode}}'

    // const res = await fetch(baseURL, {
    //     method: 'GET',
    //     headers: {
    //         'X-eBirdApiToken': ebirdApiKey,
    //     },
    // })

    const [birdInput, setBirdInput] = useState<string>('')
    const [inputValid, setInputValid] = useState<boolean>(false)

    const addBirdToBirdpedia = () => {}
    const handleOnChange: ChangeEventHandler<HTMLInputElement> = (event) => {}

    return (
        <div className="flex flex-col items-center space-y-6 ">
            <div className="space-x-2">
                <InputLabel inputId="bird" text="Bird to id: " />
                <InputText
                    id="bird"
                    placeholder={'ex: bluejay'}
                    name={'bird'}
                    onChange={handleOnChange}
                />
            </div>
            <Button type="button" onClickHandler={addBirdToBirdpedia}>
                Add bird to Birdpedia
            </Button>
        </div>
    )
}
