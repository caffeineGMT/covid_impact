/*
ref: https://github.com/vlandham/scroll_demo
https://vallandingham.me/think_you_can_scroll.html
https://github.com/vlandham/scroll_demo/blob/gh-pages/post.md
*/
import React from "react";
import Sections from "./Sections";

export default class ToiletPaper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount = () => {
    const sections = new Sections();
  };

  render() {
    return (
      <div className="container-fluid " id="toilet">
        <div className="row" id="graphic">
          <div className="col">
            <div id="sections">
              <section class="step">
                <div class="title">OpenVis Conf 2013</div>
                I did what no presenter should ever do: I watched my own talk.
                <br />
                <br />
                My first visit to OpenVis Conf in 2013.
              </section>
              <section class="step">
                <div class="title">Filler Words</div>
                As expected, I could only focus on the flaws: the rushed speech,
                the odd phrases, and, most especially, all the filler words. In
                fact, I found 180 filler words in my 30 minute talk.
              </section>
              <section class="step">
                <div class="title">My Talk</div>
                Here are all 5,040 words of my talk.
              </section>
              <section class="step">
                <div class="title">My Stumbles</div>
                And here are all the fillers I used in those 30 minutes.
              </section>
              <section class="step">
                <div class="title">Um's, Ah's &amp; Uh's</div>I almost
                exclusively used these three fillers. Um's and Ah's made up over
                80%, with Uh's trailing behind.
              </section>
              <section class="step">
                <div class="title">Fillers Over Time</div>I hoped that all these
                blunders were toward the beginning of my talk. And the data
                suggests that fewer fillers are used as I get into it. Perhaps
                the talk started out rough and improved as I found my groove.
              </section>
              <section class="step">
                <div class="title">Ramping Back Up</div>
                Unfortunately, the trend does not continue. Midway into the talk
                my Um's and Ah's spike. I continue to use them pretty
                consistently throughout the rest of the talk.
              </section>
              <section class="step">
                <div class="title">The Cough Effect</div>
                My theory is that at this critical halfway point in my talk, I
                heard a dry cough indicative of the audience's waning interest.
                This caused self-confidence to collapse and forced me out of my
                groove.
                <br />
                <br />A competing theory is that I just hadn't practiced the
                last half of my speech as much.
              </section>
              <section class="step">
                <div class="title">Best of Luck to Me in 2015</div>
                The world may never know, or care, but hopefully these insights
                improve my speaking in 2015. Though preliminary results aren't
                looking so good.
              </section>
            </div>
          </div>
          <div className="col">
            <div id="vis"></div>
          </div>
        </div>
      </div>
    );
  }
}
