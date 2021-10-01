import React from "react";
import * as d3 from "d3";
import fs from "fs";

export default class Stock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.svgRef = React.createRef();
    this.width = 1200;
    this.height = 600;

    this.dataPath = [];
    this.dataPath.push("./data/stock/Amazon.csv");
    this.dataPath.push("./data/stock/AMC.csv");
    this.dataPath.push("./data/stock/Chewy.csv");
    this.dataPath.push("./data/stock/Delta.csv");
    this.dataPath.push("./data/stock/Facebook.csv");
    this.dataPath.push("./data/stock/Google.csv");
    this.dataPath.push("./data/stock/Moderna.csv");
    this.dataPath.push("./data/stock/Tesla.csv");
    this.dataPath.push("./data/stock/Zillow.csv");
    this.dataPath.push("./data/stock/Zoom.csv");

    this.data = [];
  }

  componentDidMount = async () => {
    await this.setupData();
    this.draw();
  };

  setupData = async () => {
    await this.collectData();
    this.groupData();
  };

  collectData = async () => {
    for (let i = 0; i < this.dataPath.length; i++) {
      let rawData = await d3.csv(this.dataPath[i]);
      rawData = rawData.map((d) => {
        let priceStr = d["Close/Last"];
        let priceTokens = priceStr.split("$");
        let priceNum = +priceTokens[1];
        let nameTokens = this.dataPath[i].split("/");
        nameTokens = nameTokens[nameTokens.length - 1].split(".");
        let nameStr = nameTokens[0];
        return {
          Date: new Date(d.Date),
          [nameStr]: priceNum,
        };
      });
      rawData = rawData.filter((d) => d.Date.getFullYear() == 2020);
      this.data.push(rawData);
    }
  };

  groupData = () => {
    const map = d3.group(this.data.flat(), (d) => d.Date);
    let tempArr = [];
    for (let key of map.keys()) {
      let target = {};
      map.get(key).forEach((item) => {
        Object.assign(target, item);
      });
      tempArr.push(target);
    }
    this.data = tempArr;
  };

  draw = () => {
    const layerNum = 20; // number of layers
    const sampleNum = 300; // number of samples per layer
    const bumpNum = 10; // number of bumps per layer

    this.companyList = [
      "Amazon",
      "AMC",
      "Chewy",
      "Delta",
      "Facebook",
      "Google",
      "Moderna",
      "Tesla",
      "Zillow",
      "Zoom",
    ];
    const stackGen = d3
      .stack()
      .keys(this.companyList)
      .offset(d3.stackOffsetWiggle);
    const stackedSeries = stackGen(this.data);
    console.log(this.data);
    console.log(stackedSeries);

    const svg = d3.select(this.svgRef.current);
    svg.attr("width", this.width).attr("height", this.height);

    const xScale = d3
      .scaleTime()
      .domain([this.data[this.data.length - 1].Date, this.data[0].Date])
      .range([0, this.width]);
    const yScale = d3.scaleLinear().domain([10, 4000]).range([0, 300]);
    const colorScale = d3.interpolateBlues;
    // var colorScale = d3
    //   .scaleOrdinal()
    //   .domain([
    //     "Amazon",
    //     "AMC",
    //     "Chewy",
    //     "Delta",
    //     "Facebook",
    //     "Google",
    //     "Moderna",
    //     "Tesla",
    //     "Zillow",
    //     "Zoom",
    //   ])
    //   .range(["red", "yellow", "orange"]);
    const areaGen = d3
      .area()
      .x((d) => xScale(d.data.Date))
      .y0((d) => yScale(d[0]))
      .y1((d) => yScale(d[1]));

    svg
      .selectAll("path")
      .data(stackedSeries)
      .enter()
      .append("path")
      .attr("d", areaGen)
      .attr("fill", () => colorScale(Math.random()));

    svg
      .selectAll("path")
      .attr("opacity", 1)
      .on("mouseover", (d, i) => {
        svg
          .selectAll("path")
          .transition()
          .duration(250)
          .attr("opacity", (d, j) => {
            return j != i ? 0.6 : 1;
          });
      })
      // .on("mousemove", function (e) {
      //   mousex = d3.pointer(e)
      // })
      .on("mouseout", function (d, i) {
        svg.selectAll("path").transition().duration(250).attr("opacity", 1);
        d3.select(this).classed("hover", false).attr("stroke-width", "0px");
      });

    // helper functions
    function stackMax(layers) {
      return d3.max(layers, (d) => d[1]);
    }

    function stackMin(layers) {
      return d3.min(layers, (d) => d[0]);
    }

    // function transition() {
    //   var t;
    //   d3.selectAll("path")
    //     .data(((t = layers1), (layers1 = layers0), (layers0 = t)))
    //     .transition()
    //     .duration(2500)
    //     .attr("d", areaGen);
    // }

    function bumps(sampleNum, bumpNum) {
      const a = [];
      for (let i = 0; i < sampleNum; i++) a[i] = 0;
      for (let i = 0; i < bumpNum; i++) bump(a, sampleNum);
      return a;
    }

    function bump(a, n) {
      const x = 1 / (0.1 + Math.random());
      const y = 2 * Math.random() - 0.5;
      const z = 10 / (0.1 + Math.random());
      for (let i = 0; i < n; i++) {
        const w = (i / n - y) * z;
        a[i] += x * Math.exp(-w * w);
      }
    }
  };

  render() {
    return (
      <div
        className="stock container-fluid d-flex align-items-center"
        id="stock"
        style={{
          height: window.innerHeight,
        }}
      >
        <div className="row">
          <div className="col-md-3 text-left">
            <h1 style={{ fontSize: "4em" }}>Stock</h1>
            <p className="text-justify">
              The COVID-19 pandemic and resulting economic crisis had an impact
              on almost every aspect of our life, including toilet paper, stock,
              gas, how we work, how we live and among many others. Is it all bad
              effects?
            </p>
          </div>
          <div className="col-md-9 text-right">
            <svg ref={this.svgRef}></svg>
          </div>
        </div>
      </div>
    );
  }
}
