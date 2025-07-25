import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import './App.css'; // or index.css

import { BrowserRouter } from "react-router-dom"; //  Add this for routing

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
