import Image from 'next/image'
import { LOGIN_EMAIL_ROUTE, SIGN_UP_EMAIL_ROUTE } from '@/lib/routes'
import LinkButton from '@/components/LinkButton'
import Button from '@/components/Button'
import Form from '@/components/Form'
import { signInGoogle } from '@/lib/auth'

export default function RootLogin() {
    return (
        <div className="container flex flex-col items-center justify-end space-y-6 ">
            <LinkButton href={SIGN_UP_EMAIL_ROUTE}>
                <span>Sign up with Email/Password</span>
            </LinkButton>
            <LinkButton href={LOGIN_EMAIL_ROUTE}>
                <span>Login with Email/Password</span>
            </LinkButton>
            <Form action={signInGoogle}>
                <Button type="submit">
                    <span>
                        Login with Google{' '}
                        <Image
                            className="inline"
                            src={'/Google__G__logo.svg.png'}
                            width={25}
                            height={25}
                            alt="Google provider logo"
                        />
                    </span>
                </Button>
            </Form>
        </div>
    )
}
