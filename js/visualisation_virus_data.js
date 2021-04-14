function filterDataonMunicipalityDate(data, municipality, date){
    filteredData = data.filter(function(row) {
        return row['Municipality_name'].match(municipality) && (date <= row['Period'])
    });
    return filteredData
}

// function filterDataonDate(data){
//     filteredData = data.filter(function(row) {
//         date = row['Period']
//         dateSliced = date.slice(0, -3)
//         return dateSliced
        
//     });
//     return filteredData
//   }

// Generate proteins:
function generateMembrane(pathWidth = 10, pathColor = "#a7def0"){
    return membrane = {
        type: "membrane",
        "pathWidth": pathWidth,
        "pathColor": pathColor,
      }
}

function generateSpike(pathWidth = 30, pathColor = "#a7def0", circleWidth = 10, circleHeight = 10, circleColor = "#a7def0"){
    return spike = {
        "type": "spike",
        "pathWidth": pathWidth,
        "pathColor": pathColor,
        "circleWidth": circleWidth,
        "circleHeight": circleHeight,
        "circleColor": circleColor,
      }
}

function generateEnvelope(pathWidth = 10, pathColor = "#a7def0"){
    return membrane = {
        "type": "envelope",
        "pathWidth": pathWidth,
        "pathColor": pathColor,
    }
}

function mapData(data) { 
    return mappeddata
}

function generateResults(d3ElementClass, city, date){
  d3.csv("data/Covid_with_Bevolkingsontwikkeling.csv").then(function(data) {
    filteredData = filterDataonMunicipalityDate(data, city, date)
    b = 1

    // Kleuren: tol-rainbow: Tol's Rainbow palette (cbf)
    cirkelKleur = "#519cb8"
    spikeKleur = "#d92120"

    array.forEach(function(arrayDate) {
        if (Date.parse(arrayDate) >= Date.parse(date)) {
            classname = d3ElementClass + "-visualisation-" + b
            index = valueInObjectExists(filteredData, 'Period', arrayDate)

            if (!(index === undefined)) {
                proteinmap = []

                row = filteredData[index]

                cirkelGrootte = (row['population'] / row['Hospitalisations']) / 2
                aantalSpikes = Math.round((row['population'] / row['Deaths']) / 10)

                for (i = 0; i < aantalSpikes; i++) { 
                    proteinmap.push(generateSpike(10, spikeKleur, 10, 10, spikeKleur));
                }

                rnamap = [
                    {
                    offset: "30%",
                    color: "biege",
                    },
                ];

                drawVisualisationVirus(d3ElementClass, classname, row['Municipality_name'], row['Period'], proteinmap, rnamap, cirkelGrootte, cirkelKleur)

            } else {
                drawEmpty(d3ElementClass, classname, 'Geen data', arrayDate)
            }

            b++;
        }
            
        })
    })
}

function valueInObjectExists(array, column, value) {
    return array.findIndex(x => x[column] === value)
}

//   function valueInObjectExists(array, column, value) {
//     return array.some(function(el) {
//       return ([el[column] === value, el]);
//     }); 
//   }