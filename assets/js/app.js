// @TODO: YOUR CODE HERE!
///python - m http.server to run the code in python
var svgWidth = 875;
var svgHeight = 650;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

//console.log("test");

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold the chart, and shift the latter by left and top margins.
var svg = d3.select("#chart") //looking for chart as a class with the "." and "#" for a tag id
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);


// Importing Data
d3.csv("assets/data/data.csv")
  .then(function(dobblerData) {

//Parse data/cast as numbers
dobblerData.forEach(function(data) {
    data.healthcare = +data.healthcare;
    data.income = +data.income;
  });

// Create scale functions in accordance with min value of data set
var xLinearScale = d3.scaleLinear()
      .domain([0, d3.max(dobblerData, d => d.healthcare)])
      .range([0, width]);

var yLinearScale = d3.scaleLinear()
      .domain([35000, d3.max(dobblerData, d => d.income)])
      .range([height, 0]);

//making bottom left
var bottomAxis = d3.axisBottom(xLinearScale);
var leftAxis = d3.axisLeft(yLinearScale);

//axis functions
var bottomAxis = d3.axisBottom(xLinearScale);
var leftAxis = d3.axisLeft(yLinearScale);

//Creating circles
var circlesGroup = chartGroup.selectAll("circle")
.data(dobblerData)
.enter()
.append("circle")
.attr("cx", d => xLinearScale(d.healthcare))
.attr("cy", d => yLinearScale(d.income))
.attr("r", "10")
.attr("fill", "green")
.attr("opacity", ".65");

//Tool Tip 
var toolTip = d3.tip()
.attr("class", "tooltip")
.offset([80, -60])
.html(function(d) {
  return (`${d.state}<br>Healthcare: ${d.healthcare}<br>Income: ${d.income}`);
});

//Tool tip in chart
chartGroup.call(toolTip);

//Event listeners to display and hide the tooltip
circlesGroup.on("click", function(data) {
    toolTip.show(data, this);
  })

//mouse out event
.on("mouseout", function(data, index) {
    toolTip.hide(data);
  });

  // Axes Labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Income Levels ($)");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("Healthcare (Rating)");
  });