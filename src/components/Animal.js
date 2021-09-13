import * as d3 from "d3";
import React from "react";
import fetchAndParse from "../utils/FetchAndParse.js";

export default class Animal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataPath: `./data/national_shelter_count_all.csv`,
      data: [],
    };

    this.svgRef = React.createRef();
    this.width = 800;
    this.height = 400;
    this.margin = { top: 60, right: 40, bottom: 88, left: 105 };
    this.line = null;
    this.lineGenerator = null;
  }

  componentDidMount = () => {
    const svg = d3.select(this.svgRef.current);
    svg.selectAll("*").remove();
    svg.attr("width", this.width).attr("height", this.height);

    fetchAndParse(this.state.dataPath, this.parseData).then((data) => {
      this.setState({ data });
      const filteredData = data.filter((d) => d.Year === 2020);
      this.drawSVG(filteredData, svg);
    });
  };

  parseData = (data) => {
    return data.map((d) => {
      return {
        Year: +d.Year,
        Month: d.Month,
        LiveOutcome: +d.LiveOutcome,
      };
    });
  };

  handleYearChange = (year) => {
    if (!year) {
      console.log("this is all");
      // const sumStats = d3.group(this.state.data, (d) => d.Year);
      // console.log(sumStats);
      // this.updateSVG(sumStats);
      return;
    }
    const filteredData = this.state.data.filter((d) => d.Year === year);
    this.updateSVG(filteredData);
  };

  updateSVG = (data) => {
    this.line.transition().duration(1000).attr("d", this.lineGenerator(data));
  };

  drawSVG = (data, svg) => {
    // accessor
    const xValue = (d) => d.Month;
    const xAxisLabel = "Month";

    const yValue = (d) => d.LiveOutcome;
    const circleRadius = 6;
    const yAxisLabel = "Adoption Count";

    // frame
    const innerWidth = this.width - this.margin.left - this.margin.right;
    const innerHeight = this.height - this.margin.top - this.margin.bottom;

    // x-scale and y-scale
    const months = this.state.data.map((d) => d.Month);
    const xScale = d3
      .scaleOrdinal()
      .domain(months)
      .range(
        (() => {
          let arr = [];
          for (let i = 0; i < 12; i++) arr.push(i * 60);
          return arr;
        })()
      );

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
      .attr("class", "bg-primary")
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

    const line = g
      .append("path")
      .attr("class", "line-path")
      .attr("d", lineGenerator(data));

    // hold a ref to these so that we only update line when new data kicks in
    this.line = line;
    this.lineGenerator = lineGenerator;
  };

  render() {
    return (
      <div
        className="animal container-fluid"
        id="animal adoption"
        style={{
          height: 900,
          display: "flex",
          alignItems: "center",
        }}
      >
        <div className="row">
          <div className="col-md-7">
            <svg ref={this.svgRef}></svg>
          </div>
          <div className="col-md-4">
            <h5 className="font-weight-bold">Animal Adoption Change</h5>
            <div className="btn-group btn-group-sm btn-group-toggle d-flex">
              <button
                type="button"
                className="btn btn-outline-light"
                onClick={() => this.handleYearChange()}
              >
                All
              </button>
              <button
                type="button"
                className="btn btn-outline-light"
                onClick={() => this.handleYearChange(2017)}
              >
                Year 2017
              </button>
              <button
                type="button"
                className="btn btn-outline-light"
                onClick={() => this.handleYearChange(2018)}
              >
                Year 2018
              </button>
              <button
                type="button"
                className="btn btn-outline-light"
                onClick={() => this.handleYearChange(2019)}
              >
                Year 2019
              </button>
              <button
                type="button"
                className="btn btn-outline-light"
                onClick={() => this.handleYearChange(2020)}
              >
                Year 2020
              </button>
            </div>
            <p className="text-justify mt-2">
              During the pandemic burst in 2020, we see more and more pets being
              adopted. One would find it was very hard to adopt a pet from a
              shelter. Was it truly having more adoptions? or was it just
              because the available pets were adopted a lot faster than before
              so that it created an illusion that more pets were adopted?
            </p>
            <br />
            <br />
            <div className="text-center"> The answer is latter</div>
          </div>
        </div>
      </div>
    );
  }
}
