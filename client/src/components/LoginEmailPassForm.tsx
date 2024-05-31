import InputText from './InputText'
import LoginButton from './LoginButton'

export default function LoginEmailPassForm() {
    return (
        <div className="flex flex-col items-center space-y-6 pb-6  w-full">
            <InputText type="email" placeholder="Email" />
            <InputText type="password" placeholder="password" />

            <LoginButton href={'/home'} />
        </div>
    )
}
