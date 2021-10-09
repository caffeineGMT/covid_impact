import React from "react";

export default class Introduction extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.imagePath = "image/activity.jpg";
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
            <h1 className="text-left" style={{ fontSize: "4em" }}>
              Introduction
            </h1>
          </div>
          <div className="col-6 text-justify">
            <p>
              Coronaviruses are a large family of viruses that are known to
              cause illness ranging from the common cold to more severe diseases
              such as Middle East Respiratory Syndrome (MERS) and Severe Acute
              Respiratory Syndrome (SARS). A novel coronavirus (COVID-19) was
              identified in 2019 in Wuhan, China. This is a new coronavirus that
              has not been previously identified in humans. This course provides
              a general introduction to COVID-19 and emerging respiratory
              viruses and is intended for public health professionals, incident
              managers and personnel working for the United Nations,
              international organizations and NGOs. As the official disease name
              was established after material creation, any mention of nCoV
              refers to COVID-19, the infectious disease caused by the most
              recently discovered coronavirus.
            </p>
            <br />
            <p>
              Coronaviruses are a large family of viruses that are known to
              cause illness ranging from the common cold to more severe diseases
              such as Middle East Respiratory Syndrome (MERS) and Severe Acute
              Respiratory Syndrome (SARS). A novel coronavirus (COVID-19) was
              identified in 2019 in Wuhan, China. This is a new coronavirus that
              has not been previously identified in humans. This course provides
              a general introduction to COVID-19 and emerging respiratory
              viruses and is intended for public health professionals, incident
              managers and personnel working for the United Nations,
              international organizations and NGOs. As the official disease name
              was established after material creation, any mention of nCoV
              refers to COVID-19, the infectious disease caused by the most
              recently discovered coronavirus.
            </p>
            <br />
            <p>
              Coronaviruses are a large family of viruses that are known to
              cause illness ranging from the common cold to more severe diseases
              such as Middle East Respiratory Syndrome (MERS) and Severe Acute
              Respiratory Syndrome (SARS). A novel coronavirus (COVID-19) was
              identified in 2019 in Wuhan, China. This is a new coronavirus that
              has not been previously identified in humans.
            </p>
          </div>
          <div className="col-6">
            <img src={`${this.imagePath}`} style={{ width: "100%" }} />
            <p className="text-right" id="credit">
              photo credit @MUTI
            </p>
          </div>
        </div>
      </div>
    );
  }
}
