import { BirdDetailed, BirdBasic } from '@/types/action-types'

export default async function searchBirdsWikidata(searchPattern: string) {
    if (searchPattern.length == 0) {
        return []
    }

    const query = `
    SELECT ?id ?birdLabel (SAMPLE(?name) AS ?commonName) (SAMPLE(?img) AS ?birdImg)
    WHERE {
        ?bird wdt:P31 wd:Q16521 ;
              wdt:P105 wd:Q7432 ;
                wdt:P3444 ?id ;
                wdt:P18 ?img ;
                wdt:P1843 ?name .
	    SERVICE wikibase:label { bd:serviceParam wikibase:language "en" } 
        FILTER(LANG(?name) = "en") .
        FILTER(REGEX(LCASE(?name), "${searchPattern}")) .
    }
    GROUP BY ?id ?birdLabel
    LIMIT 10
    `
    try {
        const resultsJson = await getSparqlQueryResults(query)
        const birds: BirdBasic[] = resultsJson.results.bindings.map(
            (bird: any): BirdBasic => {
                return {
                    speciesId: bird.id.value,
                    name: bird.birdLabel.value,
                    commonName: bird.commonName.value,
                    imgURI: bird.birdImg.value.replace('http', 'https'),
                }
            }
        )
        return birds
    } catch (error) {
        return []
    }
}

export async function getMultipleBirdsInfo(ids: string[]) {
    let idsStr = ''
    ids.forEach((id) => {
        idsStr += `'${id}',`
    })
    idsStr = idsStr.slice(0, -1)
    const query = `
    SELECT ?id ?birdLabel (SAMPLE(?name) AS ?commonName) (SAMPLE(?img) AS ?birdImg) (SAMPLE(?rangeMapImg) AS ?rangeMapImg)
    WHERE {
        ?bird wdt:P31 wd:Q16521 ;
              wdt:P105 wd:Q7432 ;
                wdt:P3444 ?id ;
                wdt:P18 ?img ;
                wdt:P1843 ?name .
        OPTIONAL {?bird wdt:P181 ?rangeMapImg .}
	    SERVICE wikibase:label { bd:serviceParam wikibase:language "en" } 
        FILTER(LANG(?name) = "en") .
        FILTER( ?id IN ( ${idsStr} )) .
    }
    GROUP BY ?id ?birdLabel
    `
    const resultsJson = await getSparqlQueryResults(query)
    const birdInfos: BirdDetailed[] = resultsJson.results.bindings.map(
        (bird: any): BirdDetailed => {
            return {
                speciesId: bird.id.value,
                name: bird.birdLabel.value,
                commonName: bird.commonName.value,
                imgURI: !bird.birdImg.value.includes('https')
                    ? bird.birdImg.value.replace('http', 'https')
                    : bird.birdImg.value,
                rangeMapImg: bird.rangeMapImg
                    ? !bird.rangeMapImg.value.includes('https')
                        ? bird.rangeMapImg.value.replace('http', 'https')
                        : bird.rangeMapImg.value
                    : '',
            }
        }
    )
    return birdInfos
}

async function getSparqlQueryResults(query: string) {
    try {
        const res = await fetch(
            `https://query.wikidata.org/bigdata/namespace/wdq/sparql?query=${query}`,
            {
                headers: {
                    Accept: 'application/sparql-results+json',
                    'User-Agent':
                        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36',
                },
            }
        )
        console.log(res.status, res.statusText)

        let searchResults = await res.json()

        return searchResults
    } catch (error) {
        // console.error(error)
        return []
    }
}
