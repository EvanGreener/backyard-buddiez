import { getUserAuth } from '@/lib/auth'
import { addNewSightingAndUpdateDCProgress } from '@/lib/db/inserts'
import { getUser } from '@/lib/db/queries'
import { User } from '@/types/db-types'

export async function POST(request: Request) {
    const body = await request.json()

    const {
        dcIDs,
        speciesId,
        lat,
        long,
    }: {
        dcIDs: number[]
        speciesId: string
        lat: number | undefined
        long: number | undefined
    } = body

    const userAuth = await getUserAuth()
    const user: User | undefined = await getUser(userAuth.id)
    if (user) {
        const { newUDCProgress, newSighting } =
            await addNewSightingAndUpdateDCProgress(
                user,
                dcIDs,
                speciesId,
                lat,
                long
            )

        return Response.json({ newSighting, newUDCProgress }, { status: 200 })
    }
}
