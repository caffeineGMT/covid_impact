/**
 * ref: https://github.com/vlandham/scroll_demo/blob/gh-pages/js/scroller.js
 * handles the details of figuring out which section the user is currently scrolled to
 */
import * as d3 from "d3";

export default class Scroller {
  /**
   * Sets up scroller to monitor scrolling of els selection.
   * @param elements - d3 selection of
   *  elements that will be scrolled
   *  through by user.
   */
  constructor(elements) {
    this.container = d3.select("#sections");
    // event dispatcher
    this.dispatch = d3.dispatch("active", "progress");
    // d3 selection of all the text sections that will be scrolled thru
    this.sections = elements;
    // array that will hold the y coordinate of each section that is scrolled through
    this.sectionPositions = [];
    this.currentIndex = -1;
    // y coordinate of container start
    this.containerStart = 0;

    // when window is scrolled call position. When it is resized call resize.
    // .scroller namespace
    d3.select(window)
      .on("scroll.scroller", this.position)
      .on("resize.scroller", this.resize);

    // manually call resize initially to setup scroller.
    this.resize();

    // hack to get position to be called once for the scroll position on load.
    // let timer = d3.timer(function () {
    //   this.position();
    //   timer.stop();
    // });
  }

  /**
   * resize - called initially and also when page is resized.
   * Resets the sectionPositions
   */
  resize = () => {
    // sectionPositions will be each sections starting position relative to the top of the first section.
    this.sectionPositions = [];
    let startPos;
    this.sections.each((d, i, nodes) => {
      let top = nodes[i].getBoundingClientRect().top;
      if (i === 0) startPos = top;
      this.sectionPositions.push(top - startPos);
    });
    // container's relative pos to viewport + the absolute pos of viewport in document
    this.containerStart =
      this.container.node().getBoundingClientRect().top + window.scrollY;
  };

  /**
   * position - get current users position.
   * if user has scrolled to new section,
   * dispatch active event with new section
   * index.
   */
  position = () => {
    let pos = window.scrollY - 10 - this.containerStart;
    let sectionIndex = d3.bisect(this.sectionPositions, pos);
    sectionIndex = Math.min(this.sections.size() - 1, sectionIndex);
    console.log(sectionIndex);
    if (this.currentIndex !== sectionIndex) {
      this.dispatch.call("active", this, sectionIndex);
      this.currentIndex = sectionIndex;
    }
    let prevIndex = Math.max(sectionIndex - 1, 0);
    let prevTop = this.sectionPositions[prevIndex];
    let progress =
      (pos - prevTop) / (this.sectionPositions[sectionIndex] - prevTop);
    this.dispatch.call("progress", this, this.currentIndex, progress);
  };

  /**
   * container - get/set the parent element
   * of the sections. Useful for if the
   * scrolling doesn't start at the very top
   * of the page.
   * @param value - the new container value
   */
  container = function (value) {
    if (arguments.length === 0) {
      return this.container;
    }
    this.container = value;
    return this;
  };

  // implements a .on method to pass in a callback to the dispatcher.
  on = (action, callback) => {
    this.dispatch.on(action, callback);
  };
}
