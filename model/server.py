from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import numpy as np
import tensorflow as tf
import io

app = FastAPI()

# Enable CORS (Allows frontend apps to make API requests)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all domains for now
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the trained digit recognition model
model = tf.keras.models.load_model("digit_recognition_model.h5")

def preprocess_image(image: Image.Image):
    """Convert image to grayscale, resize, normalize, and reshape for model input."""
    image = image.convert("L")  # Convert to grayscale
    image = image.resize((28, 28))  # Resize to 28x28
    image_array = np.array(image) / 255.0  # Normalize pixel values (0 to 1)
    image_array = image_array.reshape(1, 28, 28, 1)  # Reshape for model input
    return image_array

@app.post("/predict/")
async def predict_digit(file: UploadFile = File(...)):
    """Predict digit from uploaded image."""
    try:
        # Read image from the uploaded file
        image = Image.open(io.BytesIO(await file.read()))

        # Preprocess the image
        image_array = preprocess_image(image)

        # Predict using the model
        prediction = model.predict(image_array)
        predicted_digit = int(np.argmax(prediction))  # Get highest probability class

        return {"predicted_digit": predicted_digit}

    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=5000)
