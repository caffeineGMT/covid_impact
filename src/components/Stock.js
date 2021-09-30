import React from "react";
import * as d3 from "d3";
import fs from "fs";

export default class Stock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.svgRef = React.createRef();
    this.width = 1200;
    this.height = 500;

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
    // const layerNum = 20; // number of layers
    // const sampleNum = 300; // number of samples per layer
    // const bumpNum = 10; // number of bumps per layer

    // const stackGen = d3
    //   .stack()
    //   .keys(d3.range(layerNum))
    //   .offset(d3.stackOffsetWiggle);

    // // data
    // let layers0 = stackGen(
    //   d3.transpose(d3.range(layerNum).map(() => bumps(sampleNum, bumpNum)))
    // );
    // let layers1 = stackGen(
    //   d3.transpose(d3.range(layerNum).map(() => bumps(sampleNum, bumpNum)))
    // );
    // const layers = layers0.concat(layers1);

    // const svg = d3.select(this.svgRef.current);
    // svg.attr("width", this.width).attr("height", this.height);

    // const xScale = d3
    //   .scaleLinear()
    //   .domain([0, sampleNum - 1])
    //   .range([0, this.width]);
    // const yScale = d3
    //   .scaleLinear()
    //   .domain([d3.min(layers, stackMin), d3.max(layers, stackMax)])
    //   .range([this.height, 0]);
    // const colorScale = d3.interpolatePlasma;
    // const areaGen = d3
    //   .area()
    //   .x((d, i) => xScale(i))
    //   .y0((d) => yScale(d[0]))
    //   .y1((d) => yScale(d[1]));

    // svg
    //   .selectAll("path")
    //   .data(layers0)
    //   .enter()
    //   .append("path")
    //   .attr("d", areaGen)
    //   .attr("fill", () => colorScale(Math.random()));

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
