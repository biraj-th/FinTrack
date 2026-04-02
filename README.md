# 💸 FinTrack

FinTrack is a comprehensive personal and organizational finance tracking system featuring a modern web interface, a robust backend, and AI-driven insights to help you manage your budget efficiently. 🚀

## 🏗️ Project Structure

The project consists of three main components:

- **🎨 fintrack-frontend**: A React application built with Vite, featuring a responsive and modern glassmorphism design.
- **⚙️ fintrack-backend**: A Java Spring Boot application providing the core REST API and database integration.
- **🤖 fintrack-ai**: A Python FastAPI service that processes data to provide AI-driven predictions and intelligent budget suggestions.

## ✨ Features

- **💰 Finance Tracking**: Seamlessly add, view, and categorize your income and expenses.
- **📊 Interactive Dashboard**: Get a clear, visual overview of your financial health, including your current balance and monthly trends.
- **🔮 AI Predictions**: Receive intelligent insights on future spending patterns based on your transaction history.

## 🚀 Development Setup

To run the application locally, you will need to start all three services.

### 1️⃣ Frontend (Website) 🌐
```bash
cd fintrack-frontend
npm install
npm run dev
```
The application will be available at `http://localhost:5173/`.

### 2️⃣ Backend (Spring Boot) ☕
```bash
cd fintrack-backend
.\mvnw spring-boot:run
```
The backend API server will start on its default port.

### 3️⃣ AI Prediction Service (FastAPI) 🐍
```bash
cd fintrack-ai
pip install fastapi uvicorn pydantic
python -m uvicorn main:app
```
The AI engine will run locally, providing data analysis endpoints for the backend.

## 💎 Design Philosophy

The frontend utilizes a sleek dark-mode glassmorphism theme 🌌, featuring translucent panels and smooth background gradients to deliver a rich, dynamic, and premium user experience.
