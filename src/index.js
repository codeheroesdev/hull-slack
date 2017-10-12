import React from "react";
import ReactDOM from "react-dom";
import ready from "domready";

import { queryParams } from "./utils";
import App from "./app";

ready(() => {
  const config = queryParams();

  const root = document.getElementById("editor");
  ReactDOM.render(<App config={config}/>, root);
});
