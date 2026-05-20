import tensorflow as tf
from tensorflow.keras import layers, models
import os

def create_model():
    """
    Creates a simple Convolutional Neural Network (CNN) for Plant Disease Detection.
    Input size: 224x224 RGB images.
    Output: 10 classes (Tomato, Potato, Corn variations).
    """
    model = models.Sequential([
        # Data Augmentation layer could be added here in a real scenario
        layers.Input(shape=(224, 224, 3)),
        
        # Block 1
        layers.Conv2D(32, (3, 3), activation='relu', padding='same'),
        layers.MaxPooling2D((2, 2)),
        
        # Block 2
        layers.Conv2D(64, (3, 3), activation='relu', padding='same'),
        layers.MaxPooling2D((2, 2)),
        
        # Block 3
        layers.Conv2D(128, (3, 3), activation='relu', padding='same'),
        layers.MaxPooling2D((2, 2)),
        
        # Classification head
        layers.Flatten(),
        layers.Dense(128, activation='relu'),
        layers.Dropout(0.5),
        layers.Dense(10, activation='softmax') # 10 classes as defined in main.py
    ])
    
    model.compile(optimizer='adam',
                  loss='sparse_categorical_crossentropy',
                  metrics=['accuracy'])
    
    return model

if __name__ == "__main__":
    # Create an untrained model and save it for demonstration purposes.
    # In a real scenario, you would train this model on the PlantVillage dataset first.
    print("Generating a dummy untrained model for the API...")
    model = create_model()
    model.summary()
    
    model_path = 'model.h5'
    model.save(model_path)
    print(f"Saved dummy model to {os.path.abspath(model_path)}")
