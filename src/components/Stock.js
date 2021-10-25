/*
ref: http://bl.ocks.org/WillTurman/4631136
*/
import React from "react";
import * as d3 from "d3";

export default class Stock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.svgRef = React.createRef();
    this.margin = { top: 30, right: 0, bottom: 30, left: 0 };
    this.width = window.innerWidth;
    this.height = 680;

    this.innerWidth = this.width - this.margin.left - this.margin.right;
    this.innerHeight = this.height - this.margin.top - this.margin.bottom;

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
    this.date = [];
  }

  componentDidMount = async () => {
    await this.setupData();
    this.draw();
  };

  setupData = async () => {
    await this.collectData();
    this.groupData();
    this.collectDate();
  };

  collectDate = () => {
    this.data.forEach((d) => this.date.push({ Date: d.Date }));
  };

  collectData = async () => {
    for (let i = 0; i < this.dataPath.length; i++) {
      let rawData = await d3.csv(this.dataPath[i]);
      rawData = rawData.map((d) => {
        let priceStr = d["Close/Last"];
        console.log(priceStr);
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
      rawData.reverse(); // reverse date order
      rawData = rawData.filter((d) => {
        return d.Date.getFullYear() === 2020 && d.Date.getDate() % 3 === 0; // % 3 to smooth out data
      });
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
    const g = svg
      .append("g")
      .attr(
        "transform",
        `translate(${this.margin.left}, ${this.margin.top + 100})`
      );

    // scale
    const xScale = d3
      .scaleTime()
      .domain([new Date(2020, 0, 1), new Date(2020, 12, 1)])
      .range([0, this.innerWidth])
      .nice();
    const yScale = d3
      .scaleLinear()
      .domain([0, 4000])
      .range([0, this.height / 3]);
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
    const xAxis = d3
      .axisBottom(xScale)
      .ticks(d3.timeWeek)
      .tickPadding(15)
      .tickSize(1);

    // draw
    const areaGen = d3
      .area()
      .x((d) => xScale(d.data.Date))
      .y0((d) => yScale(d[0]))
      .y1((d) => yScale(d[1]))
      .curve(d3.curveBasis);

    const vertical = d3
      .select("#vertical")
      .style("position", "absolute")
      .style("z-index", 20)
      .style("width", "1px")
      .style("height", `${this.height - this.margin.bottom}px`)
      .style("background", "#fff")
      .style("visibility", "hidden");

    g.selectAll("path")
      .data(stackedSeries)
      .enter()
      .append("path")
      .attr("d", areaGen)
      .attr("fill", (d, i) => colorScale(d.key));
    const xAisG = g
      .append("g")
      .attr("class", "xAxis")
      .attr("transform", `translate(0, ${this.innerHeight - 250})`)
      .call(xAxis);
    xAisG.select(".domain").remove();

    this.handleMouseMove = (event, curDatum) => {
      const [x, y] = d3.pointer(event);
      svg.selectAll("#tooltip").remove();

      const bisect = d3.bisector((d) => d.Date);
      const curDate = xScale.invert(x);
      const curIdx = bisect.center(this.date, curDate);
      const curFirm = curDatum.key;
      const value = this.data[curIdx][curFirm];

      svg
        .append("text")
        .attr("x", x)
        .attr("y", y + 100)
        .attr("id", "tooltip")
        .style("fill", "white")
        .style("font-weight", "bold")
        .style("font-size", "20px")
        .text(`${curFirm} $${value}`);

      vertical.style("left", `${x + 10}px`).style("visibility", "visible");
    };

    g.selectAll("path")
      .attr("opacity", 1)
      .on("mouseenter", handleMouseEnter)
      .on("mousemove", this.handleMouseMove)
      .on("mouseleave", handleMouseLeave);

    // helper functions
    // function stackMax(layers) {
    //   return d3.max(layers, (d) => d[1]);
    // }

    // function stackMin(layers) {
    //   return d3.min(layers, (d) => d[0]);
    // }

    function handleMouseEnter(event, curDatum) {
      let curIdx = curDatum.index;
      g.selectAll("path")
        .transition()
        .duration(0)
        .attr("opacity", (d, idx) => (idx !== curIdx ? 0.2 : 1));
    }

    function handleMouseLeave(event, curDatum) {
      g.selectAll("path").transition().duration(250).attr("opacity", 1);
      svg.selectAll("#tooltip").remove();

      vertical.style("visibility", "hidden");
    }
  };

  render() {
    return (
      <div
        className="stock container-fluid"
        id="stock"
        style={{
          height: window.innerHeight,
        }}
      >
        <div className="row">
          <div className="col-5">
            <h1>Stock</h1>
            <p className="text-justify">
              February 19, 2020, marked the stock market peak before the
              outbreak of the COVID-19 pandemic triggered a freefall in share
              prices. In the year since, the world has changed, transforming our
              lives, our economies, and the fortunes of our businesses—an
              unfolding journey that is reflected in the ups and downs of share
              prices. The fundamental trends have accelerated, propelling some
              companies forward at record speed while for others headwinds have
              turned into hurricanes.
            </p>
          </div>
        </div>
        <div className="row row-full">
          <div className="col">
            <div id="vertical"></div>
            <svg ref={this.svgRef}></svg>
          </div>
        </div>
      </div>
    );
  }
}
