municipalitycolumnId = 0

function addMunicipality(){
    d3.csv("./data/Covid_with_Bevolkingsontwikkeling_Index.csv").then(function(data) {
        data = data.sort(d3.ascending);

        localColumn = d3.select(".municipalitycontainer")
            .append("div").attr("class", "column municipalitycolumn-" + municipalitycolumnId);

        localHeader = localColumn.append("div").attr("class", "column-header municipalitycolumn-" + municipalitycolumnId);

        localHeader.append("hr");
        localHeader.append("br");
        localHeader.append("p").text("In gemeente");
        municipalityselect = localHeader.append("select").data(data).attr("placeholder", "gemeente").attr("class", "column-municipalityselect municipalitycolumn-" + municipalitycolumnId).attr("data", municipalitycolumnId)
            .on('change', function() {
                localmunicipalitycolumnId = d3.select(this).attr('data')
                municipality = d3.select(this).property('value')
                addDate(localmunicipalitycolumnId, municipality);});

        localHeader.append("br");

        data.forEach(municipality => {
            municipalityselect.append('option')
                .attr('value', function(d) {return municipality['Municipality_name'];})
                .text(function(d) {return municipality['Municipality_name'];});
        });

        municipalitycolumnId++
    });
}

function addDate(municipalitycolumnId, municipality){
    d3.csv("./data/Covid_with_Bevolkingsontwikkeling.csv").then(function(data) {
        filteredData = filterDataonMunicipality(data, municipality)
        d3Element = d3.select(".municipalitycolumn-" + municipalitycolumnId)

        d3Element.selectAll(".dateselectdiv").remove()

        sortedData = filteredData.slice().sort((a) => d3.ascending(a['Period']))

        dateselectdiv = d3Element.append("div").attr("class","dateselectdiv")
        dateselectdiv.append("p").text("vanaf");
        dateselect = dateselectdiv.append("select").attr("placeholder", "maand").attr("municipality", municipality).attr("municipalitycolumn", municipalitycolumnId).on('change', function() {
            date = d3.select(this).property('value')
            municipality = d3.select(this).attr('municipality')
            municipalitycolumnId = d3.select(this).attr('municipalitycolumn')
            d3ElementClass = ".municipalitycolumn-" + municipalitycolumnId
            d3.select(d3ElementClass).selectAll('svg').remove()
            generateResults(d3ElementClass, municipality, date, municipalitycolumnId)});

        sortedData.forEach(row => {
            dateselect.append('option')
                .attr('value', function(d) {return row['Period'];})
                .text(function(d) {return row['Period'];});
        });
    })
}
