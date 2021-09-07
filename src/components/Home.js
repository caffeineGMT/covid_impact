import React from "react";

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.imagePath = "image/toilet_paper.png";
  }

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
        <div className="row">
          <div className="col-md-8 text-justify">
            <h1 style={{ fontSize: "4em" }}>Issues with Tissues</h1>
            <p>
              The COVID-19 pandemic and resulting economic crisis had an impact
              on almost every aspect of our life, including toilet paper, stock,
              gas, how we work, how we live and among many others. Is it all bad
              effects?
              <br />
              <br />
              <br />
            </p>
            <h3>Not really.</h3>
          </div>
          <div className="col-md-4">
            <img src={`${this.imagePath}`} style={{ width: "25%" }} />
          </div>
        </div>
      </div>
    );
  }
}
