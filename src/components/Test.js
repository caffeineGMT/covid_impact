import React from "react";
import * as d3 from "d3";
import Scroller from "./Scroller";
import Sections from "./Sections";

export default class Test extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount = () => {
    // this.another();
    const steps = d3.selectAll(".step");
    const scroller = new Scroller(steps);
    const sections = new Sections();
  };

  another = () => {
    const container = d3.select("body");
    console.log(container);
    // event dispatcher
    const dispatch = d3.dispatch("active", "progress");
    // d3 selection of all the text sections that will be scrolled through
    let sections = null;
    // array that will hold the y coordinate of each section that is scrolled through
    let sectionPositions = [];
    let currentIndex = -1;
    // y coordinate of container start
    let containerStart = 0;
  };

  render() {
    return (
      <div>
        this is a test<div></div>
      </div>
    );
  }
}
