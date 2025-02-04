// PredictionContext.jsx

import React, { createContext, useState, useContext } from "react";

const PredictionContext = createContext();

export const PredictionProvider = ({ children }) => {
  const [prediction, setPrediction] = useState(null);

  return (
    <PredictionContext.Provider value={{ prediction, setPrediction }}>
      {children}
    </PredictionContext.Provider>
  );
};

export const usePrediction = () => useContext(PredictionContext);
