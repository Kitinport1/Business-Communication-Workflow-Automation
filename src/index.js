import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// Import Bootstrap apenas para estilos
import "bootstrap/dist/css/bootstrap.min.css";
// Import custom styles (sobrescreve Bootstrap)
import "./assets/styles/main.scss";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
