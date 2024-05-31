import Link from 'next/link'
import Button from './Button'
import InputText from './InputText'

export default function SignUpEmailPassForm() {
    return (
        <div className="flex flex-col items-center space-y-6 pb-6  w-full">
            <InputText type="text" placeholder="First Name" />
            <InputText type="text" placeholder="Last Name" />
            <InputText type="email" placeholder="Email" />
            <InputText type="password" placeholder="password" />
            <Button>
                <Link href={'/home'}>Sign Up!</Link>
            </Button>
        </div>
    )
}
