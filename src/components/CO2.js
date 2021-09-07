import React from "react";
import * as d3 from "d3";

export default class CO2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount = () => {
    this.draw();
  };

  draw = () => {
    const canvas = d3.select("canvas");
    const width = +canvas.attr("width");
    const height = +canvas.attr("height");
    const context = canvas.node().getContext("2d");

    const nodes = [];
    const strength = -0.25; // default repulsion
    const centeringStrength = 0.01; // power of centering force for two clusters
    const velocityDecay = 0.15; // velocity decay: higher value, less overshooting
    const outerRadius = 250; // new nodes within this radius
    const innerRadius = 100; // new nodes outside this radius, initial nodes within.
    const startCenter = [250, 250]; // new nodes/initial nodes center point
    const endCenter = [710, 250]; // destination center
    const n = 200; // number of initial nodes
    const cycles = 1000; // number of ticks before stopping.

    // create a random node
    const random = () => {
      const angle = Math.random() * Math.PI * 2;
      const dis = innerRadius + Math.random() * (outerRadius - innerRadius);
      const x = Math.cos(angle) * dis + startCenter[0];
      const y = Math.cos(angle) * dis + startCenter[1];

      return {
        x: x,
        y: y,
        strength: strength,
        migrated: false,
      };
    };

    // initial nodes:
    for (let i = 0; i < n; i++) {
      nodes.push(random());
    }

    const simulation = d3
      .forceSimulation()
      .force(
        "charge",
        d3.forceManyBody().strength((d) => d.strength)
      )
      .force(
        "x1",
        d3
          .forceX()
          .x((d) => (d.migrated ? endCenter[0] : startCenter[0]))
          .strength(centeringStrength)
      )
      .force(
        "y1",
        d3
          .forceY()
          .y((d) => (d.migrated ? endCenter[1] : startCenter[1]))
          .strength(centeringStrength)
      )
      .alphaDecay(0)
      .velocityDecay(velocityDecay)
      .nodes(nodes)
      .on("tick", ticked);

    let tick = 0;

    const ticked = () => {
      tick++;

      if (tick > cycles) this.stop();

      nodes.push(random());
      this.nodes(nodes);

      const migrating = simulation.find(
        (Math.random() - 0.5) * 50 + startCenter[0],
        (Math.random() - 0.5) * 50 + startCenter[1],
        10
      );
      if (migrating) migrating.migrated = true;

      context.clearRect(0, 0, width.height);

      nodes.forEach((d) => {
        context.beginPath();
        context.fillStyle = d.migrated ? "steelblue" : "orange";
        context.arc(d.x, d.y, 3, 0, Math.PI * 2);
        context.fill();
      });
    };
  };

  render() {
    return (
      <div
        className="co2 container-fluid"
        style={{
          height: 900,
          display: "flex",
          alignItems: "center",
        }}
      >
        <div className="row mx-auto" style={{ width: "50%" }}>
          <div className="col-md-12">
            <h4 className="text-center">CO2 change</h4>
            <p className="text-justify">
              The COVID-19 pandemic and resulting economic crisis had an impact
              on almost every aspect of how energy is produced, supplied, and
              consumed around the world. The pandemic defined energy and
              emissions trends in 2020 – it drove down fossil fuel consumption
              for much of the year, whereas renewables and electric vehicles,
              two of the main building blocks of clean energy transitions, were
              largely immune. As primary energy demand dropped nearly 4% in
              2020, global energy-related CO2 emissions fell by 5.8% according
              to the latest statistical data, the largest annual percentage
              decline since World War II. In absolute terms, the decline in
              emissions of almost 2 000 million tonnes of CO2 is without
              precedent in human history – broadly speaking, this is the
              equivalent of removing all of the European Union’s emissions from
              the global total. Demand for fossil fuels was hardest hit in 2020
              – especially oil, which plunged 8.6%, and coal, which dropped by
              4%. Oil’s annual decline was its largest ever, accounting for more
              than half of the drop in global emissions. Global emissions from
              oil use plummeted by well over 1 100 Mt CO2, down from around 11
              400 Mt in 2019. The drop in road transport activity accounted for
              50% of the decline in global oil demand, and the slump in the
              aviation sector for around 35%. Meanwhile, low-carbon fuels and
              technologies, in particular, solar PV and wind, reached their
              highest ever annual share of the global energy mix, increasing it
              by more than one percentage point to over 20%.
            </p>
          </div>
        </div>
        {/* <canvas width="960" height="500"></canvas> */}
      </div>
    );
  }
}
