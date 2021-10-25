/*
ref: https://github.com/vlandham/scroll_demo
https://vallandingham.me/think_you_can_scroll.html
https://github.com/vlandham/scroll_demo/blob/gh-pages/post.md
https://lancecourse.com/howto/the-science-of-creating-fixed-components-on-scroll-with-vanilla-javascript
*/
import React from "react";
import * as d3 from "d3";
import * as d3Collection from "d3-collection";
import Scroller from "../utils/Scroller";

export default class ToiletPaper extends React.Component {
  width = window.innerWidth / 3;
  height = this.width;
  margin = { top: 10, left: 10, bottom: 10, right: 10 };
  lastIndex = -1;
  activeIndex = 0;

  squareSize = window.innerWidth / 198;
  squarePad = this.squareSize;
  numPerRow = this.width / (this.squareSize + this.squarePad);

  svg = null;
  g = null;

  activateFunctions = [];
  updateFunctions = [];

  // data: https://www.statista.com/chart/15676/cmo-toilet-paper-consumption/
  rollsRaw = [
    { Country: "US", Rolls: 141 },
    { Country: "Germany", Rolls: 134 },
    { Country: "UK", Rolls: 127 },
    { Country: "Japan", Rolls: 91 },
    { Country: "Australia", Rolls: 88 },
    { Country: "Spain", Rolls: 81 },
    { Country: "France", Rolls: 71 },
    { Country: "Italy", Rolls: 70 },
    { Country: "China", Rolls: 49 },
    { Country: "Brazil", Rolls: 38 },
  ];

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount = () => {
    d3.tsv("./data/words.tsv").then((data) => {
      this.init(data);
    });
  };

  //#region initialization

  /**
   * called once data has been loaded.
   * @param rawData - loaded tsv data
   */
  init = (rawData) => {
    this.setupData(rawData);

    this.setupVis(d3.select("#vis"));
    this.setupOverallIncrease();
    this.setupInvention();
    this.setupGrid();
    this.setupBarChart();
    this.setupHistogram();

    this.setupScroller();
    this.setupSections();
  };

  setupData = (rawData) => {
    this.wordData = this.getWords(rawData);
    this.fillerWords = this.getFillerWords(this.wordData);
    this.generateRolls();
  };

  /**
   * @param selection - the current d3 selection(s) to draw the visualization in.
   */

  setupVis = (selection) => {
    this.svg = selection.selectAll("svg").data([this.wordData]); // [array] wraps array as an another array with just 1 item inside
    var svgEntry = this.svg.enter().append("svg");
    this.svg = this.svg.merge(svgEntry);
    this.svg.attr("width", this.width + this.margin.left + this.margin.right);
    this.svg.attr("height", this.height + this.margin.top + this.margin.bottom);
    this.svg.append("g");
    this.g = this.svg
      .select("g")
      .attr("transform", `translate(${this.margin.left},${this.margin.top})`);
  };

  setupOverallIncrease = () => {
    this.g
      .append("text")
      .attr("class", "title tp-overall-increase highlight")
      .attr("x", this.width / 2)
      .attr("y", this.height / 3)
      .text("40%");
    this.g
      .append("text")
      .attr("class", "sub-title tp-overall-increase")
      .attr("x", this.width / 2)
      .attr("y", this.height / 3 + this.height / 5)
      .text("Overall Increase")
      .style("fill", "#fff");
    this.g.selectAll(".tp-overall-increase").attr("opacity", 0);
  };

  setupInvention = () => {
    this.g
      .append("image")
      .attr("class", "tp-invention-img")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", this.width)
      .attr("height", this.height)
      .attr("xlink:href", "./image/toilet_paper_invention.jpg")
      .attr("opacity", 0);
  };

