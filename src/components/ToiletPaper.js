/*
ref: https://github.com/vlandham/scroll_demo
https://vallandingham.me/think_you_can_scroll.html
https://github.com/vlandham/scroll_demo/blob/gh-pages/post.md
*/
import React from "react";

export default class ToiletPaper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.imagePath = "image/toilet_paper.png";
  }

  render() {
    return (
      <div
        className="toilet container-fluid"
        id="toilet"
        style={{
          height: 900,
          display: "flex",
          alignItems: "center",
        }}
      >
        <div className="container"></div>
      </div>
    );
  }
}
