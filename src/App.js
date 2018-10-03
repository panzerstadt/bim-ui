import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";

import EditorPage from "./js/pages/EditorPage";
import IntroPage from "./js/pages/IntroPage";

import "./App.css";

// this is where the App really starts
class App extends Component {
  render() {
    const IntroPageCompoent = () => {
      return <IntroPage />;
    };

    const EditorPageComponent = () => {
      return <EditorPage />;
    };

    return (
      <div className="App">
        <Switch>
          <Route exact path="/" component={IntroPageCompoent} />
          <Route exact path="/editor" component={EditorPageComponent} />
        </Switch>
      </div>
    );
  }
}

export default App;
