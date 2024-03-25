 /* CONSTANTS AND GLOBALS */
 const width = window.innerWidth,
  height = window.innerHeight*0.9,
  margin = 70
 let test;
  /* LOAD DATA */
d3.csv('../data/NYPD_Shooting_2023.csv', d => {
  return {
    month: new Date(2023, d.month),
    count: d.monthlyCount,
  }
}).then(data => {
  console.log('data :>> ', data);
  test = data;

  // SCALES
  const xScale = d3.scaleTime()           //https://d3js.org/d3-array/summarize#extent
    .domain(d3.extent(data, d => d.month)) //same as -> [Math.min(...data.map(d => d.date)), Math.max(...data.map(d => d.date))]
    .range([margin, width - margin])
    .nice()

  const yScale = d3.scaleLinear()
    .domain([0, Math.max(...data.map(d => d.count))])
    .range([height - margin, margin])
  
    // CREATE SVG ELEMENT
  const svg = d3.select("#container")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
  


  // LINE GENERATOR FUNCTION
  const lineGen = d3.line()
    .x(d => xScale(d.month))
    .y(d => yScale(d.count))
  
    const dummyLine = lineGen([
      { month: data[0].month, count: data[0].count},
      { month: data[11].month, count: data[11].count}
     ])
     console.log(dummyLine)

  //AREA GENERATOR FUNCTION
  const areaGen = d3.area()
    .x(d => xScale(d.month))
    .y0(yScale(0)) 
    .y1(d => yScale(d.count));
  
  // DRAW LINE
  svg.selectAll(".shooting")
    .data(data)
    .join("path")
    .attr("class", 'shooting')
    .attr("fill", "none")
    .attr("stroke", "black")
    .attr("d", lineGen(data))
  // DRAW AREA
  svg.selectAll(".area")
    .data(data)
    .join("path")
		.attr("class", "area")
    .attr("fill", "lightgray")
    .attr("d", areaGen(data));
  
  //DRAW POINTS
  svg.selectAll(".circle")
    .data(data)
    .join("circle")
    .attr("class", "circle")
    .attr("cx", d => xScale(d.month))
    .attr("cy", d => yScale(d.count))
    .attr("fill", "red")
    .attr("r", 3)

  // BUILD AND CALL AXES
  // X axis
  const xAxis = d3.axisBottom(xScale)

  svg.append("g")
    .attr("class", "xAxis")
    .attr("transform", `translate(${0}, ${height - margin})`)
    .call(xAxis)

  //add x axis lable
  svg.append("text")
    .attr("text-anchor", "end")
    .attr("x", width - margin)
    .attr("y", height - margin/3)
    .text("Month")
  
    // Y axis
  const yAxis = d3.axisLeft(yScale)
                  .ticks(15)
  svg.append("g")
      .attr("class", "yAxis")
      .attr("transform", `translate(${margin}, 0)`)
      .call(yAxis)

  //add y axis label
  svg.append("text")
    .attr("text-anchor", "end")
    .attr("transform", "rotate(-90)")
    .attr("x", -margin)
    .attr("y", margin/3)
    .text("Number of shooting");
});