import * as d3 from "d3";
import React from "react";
import fetchAndParse from "../utils/FetchAndParse.js";

export default class Animal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.svgRef = React.createRef();
    this.width = 800;
    this.height = 400;
    this.margin = { top: 60, right: 40, bottom: 88, left: 105 };
    this.animalDataPath = "./data/national_shelter_count_2020.csv";
  }

  componentDidMount() {
    const svg = d3.select(this.svgRef.current);

    svg.selectAll("*").remove();
    fetchAndParse(this.animalDataPath, this.parseAnimalData).then((data) => {
      this.draw(data, svg);
    });
    svg.attr("width", this.width).attr("height", this.height);
  }

  render() {
    return (
      <div className="animal section nav-section">
        <div className="row align-items-center">
          <div className="col-md-8">
            <svg
              ref={this.svgRef}
              // width={console.log(this.width)}
              // height="745"
            ></svg>
          </div>
          <div className="col-md-4">
            <h5 className="font-weight-bold">Animal Adoption Change</h5>
            <div className="btn-group btn-group-sm btn-group-toggle d-flex">
              <label className="btn btn-outline-light">
                <input type="radio" /> Year 2017
              </label>
              <label className="btn btn-outline-light">
                <input type="radio" /> Year 2018
              </label>
              <label className="btn btn-outline-light">
                <input type="radio" /> Year 2019
              </label>
              <label className="btn btn-outline-light">
                <input type="radio" /> Year 2020
              </label>
            </div>
            <p className="text-justify mt-2">
              Shelter Animals Count, which runs a database that tracks shelter
              and rescue activity, looked at pet adoptions during the pandemic.
              The group, which tracks about 500 rescue organizations across the
              country, recorded 26,000 more pet adoptions in 2020 than in the
              year before — a rise of about 15 percent.
            </p>
          </div>
        </div>
      </div>
    );
  }

  parseAnimalData = (data) => {
    return data.map((d) => {
      return {
        DateTime: new Date(d.DateTime),
        LiveOutcome: +d.LiveOutcome,
      };
    });
  };

  draw = (data, svg) => {
    // accessor
    const xValue = (d) => d.DateTime;
    const xAxisLabel = "Time";

    const yValue = (d) => d.LiveOutcome;
    const circleRadius = 6;
    const yAxisLabel = "Live Outcome";

    // style
    const innerWidth = this.width - this.margin.left - this.margin.right;
    const innerHeight = this.height - this.margin.top - this.margin.bottom;

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
      .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`);

    // tick
    const xAxis = d3.axisBottom(xScale).tickPadding(15);
    const yAxis = d3.axisLeft(yScale).tickSize(-innerWidth).tickPadding(15);

    // xAxis and yAxis
    const xAisG = g
      .append("g")
      .call(xAxis)
      .attr("transform", `translate(0, ${innerHeight})`);
    xAisG.select(".domain").remove();
    xAisG
      .append("text")
      .attr("class", "axis-label")
      .attr("y", 50)
      .attr("x", innerWidth / 2)
      .attr("fill", "white")
      .text(xAxisLabel);

    const yAxisG = g.append("g").call(yAxis);
    yAxisG.selectAll(".domain").remove();
    yAxisG
      .append("text")
      .attr("class", "bg-primary")
      .attr("y", -70)
      .attr("x", -innerHeight / 2)
      .attr("fill", "white")
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
  };
}