  setupGrid = () => {
    const countryList = [
      "US",
      "Germany",
      "UK",
      "Japan",
      "Australia",
      "Spain",
      "France",
      "Italy",
      "China",
      "Brazil",
    ];

    this.colorScale = d3.scaleOrdinal().domain(countryList).range([
      // "#ab2668", // purple
      "#ef3f5d", // light-red
      "#00aaa9", // green-blue
      // "#bfc0c2", // light-grey
      "#fcf001", // light-yellow
      // "#c2272d", // dark red
      // "#c9da29", // blue-yellow
      // "#03a7c1", // blue-green
      // "#be1a8b", // dark pink
      "#75d1f3", // light blue
      // "#7f65aa", // light purple
      // "#01aef0", // blue
      "#ed0477", // pink
      // "#5d2d91", // dark purple
      // "#015aaa", // blue
      "#84bc41", // light green
      "#01954e", // green
      "#ffc60e", // yellow
      // "#94238e", // purple
      "#ec6aa0", // light pink
      // "#d71b32", // red
      "#f69324", // orange
    ]);

    let squares = this.g.selectAll(".square").data(this.rollsProcessed);
    const squaresE = squares.enter().append("rect").classed("square", true);
    squares = squares
      .merge(squaresE)
      .attr("width", this.squareSize)
      .attr("height", this.squareSize)
      .attr("fill", (d) => this.colorScale(d.Country))
      .attr("x", (d) => d.x)
      .attr("y", (d) => d.y)
      .attr("opacity", 0)
      .attr("transform", `translate(0, ${50})`);

    const legend = this.g
      .selectAll(".legend")
      .data(countryList)
      .enter()
      .append("rect")
      .classed("legend", true)
      .attr("width", this.squareSize)
      .attr("height", this.squareSize)
      .attr("fill", (d) => this.colorScale(d))
      .attr("x", (d, i) => i * this.squareSize * 6)
      .attr("y", 0)
      .attr("opacity", 0);

    const legendText = this.g
      .selectAll(".legend-text")
      .data(countryList)
      .enter()
      .append("text")
      .attr("class", "legend-text")
      .text((d) => d)
      .attr("x", (d, i) => i * this.squareSize * 6)
      .attr("y", 0)
      .attr("transform", `translate(0, ${this.squareSize + 15})`)
      .style("font-size", 10)
      .attr("fill", "white")
      .attr("opacity", 0);
  };

  setupBarChart = () => {
    // const fillerCounts = this.groupByWord(this.fillerWords);
    // const countMax = d3.max(fillerCounts, (d) => d.value);
    // this.xBarScale = d3
    //   .scaleLinear()
    //   .domain([0, countMax])
    //   .range([0, this.width]);
    // this.yBarScale = d3
    //   .scaleBand()
    //   .paddingInner(0.08)
    //   .domain([0, 1, 2])
    //   .range([0, this.height - 50], 0.1, 0.1);
    // this.xAxisBar = d3.axisBottom().scale(this.xBarScale);
    // this.g
    //   .append("g")
    //   .attr("class", "x axis")
    //   .attr("transform", `translate(0, ${this.height - 40})`)
    //   .call(this.xAxisBar);
    // this.g.select(".x.axis").style("opacity", 0);
  };

  setupHistogram = () => {
    this.colors = {
      0: "#84bc41", // light green
      1: "#fcf001", // light yellow
      2: "#75d1f3", // light blue
      3: "#ef3f5d", // light-red
    };
    this.changeColorScale = d3
      .scaleLinear()
      .domain([0, 1.0])
      .range(["#84bc41", "#75d1f3"]);

    this.xHistScale = d3
      .scaleLinear()
      .domain([1, 13])
      .range([0, this.width - 20]);
    this.xAxisHist = d3.axisBottom().scale(this.xHistScale);
    this.g
      .append("g")
      .attr("class", "x axis")
      .attr("transform", `translate(0, ${this.height - 40})`)
      .call(this.xHistScale);
    this.g.select(".x.axis").style("opacity", 0);

    const histData = this.getOtherHist();
    // const histData = this.getHistogram(this.fillerWords);
    const histMax = d3.max(histData, (d) => d.length);

    this.yHistScale = d3
      .scaleLinear()
      .domain([0, histMax])
      .range([this.height, 0]);

    let hist = this.g.selectAll(".hist").data(histData);
    const histE = hist.enter().append("rect").attr("class", "hist");
    hist = hist
      .merge(histE)
      .attr("x", (d) => this.xHistScale(d.x0))
      .attr("y", this.height)
      .attr("height", 0)
      .attr(
        "width",
        this.xHistScale(histData[0].x1) - this.xHistScale(histData[0].x0) - 1
      )
      .attr("transform", `translate(0, ${-40})`)
      .attr("fill", this.colors[0])
      .attr("opacity", 0);
  };

