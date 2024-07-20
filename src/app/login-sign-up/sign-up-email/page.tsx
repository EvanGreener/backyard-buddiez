import Button from '@/components/Button'
import Form from '@/components/Form'
import InputText from '@/components/InputText'
import { signup } from '@/lib/auth'

export default function LoginPage() {
    return (
        <Form action={signup}>
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
            <InputText
                id="password2"
                name="password2"
                type="password"
                placeholder="confirm password"
                required
            />
            <Button type="submit">Sign up</Button>
        </Form>
    )
}
