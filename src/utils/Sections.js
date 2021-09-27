import * as d3 from "d3";
import * as d3Collection from "d3-collection";
import Scroller from "../components/Scroller";

export default class Sections {
  width = 600;
  height = 600;
  margin = { top: 0, left: 20, bottom: 40, right: 10 };
  lastIndex = -1;
  activeIndex = 0;

  squareSize = 6;
  squarePad = 2;
  numPerRow = this.width / (this.squareSize + this.squarePad);

  svg = null;
  g = null;
  colors = { 0: "#008080", 1: "#399785", 2: "#5AAF8C" };

  activateFunctions = [];
  updateFunctions = [];

  constructor() {
    d3.tsv("./data/words.tsv").then((data) => {
      this.init(data);
    });
  }

  //#region initialization

  /**
   * called once data has been loaded.
   * @param rawData - loaded tsv data
   */
  init = (rawData) => {
    this.setupData(rawData);

    this.setupVis(d3.select("#vis"));
    this.setupOthers();
    this.setupBarChart();
    this.setupHistogram();

    this.setupScroller();
    this.setupSections();
  };

  setupData = (rawData) => {
    this.wordData = this.getWords(rawData);
    this.fillerWords = this.getFillerWords(this.wordData);
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

  setupOthers = () => {
    //openVis title
    this.g
      .append("text")
      .attr("class", "title openvis-title")
      .attr("x", this.width / 2)
      .attr("y", this.height / 3)
      .text("2013");
    this.g
      .append("text")
      .attr("class", "sub-title openvis-title")
      .attr("x", this.width / 2)
      .attr("y", this.height / 3 + this.height / 5)
      .text("OpenVis Conf");
    this.g.selectAll(".openvis-title").attr("opacity", 0);

    // count filler word count title
    this.g
      .append("text")
      .attr("class", "title count-title highlight")
      .attr("x", this.width / 2)
      .attr("y", this.height / 3)
      .text("180");
    this.g
      .append("text")
      .attr("class", "sub-title count-title")
      .attr("x", this.width / 2)
      .attr("y", this.height / 3 + this.height / 5)
      .text("Filler Words");
    this.g.selectAll(".count-title").attr("opacity", 0);

    // square grid
    let squares = this.g
      .selectAll(".square")
      .data(this.wordData, (d) => d.word);
    const squaresE = squares.enter().append("rect").classed("square", true);
    squares = squares
      .merge(squaresE)
      .attr("width", this.squareSize)
      .attr("height", this.squareSize)
      .attr("fill", "#fff")
      .classed("fill-square", (d) => d.filler)
      .attr("x", (d) => d.x)
      .attr("y", (d) => d.y)
      .attr("opacity", 0);

    // cough title
    this.g
      .append("text")
      .attr("class", "sub-title cough cough-title")
      .attr("x", this.width / 2)
      .attr("y", 60)
      .text("cough")
      .attr("opacity", 0);
    // arrowhead
    this.svg
      .append("defs")
      .append("marker")
      .attr("id", "arrowhead")
      .attr("refY", 2)
      .attr("markerWidth", 6)
      .attr("markerHeight", 4)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M 0,0 V 4 L6,2 Z");
    this.g
      .append("path")
      .attr("class", "cough cough-arrow")
      .attr("marker-end", "url(#arrowhead)")
      .attr("d", () => {
        let line = "M " + (this.width / 2 - 10) + " " + 80;
        line += " l 0 " + 230;
        return line;
      })
      .attr("opacity", 0);
  };

  setupBarChart = () => {
    const fillerCounts = this.groupByWord(this.fillerWords);
    const countMax = d3.max(fillerCounts, (d) => d.value);

    this.xBarScale = d3
      .scaleLinear()
      .domain([0, countMax])
      .range([0, this.width]);
    this.yBarScale = d3
      .scaleBand()
      .paddingInner(0.08)
      .domain([0, 1, 2])
      .range([0, this.height - 50], 0.1, 0.1);
    this.xAxisBar = d3.axisBottom().scale(this.xBarScale);

    this.g
      .append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + this.height + ")")
      .call(this.xAxisBar);
    this.g.select(".x.axis").style("opacity", 0);

    let bars = this.g.selectAll(".bar").data(fillerCounts);
    const barsE = bars.enter().append("rect").attr("class", "bar");
    bars = bars
      .merge(barsE)
      .attr("x", 0)
      .attr("y", (d, i) => this.yBarScale(i))
      .attr("fill", (d, i) => this.colors[i])
      .attr("width", 0)
      .attr("height", this.yBarScale.bandwidth());
    const barText = this.g
      .selectAll(".bar-text")
      .data(fillerCounts)
      .enter()
      .append("text")
      .attr("class", "bar-text")
      .text((d) => `${d.key}…`)
      .attr("x", 0)
      .attr("dx", 15)
      .attr("y", (d, i) => this.yBarScale(i))
      .attr("dy", this.yBarScale.bandwidth() / 1.2)
      .style("font-size", "110px")
      .attr("fill", "white")
      .attr("opacity", 0);
  };

