import React from "react";
import { usePrediction } from "./PredictionContext.jsx";

const PredictionResult = () => {
  const { prediction } = usePrediction();

  return (
    <div>
      {prediction !== null ? (
        <h3 style={{ color: "white", marginTop: "10px" }}>
          Predicted Digit: {prediction}
        </h3>
      ) : (
        <h3 style={{ color: "white", marginTop: "10px" }}>
          Draw a digit and submit for prediction!
        </h3>
      )}
    </div>
  );
};

export default PredictionResult;