  setupScroller = () => {
    // setup onScroll event
    const scroller = new Scroller(d3.selectAll(".step"), d3.select("#graphic"));

    scroller.on("active", (curIndex) => {
      d3.selectAll(".step").style("opacity", (d, i) =>
        i === curIndex ? 1 : 0.1
      );

      this.activate(curIndex);
    });

    scroller.on("progress", (curIndex, progress) => {
      this.update(curIndex, progress);
    });

    // setup start and end stick trigger
    this.vis = document.querySelector("#vis");
    this.measure = document.querySelector("#graphic > .col");
    this.flexContainer = document.querySelector("#graphic");

    this.targetStart = this.measure.offsetTop;
    this.targetEnd = this.targetStart + this.measure.offsetHeight;
    this.rect = this.vis.getBoundingClientRect();

    this.virtualElement = document.createElement("div");
    this.virtualElement.style.height = `${parseInt(this.rect.height)}px`;

    window.addEventListener("scroll", this.makeStick);
  };

  makeStick = () => {
    const curTop = window.scrollY;
    const curBot = window.innerHeight + curTop;
    const hasStick = this.vis.classList.contains("stick");

    if (curTop >= this.targetStart && curBot <= this.targetEnd && !hasStick) {
      this.vis.classList.add("stick");
      this.vis.style.width = `${parseInt(this.rect.width)}px`;
      this.vis.parentNode.insertBefore(this.virtualElement, this.vis);

      this.flexContainer.classList.remove("align-items-end");
      this.flexContainer.classList.add("align-items-start");
    } else if (curTop <= this.targetStart && hasStick) {
      this.vis.classList.remove("stick");
      this.vis.style.width = "auto";
      this.vis.parentNode.removeChild(this.virtualElement);
    } else if (curBot >= this.targetEnd && hasStick) {
      this.vis.classList.remove("stick");
      this.vis.style.width = "auto";
      this.vis.parentNode.removeChild(this.virtualElement);

      // this.flexContainer.classList.add("align-items-end");
      // this.flexContainer.classList.remove("align-items-start");
    }
  };

  setupSections = () => {
    this.activateFunctions.push(
      this.showTitle,
      this.showInventionImg,
      this.showSquares,
      this.expandGrid,
      this.highlightGrid,
      this.showHistPart,
      this.showHistAll,
      this.showCough,
      this.showNothing
    );

    for (let i = 0; i < this.activateFunctions.length; i++) {
      this.updateFunctions[i] = function () {};
    }
    this.updateFunctions[7] = this.updateCough;
  };

  /**
   * activate current section's visualization
   * @param curIndex - index of the activated section
   */
  activate = (curIndex) => {
    this.activeIndex = curIndex;
    const dir = this.activeIndex > this.lastIndex ? 1 : -1;
    const scrolledSections = d3.range(
      this.lastIndex + dir,
      this.activeIndex + dir,
      dir
    );
    scrolledSections.forEach((i) => {
      this.activateFunctions[i]();
    });
    this.lastIndex = this.activeIndex;
  };

  /**
   * update current section's visualization based on progress
   * @param curIndex - index of the activated section
   * @param progress - progress of the activated section
   */
  update = (curIndex, progress) => {
    this.updateFunctions[curIndex](progress);
  };

  //#endregion initialization

  //#region data func

  /**
   * maps raw data to array of data objects.
   * @param rawData - data read in from file
   */
  getWords = (rawData) => {
    return rawData.map((d, i) => {
      // post-process each data
      d.filler = d.filler === "1" ? true : false;
      d.time = +d.time;
      d.min = Math.floor(d.time / 60);

      // position for each square
      d.col = i % this.numPerRow;
      d.row = Math.floor(i / this.numPerRow);
      d.x = d.col * (this.squareSize + this.squarePad);
      d.y = d.row * (this.squareSize + this.squarePad);
      return d;
    });
  };

