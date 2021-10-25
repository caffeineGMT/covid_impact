import React from "react";

export default class VerticalNav extends React.Component {
  constructor(props) {
    super(props);
  }

  handleClick = () => {
    const element = document.getElementsByClassName("animal");
    console.log(element);
    // element.scrollToIntoView();
  };

  render() {
    return (
      <div id="cd-vertical-nav">
        <ul>
          <li>
            <a href="#home" onClick={() => this.handleClick()}>
              <span className="cd-dot"></span>
              <span className="cd-label">Home</span>
            </a>
          </li>
          <li>
            <a href="#introduction">
              <span className="cd-dot"></span>
              <span className="cd-label">Introduction</span>
            </a>
          </li>
          <li>
            <a href="#toilet">
              <span className="cd-dot"></span>
              <span className="cd-label">Toilet Paper</span>
            </a>
          </li>
          <li>
            <a href="#stock">
              <span className="cd-dot"></span>
              <span className="cd-label">Stock</span>
            </a>
          </li>
          <li>
            <a href="#animal">
              <span className="cd-dot"></span>
              <span className="cd-label">Animal Adoption</span>
            </a>
          </li>
          <li>
            <a href="#co2">
              <span className="cd-dot"></span>
              <span className="cd-label">CO2</span>
            </a>
          </li>
          <li>
            <a href="#reflection">
              <span className="cd-dot"></span>
              <span className="cd-label">Reflection</span>
            </a>
          </li>
        </ul>
      </div>
    );
  }
}
