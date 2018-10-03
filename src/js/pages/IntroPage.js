import React, { Component } from "react";
import logo from "../../logo.svg";

export default class IntroPage extends Component {
  render() {
    return (
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <a className="App-link" href="/editor" rel="noopener noreferrer">
          Go to Editor
        </a>
      </header>
    );
  }
}
