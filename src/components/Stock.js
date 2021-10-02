import React from "react";
import * as d3 from "d3";
import fs from "fs";

export default class Stock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.svgRef = React.createRef();
    this.width = 2000;
    this.height = 620;

    this.dataPath = [];
    this.companyList = [
      "Delta",
      "Moderna",
      "ExxonMobil",
      "Nordstrom",
      "Disney",
      "Uber",
      "Netflix",
      "Boeing",
      "Chewy",
      "Zillow",
      "Zoom",
      "Facebook",
      "Tesla",
      "Google",
      "Amazon",
    ];

    this.companyList.forEach((element) => {
      this.dataPath.push(`./data/stock/${element}.csv`);
    });

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
      rawData = rawData.filter(
        (d) => d.Date.getFullYear() === 2020 && d.Date.getDate() % 3 === 0 // % 3 to smooth out data
      );
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
    // data
    const stackGen = d3
      .stack()
      .keys(this.companyList)
      .offset(d3.stackOffsetWiggle);
    const stackedSeries = stackGen(this.data);

    // svg
    const svg = d3.select(this.svgRef.current);
    svg.attr("width", this.width).attr("height", this.height);

    // scale
    const xScale = d3
      .scaleTime()
      .domain([this.data[this.data.length - 1].Date, this.data[0].Date])
      .range([0, this.width]);
    const yScale = d3.scaleLinear().domain([0, 4000]).range([0, 300]);
    const colorScale = d3.scaleOrdinal().domain(this.companyList).range([
      // "#ab2668", // purple
      // "#ef3f5d", // light-red
      // "#00aaa9", // green-blue
      // "#bfc0c2", // light-grey
      // "#fcf001", // light-yellow
      // "#c2272d", // dark red
      // "#c9da29", // blue-yellow
      "#03a7c1", // blue-green
      "#be1a8b", // dark pink
      "#75d1f3", // light blue
      "#7f65aa", // light purple
      "#01aef0", // blue
      "#ed0477", // pink
      "#5d2d91", // dark purple
      "#84bc41", // light green
      "#01954e", // green
      "#ffc60e", // yellow
      "#94238e", // purple
      "#ec6aa0", // light pink
      "#d71b32", // red
      "#f69324", // orange
      "#015aaa", // blue
    ]);

    // axis
    const xAxis = d3.axisBottom(xScale).tickPadding(15);

    // draw
    const areaGen = d3
      .area()
      .x((d) => xScale(d.data.Date))
      .y0((d) => yScale(d[0]))
      .y1((d) => yScale(d[1]))
      .curve(d3.curveBasis);

    var vertical = svg
      .append("div")
      .attr("class", "remove")
      .style("position", "absolute")
      .style("z-index", "19")
      .style("width", "1px")
      .style("height", "380px")
      .style("top", "10px")
      .style("bottom", "30px")
      .style("left", "0px")
      .style("background", "#fff");

    svg
      .on("mousemove", function (e) {
        const [x, y] = d3.pointer(e);
        vertical.style("left", x + "px");
      })
      .on("mouseover", function (e) {
        const [x, y] = d3.pointer(e);
        vertical.style("left", x + "px");
      });
    svg
      .selectAll("path")
      .data(stackedSeries)
      .enter()
      .append("path")
      .attr("d", areaGen)
      .attr("fill", (d, i) => colorScale(d.key));
    svg
      .append("g")
      .attr("class", "xAxis")
      .attr("transform", `translate(0, ${this.height})`)
      .style("stroke", "#f00")
      .call(xAxis);

    svg
      .selectAll("path")
      .attr("opacity", 1)
      .on("mouseover", handleMouseOver)
      // .on("mousemove", handleMouseMove)
      .on("mouseout", handleMouseOut);

    // helper functions
    function stackMax(layers) {
      return d3.max(layers, (d) => d[1]);
    }

    function stackMin(layers) {
      return d3.min(layers, (d) => d[0]);
    }

    function handleMouseOver(event, curDatum) {
      console.log(event);
      let curIdx = curDatum.index;
      svg
        .selectAll("path")
        .transition()
        .duration(0)
        .attr("opacity", (d, idx) => (idx != curIdx ? 0.2 : 1));
    }

    function handleMouseMove(event, curDatum) {
      let curIdx = curDatum.index;
      svg
        .selectAll("path")
        .transition()
        .duration(0)
        .attr("opacity", (d, idx) => (idx != curIdx ? 0.2 : 1));

      const [x, y] = d3.pointer(event);
      console.log(event);
      svg.selectAll("text").remove();
      const text = svg.append("text");
      text.attr("x", x).attr("y", y).style("fill", "white").text(curDatum.key);
    }

    function handleMouseOut(event, curDatum) {
      svg.selectAll("path").transition().duration(250).attr("opacity", 1);
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
          <div className="col-md-12" style={{ marginLeft: -115 }}>
            <svg ref={this.svgRef}></svg>
          </div>
        </div>
      </div>
    );
  }
}
