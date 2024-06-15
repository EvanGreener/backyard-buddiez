export default async function searchBirds(searchPattern: string) {
    const query = `
    SELECT ?id (SAMPLE(?name) as ?birdName) (SAMPLE(?img) AS ?birdImg)
    WHERE {
        ?bird wdt:P31 wd:Q16521 ;
                wdt:P3444 ?id ;
                wdt:P18 ?img ;
                wdt:P1843 ?name .
        FILTER(LANG(?name) = "en") .
        FILTER(REGEX(LCASE(?name), "${searchPattern}")) 
    }
    GROUP BY ?id
    ORDER BY ?birdName
    LIMIT 10
    `
    return await getSparqlQueryResults(query)
}

export async function getAllbirds(pattern: string) {
    const query = `
    SELECT ?id (SAMPLE(?name) as ?birdName) (SAMPLE(?img) AS ?birdImg)
    WHERE {
        ?bird wdt:P31 wd:Q16521 ;
                wdt:P3444 ?id ;
                wdt:P18 ?img ;
                wdt:P1843 ?name .
        FILTER(LANG(?name) = "en")
    }
    GROUP BY ?id
    ORDER BY ?birdName
    `

    return await getSparqlQueryResults(query)
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
