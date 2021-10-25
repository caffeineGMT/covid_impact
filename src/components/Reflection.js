import React from "react";

export default class Introduction extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.imagePath = "image/ending.png";
  }

  render() {
    return (
      <div
        className="introduction container-fluid d-flex align-items-center"
        id="introduction"
        style={{
          height: window.innerHeight,
        }}
      >
        <div className="row">
          <div className="col-12">
            <h1 className="text-right" style={{ fontSize: "4em" }}>
              Reflection
            </h1>
          </div>
          <div className="col-6">
            <img src={`${this.imagePath}`} style={{ width: "100%" }} />
          </div>
          <div className="col-6 text-justify">
            <p>
              In many ways, the negatives clearly outweigh the positives.
              Eventually, it is still a pandemic that had killed more than
              730,000 Americans. However, we cannot ignore the positive impacts
              such as energy, relationships, work-life-balance, and more. It is
              a mixed bag at the end of the day.
            </p>
            <br />
            <p>
              Globally, by claiming ownership over skills development and
              embracing remote work, employees have been able to take more
              control of their careers and professional growth. For many, the
              ‘new normal’ has enabled organizations to pinpoint growth
              opportunities and advance digitization. We see how leading
              companies have placed greater emphasis on advancing cutting-edge
              technologies and fostering digital collaboration. Executives have
              found that the crisis has created significant opportunities for
              their organizations, it has accelerated their digital
              transformation efforts. The slowdown effect of the lock-down has
              afforded respondents greater control over how they allocate their
              time, with many grateful for the opportunity to reevaluate their
              priorities. We all appreciated the opportunity to reconnect with
              what’s important to us, with parents particularly grateful to have
              more flexible hours at their disposal.
            </p>
          </div>
        </div>
      </div>
    );
  }
}
