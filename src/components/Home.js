import { index } from "d3-array";
import React from "react";

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.imagePath = "image/doctor.jpg";
  }

  render() {
    return (
      <React.Fragment>
        <div
          className="home container-fluid"
          id="home"
          style={{
            height: window.innerHeight,
            backgroundImage: `url(${this.imagePath})`,
            backgroundSize: "cover",
            backgroundAttachment: "fixed",
            color: "black",
          }}
        >
          <div className="row">
            <div className="col-12">
              <h1>Issues with Tissues</h1>
              <p>
                The COVID-19 pandemic and resulting economic crisis had an
                impact on almost every aspect of our life, including household
                items, stock, gas, how we work, how we live, among many other
                things. The question of this research trying to ask is:
                <br />
                <br />
                <br />
                <h3>Are they all bad effects? </h3>
              </p>
              <p id="credit">photo credit @Bryan Vectorartist</p>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
