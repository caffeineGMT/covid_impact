/*
ref: 
https://bl.ocks.org/Andrew-Reid/aa5d4329d7e85075391e003c09c8283d 
https://stackoverflow.com/questions/54344073/how-to-achieve-disc-shape-in-d3-force-simulation
https://www.theguardian.com/us-news/ng-interactive/2017/dec/20/bussed-out-america-moves-homeless-people-country-studys
*/

import React from "react";
import * as d3 from "d3";

export default class CO2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.canvasRef = React.createRef();
    this.width = (window.innerWidth * 3) / 4;
    this.height = window.innerWidth / 3;
    this.context = null;

    this.nodes = [];
    this.strength = -0.25; // default repulsion
    this.centeringStrength = 0.01; // power of centering force for two clusters
    this.velocityDecay = 0.15; // velocity decay: higher value, less overshooting
    this.outerRadius = this.height / 2; // new nodes within this radius
    this.innerRadius = (1 / 3) * this.outerRadius; // new nodes outside this radius, initial nodes within.
    this.start = [this.width / 4, this.height / 2]; // new nodes/initial nodes center point
    this.end = [this.width * (3 / 4), this.height / 2]; // destination center
    this.n = 1000; // number of initial nodes
    this.cycles = 100; // number of ticks before stopping.
    this.tick = 0;
    this.simulation = null;
  }

  componentDidMount = () => {
    const canvas = d3.select(this.canvasRef.current);
    canvas.attr("width", this.width).attr("height", this.height);
    this.context = canvas.node().getContext("2d");
    this.draw();
  };

  // create a random node
  random = () => {
    const angle = Math.random() * Math.PI * 2;
    const dis =
      Math.random() * (this.outerRadius - this.innerRadius) + this.innerRadius;
    const x = Math.cos(angle) * dis + this.start[0];
    const y = Math.sin(angle) * dis + this.start[1];

    return {
      x: x,
      y: y,
      strength: this.strength,
      migrated: false,
    };
  };

  draw = () => {
    // clean-up
    if (this.simulation != null) {
      this.simulation.stop();
      this.simulation = null;
    }
    this.tick = 0;
    this.nodes = [];

    // init
    for (let i = 0; i < this.n; i++) {
      this.nodes.push(this.random());
    }

    // create simulation
    this.simulation = d3
      .forceSimulation()
      .force(
        "charge",
        d3.forceManyBody().strength((d) => d.strength)
      )
      .force(
        "x",
        d3
          .forceX()
          .x((d) => (d.migrated ? this.end[0] : this.start[0]))
          .strength(this.centeringStrength)
      )
      .force(
        "y",
        d3
          .forceY()
          .y((d) => (d.migrated ? this.end[1] : this.start[1]))
          .strength(this.centeringStrength)
      )
      .alphaDecay(0)
      .velocityDecay(this.velocityDecay)
      .nodes(this.nodes)
      .on("tick", this.handleTick);
  };

  handleTick = () => {
    // stop condition
    if (this.tick > 300) {
      this.simulation.stop();
      this.simulation = null;
      console.log("hit");
      return;
    }

    // update tick and nodes
    this.tick++;
    this.simulation.nodes(this.nodes);
    if (this.tick <= this.cycles) {
      const migrating = this.simulation.find(
        (Math.random() - 0.5) * 50 + this.start[0],
        (Math.random() - 0.5) * 50 + this.start[1],
        10
      );
      if (migrating) migrating.migrated = true;
    }

    // clear canvas and draw updated dot
    this.context.clearRect(0, 0, this.width, this.height);
    this.nodes.forEach((d) => {
      this.context.beginPath();
      this.context.fillStyle = d.migrated ? "#75d1f3" : "orange";
      this.context.arc(d.x, d.y, 2, 0, Math.PI * 2);
      this.context.fill();
    });
  };

  handleClick = () => {
    this.draw();
  };

  render() {
    return (
      <div
        className="co2 container-fluid d-flex align-items-center "
        id="co2"
        style={{
          height: window.innerHeight,
        }}
      >
        <div className="row">
          <div className="col-12">
            <h1 className="">CO2 change</h1>
          </div>
          <div className="col-4">
            <p className="text-justify">
              The COVID-19 pandemic and resulting economic crisis had an impact
              on almost every aspect of how energy is produced, supplied, and
              consumed around the world. The pandemic defined energy and
              emissions trends in 2020 – it drove down fossil fuel consumption
              for much of the year, whereas renewables and electric vehicles,
              two of the main building blocks of clean energy transitions, were
              largely immune. As primary energy demand dropped nearly{" "}
              <span>4%</span> in 2020, global energy-related CO2 emissions fell
              by <span>5.8%</span> according to the latest statistical data, the
              largest annual percentage decline since World War II.
              <br />
              <br />
              In absolute terms, the decline in emissions CO2 is without
              precedent in human history – broadly speaking, this is the
              equivalent of removing all of the European Union’s emissions from
              the global total.
            </p>
            <br />
            <br />
            <button
              type="button"
              className="btn btn-outline-light"
              onClick={this.handleClick}
            >
              play / replay
            </button>
          </div>
          <div className="col-8">
            <div className="row">
              <div className="col-12 d-flex align-items-center justify-content-center">
                <span
                  style={{
                    height: 15,
                    width: 15,
                    backgroundColor: "orange",
                    borderRadius: "50%",
                    display: "inline-block",
                  }}
                ></span>
                <span>
                  &nbsp; &nbsp; &nbsp;if one dot is representing 3 tons of CO2
                </span>
              </div>
              <canvas className="col-12" ref={this.canvasRef}></canvas>
              <div className="col-6">
                <h5 className="mx-auto">CO2 emissions in 2019</h5>
              </div>
              <div className="col-6">
                <h5 className="mx-auto">CO2 emissions decreased in 2020</h5>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
