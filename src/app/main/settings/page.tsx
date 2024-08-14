import Button from '@/components/Button'
import Form from '@/components/Form'
import { signOut } from '@/lib/auth'
import HelpModal from '../home/HelpModal'
import ClientSide from '@/components/ClientSide'

export default async function SettingsScreen() {
    return (
        <Form action={signOut}>
            <ClientSide />
            <Button type="submit">Sign out</Button>
            <div className="flex flex-col items-center">
                <HelpModal />
            </div>
        </Form>
    )
}
