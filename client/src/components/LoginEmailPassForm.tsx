import LoginButton from './LoginButton'

export default function LoginEmailPassForm() {
    return (
        <div className="flex flex-col items-center space-y-6 pb-6 border-b-2 w-full">
            <input type="email" placeholder="Email" />
            <input type="password" placeholder="Password" />
            <LoginButton href={'/home'} provider={''} imagePath={''} />
        </div>
    )
}
