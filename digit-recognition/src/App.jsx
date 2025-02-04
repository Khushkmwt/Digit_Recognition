import React from "react";
import { PredictionProvider } from "./PredictionContext.jsx";
import Canvas from "./canvas.jsx";
import PredictionResult from "./PredictionResult.jsx";

const App = () => {
  return (
    <PredictionProvider>
      <div style={{ background: "black", padding: "20px" }}>
        <h1 style={{ color: "white" }}>Digit Recognition</h1>
        <Canvas />
        <PredictionResult />
      </div>
    </PredictionProvider>
  );
};

export default App;
