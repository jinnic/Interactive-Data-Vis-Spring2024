/**
 * Referance : 
 *  https://observablehq.com/@d3/stacked-bar-chart/2?intent=fork
 *  https://d3-graph-gallery.com/graph/barplot_stacked_basicWide.html
 */

/* CONSTANTS AND GLOBALS */
const width = window.innerWidth * 0.8;
const height = 450;
const margin = 70;

/* LOAD DATA */
d3.csv('../data/MoMA-yearly-sample.csv', d3.autoType)
  .then(data => {
    
  // List of country: remove year column which is 0 index
  const countries = data.columns.slice(1)

  // List of years: map the value of the first column called Year for X axis
  const years = data.map(d => (d.Year))
  console.log("data", data)
  console.log("countries", countries)
  console.log("years", years)


    /** select/create SVG */
    const barChartVertical = d3.select("#container")
      .append("svg")
      .attr("class", "bar-graph")
      .attr("width", width)
      .attr("height", height)
      .style("overflow", "visible");

    const barChartVerticalNormal = d3.select("#container")
      .append("svg")
      .attr("class", "bar-graph")
      .attr("width", width)
      .attr("height", height)
      .style("overflow", "visible");
    /* SCALES */
    /** This is where you should define your scales from data to pixel space */
    
    /**
    * barChartVertical
    */

    /** stacked data */
    const stackedData = d3.stack()
      .keys(countries)
      .order(d3.stackOrderDescending)
      (data)

    const stackedDataNormal = d3.stack()
      .keys(countries)
      .order(d3.stackOrderDescending)
      .offset(d3.stackOffsetExpand)
      (data)

    /** y axis for Stacked bar chart - count of works */
    const yScale = d3.scaleLinear()
      .domain([0, 1500])
      .range([height - margin, margin/3])

    const yAxis = d3.axisLeft(yScale)
        
    barChartVertical.append("g")
      .attr("transform", `translate(${margin}, 0)`)
      .call(yAxis)   

    /** y axis for 100% Stacked bar chart, normalized - % of works */
    const yScaleNormal = d3.scaleLinear()
      .domain([0, d3.max(stackedDataNormal, d => d3.max(d, d =>{ console.log("MAX",d, d[1]); return d[1]}))])
      .range([height - margin, margin/3])
    
    const yAxisNormal = d3.axisLeft(yScaleNormal).ticks(height/50, "%")
    
    barChartVerticalNormal.append("g")
      .attr("transform", `translate(${margin}, 0)`)
      .call(yAxisNormal)
    
    const xScale = d3.scaleBand()
      .domain(years)
      .range([margin, width - margin])
      .paddingInner(0.2)
      .paddingOuter(0.3)
    
    /** x axis for both - year */
    const xAxis = d3.axisBottom(xScale).tickSizeOuter(0)

    barChartVertical.append("g")
      .attr("transform", `translate(0, ${height - margin})`)
      .call(xAxis)

    barChartVerticalNormal.append("g")
      .attr("transform", `translate(0, ${height - margin})`)
      .call(xAxis)
      

   
    /** Color scale */
    const colorScale = d3.scaleOrdinal(d3.schemePaired)
      .domain(countries)

    /** Tooltip */
    const tooltip = d3.select("#container")
      .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "1px")
      .style("border-radius", "5px")
      .style("padding", "10px")

    // Three function that change the tooltip when user hover / move / leave a cell
    const mouseover = function(event, d) {
      const country = d3.select(this.parentNode).datum().key;
      const count = d.data[country];
      tooltip
          .html("Country: " + country + "<br>" + "Number of works: " + count)
          .style("opacity", 1)

    }
    const mousemove = function(event, d) {
      tooltip.style("transform","translateY(-55%)")
            .style("left",(event.x)/2+"px")
            .style("top",(event.y)/2-30+"px")
    }
    const mouseleave = function(event, d) {
      tooltip
        .style("opacity", 0)
    }

    /* HTML ELEMENTS */
    /** Select your container and append the visual elements to it */
    
    /** Draw vertical bar chart */
    /** Stacked bar chart*/
    barChartVertical.selectAll(".bar")
    // Enter in the stack data = loop key per key = group per group
    .data(d => {
      //console.log("stackedData", stackedData)
      return stackedData
    })
    .join("g")
      .attr("class", "bar")
      .attr("fill",d => colorScale(d.key))
      .attr("stroke", "grey")
      .selectAll("rect")
      // enter a second time = loop subgroup per subgroup to add all rectangles
      .data(d => {
        //console.log("data", d)
        return d})
      .join("rect")
        .attr("x", d => xScale(d.data.Year))
        .attr("y", d => yScale(d[1]))
        .attr("height", d => yScale(d[0]) - yScale(d[1]))
        .attr("width",xScale.bandwidth())
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)

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
      
    /** 100% Stacked bar chart, normalized */
    barChartVerticalNormal.selectAll(".bar")
    // Enter in the stack data = loop key per key = group per group
    .data(d => {
      //console.log("stackedDataNormal", stackedDataNormal)
      return stackedDataNormal
    })
    .join("g")
      .attr("class", "bar")
      .attr("fill",d => colorScale(d.key))
      .attr("stroke", "grey")
      .selectAll("rect")
      // enter a second time = loop subgroup per subgroup to add all rectangles
      .data(d => {
        //console.log("data", d)
        return d})
      .join("rect")
        .attr("x", d => xScale(d.data.Year))
        .attr("y", d => yScaleNormal(d[1]))
        .attr("height", d => yScaleNormal(d[0]) - yScaleNormal(d[1]))
        .attr("width",xScale.bandwidth())
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)

    //X axis label
    barChartVerticalNormal.append("text")
      .attr("text-anchor", "end")
      .attr("x", width - margin)
      .attr("y", height - margin/2)
      .text("Nationality");

    //Y axis label
    barChartVerticalNormal.append("text")
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-90)")
      .attr("x", -margin/3 )
      .attr("y", 20 )
      .text("Count");

    

  })