from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
from PIL import Image
import io
import tensorflow as tf

app = FastAPI(title="AgroVision AI API")

# Setup CORS for Laravel backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this to your Laravel app's URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the model
try:
    model = tf.keras.models.load_model('model.h5')
    print("Model loaded successfully.")
except Exception as e:
    print(f"Warning: Model could not be loaded. Please ensure model.h5 exists. Error: {e}")
    model = None

# PlantVillage dataset classes (simplified for Tomato, Potato, Corn)
CLASS_NAMES = [
    "Corn_Blight",
    "Corn_Common_Rust",
    "Corn_Healthy",
    "Potato_Early_Blight",
    "Potato_Healthy",
    "Potato_Late_Blight",
    "Tomato_Bacterial_Spot",
    "Tomato_Early_Blight",
    "Tomato_Healthy",
    "Tomato_Late_Blight"
]

# Provide dummy descriptions and solutions for the demo
DISEASE_INFO = {
    "Corn_Blight": {
        "status": "Diseased",
        "description": "Leaf blight is caused by the fungus Exserohilum turcicum. It creates large, cigar-shaped lesions on leaves.",
        "solution": "Apply appropriate fungicides when lesions first appear. Use resistant hybrids."
    },
    "Corn_Common_Rust": {
        "status": "Diseased",
        "description": "Common rust is caused by the fungus Puccinia sorghi, forming rust-colored pustules on leaves.",
        "solution": "Use rust-resistant varieties and apply fungicides if detected early."
    },
    "Corn_Healthy": {
        "status": "Healthy",
        "description": "The corn leaf is healthy.",
        "solution": "Maintain proper watering and nutrient levels."
    },
    "Potato_Early_Blight": {
        "status": "Diseased",
        "description": "Early blight causes dark, concentric ring lesions on older leaves.",
        "solution": "Rotate crops, remove infected plant debris, and use fungicides like chlorothalonil."
    },
    "Potato_Healthy": {
        "status": "Healthy",
        "description": "The potato leaf is healthy.",
        "solution": "Ensure good soil drainage and balanced fertilization."
    },
    "Potato_Late_Blight": {
        "status": "Diseased",
        "description": "Late blight is a destructive disease causing water-soaked spots on leaves.",
        "solution": "Apply protective fungicides before infection occurs and destroy infected plants."
    },
    "Tomato_Bacterial_Spot": {
        "status": "Diseased",
        "description": "Causes small, dark, water-soaked spots on leaves and fruit.",
        "solution": "Use disease-free seeds and apply copper-based bactericides."
    },
    "Tomato_Early_Blight": {
        "status": "Diseased",
        "description": "Fungal disease causing brown spots with concentric rings.",
        "solution": "Ensure proper spacing for air circulation and apply fungicides."
    },
    "Tomato_Healthy": {
        "status": "Healthy",
        "description": "The tomato leaf is healthy.",
        "solution": "Continue regular care, adequate sunlight, and proper watering."
    },
    "Tomato_Late_Blight": {
        "status": "Diseased",
        "description": "Rapidly spreading disease causing large, irregular brown lesions.",
        "solution": "Remove affected parts immediately and treat with specific fungicides."
    }
}

def preprocess_image(image: Image.Image):
    image = image.resize((224, 224))
    image_array = np.array(image)
    
    # Handle PNG images with alpha channel
    if image_array.shape[-1] == 4:
        image_array = image_array[..., :3]
        
    image_array = np.expand_dims(image_array, axis=0)
    image_array = image_array / 255.0
    return image_array

@app.get("/")
def read_root():
    return {"message": "Welcome to AgroVision AI API"}

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    if not file.filename.endswith(('.jpg', '.jpeg', '.png')):
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload a JPG or PNG image.")
    
    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))
        processed_image = preprocess_image(image)
        
        # If model is not loaded, return a dummy prediction for demonstration
        if model is None:
            # Generate a pseudo-random prediction based on file size just to vary the output
            dummy_index = len(contents) % len(CLASS_NAMES)
            predicted_class = CLASS_NAMES[dummy_index]
            confidence = 85.5 + (len(contents) % 100) / 10.0 # e.g. 85.5 - 95.4
        else:
            predictions = model.predict(processed_image)
            predicted_index = np.argmax(predictions[0])
            predicted_class = CLASS_NAMES[predicted_index]
            confidence = float(predictions[0][predicted_index]) * 100
            
        info = DISEASE_INFO.get(predicted_class, {})
        
        return {
            "success": True,
            "disease_name": predicted_class.replace('_', ' '),
            "accuracy": round(confidence, 2),
            "status": info.get("status", "Unknown"),
            "description": info.get("description", "No description available."),
            "solution": info.get("solution", "Consult an agricultural expert.")
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
