import React from "react";

export default class VericalNav extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div id="cd-vertical-nav">
        <ul>
          <li>
            <a href="#section1">
              <span className="cd-dot"></span>
              <span className="cd-label">Home</span>
            </a>
          </li>
          <li>
            <a href="#section2">
              <span className="cd-dot"></span>
              <span className="cd-label">Introduction</span>
            </a>
          </li>
          <li>
            <a href="#section3">
              <span className="cd-dot"></span>
              <span className="cd-label">Animal Adoption</span>
            </a>
          </li>
          <li>
            <a href="#section4">
              <span className="cd-dot"></span>
              <span className="cd-label">CO2</span>
            </a>
          </li>
          <li>
            <a href="#section5">
              <span className="cd-dot"></span>
              <span className="cd-label">Rent</span>
            </a>
          </li>
          <li>
            <a href="#section6">
              <span className="cd-dot"></span>
              <span className="cd-label">Food Delivery</span>
            </a>
          </li>
          <li>
            <a href="#section7">
              <span className="cd-dot"></span>
              <span className="cd-label">Stock</span>
            </a>
          </li>
        </ul>
      </div>
    );
  }
}
