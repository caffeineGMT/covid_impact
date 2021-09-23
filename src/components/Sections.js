/**
 * scrollVis - encapsulates
 * all the code for the visualization
 * using reusable charts pattern:
 * http://bost.ocks.org/mike/chart/
 */
import * as d3 from "d3";
import * as d3Collection from "d3-collection";
import Scroller from "./Scroller";

export default class Sections {
  width = 600;
  height = 520;
  margin = { top: 0, left: 20, bottom: 40, right: 10 };
  lastIndex = -1;
  activeIndex = 0;

  squareSize = 6;
  squarePad = 2;
  numPerRow = this.width / (this.squareSize + this.squarePad);

  svg = null;
  g = null;

  constructor() {
    d3.tsv("./data/words.tsv").then((data) => {
      this.init(data);
    });
  }

  scrollVis = () => {
    this.xBarScale = d3.scaleLinear().range([0, this.width]);
    this.yBarScale = d3
      .scaleBand()
      .paddingInner(0.08)
      .domain([0, 1, 2])
      .range([0, this.height - 50], 0.1, 0.1);
    this.barColors = { 0: "#008080", 1: "#399785", 2: "#5AAF8C" };

    this.xHistScale = d3
      .scaleLinear()
      .domain([0, 30])
      .range([0, this.width - 20]);
    this.yHistScale = d3.scaleLinear().range([this.height, 0]);

    this.coughColorScale = d3
      .scaleLinear()
      .domain([0, 1.0])
      .range(["#008080", "red"]);

    this.xAxisBar = d3.axisBottom().scale(this.xBarScale);
    this.xAxisHist = d3
      .axisBottom()
      .scale(this.xHistScale)
      .tickFormat(function (d) {
        return d + " min";
      });

    this.activateFunctions = [];
    this.updateFunctions = [];
  };

  /**
   * @param selection - the current d3 selection(s)
   *  to draw the visualization in. For this
   *  example, we will be drawing it in #vis
   */
  chart = function (selection) {
    selection.each((d, i, nodes) => {
      // var wordData = this.getWords(nodes[i]);
      // console.log(wordData);
      // this.svg = d3.select(nodes).selectAll("svg").data([wordData]);
      // console.log(this.svg);
      // var svgEntry = this.svg.enter().append("svg");
      // this.svg = this.svg.merge(svgEntry);
      // this.svg.attr("width", this.width + this.margin.left + this.margin.right);
      // this.svg.attr(
      //   "height",
      //   this.height + this.margin.top + this.margin.bottom
      // );
      // this.svg.append("g");
      // this.g = this.svg
      //   .select("g")
      //   .attr("transform", `translate(${this.margin.left},${this.margin.top})`);
      // var fillerWords = this.getFillerWords(wordData);
      // var fillerCounts = this.groupByWord(fillerWords);
      // var countMax = d3.max(fillerCounts, (d) => d.value);
      // this.xBarScale.domain([0, countMax]);
      // var histData = this.getHistogram(fillerWords);
      // var histMax = d3.max(histData, (d) => d.length);
      // this.yHistScale.domain([0, histMax]);
      // this.setupVis(wordData, fillerCounts, histData);
      // this.setupSections();
    });
  };

  /**
   * setupVis - creates initial elements for all
   * sections of the visualization.
   *
   * @param wordData - data object for each word.
   * @param fillerCounts - nested data that includes
   *  element for each filler word type.
   * @param histData - binned histogram data
   */
  setupVis = function (wordData, fillerCounts, histData) {
    // axis
    this.g
      .append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + this.height + ")")
      .call(this.xAxisBar);
    this.g.select(".x.axis").style("opacity", 0);

    // count openvis title
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
    // @v4 Using .merge here to ensure
    // new and old data have same attrs applied
    var squares = this.g.selectAll(".square").data(wordData, function (d) {
      return d.word;
    });
    var squaresE = squares.enter().append("rect").classed("square", true);
    squares = squares
      .merge(squaresE)
      .attr("width", this.squareSize)
      .attr("height", this.squareSize)
      .attr("fill", "#fff")
      .classed("fill-square", function (d) {
        return d.filler;
      })
      .attr("x", function (d) {
        return d.x;
      })
      .attr("y", function (d) {
        return d.y;
      })
      .attr("opacity", 0);

    // barchart
    // @v4 Using .merge here to ensure
    // new and old data have same attrs applied
    var bars = this.g.selectAll(".bar").data(fillerCounts);
    var barsE = bars.enter().append("rect").attr("class", "bar");
    bars = bars
      .merge(barsE)
      .attr("x", 0)
      .attr("y", function (d, i) {
        return this.yBarScale(i);
      })
      .attr("fill", function (d, i) {
        return this.barColors[i];
      })
      .attr("width", 0)
      .attr("height", this.yBarScale.bandwidth());

