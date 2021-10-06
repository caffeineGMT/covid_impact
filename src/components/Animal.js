import * as d3 from "d3";
import React from "react";
import fetchAndParse from "../utils/FetchAndParse.js";

export default class Animal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataPath: `./data/animal/national_shelter_count_all.csv`,
      data: [],
    };

    this.svgRef = React.createRef();
    this.width = 800;
    this.height = 450;
    this.margin = { top: 60, right: 40, bottom: 90, left: 100 };

    this.line = null;
    this.lineGenerator = null;
  }

  componentDidMount = () => {
    const svg = d3.select(this.svgRef.current);
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

  handleYearChange = (selectedYear) => {
    const selectedData = this.state.data.filter((d) => d.Year === selectedYear);
    this.line
      .transition()
      .duration(1000)
      .attr("d", this.lineGenerator(selectedData))
      .style("stroke", this.colorScale(selectedYear));
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

    // scales
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
    this.colorScale = d3.scaleOrdinal().domain([2017, 2018, 2019, 2020]).range([
      "#FCECDD", // blue-green
      "#FFC288", // dark pink
      "#FEA82F", // light blue
      "#FF6701", // light purple
    ]);

    // transformation
    this.g = svg
      .append("g")
      .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`);

    // tick
    const xAxis = d3.axisBottom(xScale).tickPadding(15);
    const yAxis = d3.axisLeft(yScale).tickSize(-innerWidth).tickPadding(15);

    // xAxis and yAxis
    const xAisG = this.g
      .append("g")
      .call(xAxis)
      .attr("transform", `translate(0, ${innerHeight})`);
    xAisG.select(".domain").remove();
    xAisG
      .append("text")
      .attr("class", "bg-primary")
      .attr("y", 60)
      .attr("x", innerWidth / 2)
      .attr("fill", "#d8d8d8")
      .style("font-size", "15px")
      .text(xAxisLabel);

    const yAxisG = this.g.append("g").call(yAxis);
    yAxisG.selectAll(".domain").remove();
    yAxisG
      .append("text")
      .attr("class", "bg-primary")
      .attr("y", -70)
      .attr("x", -innerHeight / 2)
      .attr("fill", "#d8d8d8")
      .attr("transform", `rotate(-90)`)
      .attr("text-anchor", "middle")
      .style("font-size", "15px")
      .text(yAxisLabel);

    // drawing line
    this.lineGenerator = d3
      .line()
      .x((d) => xScale(xValue(d)))
      .y((d) => yScale(yValue(d)))
      .curve(d3.curveNatural);

    for (let year = 2017; year <= 2020; year++) {
      const temp = this.state.data.filter((d) => d.Year === year);
      this.g
        .append("path")
        .attr("class", "line-path")
        .attr("id", `${year}`)
        .style("stroke", this.colorScale(year))
        .style("opacity", 0.3)
        .style("stroke-width", 2)
        .attr("d", this.lineGenerator(temp));
    }

    this.handleMouseEnter = () => {
      focus.style("opacity", 1);
      focusText.style("opacity", 1);
    };

    this.handleMouseMove = (event, curDatum) => {
      const [x, y] = d3.pointer(event);
      console.log(curDatum);
      focus.attr("cx", xScale(x)).attr("cy", yScale(y));
    };

    this.handleMouseLeave = () => {
      focus.style("opacity", 0);
      focusText.style("opacity", 0);
    };

    console.log(data);
    const line = this.g
      .append("path")
      // .data(data[0])
      .attr("class", "line-path highlight")
      .attr("id", `${data[0].Year}`)
      .attr("d", this.lineGenerator(data))
      .style("stroke", this.colorScale(data[0].Year))
      .style("stroke-width", 3)
      .on("mouseenter", this.handleMouseEnter)
      .on("mousemove", this.handleMouseMove)
      .on("mouseleave", this.handleMouseLeave);

    const focus = this.g
      .append("circle")
      .attr("r", 8)
      .style("opacity", 0)
      .style("fill", "none")
      .style("stroke", "white");

    const focusText = this.g
      .append("text")
      .style("opacity", 0)
      .style("text-anchor", "left")
      .style("alignment-baseline", "middle");

    // hold a ref to these so that we only update line when new data kicks in
    this.line = line;
  };

  render() {
    return (
      <div
        className="animal container-fluid d-flex align-items-center"
        id="animal"
        style={{
          height: window.innerHeight,
        }}
      >
        <div className="row">
          <div className="col-md-7">
            <svg ref={this.svgRef}></svg>
          </div>
          <div className="col-md-4" style={{ marginLeft: 50 }}>
            <h1>Animal Adoption</h1>
            <div className="btn-group btn-group-sm btn-group-toggle d-flex">
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
              <br />
              <br />
              During the pandemic burst in 2020, we see more and more pets being
              adopted. One would find it was very hard to adopt a pet from a
              shelter. Was it truly having more adoptions? or was it just
              because the available pets were adopted a lot faster than before
              so that it created an illusion that more pets were adopted? During
              the pandemic burst in 2020, we see more and more pets being
              adopted. One would find it was very hard to adopt a pet from a
              shelter. Was it truly having more adoptions? or was it just
              because the available pets were adopted a lot faster than before
              so that it created an illusion that more pets were adopted?
            </p>
            <br />
            <br />
            <h4 className="text-center"> The answer is latter</h4>
          </div>
        </div>
      </div>
    );
  }
}
