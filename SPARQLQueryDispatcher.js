class SPARQLQueryDispatcher {
    constructor( endpoint ) {
        this.endpoint = endpoint;
    }

    query( sparqlQuery ) {
        const fullUrl = this.endpoint + '?query=' + encodeURIComponent( sparqlQuery );
        const headers = { 'Accept': 'application/sparql-results+json' };

        return fetch( fullUrl, { headers } ).then( body => body.json() );
    }
}

const endpointUrl = 'https://query.wikidata.org/sparql';
const sparqlQuery = `#Mons (montagnes), avec coordonnées, ne se trouvant pas sur la terre
SELECT DISTINCT ?item ?name ?coord ?lat ?lon ?globe
{
   ?item wdt:P31 wd:Q429088 ;
         p:P625 [
           psv:P625 [
             wikibase:geoLatitude ?lat ;
             wikibase:geoLongitude ?lon ;
             wikibase:geoGlobe ?globe ;
           ] ;
           ps:P625 ?coord
         ]
  FILTER ( ?globe != wd:Q2 )
  SERVICE wikibase:label {
    bd:serviceParam wikibase:language "en" .
    ?item rdfs:label ?name
   }
}
ORDER BY ASC (?name)`;

const queryDispatcher = new SPARQLQueryDispatcher( endpointUrl );
queryDispatcher.query( sparqlQuery ).then( console.log );
