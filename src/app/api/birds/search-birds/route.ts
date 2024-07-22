import searchBirdsWikidata from '@/lib/wikidata'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const birdInput = searchParams.get('bird_input')
    const birds = await searchBirdsWikidata(birdInput!)
    return Response.json(birds, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
    })
}
