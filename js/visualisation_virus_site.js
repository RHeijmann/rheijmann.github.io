var array = []

function addHeader(){
    section = d3.select("#virus-visualisation")
    container = section.append("div").classed("container", true).classed("py-4", true)

    container.append("h2").classed("section-title", true).text("COVID-19 als visualisatie")
    container.append("div").classed("bottom-line", true)
    container.append("p").classed("section-lead", true).text("Kies een maand, en vergelijk vanaf die maand de gekozen gemeenten met elkaar.")
    container.append("p").text("Zo kan de visualisatie gelezen worden:")
    container.append("img").attr("src","img/legenda.png").attr("style","height: auto; width: 400px;")

    d3.csv("./data/Covid_with_Bevolkingsontwikkeling.csv").then(function(data) {

        filteredData = data.map(x => x['Period'])
        sortedDate = new Set(filteredData)
        array = Array.from(sortedDate);
        array.shift();
        array.pop();
        array.pop();

        container.append("p").text("Ik wil gegevens tonen vanaf:");
        dateselectdiv = container.append("div").attr("class","dateselectdiv")

        dateselect = dateselectdiv.append("select").attr("placeholder", "maand");        

        sortedDate.forEach(row => {
            dateselect.append('option')
                .attr('value', function(d) {return row;})
                .text(function(d) {return row;});
        });

        container.append("a").classed("btn-dark", true).attr("style", "margin: 30px;").text("Voeg een gemeente toe").attr("href", "javascript:addMunicipality(array);")
        container.append("div").classed("container-column", true).classed("municipalitycontainer", true).attr("style", "align-content: stretch")
    })

}

municipalitycolumnId = 0

function addMunicipality(){
    if (municipalitycolumnId < 4) {
    d3.csv("./data/Covid_with_Bevolkingsontwikkeling_Index.csv").then(function(data) {
        data = data.sort(d3.ascending);

        columnClass = "municipalitycolumn-" + municipalitycolumnId
        d3ElementClass = "."+columnClass

        localColumn = d3.select(".municipalitycontainer")
            .append("div").attr("class", "column municipalitycolumn-" + municipalitycolumnId);

        localHeader = localColumn.append("div").attr("class", "column-header " + columnClass);

        localHeader.append("hr");
        localHeader.append("br");
        localHeader.append("p").text("Gemeente");

        municipalityselect = localHeader.append("select").data(data).attr("placeholder", "gemeente").attr("class", "column-municipalityselect " + columnClass).attr("data", municipalitycolumnId).attr("style", "margin-bottom: 30px;")
            .on('change', function() {
                localmunicipalitycolumnId = d3.select(this).attr('data')
                municipality = d3.select(this).property('value')
                date = d3.select(".dateselectdiv option:checked").text();
                d3.select('.municipalitycolumn-' + localmunicipalitycolumnId).selectAll('svg').remove();
                generateResults(d3ElementClass, municipality, date, municipalitycolumnId)});

        localHeader.append("br");

        data.forEach(municipality => {
            municipalityselect.append('option')
                .attr('value', function(d) {return municipality['Municipality_name'];})
                .text(function(d) {return municipality['Municipality_name'];});
        });

        localHeader.append("hr");
        localHeader.append("br");

        municipalitycolumnId++
    });
}
}

addHeader();