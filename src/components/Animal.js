import * as d3 from "d3";
import React from "react";

const svg = d3.select("svg");
const width = +svg.attr("width");
const height = +svg.attr("height");

const data = d3.csv("./data/national_shelter_count_2020.csv").then((data) => {
  data = data.map((d) => {
    return {
      DateTime: new Date(d.DateTime),
      LiveOutcome: +d.LiveOutcome,
    };
  });
  // return data;
  // console.log(data);
  render(data);
});

console.log(data);

const render = (data) => {
  const title = "puppy";

  const xValue = (d) => d.DateTime;
  const xAxisLabel = "Time";

  const yValue = (d) => d.LiveOutcome;
  const circleRadius = 6;
  const yAxisLabel = "Live Outcome";

  const margin = { top: 60, right: 40, bottom: 88, left: 105 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

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

  const g = svg
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  const xAxis = d3.axisBottom(xScale).tickSize(-innerHeight).tickPadding(15);

  const yAxis = d3.axisLeft(yScale).tickSize(-innerWidth).tickPadding(10);

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

  // drawing line
  const lineGenerator = d3
    .line()
    .x((d) => xScale(xValue(d)))
    .y((d) => yScale(yValue(d)))
    .curve(d3.curveNatural);

  g.append("path").attr("class", "line-path").attr("d", lineGenerator(data));

  g.append("text").attr("class", "title").attr("y", -10).text(title);

  return svg;
};

export default function Animal() {
  // render(data);
  return <h1>Hello</h1>;
}
