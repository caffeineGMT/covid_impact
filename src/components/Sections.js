/**
 * scrollVis - encapsulates
 * all the code for the visualization
 * using reusable charts pattern:
 * http://bost.ocks.org/mike/chart/
 */
import * as d3 from "d3";

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

  constructor() {}

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
    selection.each(function (rawData) {
      // create svg and give it a width and height
      this.svg = d3.select(this).selectAll("svg").data([wordData]);
      var svgE = this.svg.enter().append("svg");
      // @v4 use merge to combine enter and existing selection
      this.svg = this.svg.merge(svgE);

      this.svg.attr("width", this.width + this.margin.left + this.margin.right);
      this.svg.attr(
        "height",
        this.height + this.margin.top + this.margin.bottom
      );

      this.svg.append("g");
      this.g = this.svg
        .select("g")
        .attr(
          "transform",
          "translate(" + this.margin.left + "," + this.margin.top + ")"
        );

      // perform some preprocessing on raw data
      var wordData = getWords(rawData);
      // filter to just include filler words
      var fillerWords = getFillerWords(wordData);

      // get the counts of filler words for the
      // bar chart display
      var fillerCounts = groupByWord(fillerWords);
      // set the bar scale's domain
      var countMax = d3.max(fillerCounts, function (d) {
        return d.value;
      });
      this.xBarScale.domain([0, countMax]);

      // get aggregated histogram data

      var histData = getHistogram(fillerWords);
      // set histogram's domain
      var histMax = d3.max(histData, function (d) {
        return d.length;
      });
      yHistScale.domain([0, histMax]);

      setupVis(wordData, fillerCounts, histData);

      setupSections();
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
    g.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxisBar);
    g.select(".x.axis").style("opacity", 0);

    // count openvis title
    g.append("text")
      .attr("class", "title openvis-title")
      .attr("x", width / 2)
      .attr("y", height / 3)
      .text("2013");

    g.append("text")
      .attr("class", "sub-title openvis-title")
      .attr("x", width / 2)
      .attr("y", height / 3 + height / 5)
      .text("OpenVis Conf");

    g.selectAll(".openvis-title").attr("opacity", 0);

    // count filler word count title
    g.append("text")
      .attr("class", "title count-title highlight")
      .attr("x", width / 2)
      .attr("y", height / 3)
      .text("180");

    g.append("text")
      .attr("class", "sub-title count-title")
      .attr("x", width / 2)
      .attr("y", height / 3 + height / 5)
      .text("Filler Words");

    g.selectAll(".count-title").attr("opacity", 0);

    // square grid
    // @v4 Using .merge here to ensure
    // new and old data have same attrs applied
    var squares = g.selectAll(".square").data(wordData, function (d) {
      return d.word;
    });
    var squaresE = squares.enter().append("rect").classed("square", true);
    squares = squares
      .merge(squaresE)
      .attr("width", squareSize)
      .attr("height", squareSize)
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
    var bars = g.selectAll(".bar").data(fillerCounts);
    var barsE = bars.enter().append("rect").attr("class", "bar");
    bars = bars
      .merge(barsE)
      .attr("x", 0)
      .attr("y", function (d, i) {
        return yBarScale(i);
      })
      .attr("fill", function (d, i) {
        return barColors[i];
      })
      .attr("width", 0)
      .attr("height", yBarScale.bandwidth());

    var barText = g.selectAll(".bar-text").data(fillerCounts);
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
        return yBarScale(i);
      })
      .attr("dy", yBarScale.bandwidth() / 1.2)
      .style("font-size", "110px")
      .attr("fill", "white")
      .attr("opacity", 0);

    // histogram
    // @v4 Using .merge here to ensure
    // new and old data have same attrs applied
    var hist = g.selectAll(".hist").data(histData);
    var histE = hist.enter().append("rect").attr("class", "hist");
    hist = hist
      .merge(histE)
      .attr("x", function (d) {
        return xHistScale(d.x0);
      })
      .attr("y", height)
      .attr("height", 0)
      .attr(
        "width",
        xHistScale(histData[0].x1) - xHistScale(histData[0].x0) - 1
      )
      .attr("fill", barColors[0])
      .attr("opacity", 0);

    // cough title
    g.append("text")
      .attr("class", "sub-title cough cough-title")
      .attr("x", width / 2)
      .attr("y", 60)
      .text("cough")
      .attr("opacity", 0);

    // arrowhead from
    // http://logogin.blogspot.com/2013/02/d3js-arrowhead-markers.html
    svg
      .append("defs")
      .append("marker")
      .attr("id", "arrowhead")
      .attr("refY", 2)
      .attr("markerWidth", 6)
      .attr("markerHeight", 4)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M 0,0 V 4 L6,2 Z");

    g.append("path")
      .attr("class", "cough cough-arrow")
      .attr("marker-end", "url(#arrowhead)")
      .attr("d", function () {
        var line = "M " + (width / 2 - 10) + " " + 80;
        line += " l 0 " + 230;
        return line;
      })
      .attr("opacity", 0);
  };

  setupSections = () => {
    // activateFunctions are called each time the active section changes
    activateFunctions[0] = this.showTitle;
    activateFunctions[1] = this.showFillerTitle;
    activateFunctions[2] = this.showGrid;
    activateFunctions[3] = this.highlightGrid;
    activateFunctions[4] = this.showBar;
    activateFunctions[5] = this.showHistPart;
    activateFunctions[6] = this.showHistAll;
    activateFunctions[7] = this.showCough;
    activateFunctions[8] = this.showHistAll;

    // updateFunctions are called while in a particular section to update the scroll progress in that section.
    // Most sections do not need to be updated for all scrolling and so are set to no-op functions.
    for (var i = 0; i < 9; i++) {
      updateFunctions[i] = function () {};
    }
    updateFunctions[7] = updateCough;
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
    g.selectAll(".count-title").transition().duration(0).attr("opacity", 0);

    g.selectAll(".openvis-title")
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
    g.selectAll(".openvis-title").transition().duration(0).attr("opacity", 0);

    g.selectAll(".square").transition().duration(0).attr("opacity", 0);

    g.selectAll(".count-title").transition().duration(600).attr("opacity", 1.0);
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
    g.selectAll(".count-title").transition().duration(0).attr("opacity", 0);

    g.selectAll(".square")
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
    hideAxis();
    g.selectAll(".bar").transition().duration(600).attr("width", 0);

    g.selectAll(".bar-text").transition().duration(0).attr("opacity", 0);

    g.selectAll(".square")
      .transition()
      .duration(0)
      .attr("opacity", 1.0)
      .attr("fill", "#ddd");

    // use named transition to ensure
    // move happens even if other
    // transitions are interrupted.
    g.selectAll(".fill-square")
      .transition("move-fills")
      .duration(800)
      .attr("x", function (d) {
        return d.x;
      })
      .attr("y", function (d) {
        return d.y;
      });

    g.selectAll(".fill-square")
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
    showAxis(xAxisBar);

    g.selectAll(".square").transition().duration(800).attr("opacity", 0);

    g.selectAll(".fill-square")
      .transition()
      .duration(800)
      .attr("x", 0)
      .attr("y", function (d, i) {
        return yBarScale(i % 3) + yBarScale.bandwidth() / 2;
      })
      .transition()
      .duration(0)
      .attr("opacity", 0);

    g.selectAll(".hist")
      .transition()
      .duration(600)
      .attr("height", function () {
        return 0;
      })
      .attr("y", function () {
        return height;
      })
      .style("opacity", 0);

    g.selectAll(".bar")
      .transition()
      .delay(function (d, i) {
        return 300 * (i + 1);
      })
      .duration(600)
      .attr("width", function (d) {
        return xBarScale(d.value);
      });

    g.selectAll(".bar-text")
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
    showAxis(xAxisHist);

    g.selectAll(".bar-text").transition().duration(0).attr("opacity", 0);

    g.selectAll(".bar").transition().duration(600).attr("width", 0);

    // here we only show a bar if
    // it is before the 15 minute mark
    g.selectAll(".hist")
      .transition()
      .duration(600)
      .attr("y", function (d) {
        return d.x0 < 15 ? yHistScale(d.length) : height;
      })
      .attr("height", function (d) {
        return d.x0 < 15 ? height - yHistScale(d.length) : 0;
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
    showAxis(xAxisHist);

    g.selectAll(".cough").transition().duration(0).attr("opacity", 0);

    // named transition to ensure
    // color change is not clobbered
    g.selectAll(".hist")
      .transition("color")
      .duration(500)
      .style("fill", "#008080");

    g.selectAll(".hist")
      .transition()
      .duration(1200)
      .attr("y", function (d) {
        return yHistScale(d.length);
      })
      .attr("height", function (d) {
        return height - yHistScale(d.length);
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
    showAxis(xAxisHist);

    g.selectAll(".hist")
      .transition()
      .duration(600)
      .attr("y", function (d) {
        return yHistScale(d.length);
      })
      .attr("height", function (d) {
        return height - yHistScale(d.length);
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
    g.select(".x.axis")
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
    g.select(".x.axis").transition().duration(500).style("opacity", 0);
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
    g.selectAll(".cough").transition().duration(0).attr("opacity", progress);

    g.selectAll(".hist")
      .transition("cough")
      .duration(0)
      .style("fill", function (d) {
        return d.x0 >= 14 ? coughColorScale(progress) : "#008080";
      });
  };

  /**
   * DATA FUNCTIONS
   *
   * Used to coerce the data into the
   * formats we need to visualize
   *
   */

  /**
   * getWords - maps raw data to
   * array of data objects. There is
   * one data object for each word in the speach
   * data.
   *
   * This function converts some attributes into
   * numbers and adds attributes used in the visualization
   *
   * @param rawData - data read in from file
   */
  getWords = (rawData) => {
    return rawData.map(function (d, i) {
      // is this word a filler word?
      d.filler = d.filler === "1" ? true : false;
      // time in seconds word was spoken
      d.time = +d.time;
      // time in minutes word was spoken
      d.min = Math.floor(d.time / 60);

      // positioning for square visual
      // stored here to make it easier
      // to keep track of.
      d.col = i % numPerRow;
      d.x = d.col * (squareSize + squarePad);
      d.row = Math.floor(i / numPerRow);
      d.y = d.row * (squareSize + squarePad);
      return d;
    });
  };

  /**
   * getFillerWords - returns array of
   * only filler words
   *
   * @param data - word data from getWords
   */
  getFillerWords = (data) => {
    return data.filter(function (d) {
      return d.filler;
    });
  };

  /**
   * getHistogram - use d3's histogram layout
   * to generate histogram bins for our word data
   *
   * @param data - word data. we use filler words
   *  from getFillerWords
   */
  getHistogram = (data) => {
    // only get words from the first 30 minutes
    var thirtyMins = data.filter(function (d) {
      return d.min < 30;
    });
    // bin data into 2 minutes chuncks
    // from 0 - 31 minutes
    // @v4 The d3.histogram() produces a significantly different
    // data structure then the old d3.layout.histogram().
    // Take a look at this block:
    // https://bl.ocks.org/mbostock/3048450
    // to inform how you use it. Its different!
    return d3
      .histogram()
      .thresholds(xHistScale.ticks(10))
      .value(function (d) {
        return d.min;
      })(thirtyMins);
  };

  /**
   * groupByWord - group words together
   * using nest. Used to get counts for
   * barcharts.
   *
   * @param words
   */
  groupByWord = (words) => {
    return d3
      .nest()
      .key(function (d) {
        return d.word;
      })
      .rollup(function (v) {
        return v.length;
      })
      .entries(words)
      .sort(function (a, b) {
        return b.value - a.value;
      });
  };

  /**
   * activate -
   *
   * @param index - index of the activated section
   */
  activate = (index) => {
    activeIndex = index;
    var sign = activeIndex - lastIndex < 0 ? -1 : 1;
    var scrolledSections = d3.range(lastIndex + sign, activeIndex + sign, sign);
    scrolledSections.forEach(function (i) {
      activateFunctions[i]();
    });
    lastIndex = activeIndex;
  };

  /**
   * update
   *
   * @param index
   * @param progress
   */
  update = function (index, progress) {
    updateFunctions[index](progress);
  };
}

/**
 * display - called once data
 * has been loaded.
 * sets up the scroller and
 * displays the visualization.
 *
 * @param data - loaded tsv data
 */
function display(data) {
  // create a new plot and
  // display it
  var plot = scrollVis();
  d3.select("#vis").datum(data).call(plot);

  // setup scroll functionality
  var scroll = scroller().container(d3.select("#graphic"));

  // pass in .step selection as the steps
  scroll(d3.selectAll(".step"));

  // setup event handling
  scroll.on("active", function (index) {
    // highlight current step text
    d3.selectAll(".step").style("opacity", function (d, i) {
      return i === index ? 1 : 0.1;
    });

    // activate current section
    plot.activate(index);
  });

  scroll.on("progress", function (index, progress) {
    plot.update(index, progress);
  });
}
