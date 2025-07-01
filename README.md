# 🍽️ FoodCalorie - AI-Powered Meal Analysis

FoodCalorie is a smart web application that helps users track their daily meals and monitor their nutritional intake. The system provides automatic calorie and macronutrient estimation using image and text-based meal analysis, making it easier for users to maintain their health goals.

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
- **React.js**
- **MongoDB Atlas**
- **FastAPI (for image model inference)**
- **OpenAI ChatGPT API**
- **YOLOv8 (custom-trained models)**
- **Swagger (API docs)**

---


## 🚀 Running the Project Locally

The **FoodCalorie** app is a full-stack system built with **.NET 8** for the backend and **React** for the frontend. Below is a step-by-step guide to run the project on your machine.

---



### 📁 Project Structure and steps to run

```bash
FoodCalorie/
├── backend/         # ASP.NET Core Web API
├── frontend/        # React Frontend App
└── README.md


🖥️ 1. Clone the Repository

git clone https://github.com/your-username/FoodCalorie.git
cd FoodCalorie
🔧 2. Backend (.NET 8 Web API)

cd backend

▶️ Run the API
dotnet restore
dotnet run
By default, the API will run on: https://localhost:5001 or http://localhost:5000

🌐 3. Frontend (React)

cd ../frontend

📦 Install Dependencies
npm install

▶️ Run the React App
npm start


