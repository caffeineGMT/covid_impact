import * as d3 from "d3";
import React from "react";

const width = 800;
const height = 800;
const animalDataPath = "./data/national_shelter_count_2020.csv";

async function fetch(path) {
  const data = await d3.csv(path);
  return parse(data);
}

const parse = (data) => {
  return data.map((d) => {
    return {
      DateTime: new Date(d.DateTime),
      LiveOutcome: +d.LiveOutcome,
    };
  });
};

const render = (data, svg) => {
  const title = "puppy";

  // accessor
  const xValue = (d) => d.DateTime;
  const xAxisLabel = "Time";

  const yValue = (d) => d.LiveOutcome;
  const circleRadius = 6;
  const yAxisLabel = "Live Outcome";

  // style
  const margin = { top: 60, right: 40, bottom: 88, left: 105 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // x-scale and y-scale
  const xScale = d3
    .scaleTime()
    .domain(d3.extent(data, xValue))
    .range([0, innerWidth])
    .nice();

  const yScale = d3
    .scaleLinear()
    .domain([0, 400000])
    .range([innerHeight, 0])
    .nice();

  // transformation
  const g = svg
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // tick
  const xAxis = d3.axisBottom(xScale).tickSize(-innerHeight).tickPadding(15);
  const yAxis = d3.axisLeft(yScale).tickSize(-innerWidth).tickPadding(10);

  // xAxis and yAxis
  const xAisG = g
    .append("g")
    .call(xAxis)
    .attr("transform", `translate(0, ${innerHeight})`);
  xAisG.select(".domain").remove();
  xAisG
    .append("text")
    .attr("class", "axis-label")
    .attr("y", 80)
    .attr("x", innerWidth / 2)
    .attr("fill", "black")
    .text(xAxisLabel);

  const yAxisG = g.append("g").call(yAxis);
  yAxisG.selectAll(".domain").remove();
  yAxisG
    .append("text")
    .attr("class", "axis-label")
    .attr("y", -60)
    .attr("x", -innerHeight / 2)
    .attr("fill", "black")
    .attr("transform", `rotate(-90)`)
    .attr("text-anchor", "middle")
    .text(yAxisLabel);

  // drawing line
  const lineGenerator = d3
    .line()
    .x((d) => xScale(xValue(d)))
    .y((d) => yScale(yValue(d)))
    .curve(d3.curveNatural);

  g.append("path").attr("class", "line-path").attr("d", lineGenerator(data));
  g.append("text").attr("class", "title").attr("y", -10).text(title);
};

export default function Animal() {
  const svgRef = React.useRef(null);
  const svg = d3.select(svgRef.current);
  svg.selectAll("*").remove();
  React.useEffect(() => {
    fetch(animalDataPath).then((data) => {
      render(data, svg);
      console.log(svg);
    });
  });
  return (
    <div className="section nav-section">
      <div className="row align-items-center">
        <div className="col-md-9">
          <svg ref={svgRef} width="800" height="800"></svg>
        </div>
        <div className="col-md-3">
          <p>Animal Adoption Change</p>
          <div className="btn-group btn-group-toggle">
            <label className="btn btn-light">
              <input type="radio" /> Year 2017
            </label>
            <label className="btn btn-light">
              <input type="radio" /> Year 2018
            </label>
            <label className="btn btn-light">
              <input type="radio" /> Year 2019
            </label>
            <label className="btn btn-light">
              <input type="radio" /> Year 2020
            </label>
          </div>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Qui dicta
            minus molestiae vel beatae natus eveniet ratione temporibus aperiam
            harum alias officiis assumenda officia quibusdam deleniti eos
            cupiditate dolore doloribus!
          </p>
        </div>
      </div>
    </div>
  );
}
