import React from "react";
import "./App.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../node_modules/bootstrap/dist/js/bootstrap.bundle.js";
import "mapbox-gl/dist/mapbox-gl.css";

import AllRoutes from "./allRoutes/AllRoutes";

function App() {
  return (
    <>
      <AllRoutes />
    </>
  );
}

export default App;
