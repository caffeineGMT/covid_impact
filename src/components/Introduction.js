import React from "react";

export default class Introduction extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.imagePath = "image/toilet_paper.png";
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
          <div className="col-md-8 text-justify">
            <h1 style={{ fontSize: "4em" }}>Introduction</h1>
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
            <br />
            <br />
            <br />
            <br />
            <br />
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
          </div>
          <div className="col-md-4">
            <img src={`${this.imagePath}`} style={{ width: "25%" }} />
          </div>
        </div>
      </div>
    );
  }
}
