var proteinTypes = [];
var proteinTypesStats = [];
proteinTypesStats.max = 0;
proteinTypesStats.min = 0;

const move = 50;

//Helper functions
const getRnaPoint = () => {
  const points = [
    { x: 40, y: 100 },
    { x: 90, y: 100 },
    { x: 170, y: 100 },
  ].map((d) => ({
    x: d.x + move,
    y: d.y + move,
  }));
  return calculatePoints(points, 7, 12);
};

const naturalLine = d3
  .line()
  .curve(d3.curveNatural)
  .x((d) => d.x)
  .y((d) => d.y);

function drawCircle(svg, classname, size, strokeWidth, fill, stroke) {
  svg
    .append("circle")
    .attr("r", size)
    .attr("cx", 100 + move)
    .attr("cy", 100 + move)
    .attr("fill", fill)
    .attr("stroke", stroke)
    .attr("stroke-width", strokeWidth)
    .attr("class", classname + "virus-circle");
}

function generateGradient(svg, input) {
  defs = svg
    .append("defs")
    .append("linearGradient")
    .attr("id", "gradient")
    .attr("x1", "0%")
    .attr("y1", "100%")
    .attr("x2", "100%")
    .attr("y2", "100%");

  function addToGradient(item, index) {
    defs
      .append("stop")
      .attr("offset", item["offset"])
      .attr("stop-color", item["color"]);
  }
  input.forEach(addToGradient);
}

function drawRnaOutline(svg, classname, strokeWidth) {
  svg
    .append("path")
    .datum(getRnaPoint())
    .attr("d", naturalLine)
    .attr("stroke", "url(#gradient)")
    .attr("stroke-width", strokeWidth)
    .attr("opacity", ".6")
    .attr("fill", "none")
    .attr("class", classname + " virus-rna virus-rna-outline");
}

function drawRnaInner(svg, classname, stroke) {
  svg
    .append("path")
    .datum(getRnaPoint())
    .attr("d", naturalLine)
    .attr("stroke", stroke)
    .attr("fill", "none")
    .attr("class", classname + " virus-rna virus-rna-inner");
    
}

function drawRna(svg, classname, rnamap, outlineWidth, innerStroke) {
  generateGradient(svg, rnamap);
  drawRnaOutline(svg, classname, outlineWidth);
  drawRnaInner(svg, classname, innerStroke);
}

function drawEnvelope(svg, classname, circleSize, circleStrokeWidth, startAngle, width, color) {
  newWidth = circleSize + circleStrokeWidth + width + 5;
  svg
    .append("path")
    .attr(
      "d",
      d3
        .arc()
        .innerRadius(circleSize - circleStrokeWidth / 2)
        .outerRadius(newWidth)
        .startAngle(startAngle)
        .endAngle(startAngle + 0.04)
    )
    .attr("transform", `translate(${100 + +move},${100 + +move})`)
    .attr("fill", color)
    .attr("class", classname + " virus-protein virus-envelope");
}

function drawMembrane(svg, classname, circleSize, circleStrokeWidth, startAngle, width, color) {
  newWidth = circleSize + circleStrokeWidth + width + 5;
  svg
    .append("path")
    .attr(
      "d",
      d3
        .arc()
        .innerRadius(circleSize - circleStrokeWidth / 2)
        .outerRadius(newWidth)
        .startAngle(startAngle)
        .endAngle(startAngle + 0.09)
    )
    .attr("transform", `translate(${100 + +move},${100 + +move})`)
    .attr("fill", color)
    .attr("class", classname + " virus-protein virus-membrane");
}

function drawSpike(
  svg,
  classname,
  circleSize,
  circleStrokeWidth,
  startAngle,
  pathWidth,
  pathColor,
  circleWidth,
  circleHeight,
  circleColor
) {
  newWidth = circleSize + circleStrokeWidth + pathWidth + 5;
  svg
    .append("path")
    .attr(
      "d",
      d3
        .arc()
        .innerRadius(circleSize + circleStrokeWidth / 2)
        .outerRadius(newWidth)
        .startAngle(startAngle)
        .endAngle(startAngle + 0.1)
    )
    .attr("transform", `translate(${100 + move},${100 + +move})`)
    .attr("fill", pathColor)
    .attr("class", classname + " virus-protein virus-spike");

  convertedCircleWidth = circleWidth / 100;
  svg
    .append("path")
    .attr(
      "d",
      d3
        .arc()
        .innerRadius(newWidth - circleHeight)
        .outerRadius(newWidth)
        .startAngle(startAngle - convertedCircleWidth)
        .endAngle(startAngle + (convertedCircleWidth + 0.1))
    )
    .attr("transform", `translate(${100 + move},${100 + move})`)
    .attr("fill", circleColor)
    .attr("class", classname + " virus-protein virus-spike-circle");
}

function drawProtein(svg, classname, circlesize, strokeWidth, input) {
  startAngle = 2.0 / input.length;

  function randomize(a, b) {
    return Math.random() - 0.5;
  }

  function countProteinTypes(item, index) {
    if (!(item["type"] in proteinTypes)) {
      type = item["type"];
      proteinTypes[type] = { amount: 1 };
    } else {
      proteinTypes[item["type"]]["amount"] =
        proteinTypes[item["type"]]["amount"] + 1;
    }
  }

  function addToVisualisation(item, index) {
    switch (item["type"]) {
      case "spike":
        angle = startAngle * index * Math.PI;
        drawSpike(
          svg,
          classname,
          circlesize,
          strokeWidth,
          angle,
          item["pathWidth"],
          item["pathColor"],
          item["circleWidth"],
          item["circleHeight"],
          item["circleColor"]
        );
        break;

      case "envelope":
        angle = startAngle * index * Math.PI;
        drawEnvelope(
          svg,
          classname,
          circlesize,
          strokeWidth,
          angle,
          item["pathWidth"],
          item["pathColor"]
        );
        break;

      case "membrane":
        angle = startAngle * index * Math.PI;
        drawMembrane(
          svg,
          classname,
          circlesize,
          strokeWidth,
          angle,
          item["pathWidth"],
          item["pathColor"]
        );
        break;
    }
  }

  input.forEach(addToVisualisation);
}

function drawText(svg, title, date){
  svg.append("text").attr("x",6).attr("y",30).attr("fill","black").text(title)
  svg.append("text").attr("x",6).attr("y",14).attr("fill","black").attr("font-weight", "bold").text(date)
}

function addSvg(d3ElementClass, classname){
    const svg = d3.select(d3ElementClass).append("svg").attr("width", "320px").attr("height", "320px").attr("class", classname + " virus-svg")
    return svg;
}

function drawVisualisationVirus(
  d3ElementClass,
  classname,
  title,
  date,
  proteinmap,
  rnamap,
  circlesize = 100,
  circleColor = "white",
  strokeWidth = 10,
  strokeColor = "#6CC8EA",
  rnaOutlineWidth = "15",
  rnaColor = "black"
) {
  svg = addSvg(d3ElementClass, classname);
  drawCircle(svg, classname, circlesize, strokeWidth, circleColor, strokeColor);
  drawProtein(svg, classname, circlesize, strokeWidth, proteinmap);
  // drawRna(svg, classname, rnamap, rnaOutlineWidth, rnaColor);
  drawText(svg, title, date)
}

function drawEmpty(
  d3ElementClass,
  classname,
  title,
  date
) {
  svg = addSvg(d3ElementClass, classname);
  drawText(svg, title, date)
}