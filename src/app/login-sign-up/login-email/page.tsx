import Button from '@/components/Button'
import Form from '@/components/Form'
import InputText from '@/components/InputText'
import { login } from '@/lib/auth'

export default function LoginPage() {
    return (
        <Form action={login}>
            <InputText
                id="email"
                name="email"
                type="email"
                placeholder="Email"
                required
            />
            <InputText
                id="password"
                name="password"
                type="password"
                placeholder="password"
                required
            />
            <Button type="submit">Login</Button>
        </Form>
    )
}
