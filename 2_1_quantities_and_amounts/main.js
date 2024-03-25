/**
 * Referance : 
 *  https://observablehq.com/@d3/horizontal-bar-chart/2
 *  https://d3-graph-gallery.com/graph/custom_color.html
 */

/* CONSTANTS AND GLOBALS */
const width = window.innerWidth * 0.8;
const height = 450;
const margin = 70;

/* LOAD DATA */
d3.csv('../data/MoMA_topTenNationalities.csv', d3.autoType)
  .then(data => {
    //console.log("data", data)

    /** select/create SVG */
    const barChartVertical = d3.select("#container")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .style("overflow", "visible");

    const barChartHorizontal = d3.select("#container")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .style("overflow", "visible");

    /* SCALES */
    /** This is where you should define your scales from data to pixel space */
    
    /**
    * barChartVertical
    */

    /** barChartVertical Y scale: Count */
    const yScale = d3.scaleLinear()
      .domain([0, Math.max(...data.map(d => d.Count))])
      .range([height - margin, margin/3])
      

    const yAxis = d3.axisLeft(yScale)
    barChartVertical.append("g")
      .attr("transform", `translate(${margin}, 0)`)
      .call(yAxis)
    
    const nation = data.map(d => d.Nationality)
    console.log(nation)
    /** barChartVertical X scale: Nationality */
    const xScale = d3.scaleBand()
      .domain(nation)
      .range([margin, width - margin])
      .paddingInner(0.2)
      .paddingOuter(0.3)
    
    const xAxis = d3.axisBottom(xScale)

    barChartVertical.append("g")
      .attr("transform", `translate(0, ${height - margin})`)
      .call(xAxis)
    
    /**
    * barChartHorizontal
    */
    
    /** barChartHorizontal X scale: Count */
    const xScaleHor = d3.scaleLinear()
      .domain([0, Math.max(...data.map(d => d.Count))])
      .range([margin, width - margin])
      
    const xAxisHor = d3.axisBottom(xScaleHor)

    /** barChartHorizontal Y scale: Nationality */
    const yScaleHor = d3.scaleBand()
      .domain(data.map(d => d.Nationality))
      .range([height - margin, margin/3])
      .paddingInner(0.2)
      .paddingOuter(0.3)
     
    const yAxisHor = d3.axisLeft(yScaleHor)

    /** Color scale */
    const colorScale = d3.scaleLinear()
      .domain([0, Math.max(...data.map(d => d.Count))])
      .range(["yellow", "green"])

    /* HTML ELEMENTS */
    /** Select your container and append the visual elements to it */
    
    /** Draw vertical bar chart */
    barChartVertical.selectAll(".bar")
      .data(data)
      .join("rect")
      .attr("x", d => xScale(d.Nationality))
      .attr("y", d => yScale(d.Count))
      .attr("width", xScale.bandwidth)
      .attr("height", d => height - yScale(d.Count) - margin)
      .attr("fill", d => colorScale(d.Count))

    //X axis label
    barChartVertical.append("text")
      .attr("text-anchor", "end")
      .attr("x", width - margin)
      .attr("y", height - margin/2)
      .text("Nationality");

    //Y axis label
    barChartVertical.append("text")
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-90)")
      .attr("x", -margin/3 )
      .attr("y", 20 )
      .text("Count");

    /** Draw horizontal bar chart */
    barChartHorizontal.selectAll(".bar")
      .data(data)
      .join("rect")
      .attr("x", xScaleHor(0)) // xScaleHor(0) === margin
      .attr("y", d => yScaleHor(d.Nationality))
      .attr("z", -1)
      .attr("width",  d => xScaleHor(d.Count) - margin)
      .attr("height",yScaleHor.bandwidth)
      .attr("fill", d => colorScale(d.Count))

    //X axis label
    barChartHorizontal.append("text")
      .attr("text-anchor", "end")
      .attr("x", width - margin)
      .attr("y", height - margin/2)
      .text("Count");

    //Y axis label
    barChartHorizontal.append("text")
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-90)")
      .attr("x", -margin/3 )
      .attr("y", 10 )
      .text("Nationality");
    
    //Draw axis
    barChartHorizontal.append("g")
      .attr("transform", `translate(0, ${height - margin})`)
      .call(xAxisHor)

    barChartHorizontal.append("g")
      .attr("transform", `translate(${margin}, 0)`)
      .call(yAxisHor)
    

  })