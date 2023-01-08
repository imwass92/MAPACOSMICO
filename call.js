$(document).ready(function(){
    $(".ajout").prop("disabled",true); 
    $('#supp').click(function() {
        $(".ajout").prop("disabled",false);
    });
    $('#boutonVilles').click(function() {
        $(this).prop("disabled",true); 
    });
    $('#boutonMons').click(function() {
        $(this).prop("disabled",true); 
    });
 });


function makeSPARQLQuery1( endpointUrl, sparqlQuery, doneCallback ) {
	var settings = {
		headers: { Accept: 'application/sparql-results+json' },
		data: { query: sparqlQuery }
	};
	return $.ajax( endpointUrl, settings ).then( doneCallback );
}

var endpointUrl1 = 'https://query.wikidata.org/sparql',
	sparqlQuery1 = "#Mons (montagnes), avec coordonnées, ne se trouvant pas sur la terre\n" +
        "SELECT DISTINCT ?item ?name ?coord ?lat ?lon ?globe ?image WHERE {\n" +
        "  ?item wdt:P31 wd:Q429088;\n" +
        "    p:P625 _:b1.\n" +
        "  _:b1 psv:P625 _:b0.\n" +
        "  _:b0 wikibase:geoLatitude ?lat;\n" +
        "    wikibase:geoLongitude ?lon;\n" +
        "    wikibase:geoGlobe ?globe.\n" +
        "  _:b1 ps:P625 ?coord.\n" +
        "  FILTER(?globe != wd:Q2)\n" +
        "  SERVICE wikibase:label {\n" +
        "    bd:serviceParam wikibase:language \"en\".\n" +
        "    ?item rdfs:label ?name.\n" +
        "  }\n" +
        "  OPTIONAL { ?item wdt:P18 ?image. }\n" +
        "}\n" +
        "ORDER BY (?name)";
        function restartMont(){
                            console.log( "yep");

            makeSPARQLQuery1( endpointUrl1, sparqlQuery1, function( data ) {
                console.log( data);
                debut(data);


            }
            );
        }


function makeSPARQLQuery( endpointUrl, sparqlQuery, doneCallback ) {
    var settings = {
        headers: { Accept: 'application/sparql-results+json' },
        data: { query: sparqlQuery }
    };
    return $.ajax( endpointUrl, settings ).then( doneCallback );
}

var endpointUrl = 'https://query.wikidata.org/sparql',
    sparqlQuery = "#Largest cities per country\n" +
        "SELECT DISTINCT ?city ?cityLabel ?population ?country ?countryLabel ?loc ?image ?site_officiel WHERE {\n" +
        "  {\n" +
        "    SELECT (MAX(?population_) AS ?population) ?country WHERE {\n" +
        "      ?city (wdt:P31/(wdt:P279*)) wd:Q515;\n" +
        "        wdt:P1082 ?population_;\n" +
        "        wdt:P17 ?country.\n" +
        "    }\n" +
        "    GROUP BY ?country\n" +
        "    ORDER BY DESC (?population)\n" +
        "  }\n" +
        "  ?city (wdt:P31/(wdt:P279*)) wd:Q515;\n" +
        "    wdt:P1082 ?population;\n" +
        "    wdt:P17 ?country;\n" +
        "    wdt:P625 ?loc.\n" +
        "  SERVICE wikibase:label { bd:serviceParam wikibase:language \"en\". }\n" +
        "  OPTIONAL { ?city wdt:P18 ?image. }\n" +
        "  OPTIONAL { ?city wdt:P856 ?site_officiel. }\n" +
        "}\n" +
        "ORDER BY DESC (?population)";

        function restartCity(){
            makeSPARQLQuery( endpointUrl, sparqlQuery, function( data ) {
                console.log( data );
                debut2(data);
                }
            );
        }



function debut(data){
    var montagne = L.icon({
        iconUrl: './pictures/montagne.png',
        iconSize:    [22, 22],
        iconAnchor:   [22, 22],
        popupAnchor:  [-3, -3]
    });
    var tab = [];
    for (let i = 0; i < data.results.bindings.length ; i++){
        if(data["results"]["bindings"][i]["image"] != undefined){
            if(!tab.includes(data["results"]["bindings"][i]["name"]["value"])){
                tab. push(data["results"]["bindings"][i]["name"]["value"]);
                var lon = data["results"]["bindings"][i]["lon"]["value"];
                var lat = data["results"]["bindings"][i]["lat"]["value"];

                var marker = L.marker([lat, lon], {icon: montagne}).addTo(macarte);
                marker.bindPopup("<img src='"+data["results"]["bindings"][i]["image"]["value"]+"' style='margin-left:auto; margin-right:auto; display:block;' width='120px' height='80px'><p style='text-align:center; font-weight:bold; text-transform: capitalize;'>"+ data["results"]["bindings"][i]["name"]["value"] +"</p>");


                markerClusters.addLayer(marker);
                markerGroup.addLayer(marker);
            }
        }
    }


}

 function clearMarker(){
        markerClusters.clearLayers();
        markerGroup.clearLayers();
    }

function debut2(data){
    var tab = [];
    for (let i = 0; i < data.results.bindings.length ; i++)
    {
        if(data["results"]["bindings"][i]["image"] != undefined){
            if(!tab.includes(data["results"]["bindings"][i]["cityLabel"]["value"])){
                tab.push(data["results"]["bindings"][i]["cityLabel"]["value"]);
                    var ville = L.icon({
                        iconUrl: "./pictures/ville.png",
                        iconSize:    [22, 22],
                    iconAnchor:   [22, 22],
                    popupAnchor:  [-3, -3]
                    });

                    var point = data["results"]["bindings"][i]["loc"]["value"];

                    var start = point.indexOf('(')+1;
                    var middle1 = point.indexOf(' ')-1;
                    var middle2 = point.indexOf(' ')+1;
                    var end = point.indexOf(')');
                    var lat = point.substring(middle2, end);
                    var lon = point.substring(start, middle1);
                    
                    function formatMillier(nombre){
                      nombre += '';
                      var sep = ' ';
                      var reg = /(\d+)(\d{3})/;
                      while( reg.test( nombre)) {
                        nombre = nombre.replace( reg, '$1' +sep +'$2');
                      }
                      return nombre;
                    }

                    var markerPoint = L.marker([lat, lon], {icon: ville}).addTo(macarte);
                    if(data["results"]["bindings"][i]["site_officiel"] != undefined){
                        var site = "<p style='text-align:center; font-weight:bold;'>Site : <a href="+ data["results"]["bindings"][i]["site_officiel"]["value"] +">"+data["results"]["bindings"][i]["site_officiel"]["value"]+"</a></p>";
                    }
                    markerPoint.bindPopup("<img src='"+data["results"]["bindings"][i]["image"]["value"]+"' style='margin-left:auto; margin-right:auto; display:block;' width='120px' height='80px'><p style='text-align:center; font-weight:bold; text-transform: capitalize;'>"+data["results"]["bindings"][i]["cityLabel"]["value"]+"<p style='text-align:center; font-weight:bold; text-transform: capitalize;'>Population : "+formatMillier(data["results"]["bindings"][i]["population"]["value"])+"</p>"+site+"<p style='text-align:center; font-weight:bold; text-transform: capitalize;'>Pays : "+data["results"]["bindings"][i]["countryLabel"]["value"]);

                    markerClusters.addLayer(markerPoint);
                    markerGroup.addLayer(markerPoint);

                     macarte.addLayer(markerClusters);
                    macarte.addLayer(markerGroup);
            }
        }


    }
}
