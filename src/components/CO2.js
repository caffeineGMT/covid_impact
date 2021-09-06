import React from "react";

export default class CO2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="co2 container-fluid">
        <div className="row align-items-center">
          <h5 className="col-md-12 text-center">CO2 change</h5>
          <p className="col-md-12 text-justify">
            The COVID-19 pandemic and resulting economic crisis had an impact on
            almost every aspect of how energy is produced, supplied, and
            consumed around the world. The pandemic defined energy and emissions
            trends in 2020 – it drove down fossil fuel consumption for much of
            the year, whereas renewables and electric vehicles, two of the main
            building blocks of clean energy transitions, were largely immune. As
            primary energy demand dropped nearly 4% in 2020, global
            energy-related CO2 emissions fell by 5.8% according to the latest
            statistical data, the largest annual percentage decline since World
            War II. In absolute terms, the decline in emissions of almost 2 000
            million tonnes of CO2 is without precedent in human history –
            broadly speaking, this is the equivalent of removing all of the
            European Union’s emissions from the global total. Demand for fossil
            fuels was hardest hit in 2020 – especially oil, which plunged 8.6%,
            and coal, which dropped by 4%. Oil’s annual decline was its largest
            ever, accounting for more than half of the drop in global emissions.
            Global emissions from oil use plummeted by well over 1 100 Mt CO2,
            down from around 11 400 Mt in 2019. The drop in road transport
            activity accounted for 50% of the decline in global oil demand, and
            the slump in the aviation sector for around 35%. Meanwhile,
            low-carbon fuels and technologies, in particular, solar PV and wind,
            reached their highest ever annual share of the global energy mix,
            increasing it by more than one percentage point to over 20%.
          </p>
        </div>
      </div>
    );
  }
}