  /**
   * returns array of only filler words
   * @param data - post-processed data from getWords()
   */
  getFillerWords = (data) => {
    return data.filter((d) => d.filler);
  };

  /**
   * use d3's histogram layout to generate histogram bins for our word data
   * @param data - post-processed data from getFillerWords()
   */
  // getHistogram = (data) => {
  //   const thirtyMins = data.filter((d) => d.min < 30);
  //   console.log(this.xHistScale.ticks(10));
  //   const bin = d3
  //     .bin()
  //     .thresholds(this.xHistScale.ticks(10))
  //     .value((d) => d.min);
  //   return bin(thirtyMins);
  // };

  getOtherHist = () => {
    // create dataset
    const increasePercentByMonth = [2, 4, 90, 42, 17, 8, 10, 5, 1, 9, 55, 50];
    const data = [];
    increasePercentByMonth.forEach((count, idx) => {
      for (let j = 0; j < count; j++) {
        data.push({
          Month: idx + 1,
        });
      }
    });

    // bin the data
    const bin = d3
      .bin()
      .thresholds(this.xHistScale.ticks())
      .value((d) => d.Month);
    return bin(data);
  };

  /**
   * groupByWord - group words together using nest Used to get counts for bar charts.
   * @param words
   */
  groupByWord = (words) => {
    return d3Collection
      .nest()
      .key((d) => d.word)
      .rollup((v) => v.length)
      .entries(words)
      .sort((a, b) => b.value - a.value);
  };

  generateRolls = () => {
    this.rollsProcessed = [];
    this.rollsRaw.forEach((d, i) => {
      for (let count = 0; count < d.Rolls; count++) {
        this.rollsProcessed.push({
          Country: d.Country,
        });
      }
    });
    this.rollsProcessed.map((d, i) => {
      d.col = i % this.numPerRow;
      d.row = Math.floor(i / this.numPerRow);
      d.x = d.col * (this.squareSize + this.squarePad);
      d.y = d.row * (this.squareSize + this.squarePad);
      return d;
    });
  };

  //#endregion data func

  //#region activate func

  /**
   * hides: count title
   * (no previous step to hide)
   * shows: intro title
   */
  showTitle = () => {
    this.g
      .selectAll(".tp-invention-img")
      .transition()
      .duration(0)
      .attr("opacity", 0);

    this.g
      .selectAll(".tp-overall-increase")
      .transition()
      .duration(600)
      .attr("opacity", 1.0);
  };

  /**
   * hides: intro title
   * hides: square grid
   * shows: filler count title
   */
  showInventionImg = () => {
    this.g
      .selectAll(".tp-overall-increase")
      .transition()
      .duration(0)
      .attr("opacity", 0);

    this.g.selectAll(".square").transition().duration(0).attr("opacity", 0);
    this.g.selectAll(".legend").transition().duration(0).attr("opacity", 0);
    this.g
      .selectAll(".legend-text")
      .transition()
      .duration(0)
      .attr("opacity", 0);

    this.g
      .selectAll(".tp-invention-img")
      .transition()
      .duration(600)
      .attr("opacity", 1.0);
  };

  /**
   * hides: square grid
   * hides: histogram
   * shows: barchart
   */
  showSquares = () => {
    // hide before
    this.g
      .selectAll(".tp-invention-img")
      .transition()
      .duration(0)
      .attr("opacity", 0);

    // show cur
    this.g
      .selectAll(".square")
      .transition()
      .duration(600)
      .delay((d) => 5 * d.row)
      .attr("x", 0)
      .attr("y", (d) => d.y)
      .attr("fill", (d) => this.colorScale(d.Country))
      .transition()
      .duration(0)
      .attr("opacity", 1);

    this.g.selectAll(".legend").transition().duration(600).attr("opacity", 1);
    this.g
      .selectAll(".legend-text")
      .transition()
      .duration(1000)
      .attr("opacity", 1);

    this.g
      .selectAll(".hist")
      .transition()
      .duration(600)
      .attr("height", () => 0)
      .attr("y", () => this.height)
      .style("opacity", 0);
  };

