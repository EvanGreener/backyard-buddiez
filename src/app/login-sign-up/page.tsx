import Image from 'next/image'
import { LOGIN_EMAIL_ROUTE, SIGN_UP_EMAIL_ROUTE } from '@/lib/routes'
import LinkButton from '@/components/LinkButton'

export default function RootLogin() {
    return (
        <div className="container flex flex-col items-center justify-end space-y-6 ">
            <LinkButton href={SIGN_UP_EMAIL_ROUTE}>
                <span>Sign up with Email/Password</span>
            </LinkButton>
            <LinkButton href={LOGIN_EMAIL_ROUTE}>
                <span>Login with Email/Password</span>
            </LinkButton>
            <LinkButton href="#">
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
            </LinkButton>
            <LinkButton href="#">
                <span>
                    Login with Facebook{' '}
                    <Image
                        className="inline"
                        src={'/2021_Facebook_icon.svg.png'}
                        width={25}
                        height={25}
                        alt="Facebook provider logo"
                    />
                </span>
            </LinkButton>
        </div>
    )
}