    var barText = this.g.selectAll(".bar-text").data(fillerCounts);
    barText
      .enter()
      .append("text")
      .attr("class", "bar-text")
      .text(function (d) {
        return d.key + "…";
      })
      .attr("x", 0)
      .attr("dx", 15)
      .attr("y", function (d, i) {
        return this.yBarScale(i);
      })
      .attr("dy", this.yBarScale.bandwidth() / 1.2)
      .style("font-size", "110px")
      .attr("fill", "white")
      .attr("opacity", 0);

    // histogram
    // @v4 Using .merge here to ensure
    // new and old data have same attrs applied
    var hist = this.g.selectAll(".hist").data(histData);
    var histE = hist.enter().append("rect").attr("class", "hist");
    hist = hist
      .merge(histE)
      .attr("x", function (d) {
        return this.xHistScale(d.x0);
      })
      .attr("y", this.height)
      .attr("height", 0)
      .attr(
        "width",
        this.xHistScale(histData[0].x1) - this.xHistScale(histData[0].x0) - 1
      )
      .attr("fill", this.barColors[0])
      .attr("opacity", 0);

    // cough title
    this.g
      .append("text")
      .attr("class", "sub-title cough cough-title")
      .attr("x", this.width / 2)
      .attr("y", 60)
      .text("cough")
      .attr("opacity", 0);

