import React from "react";
import ReactDOM from "react-dom";
import ready from "domready";
import App from "./app";

ready(() => {
  const root = document.getElementById("editor");
  ReactDOM.render(<App />, root);
});
