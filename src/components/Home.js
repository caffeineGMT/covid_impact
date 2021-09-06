import React from "react";

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.backgroundImagePath = "toilet_paper.png";
  }

  render() {
    return (
      <div
        className="co2 container-fluid "
        style={{
          backgroundImage: `url(${this.backgroundImagePath})`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center right 20%",
          backgroundSize: "8%",
          height: 900,
          display: "flex",
          alignItems: "center",
        }}
      >
        <div className="row " style={{ width: "45%" }}>
          <h1 className="col-md-12 text-left" style={{ fontSize: "4em" }}>
            Issues with Tissues
          </h1>
          <p className="col-md-12 text-justify">
            The COVID-19 pandemic and resulting economic crisis had an impact on
            almost every aspect of our life, including toilet paper, stock, gas,
            how we work, how we live and among many others. Is it all bad
            effects?
            <br />
            <br />
            <br />
          </p>
          <h3 className="col-md-12 text-justify">Not really.</h3>
        </div>
      </div>
    );
  }
}
