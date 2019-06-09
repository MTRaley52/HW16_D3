// @TODO: YOUR CODE HERE!
///python - m http.server to run the code in python
var svgWidth = 800;
var svgHeight = 500;

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
    data.obesity = +data.obesity;
    data.income = +data.income;
  });

// Create scale functions in accordance with min value of data set
var xLinearScale = d3.scaleLinear()
      .domain([20, d3.max(dobblerData, d => d.obesity)])
      .range([0, width]);

var yLinearScale = d3.scaleLinear()
      .domain([35000, d3.max(dobblerData, d => d.income)])
      .range([height, 0]);

//making bottom left positioning
var bottomAxis = d3.axisBottom(xLinearScale);
var leftAxis = d3.axisLeft(yLinearScale);

//axis functions & appending the functions to the chart
var bottomAxis = d3.axisBottom(xLinearScale);
var leftAxis = d3.axisLeft(yLinearScale);

chartGroup.append("g")
  .attr("transform", `translate(0, ${height})`)
  .call(bottomAxis);

chartGroup.append("g")
  .call(leftAxis);




//Creating circles
var circlesGroup = chartGroup.selectAll("circle")
.data(dobblerData)
.enter()
.append("circle")
.attr("cx", d => xLinearScale(d.obesity))
.attr("cy", d => yLinearScale(d.income))
.attr("r", "20")
.attr("fill", "green")
.attr("opacity", ".65")


//Creating the lines and text of the chart
var circlesGroup = chartGroup.selectAll()
.data(dobblerData)
.enter()
.append("text")
.attr("x", d => xLinearScale(d.obesity))
.attr("y", d => yLinearScale(d.income)) 
.style("font-size", "10px")
.style("text-anchor", "middle")
.style("fill", "white")
.text(d => (d.abbr));

//Tool Tip 
var toolTip = d3.tip()
.attr("class", "tooltip")
.offset([80, -60])
.html(function(d) {
  return (`${d.state}<br>Obesity: ${d.obesity}<br>Income: ${d.income}`);
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
      .attr("y", 0 - margin.left + 30)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Household Income (Median)");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 40})`)
      .attr("class", "axisText")
      .text("Obese (%)");
  });