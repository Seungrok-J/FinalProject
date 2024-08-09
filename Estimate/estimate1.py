import sys
import tensorflow as tf
from tensorflow.keras import layers, models
import numpy as np
import random
import os
from PIL import Image
import pytesseract
import pandas as pd
import re

# Tesseract 실행 파일 경로 설정
pytesseract.pytesseract.tesseract_cmd = '/opt/homebrew/bin/tesseract'

def setup_environment():
    seed = 32
    tf.random.set_seed(seed)
    np.random.seed(seed)
    random.seed(seed)
    os.environ['PYTHONHASHSEED'] = str(seed)

def build_model(data_dir):
    img_height, img_width, batch_size = 32, 32, 9
    train_ds, val_ds = setup_datasets(data_dir, img_height, img_width, batch_size)
    model = models.Sequential([
        layers.Conv2D(32, (3, 3), activation='relu', input_shape=(32, 32, 3)),
        layers.MaxPooling2D((2, 2)),
        layers.BatchNormalization(),
        layers.Dropout(0.3),
        layers.Conv2D(64, (3, 3), activation='relu'),
        layers.MaxPooling2D((2, 2)),
        layers.BatchNormalization(),
        layers.Conv2D(64, (3, 3), activation='relu'),
        layers.BatchNormalization(),
        layers.Dropout(0.4),
        layers.Flatten(),
        layers.Dense(64, activation='relu'),
        layers.Dense(2 if data_dir.endswith('AL_angle45') else 3, activation='softmax')
    ])
    model.compile(optimizer=tf.keras.optimizers.Adam(learning_rate=0.0001), loss='sparse_categorical_crossentropy', metrics=['accuracy'])
    model.fit(train_ds, validation_data=val_ds, epochs=10)
    return model

def setup_datasets(data_dir, img_height, img_width, batch_size):
    train_ds = tf.keras.utils.image_dataset_from_directory(
        data_dir,
        validation_split=0.2,
        subset="training",
        seed=32,
        image_size=(img_height, img_width),
        batch_size=batch_size,
        color_mode='rgb',
    )
    val_ds = tf.keras.utils.image_dataset_from_directory(
        data_dir,
        validation_split=0.2,
        subset="validation",
        seed=32,
        image_size=(img_height, img_width),
        batch_size=batch_size,
        color_mode='rgb',
    )
    return train_ds, val_ds

def predict_single_image(model, img_path, img_height, img_width):
    img = tf.io.read_file(img_path)
    img = tf.io.decode_image(img, channels=3, expand_animations=False)
    img = tf.image.resize(img, [img_height, img_width])
    img = tf.expand_dims(img, 0)  # 배치 차원 추가
    predictions = model.predict(img)
    return np.argmax(predictions)

def classify_image(data_dir, img_path):
    model = build_model(data_dir)
    label = predict_single_image(model, img_path, 32, 32)
    return label

def process_image(image_path, width, height, depth):
    image = Image.open(image_path)
    text = pytesseract.image_to_string(image, lang='eng')
    csv_path = '/Users/jeongseungrok/Desktop/SFac Solution/springboot-app/Estimate/material.csv'
    material_df = pd.read_csv(csv_path)
    materials = material_df['Material'].tolist()
    ocr_words = re.findall(r'\w+', text)
    found_materials = [material for material in materials if material in ocr_words]
    density_value = None
    material_value = None

    if found_materials:
        for material in found_materials:
            density_value = material_df.loc[material_df['Material'] == material, '비중'].values[0]
            if material.startswith('A'):
                label = classify_image('/Users/jeongseungrok/Desktop/SFac Solution/springboot-app/Estimate/data/AL_angle45', image_path)
                material_value = 6800 if label == "plate" else 5200
            elif material.startswith('S'):
                label = classify_image('/Users/jeongseungrok/Desktop/SFac Solution/springboot-app/Estimate/data/steel', image_path)
                # 예시로, 강철 소재의 레이블에 따라 material_value 설정
                if label == 0:
                    material_value = 5500
                elif label == 1:
                    material_value = 6700
                else:
                    material_value = 8200

    matches = re.findall(r'(\d+)-', text)
    numbers = [int(match) for match in matches if int(match) < 20]
    total_sum = sum(numbers)
    value = width * height * depth * (density_value if density_value else 0) * material_value * 1.5 / 1000000 + total_sum * 500
    print(f"value:{value}")

if __name__ == '__main__':
    if len(sys.argv) < 5:
        print("Usage: python estimate.py <image_path> <width> <height> <depth>")
        sys.exit(1)
    
    image_path = sys.argv[1]
    width = float(sys.argv[2])
    height = float(sys.argv[3])
    depth = float(sys.argv[4])
    process_image(image_path, width, height, depth)