  /**
   * hides: filler count title
   * hides: filler highlight in grid
   * shows: square grid
   */
  expandGrid = () => {
    // hide before
    this.g
      .selectAll(".tp-invention-img")
      .transition()
      .duration(0)
      .attr("opacity", 0);

    // hide after
    this.hideAxis();

    // show cur
    this.g
      .selectAll(".square")
      .transition()
      .duration(600)
      .delay((d) => 5 * d.row)
      .attr("x", (d) => d.x)
      .attr("y", (d) => d.y)
      .attr("fill", (d) => this.colorScale(d.Country))
      .attr("opacity", 1.0);

    this.g.selectAll(".legend").transition().duration(600).attr("opacity", 1);
    this.g
      .selectAll(".legend-text")
      .transition()
      .duration(600)
      .attr("opacity", 1);
  };

  /**
   * hides: barchart, text and axis
   * shows: square grid and highlighted
   *  filler words. also ensures squares
   *  are moved back to their place in the grid
   */
  highlightGrid = () => {
    this.hideAxis();

    // hide after
    this.g
      .selectAll(".hist")
      .transition()
      .duration(600)
      .attr("y", this.height)
      .attr("height", 0)
      .style("opacity", 1);

    this.g
      .selectAll(".square")
      .transition()
      .attr("x", (d) => d.x)
      .attr("y", (d) => d.y)
      .delay((d) => 5 * d.col)
      .duration(600)
      .attr("opacity", 1.0);
    this.g.selectAll(".legend").transition().duration(0).attr("opacity", 1);
    this.g
      .selectAll(".legend-text")
      .transition()
      .duration(0)
      .attr("opacity", 1);

    // use named transition to ensure move happens even if other transitions are interrupted.
    this.g
      .selectAll(".square")
      .transition("move-fills")
      .duration(800)
      .attr("opacity", 1.0)
      .attr("fill", (d) =>
        d.Country === "US" ? this.colorScale("US") : "lightgrey"
      );
  };

  /**
   * hides: barchart
   * hides: last half of histogram
   * shows: first half of histogram
   */
  showHistPart = () => {
    // hide before
    this.g
      .selectAll(".square")
      .transition()
      .duration(600)
      .delay((d) => 5 * d.col)
      .attr("y", this.height - 100)
      .attr("opacity", 0);
    this.g.selectAll(".legend").transition().duration(0).attr("opacity", 0);
    this.g
      .selectAll(".legend-text")
      .transition()
      .duration(0)
      .attr("opacity", 0);

    // show current
    this.showAxis(this.xAxisHist);
    this.g
      .selectAll(".hist")
      .transition()
      .duration(600)
      .attr("y", (d) => (d.x0 <= 2 ? this.yHistScale(d.length) : this.height))
      .attr("height", (d) =>
        d.x0 <= 2 ? this.height - this.yHistScale(d.length) : 0
      )
      .style("opacity", (d) => (d.x0 <= 2 ? 1.0 : 1e-6));
  };

  /**
   * hides: cough title and color
   * (previous step is also part of the
   *  histogram, so we don't have to hide
   *  that)
   * shows: all histogram bars
   */
  showHistAll = () => {
    // ensure the axis to histogram one
    this.showAxis(this.xAxisHist);
    this.g
      .selectAll(".hist")
      .transition()
      .duration(800)
      .attr("y", (d) => this.yHistScale(d.length))
      .attr("height", (d) => this.height - this.yHistScale(d.length))
      .attr("fill", (d) => (d.x0 <= 2 ? this.colors[0] : this.colors[3]))
      .style("opacity", 1.0);
  };

  /**
   * hides: nothing
   * (previous and next sections are histograms
   *  so we don't have to hide much here)
   * shows: histogram
   */
  showCough = () => {
    // hide before
    // this.g
    //   .selectAll(".hist")
    //   .transition()
    //   .duration(600)
    //   .attr("y", this.height)
    //   .attr("height", 0)
    //   .style("opacity", 0);
    this.hideAxis();
    this.g.selectAll(".hist").transition().duration(300).style("opacity", 0);
  };