    // arrowhead from
    // http://logogin.blogspot.com/2013/02/d3js-arrowhead-markers.html
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
      .attr("d", function () {
        var line = "M " + (this.width / 2 - 10) + " " + 80;
        line += " l 0 " + 230;
        return line;
      })
      .attr("opacity", 0);
  };

  /**
   * ACTIVATE FUNCTIONS
   *
   * These will be called their
   * section is scrolled to.
   *
   * General pattern is to ensure
   * all content for the current section
   * is transitioned in, while hiding
   * the content for the previous section
   * as well as the next section (as the
   * user may be scrolling up or down).
   *
   */

  /**
   * showTitle - initial title
   *
   * hides: count title
   * (no previous step to hide)
   * shows: intro title
   *
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
   * showFillerTitle - filler counts
   *
   * hides: intro title
   * hides: square grid
   * shows: filler count title
   *
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
   * showGrid - square grid
   *
   * hides: filler count title
   * hides: filler highlight in grid
   * shows: square grid
   *
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
      .delay(function (d) {
        return 5 * d.row;
      })
      .attr("opacity", 1.0)
      .attr("fill", "#ddd");
  };

  /**
   * highlightGrid - show fillers in grid
   *
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

    // use named transition to ensure
    // move happens even if other
    // transitions are interrupted.
    this.g
      .selectAll(".fill-square")
      .transition("move-fills")
      .duration(800)
      .attr("x", function (d) {
        return d.x;
      })
      .attr("y", function (d) {
        return d.y;
      });

    this.g
      .selectAll(".fill-square")
      .transition()
      .duration(800)
      .attr("opacity", 1.0)
      .attr("fill", function (d) {
        return d.filler ? "#008080" : "#ddd";
      });
  };

  /**
   * showBar - barchart
   *
   * hides: square grid
   * hides: histogram
   * shows: barchart
   *
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
      .attr("y", function (d, i) {
        return this.yBarScale(i % 3) + this.yBarScale.bandwidth() / 2;
      })
      .transition()
      .duration(0)
      .attr("opacity", 0);

    this.g
      .selectAll(".hist")
      .transition()
      .duration(600)
      .attr("height", function () {
        return 0;
      })
      .attr("y", function () {
        return this.height;
      })
      .style("opacity", 0);

    this.g
      .selectAll(".bar")
      .transition()
      .delay(function (d, i) {
        return 300 * (i + 1);
      })
      .duration(600)
      .attr("width", function (d) {
        return this.xBarScale(d.value);
      });

    this.g
      .selectAll(".bar-text")
      .transition()
      .duration(600)
      .delay(1200)
      .attr("opacity", 1);
  };

  /**
   * showHistPart - shows the first part
   *  of the histogram of filler words
   *
   * hides: barchart
   * hides: last half of histogram
   * shows: first half of histogram
   *
   */
  showHistPart = () => {
    // switch the axis to histogram one
    this.showAxis(this.xAxisHist);

    this.g.selectAll(".bar-text").transition().duration(0).attr("opacity", 0);

    this.g.selectAll(".bar").transition().duration(600).attr("width", 0);

    // here we only show a bar if
    // it is before the 15 minute mark
    this.g
      .selectAll(".hist")
      .transition()
      .duration(600)
      .attr("y", function (d) {
        return d.x0 < 15 ? this.yHistScale(d.length) : this.height;
      })
      .attr("height", function (d) {
        return d.x0 < 15 ? this.height - this.yHistScale(d.length) : 0;
      })
      .style("opacity", function (d) {
        return d.x0 < 15 ? 1.0 : 1e-6;
      });
  };

  /**
   * showHistAll - show all histogram
   *
   * hides: cough title and color
   * (previous step is also part of the
   *  histogram, so we don't have to hide
   *  that)
   * shows: all histogram bars
   *
   */
  showHistAll = () => {
    // ensure the axis to histogram one
    this.showAxis(this.xAxisHist);

    this.g.selectAll(".cough").transition().duration(0).attr("opacity", 0);

    // named transition to ensure
    // color change is not clobbered
    this.g
      .selectAll(".hist")
      .transition("color")
      .duration(500)
      .style("fill", "#008080");

    this.g
      .selectAll(".hist")
      .transition()
      .duration(1200)
      .attr("y", function (d) {
        return this.yHistScale(d.length);
      })
      .attr("height", function (d) {
        return this.height - this.yHistScale(d.length);
      })
      .style("opacity", 1.0);
  };

  /**
   * showCough
   *
   * hides: nothing
   * (previous and next sections are histograms
   *  so we don't have to hide much here)
   * shows: histogram
   *
   */
  showCough = () => {
    // ensure the axis to histogram one
    this.showAxis(this.xAxisHist);

    this.g
      .selectAll(".hist")
      .transition()
      .duration(600)
      .attr("y", function (d) {
        return this.yHistScale(d.length);
      })
      .attr("height", function (d) {
        return this.height - this.yHistScale(d.length);
      })
      .style("opacity", 1.0);
  };

  /**
   * showAxis - helper function to
   * display particular xAxis
   *
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
   * hideAxis - helper function
   * to hide the axis
   *
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
   * updateCough - increase/decrease
   * cough text and color
   *
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
      .style("fill", function (d) {
        return d.x0 >= 14 ? this.coughColorScale(progress) : "#008080";
      });
  };

  //#region initialization

  /**
   * activate current section's visualization
   * @param curIndex - index of the activated section
   */
  activate = (curIndex) => {
    this.activeIndex = curIndex;
    const sign = this.activeIndex - this.lastIndex < 0 ? -1 : 1;
    const scrolledSections = d3.range(
      this.lastIndex + sign,
      this.activeIndex + sign,
      sign
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

  /**
   * called once data has been loaded.
   * sets up the scroller and displays the visualization.
   * @param rawData - loaded tsv data
   */
  init = (rawData) => {
    this.setupData(rawData);
    this.setupBarChart();
    this.setupHistogram();
    this.setupScroller();
    this.setupVis();
    this.setupSections();
  };

  setupData = (rawData) => {
    this.wordData = this.getWords(rawData);
  };

  setupBarChart = () => {
    const fillerWords = this.getFillerWords(this.wordData);
    const fillerCounts = this.groupByWord(fillerWords);
    const countMax = d3.max(fillerCounts, (d) => d.value);
    this.xBarScale.domain([0, countMax]);
  };

  setupHistogram = () => {
    const fillerWords = this.getFillerWords(this.wordData);
    const histData = this.getHistogram(fillerWords);
    const histMax = d3.max(histData, (d) => d.length);
    this.yHistScale.domain([0, histMax]);
  };

  setupScroller = () => {
    const steps = d3.selectAll(".step");
    const scroller = new Scroller(steps);
    scroller.container("#graphic");

    scroller.on("active", function (curIndex) {
      d3.selectAll(".step").style("opacity", (d, i) => {
        return i === curIndex ? 1 : 0.1;
      });

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

    for (var i = 0; i < 9; i++) {
      this.updateFunctions[i] = function () {};
    }
    this.updateFunctions[7] = this.updateCough;
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
    // only get words from the first 30 minutes
    var thirtyMins = data.filter((d) => d.min < 30);
    // bin data into 2 minutes chuncks
    // from 0 - 31 minutes
    // @v4 The d3.histogram() produces a significantly different
    // data structure then the old d3.layout.histogram().
    // Take a look at this block:
    // https://bl.ocks.org/mbostock/3048450
    // to inform how you use it. Its different!
    return d3
      .histogram()
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
}
