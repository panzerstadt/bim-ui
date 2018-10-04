import React, { Component } from "react";
import ComponentEditor from "../components/ComponentEditor";
import ComponentCarousel from "../components/ComponentCarousel";

const editorPageSyle = {
  height: "100vh",
  width: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-around",
  alignItems: "center",

  background: "linear-gradient(#e4e0ba, #f0ab7a)"
};

export default class EditorPage extends Component {
  render() {
    return (
      <div style={editorPageSyle}>
        <ComponentEditor />
        <ComponentCarousel />
      </div>
    );
  }
}
