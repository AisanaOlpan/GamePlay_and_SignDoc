import React, { Component } from "react";
import classes from "./hoc/Layout/Layout.module.css";

import PlayGame from "./containers/main/PlayGame";
import SignDoc from "./containers/main/SignDoc";

function App() {
  return (
    <div className={classes.Layout}>
      <main>
        <PlayGame />
      </main>
    </div>
  );
}
export default App;
