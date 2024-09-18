// some data
const cities = [
  { name: "London", population: 8674000 },
  { name: "New York", population: 8406000 },
  { name: "Sydney", population: 4293000 },
  { name: "Paris", population: 2244000 },
  { name: "Beijing", population: 11510000 },
];

function drawAllSVGs() {
  drawIntoSVG();
  drawWithData(cities);
  drawWithDataAndScales(cities);
}

drawAllSVGs();

// Draw SVG graphics using D3
function drawIntoSVG() {
  // select the first svg object
  const svg = d3.select(".ex-1 svg"); // this is a D3 selection

  //  draw a circle
  svg
    .append("circle")
    .attr("r", 50)
    .attr("cx", 100)
    .attr("cy", 100)
    .attr("fill", "pink");

  //  draw a rectangle
  svg
    .append("rect")
    .attr("x", 300)
    .attr("y", 50)
    .attr("width", 400)
    .attr("height", 100)
    .attr("fill", "teal");

  // draw text
  svg
    .append("text")
    .attr("x", 200)
    .attr("y", 200)
    .attr("font-size", 30)
    .text("Hi, this was written with D3");
}

// Draw with data by using `data()` and `join()`
function drawWithData(data) {
  const svg = d3.select(".ex-2 svg");
  svg
    .selectAll("circle")
    .data(data)
    .join("circle")
    .attr("cy", 50)
    .attr("fill", "grey")
    .attr("cx", function (d, i) {
      return 50 + i * 120;
    })
    .attr("r", function (d) {
      return d.population * 0.000002;
    });

  // add labels
  svg
    .selectAll("text")
    .data(data)
    .join("text")
    .attr("x", function (d, i) {
      return 50 + i * 120;
    })
    .attr("y", 90)
    .attr("text-anchor", "middle")
    .text(function (d) {
      return d.name;
    });

  // when you hover over the circles, their "population" will be shown next to cursor.
  svg
    .selectAll("circle")
    .on("mouseover", function (event, d) {
      const x = event.pageX;
      const y = event.pageY;
      const population = formatPopulation(d.population);
      showPopulationTooltip(x, y, population);
    })
    .on("mouseout", function () {
      hidePopulationTooltip();
    });

  // function to format population
  function formatPopulation(population) {
    if (population >= 1000000) {
      return (population / 1000000).toFixed(1) + "M";
    } else {
      return population;
    }
  }

  // function to show population tooltip
  function showPopulationTooltip(x, y, population) {
    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("left", x + "px")
      .style("top", y + "px")
      .style("background-color", "rgba(0, 0, 0, 0.8)")
      .style("color", "white")
      .style("padding", "8px")
      .style("border-radius", "4px")
      .style("font-size", "12px")
      .text("Population: " + population);
  }

  // function to hide population tooltip
  function hidePopulationTooltip() {
    d3.select(".tooltip").remove();
  }

  // NOTE how the above has to scale the incoming data to place them on the screen
  // conveniently D3 offers scale functions, see below
}

// Draw with data and use scales to control how the data is interpreted
function drawWithDataAndScales(data) {
  // define dimensions and margins for the graphic
  const margin = { top: 100, right: 100, bottom: 100, left: 100 };
  const width = 800;
  const height = 300;

  // now we introduce our scales.
  // the first, x, is about the amount of items we have
  const x = d3
    .scaleLinear()
    .domain([0, data.length - 1])
    .range([margin.left, width - margin.right]);

  // The second, radius, is about the values we are getting in
  const radius = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.population)])
    .range([0, (height - margin.bottom - margin.top) / 2]);

  // select svg
  const svg = d3.select(".ex-3 svg");
  svg
    .selectAll("circle")
    .data(data)
    .join("circle")
    .attr("fill", "grey")
    .attr("cy", height / 2)
    .attr("cx", function (d, i) {
      return x(i);
    })
    .attr("r", function (d) {
      return radius(d.population);
    });
}
