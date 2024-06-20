import { BirdInfo, SearchResult } from '@/types/action-types'

export default async function searchBirds(searchPattern: string) {
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
    const resultsJson = await getSparqlQueryResults(query)
    const birds: SearchResult[] = resultsJson.results.bindings.map(
        (bird: any): SearchResult => {
            return {
                id: bird.id.value,
                name: bird.birdLabel.value,
                commonName: bird.commonName.value,
                imgURI: bird.birdImg.value.replace('http', 'https'),
            }
        }
    )
    return birds
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
    console.log(query)
    const birdInfos: BirdInfo[] = resultsJson.results.bindings.map(
        (bird: any): BirdInfo => {
            return {
                id: bird.id.value,
                name: bird.birdLabel.value,
                commonName: bird.commonName.value,
                imgURI: bird.birdImg.value.replace('http', 'https'),
                rangeMapImg: bird.rangeMapImg
                    ? bird.rangeMapImg.value
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
                method: 'GET',
                headers: {
                    Accept: ' application/sparql-results+json',
                },
            }
        )

        const searchResults = await res.json()

        return searchResults
    } catch (error) {
        return error
    }
}
