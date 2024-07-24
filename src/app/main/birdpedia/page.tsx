import { getUserAuth } from '@/lib/auth'
import { getAllUserSightings, getUser } from '@/lib/db/queries'
import { LOGIN_SIGN_UP_ROUTE } from '@/lib/routes'
import { getMultipleBirdDetails as getMultipleBirdInfos } from '@/lib/wikidata'
import Birdpedia from './Birdpedia'

export default async function BirdpediaScreen() {
    const userAuth = await getUserAuth()
    const user = await getUser(userAuth.id)

    if (user) {
        const sightings = await getAllUserSightings(user)

        // Create unique array of ids
        const ids = [
            ...new Set(
                sightings.map((sighting) => {
                    return sighting.species_id
                })
            ),
        ]

        // Get bird data from wikidata
        const birdDetails = await getMultipleBirdInfos(ids)
        const birdDetailsSorted = birdDetails.sort((a, b) => {
            return a.commonName.localeCompare(b.commonName)
        })

        return (
            <Birdpedia
                birdDetailsSorted={birdDetailsSorted}
                sightings={sightings}
                user={user}
            />
        )
    }
}