  showNothing = () => {
    this.hideAxis();
  };

  /**
   * helper function
   * @param axis - the axis to show
   *  (xAxisHist or xAxisBar)
   */
  showAxis = (axis) => {
    this.g
      .select(".x.axis")
      .call(axis)
      .transition()
      .duration(500)
      .style("opacity", 1);
  };

  /**
   * helper function
   * to hide the axis
   */
  hideAxis = () => {
    this.g.select(".x.axis").transition().duration(500).style("opacity", 0);
  };

  /**
   * UPDATE FUNCTIONS
   *
   * These will be called within a section
   * as the user scrolls through it.
   *
   * We use an immediate transition to
   * update visual elements based on
   * how far the user has scrolled
   *
   */

  /**
   * @param progress - 0.0 - 1.0 -
   *  how far user has scrolled in section
   */
  updateCough = (progress) => {
    // this.g
    //   .selectAll(".cough")
    //   .transition()
    //   .duration(0)
    //   .attr("opacity", progress);
    // this.g
    //   .selectAll(".hist")
    //   .transition("cough")
    //   .duration(0)
    //   .style("fill", (d) => {
    //     return d.x0 >= 14 ? this.coughColorScale(progress) : "#008080";
    //   });
  };

  //#endregion activate func

  render() {
    return (
      <div className="container-fluid" id="toilet">
        <div className="row d-flex align-items-start" id="graphic">
          <div className="col">
            <div id="sections">
              <section className="step">
                <div className="title">Issues With Tissues</div>
                At the beginning of the pandemic in the U.S., brief shortages of
                food, disinfectants and toiletries swept through the country.
                Americans were quick to stock up on essentials like Lysol,
                toilet paper and paper towels, and this wave of purchases caused
                a shortfall that’s lasted for months.
              </section>
              <section className="step">
                <div className="title">Invention</div>
                The origins of Toilet Paper can be dated back to 14th Century
                China, where it was used by the Emperor and his family.
                <br />
                <br />
                In the 15th Century, paper became easier to produce, but the
                19th Century is where it boomed thanks to mass production. A man
                by the name of <span>Joseph C. Gayetty</span> created the first
                ever commercial toilet paper - which were not in rolls, but
                arrived as flat sheets sold in bulk Ever since the mass
                commercialisation of toilet paper, new advances came into play
                such as <span>Walter Alcocks</span> paper, which was perforated.
                <br />
                <br />
                In other parts of the world, <span>St. Andrew's</span> Paper
                Mill in the UK developed the first 2 ply toilet paper Toilet
                paper has been developing ever since - until the 21st century,
                where finally people it became a limited necessity due to
                hoarding across the world.
              </section>
              <section className="step">
                <div className="title">The Rank</div>
                If we look at the country rank on toilet paper consumption, the
                US is taking a lead.
              </section>
              <section className="step">
                <div className="title">The World</div>
                If each square is one roll of toilet paper, this is the top 10
                country rank on toilet paper consumption per capita. And the
                Americans consume 91 rolls per person per year.
              </section>
              <section className="step">
                <div className="title">The US VS The World</div>The proportion
                between US and the rest of the top 10 countries.
              </section>

              <section className="step">
                <div className="title">Pre-COVID</div>
                Before COVID-19, this is how much more toilet paper we consume
                in percentage compare to the same month in 2019.
              </section>
              <section className="step">
                <div className="title">Panic Mode</div>
                When COVID-10 kicked in, the consumption of toilet paper
                dramatically increased.
              </section>
              {/* <section className="step">
                <div className="title">How Much Toilet Paper Do You Need?</div>
                Unfortunately, the trend does not continue. Midway into the talk
                my Um's and Ah's spike. I continue to use them pretty
                consistently throughout the rest of the talk.
              </section> */}
            </div>
          </div>
          <div
            className="col d-flex align-items-center"
            style={{ marginTop: 150, marginLeft: 15, marginRight: 15 }}
          >
            <div id="vis" style={{ height: window.innerHeight }}></div>
          </div>
        </div>
      </div>
    );
  }
}