  setupHistogram = () => {
    this.xHistScale = d3
      .scaleLinear()
      .domain([0, 30])
      .range([0, this.width - 20]);

    const histData = this.getHistogram(this.fillerWords);

    this.xAxisHist = d3
      .axisBottom()
      .scale(this.xHistScale)
      .tickFormat((d) => `${d} min`);
    this.coughColorScale = d3
      .scaleLinear()
      .domain([0, 1.0])
      .range(["#008080", "orange"]);

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
      .attr("fill", this.colors[0])
      .attr("opacity", 0);
  };

  setupScroller = () => {
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
  };

  setupSections = () => {
    this.activateFunctions[0] = this.showTitle;
    this.activateFunctions[1] = this.showFillerTitle;
    this.activateFunctions[2] = this.showGrid;
    this.activateFunctions[3] = this.highlightGrid;
    this.activateFunctions[4] = this.showBar;
    this.activateFunctions[5] = this.showHistPart;
    this.activateFunctions[6] = this.showHistAll;
    this.activateFunctions[7] = this.showCough;
    this.activateFunctions[8] = this.showHistAll;

    for (let i = 0; i < 9; i++) {
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
  getHistogram = (data) => {
    const thirtyMins = data.filter((d) => d.min < 30);
    return d3
      .bin()
      .thresholds(this.xHistScale.ticks(10))
      .value((d) => d.min)(thirtyMins);
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

  //#endregion data func

  //#region activate func

  /**
   * hides: count title
   * (no previous step to hide)
   * shows: intro title
   */
  showTitle = () => {
    this.g
      .selectAll(".count-title")
      .transition()
      .duration(0)
      .attr("opacity", 0);

    this.g
      .selectAll(".openvis-title")
      .transition()
      .duration(600)
      .attr("opacity", 1.0);
  };

  /**
   * hides: intro title
   * hides: square grid
   * shows: filler count title
   */
  showFillerTitle = () => {
    this.g
      .selectAll(".openvis-title")
      .transition()
      .duration(0)
      .attr("opacity", 0);

    this.g.selectAll(".square").transition().duration(0).attr("opacity", 0);

    this.g
      .selectAll(".count-title")
      .transition()
      .duration(600)
      .attr("opacity", 1.0);
  };

  /**
   * hides: filler count title
   * hides: filler highlight in grid
   * shows: square grid
   */
  showGrid = () => {
    this.g
      .selectAll(".count-title")
      .transition()
      .duration(0)
      .attr("opacity", 0);

    this.g
      .selectAll(".square")
      .transition()
      .duration(600)
      .delay((d) => 5 * d.row)
      .attr("opacity", 1.0)
      .attr("fill", "#ddd");
  };

  /**
   * hides: barchart, text and axis
   * shows: square grid and highlighted
   *  filler words. also ensures squares
   *  are moved back to their place in the grid
   */
  highlightGrid = () => {
    this.hideAxis();

    this.g.selectAll(".bar").transition().duration(600).attr("width", 0);
    this.g.selectAll(".bar-text").transition().duration(0).attr("opacity", 0);

    this.g
      .selectAll(".square")
      .transition()
      .duration(0)
      .attr("opacity", 1.0)
      .attr("fill", "#ddd");

    // use named transition to ensure move happens even if other transitions are interrupted.
    this.g
      .selectAll(".fill-square")
      .transition("move-fills")
      .duration(800)
      .attr("x", (d) => d.x)
      .attr("y", (d) => d.y);

    this.g
      .selectAll(".fill-square")
      .transition()
      .duration(800)
      .attr("opacity", 1.0)
      .attr("fill", (d) => (d.filler ? "#008080" : "#ddd"));
  };

  /**
   * hides: square grid
   * hides: histogram
   * shows: barchart
   */
  showBar = () => {
    // ensure bar axis is set
    this.showAxis(this.xAxisBar);

    this.g.selectAll(".square").transition().duration(800).attr("opacity", 0);

    this.g
      .selectAll(".fill-square")
      .transition()
      .duration(800)
      .attr("x", 0)
      .attr(
        "y",
        (d, i) => this.yBarScale(i % 3) + this.yBarScale.bandwidth() / 2
      )
      .transition()
      .duration(0)
      .attr("opacity", 0);

    this.g
      .selectAll(".hist")
      .transition()
      .duration(600)
      .attr("height", () => 0)
      .attr("y", () => this.height)
      .style("opacity", 0);

    this.g
      .selectAll(".bar")
      .transition()
      .delay((d, i) => 300 * (i + 1))
      .duration(600)
      .attr("width", (d) => this.xBarScale(d.value));

    this.g
      .selectAll(".bar-text")
      .transition()
      .duration(600)
      .delay(1200)
      .attr("opacity", 1);
  };

  /**
   * hides: barchart
   * hides: last half of histogram
   * shows: first half of histogram
   */
  showHistPart = () => {
    // switch the axis to histogram one
    this.showAxis(this.xAxisHist);

    this.g.selectAll(".bar-text").transition().duration(0).attr("opacity", 0);

    this.g.selectAll(".bar").transition().duration(600).attr("width", 0);

    // here we only show a bar if it is before the 15 minute mark
    this.g
      .selectAll(".hist")
      .transition()
      .duration(600)
      .attr("y", (d) => (d.x0 < 15 ? this.yHistScale(d.length) : this.height))
      .attr("height", (d) =>
        d.x0 < 15 ? this.height - this.yHistScale(d.length) : 0
      )
      .style("opacity", (d) => (d.x0 < 15 ? 1.0 : 1e-6));
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

    this.g.selectAll(".cough").transition().duration(0).attr("opacity", 0);

    // named transition to ensure color change is not clobbered
    this.g
      .selectAll(".hist")
      .transition("color")
      .duration(500)
      .style("fill", "#008080");

    this.g
      .selectAll(".hist")
      .transition()
      .duration(1200)
      .attr("y", (d) => this.yHistScale(d.length))
      .attr("height", (d) => this.height - this.yHistScale(d.length))
      .style("opacity", 1.0);
  };

  /**
   * hides: nothing
   * (previous and next sections are histograms
   *  so we don't have to hide much here)
   * shows: histogram
   */
  showCough = () => {
    // ensure the axis to histogram one
    this.showAxis(this.xAxisHist);

    this.g
      .selectAll(".hist")
      .transition()
      .duration(600)
      .attr("y", (d) => this.yHistScale(d.length))
      .attr("height", (d) => this.height - this.yHistScale(d.length))
      .style("opacity", 1.0);
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
    this.g
      .selectAll(".cough")
      .transition()
      .duration(0)
      .attr("opacity", progress);

    this.g
      .selectAll(".hist")
      .transition("cough")
      .duration(0)
      .style("fill", (d) => {
        console.log(d.x0);
        return d.x0 >= 14 ? this.coughColorScale(progress) : "#008080";
      });
  };

  //#endregion activate func
}
