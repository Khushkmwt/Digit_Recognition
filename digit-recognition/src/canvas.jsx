import React, { useRef, useState, useEffect } from "react";

const Canvas = () => {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [prediction, setPrediction] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = 280;
    canvas.height = 280;
    const ctx = canvas.getContext("2d");

    // Set drawing settings
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 10;
    ctx.strokeStyle = "white";
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height); // Black background

    ctxRef.current = ctx;
  }, []);

  const startDrawing = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = e.nativeEvent;
    ctxRef.current.lineTo(offsetX, offsetY);
    ctxRef.current.stroke();
  };

  const stopDrawing = () => {
    ctxRef.current.closePath();
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    ctxRef.current.fillRect(0, 0, canvas.width, canvas.height); // Reset to black
    setPrediction(null);
  };

  const submitDrawing = async () => {
    const canvas = canvasRef.current;
    const imageBlob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
    const formData = new FormData();
    formData.append("file", imageBlob, "digit.png");

    try {
      const response = await fetch("https://digit-recognition-cd3g.onrender.com/predict/", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setPrediction(data.predicted_digit);
      console.log(data);
    } catch (error) {
      console.error("Error sending image:", error);
    }
  };

  return (
    <div className="canvas-container" style={{ textAlign: "center", padding: "20px" }}>
      <h1 style={{ color: "#333", fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}>Handwritten Digit Recognizer</h1>
      
      <div className="canvas-box" style={{ marginBottom: "20px" }}>
        <canvas
          ref={canvasRef}
          style={{
            border: "4px solid #fff",
            background: "#222",
            borderRadius: "10px",
            cursor: "crosshair",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.5)",
          }}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
      </div>

      <div className="button-container" style={{ marginBottom: "20px" }}>
        <button
          onClick={clearCanvas}
          style={{
            padding: "10px 20px",
            marginRight: "10px",
            backgroundColor: "#ff6f61",
            border: "none",
            borderRadius: "5px",
            color: "white",
            cursor: "pointer",
            fontWeight: "bold",
            transition: "background-color 0.3s",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#ff8a7d")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#ff6f61")}
        >
          Clear
        </button>
        <button
          onClick={submitDrawing}
          style={{
            padding: "10px 20px",
            backgroundColor: "#4caf50",
            border: "none",
            borderRadius: "5px",
            color: "white",
            cursor: "pointer",
            fontWeight: "bold",
            transition: "background-color 0.3s",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#81c784")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#4caf50")}
        >
          Submit
        </button>
      </div>

      {prediction !== null && (
        <div
          className="prediction-box"
          style={{
            backgroundColor: "#444",
            color: "white",
            padding: "15px",
            borderRadius: "10px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.5)",
            maxWidth: "300px",
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          <h3>Predicted Digit:</h3>
          <p style={{ fontSize: "36px", fontWeight: "bold" }}>{prediction}</p>
        </div>
      )}
    </div>
  );
};

export default Canvas;
