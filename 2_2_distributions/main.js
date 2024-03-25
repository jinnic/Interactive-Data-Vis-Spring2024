/* CONSTANTS AND GLOBALS */
const width = window.innerWidth,
  height = window.innerHeight*0.9,
  margin = 70,
  radius = 5;

const legend = [{color: "magenta", text: "Female artist"},
                {color: "lightblue", text: "Male artist"},
                {color: "green", text: "Gender unknown"},]
let test;
/* LOAD DATA */
d3.csv("../data/MoMA_distributions.csv", d3.autoType)
  .then(data => {
    console.log(data)
    test = data


    // get artist life span
    const d = new Date();
    let year = d.getFullYear();
    const artistLiftSpan = (beginDate, endDate) => {
      
      if(beginDate!== 0 && endDate !== 0){
        return endDate - beginDate
      }
      else if(beginDate !== 0 && endDate == 0){
        return year - beginDate
      }else{
        return 0
      }
    }

    //create svg
    const svg = d3.select("#container")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .style("overflow", "visible");
    
    // Handmade legend
    //legend position 
    const dotCx = width-margin*3,
          dotCy = margin, 
          textX = width-margin*2.5,
          textY = margin
    
    legend.forEach((d, i)=> {
      svg.append("circle")
        .attr("cx",dotCx)
        .attr("cy", dotCy+i*30).attr("r", radius)
        .style("fill", d.color)
        .style("stroke", "gray")

      svg.append("text")
        .attr("x", textX)
        .attr("y", textY+i*30)
        .text(d.text)
        .style("font-size", "15px")
        .attr("alignment-baseline","middle")
    })
          
/* SCALES */
    // y scale - Width of art work
    const yScale = d3.scaleLinear()
      .domain([0, Math.max(...data.map(d => d.Width))])
      .range([height - margin, margin])
    
    //y axis scale
    const yAxis = d3.axisLeft(yScale)
    svg.append("g")
      .attr("transform", `translate(${margin}, 0)`)
      .call(yAxis)
    
    // y axis label
    svg.append("text")
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-90)")
      .attr("x", -margin)
      .attr("y", margin/3)
      .text("Width");
    
    //x scale - Length of art work
    const xScale = d3.scaleLinear()
      .domain([0, Math.max(...data.map(d => d.Length))])
      .range([margin, width-margin])
    
    //x axis scale
    const xAxis = d3.axisBottom(xScale)
    svg.append("g")
      .attr("transform", `translate(0, ${height - margin})`)
      .call(xAxis)

    // x axis label
    svg.append("text")
      .attr("text-anchor", "end")
      .attr("x", width - margin)
      .attr("y", height - margin/3)
      .text("Length of art work");

    //dot scale - artist lifespan
    const dotScale = d3.scaleSqrt()
      .domain([0, Math.max(...data.map(d => d.ArtistLifespan))])
      .range([radius, radius*10])

    const colorScale = d3.scaleOrdinal()
      .domain(["(Male)", "(Female)", "()"])
      .range(["lightblue", "magenta","green"]) // "red" "blue" "green"
    
    
      /* HTML ELEMENTS */
    svg.selectAll(".circle")
      .data(data)
      .join("circle")
      .attr("cx", d => xScale(d.Length))
      .attr("cy", d => yScale(d.Width))
      .attr("r", d => dotScale(artistLiftSpan(d.BeginDate, d.EndDate)))
      .attr("class", "circle")
      .style("fill", d => colorScale(d.Gender))


  });