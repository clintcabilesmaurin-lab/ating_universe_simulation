import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "../base.css";
import { GlobalContextProviders } from "../components/_globalContextProviders";
import SimulationPage from "../pages/_index";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <GlobalContextProviders>
        <SimulationPage />
      </GlobalContextProviders>
    </BrowserRouter>
  </React.StrictMode>
);
