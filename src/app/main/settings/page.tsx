import Button from '@/components/Button'
import Form from '@/components/Form'
import { signOut } from '@/lib/auth'

export default async function SettingsScreen() {
    return (
        <Form action={signOut}>
            <Button type="submit">Sign out</Button>
        </Form>
    )
}
