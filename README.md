# 🍽️ FoodCalorie - AI-Powered Meal Analysis

FoodCalorie is a backend service designed to help users track their daily meals and calories through AI. The system provides two ways to analyze food:
- Uploading a meal image (using YOLO deep learning models)
- Typing a description of the food (using ChatGPT for smart estimation)

---

## 🚀 Features

- 🔒 User Registration & Authentication
- 🍔 Analyze meals from **images** using two YOLO models (Arabic & International food)
- ✍️ Analyze meals from **text** descriptions in English or Arabic
- 📊 Track daily meals (breakfast, lunch, dinner) and view total calories, protein, carbs, and fat
- 🧠 Smart size estimation using ChatGPT (e.g., "طبق كبير فول" → 250g)
- 🧾 Store meal history per user for progress tracking

---

## 🧠 How It Works

### 🖼️ 1. Image Analysis
- YOLOv8 models detect and classify food from images
- Each class is mapped to nutrition facts
- Results are stored under the selected meal (e.g., lunch)

### 📝 2. Text Description Analysis
- Send a sentence like: `شوربة عدس طبق متوسط`
- ChatGPT returns:
  - Calories, macros
  - Estimated size in grams
  - Original name (in same language)
  - Confidence flag (`canEstimate`)

---

## 🧰 Technologies Used

- **.NET 8 Web API**
- **MongoDB Atlas**
- **FastAPI (for image model inference)**
- **OpenAI ChatGPT API**
- **YOLOv8 (custom-trained models)**
- **Docker + Docker Compose**
- **Swagger (API docs)**

---

## 📂 Project Structure

