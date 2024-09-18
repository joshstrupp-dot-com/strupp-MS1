
let textiles;
let allPlaces = [];

// load the data
d3.json('data/data.json').then(data => { 
  textiles = data;
  analyzeData();
  displayData();
});

// analyze the data
function analyzeData(){
  let place;

  // go through the list of textiles
  textiles.forEach(n => {
    place = n.place;
    let match = false;

    // see if their location already exists the allplaces array
    allPlaces.forEach(p => {
      if(p.name == place){
        p.count++;
        match = true;
      }
    });
    // if not create a new entry for that place name
      if(!match){
        allPlaces.push({
          name: place,
          count: 1
        });
      }
  });

  // sort by amount of items in the list
  allPlaces.sort((a, b) => (a.count < b.count) ? 1 : -1);
  // console.log(allPlaces)
}

// display the data
function displayData(){
  
  // define dimensions and margins for the graphic
  const margin = ({top: 100, right: 50, bottom: 100, left: 80});
  const width = 1400;
  const height = 700;

  // let's define our scales. 
  // yScale corresponds with amount of textiles per country
  const yScale = d3.scaleLinear()
    .domain([0, d3.max(allPlaces, d => d.count)+1])
    .range([height - margin.bottom, margin.top]); 

  // xScale corresponds with country names
  const xScale = d3.scaleBand()
    .domain(allPlaces.map(d => d.name))
    .range([margin.left, width - margin.right]);

  // interpolate colors
  const sequentialScale = d3.scaleSequential()
    .domain([0, d3.max(allPlaces, d => d.count)])
    .interpolator(d3.interpolateRgb("orange", "purple"));

  // create an svg container from scratch
  const svg = d3.select('body')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

  // attach a graphic element, and append rectangles to it
  svg.append('g')
    .selectAll('rect')
    .data(allPlaces)
    .join('rect')
    .attr('x', d => {return xScale(d.name) })
    .attr('y', d => {return yScale(d.count) })
    .attr('height', d => {return yScale(0)-yScale(d.count) })
    .attr('width', d => {return xScale.bandwidth() - 2 })
    .style('fill', d => {return sequentialScale(d.count);});
 

  // Axes
  // Y Axis
  const yAxis =  d3.axisLeft(yScale).ticks(5)

  svg.append('g')
  .attr('transform', `translate(${margin.left},0)`)
  .call(yAxis);

  // X Axis
  const xAxis =  d3.axisBottom(xScale).tickSize(0);

  svg.append('g')
    .attr('transform', `translate(0, ${height - margin.bottom})`)
    .call(xAxis)
    .selectAll('text')	
    .style('text-anchor', 'end')
    .attr('dx', '-.6em')
    .attr('dy', '-0.1em')
    .attr('transform', d => {return 'rotate(-45)' });

  // Labelling the graph
  svg.append('text')
    .attr('font-family', 'sans-serif')
    .attr('font-weight', 'bold')
    .attr('font-size', 20)
    .attr('y', margin.top-20)
    .attr('x', margin.left)
    .attr('fill', 'black')
    .attr('text-anchor', 'start')
    .text('Flowers in Embroidery by Country')
}