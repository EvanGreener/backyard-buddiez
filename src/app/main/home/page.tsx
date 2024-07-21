import LoadingGIF from '@/components/LoadingGIF'
import { getUserAuth } from '@/lib/auth'
import { getUser } from '@/lib/db/queries'
import { CREATE_PROFILE_ROUTE } from '@/lib/routes'
import { redirect } from 'next/navigation'

export default async function HomeScreen() {
    const userAuth = await getUserAuth()
    const user = await getUser(userAuth.id)

    const displayNameNotNull = user && user.display_name

    if (!displayNameNotNull) {
        redirect(CREATE_PROFILE_ROUTE)
    }

    return displayNameNotNull ? (
        <div className="flex flex-col items-center">
            <div className="text-lg">
                Welcome <span className="italic">{user.display_name}</span>
            </div>
        </div>
    ) : (
        <LoadingGIF />
    )
}
