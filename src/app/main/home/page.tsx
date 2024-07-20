import { getUser } from '@/lib/auth'

export default async function HomeScreen() {
    const user = await getUser()

    return <div>Welcome {user.email}</div>
}
