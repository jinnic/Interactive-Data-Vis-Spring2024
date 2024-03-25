/* CONSTANTS AND GLOBALS */
const width = window.innerWidth * 0.9,
  height = window.innerHeight * 0.7,
  margin = 20;
/**
 * LOAD DATA
 * Using a Promise.all([]), we can load more than one dataset at a time
 * */
 Promise.all([
  d3.json("../data/world.json"),
  d3.csv("../data/MoMA_nationalities.csv", d3.autoType),
]).then(([geojson, nationalities]) => {
  console.log("geojson", geojson)
	console.log("nationalities", nationalities)
  
  //select/create SVG
  const svg = d3 
    .select("#container")
    .append("svg")
    .attr("width", width)
    .attr("height", height);
  
  // SPECIFY PROJECTION
  /**
   * Various types of projection functions with image
   * https://tinyurl.com/4ajbksba
   */
  const projection = d3.geoMercator() 
  .fitSize(
    [width, height],  //range,
    geojson           //geojson data
    );  

  // DEFINE PATH FUNCTION
  const geoPathGen = d3.geoPath(projection);

  //CREATE SCALE FOR COLOR
  // const colorScale = d3.scaleLinear()
  //   .domain([1, Math.max(...nationalities.map(d => d.Count))])
  //   .range(["white", "green"]);
  const colorScale = d3.scaleLog()
    .domain([10, d3.max(nationalities, d => d.Count)])
    .range(["lightblue", "red"]) 
    //.base(2)
  
  //ADD LEGEND using Susie Lu's library
  // https://d3-legend.susielu.com/
  const legend = d3.legendColor()
    .labelFormat(d3.format("d"))
    .cells([10, 50, 100, 150, 200, 1000])
    .scale(colorScale)
    //.labels(d3.legendHelpers.thresholdLabels)
    
  svg.append("g")
    .attr("transform", `translate(${margin}, 0)`)
    .call(legend);
  //console.log("max count", d3.max(nationalities, d => d.Count), "color", colorScale(5181))
  
  // APPEND GEOJSON PATH  
  svg.selectAll(".country")
    .data(geojson.features)
    .join("path")
    .attr("class", "country")
    .attr("stroke", "lime")
    .attr("fill", d => {
        //if country name from geojson matches country name in nationalities
        //return color by it's count using color scale
        //return gray color for null value
        const countryName = d.properties.name;
        const nationality = nationalities.find(n => n.Country === countryName);
        // if(nationality){
        //   console.log(countryName, nationality, "color scale",colorScale(nationality.Count))
        // }
        return nationality ? colorScale(nationality.Count) : "lightgray";})
    .attr("d", d => geoPathGen(d));

  
  
});