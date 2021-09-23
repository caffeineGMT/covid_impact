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
    const steps = d3.selectAll(".step");
    const scroller = new Scroller(steps);
    const sections = new Sections();
  };

  render() {
    return (
      <div>
        this is a test<div></div>
      </div>
    );
  }
}
