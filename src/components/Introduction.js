// ref: https://www.pewresearch.org/2021/03/05/in-their-own-words-americans-describe-the-struggles-and-silver-linings-of-the-covid-19-pandemic/
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
              The past year has transformed nearly every aspect of our world.
              Seemingly overnight, the quirky became mundane. Meanwhile, our
              friends, family, colleagues, and communities have had their lives
              changed in critical ways that promise to have much longer-lasting
              effects. Living through a global pandemic has driven dramatic
              shifts in our jobs, eating habits, childcare, and even our
              collective sense of time. Virtually no one has been left untouched
              after 12 months of such dramatic disruption. A generous dose of
              empathy and understanding of that truth will make us all stronger
              as we rebuild and remake our world in the year ahead.
            </p>
            <br />
            <p>
              Pew Research Center has been asking survey questions over the past
              year about Americans’ views and reactions to the COVID-19
              pandemic. In August, they gave the public a chance to tell in
              their own words how the pandemic has affected them in their
              personal lives. According to the report, the vast majority of
              Americans <span>(89%)</span> mentioned at least one negative
              change in their own lives, while a smaller share
              <span>(73%)</span> mentioned at least one unexpected upside. Most
              have experienced these negative impacts and silver linings
              simultaneously: Two-thirds <span>(67%)</span> of Americans
              mentioned at least one negative and at least one positive change
              since the pandemic began.
            </p>
            <br />
            <p>
              Obviously, the impact of COVID-19 is mixed with bad and good
              things. This research will revisit such influence in data format
              from many facets in order to see how COVID-19 changed our life.
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
