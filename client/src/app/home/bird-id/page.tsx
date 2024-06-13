import { ebirdApiKey } from '@/config/config'

export default async function BirdID() {
    const baseURL = 'https://api.ebird.org/v2/product/spplist/{{regionCode}}'

    const res = await fetch(baseURL, {
        method: 'GET',
        headers: {
            'X-eBirdApiToken': ebirdApiKey,
        },
    })

    return <div>BirdID</div>
}
