# 🩺 Diabetes Risk Assessment System Using Machine Learning

An end-to-end full-stack health informatics application designed for college mini projects. The system estimates an individual's Type-2 diabetes risk tier (**Low**, **Moderate**, or **High**) using non-invasive demographic, anthropometric, lifestyle, and self-reported symptomatic data—**without requiring invasive laboratory test results** (such as fasting blood glucose or HbA1c).

> ⚠️ **Educational & Demonstration Disclaimer:**  
> This system is built strictly for educational and academic demonstration purposes using a documented **synthetic dataset**. It is **NOT** clinically validated and does **NOT** provide medical diagnoses. Always consult certified healthcare professionals for clinical evaluations.

---

## 📑 Table of Contents
- [System Architecture](#-system-architecture)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Quick Start Guide](#-quick-start-guide)
  - [1. Machine Learning Service (Port 8000)](#1-machine-learning-service-port-8000)
  - [2. Node.js Backend Gateway (Port 5000)](#2-nodejs-backend-gateway-port-5000)
  - [3. React Frontend (Port 5173)](#3-react-frontend-port-5173)
- [API Reference](#-api-reference)
- [Machine Learning Pipeline](#-machine-learning-pipeline)
- [Viva Questions & Academic Docs](#-viva-questions--academic-docs)
- [Troubleshooting & FAQ](#-troubleshooting--faq)

---

## 🏛 System Architecture

The application adopts an enterprise-grade **decoupled 3-tier microservice architecture**:

```text
┌─────────────────────────────────────────────────────────────┐
│                    React Client (Vite)                      │
│                http://localhost:5173                        │
│   • 3-Step Questionnaire      • Dynamic BMI Meter           │
│   • Recharts Visualizations   • Form Validation & Alerts    │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTP REST (JSON)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 Express.js API Gateway                      │
│                http://localhost:5000                        │
│   • Redundant Server Validation • CORS & Error Envelopes    │
│   • Microservice Proxy Client   • Centralized Logging       │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTP REST (JSON)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                Python FastAPI ML Microservice               │
│                http://127.0.0.1:8000                        │
│   • Preprocessing ColumnTransformer (Scaling & OneHot)      │
│   • 5 Benchmarked Classifiers   • Best Model Pipeline       │
│   • Model Metadata & Metrics    • Synthetic Data Generator  │
└─────────────────────────────────────────────────────────────┘
```

---

## ✨ Key Features

1. **Non-Invasive Assessment Form:**
   - Evaluates risk across 14 non-invasive features (Demographics, Lifestyle, Early Symptoms).
   - Instant live Body Mass Index (BMI) calculator and categorizer.
   - Interactive progress bar and real-time field validation.

2. **Benchmarked Machine Learning Engine:**
   - Trains and compares **5 classification algorithms**:
     - Logistic Regression
     - Decision Tree Classifier
     - Random Forest Classifier *(Ensemble Bagging)*
     - Support Vector Classifier (SVM)
     - K-Nearest Neighbors (KNN)
   - Automatic model selection using **Macro F1-Score**.
   - Class probability breakdown for transparency.

3. **Responsive Visualizations & Analytics:**
   - Multi-metric algorithm comparison bar chart (Accuracy, Precision, Recall, F1).
   - Radar chart illustrating best-model balanced performance.
   - Confusion matrix heatmaps and feature correlation plots.

4. **Safety & Health Literacy:**
   - Personalized evidence-based lifestyle recommendations tailored to the estimated risk tier.
   - Prominent disclaimers at every user interaction point.
   - Graceful system degradation with friendly 503 error states if the ML service is offline.

---

## 🛠 Tech Stack

| Tier | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS v3, React Router v6, Recharts, Lucide Icons, Axios |
| **Backend** | Node.js, Express.js, Axios, CORS, Dotenv |
| **ML Service** | Python 3.10+, FastAPI, Uvicorn, scikit-learn, pandas, NumPy, Matplotlib, Seaborn, Joblib |
| **Tooling** | Git, Postman Collection, PowerShell / Bash |

---

## 📁 Project Structure

```text
diabetes-risk-assessment/
├── backend/                        # Node.js Express Gateway
│   ├── src/
│   │   ├── controllers/            # Route handlers (assessment, model, health)
│   │   ├── middleware/             # Error handler, request logger
│   │   ├── routes/                 # Express API routes
│   │   ├── services/               # Axios ML client wrapper
│   │   ├── validators/             # Request schema validation
│   │   └── app.js                  # Server bootstrap & middleware
│   ├── .env.example
│   └── package.json
│
├── frontend/                       # React Single Page Application
│   ├── src/
│   │   ├── components/             # Reusable UI (Navbar, BMI, RiskCard, etc.)
│   │   ├── layouts/                # MainLayout with header and footer
│   │   ├── pages/                  # Home, Assessment, Results, ModelInfo, About
│   │   ├── services/               # Frontend API client
│   │   ├── App.jsx                 # Client router configuration
│   │   ├── index.css               # Tailwind CSS theme & components
│   │   └── main.jsx
│   ├── .env.example
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
├── ml-service/                     # Python FastAPI Service
│   ├── data/                       # Generated synthetic dataset (CSV)
│   ├── models/                     # Saved joblib pipeline & metadata JSON
│   ├── notebooks/                  # Generated EDA plots & confusion matrices
│   ├── src/
│   │   ├── main.py                 # FastAPI application endpoints
│   │   ├── predict.py              # Inference & probability extraction
│   │   ├── preprocessing.py        # ColumnTransformer & BMI formulas
│   │   └── train_model.py          # Data generator, training & evaluation
│   ├── .env.example
│   └── requirements.txt
│
├── docs/                           # Academic & Testing Documentation
│   ├── postman_collection.json     # Ready-to-import Postman collection
│   ├── viva_questions.md           # 15 in-depth viva questions & answers
│   └── project_report_outline.md   # Standard college project report structure
│
├── .gitignore
└── README.md
```

---

## 📋 Prerequisites

Before running the project, ensure you have the following installed on your machine:
- **Node.js:** v18.0.0 or higher ([Download Node.js](https://nodejs.org/))
- **Python:** v3.10 or higher ([Download Python](https://www.python.org/))
- **Git**

---

## 🚀 How to Run This Project (Step-by-Step Commands)

This project requires **three separate terminal windows** running concurrently (one for each microservice).

### 📌 Summary Table

| Terminal | Service | Directory | Port | Command to Run |
| :---: | :--- | :--- | :---: | :--- |
| **Terminal 1** | **ML Microservice** | `ml-service/` | `8000` | `uvicorn src.main:app --host 127.0.0.1 --port 8000` |
| **Terminal 2** | **Express Backend** | `backend/` | `5000` | `npm run dev` |
| **Terminal 3** | **React Frontend** | `frontend/` | `5173` | `npm run dev` |

---

### 🖥️ Step-by-Step Terminal Commands

#### 🟢 TERMINAL 1: Python FastAPI Machine Learning Service

Open **Terminal 1** in the project root directory and run:

**For Windows (PowerShell):**
```powershell
# 1. Navigate to ml-service
cd ml-service

# 2. Create Python virtual environment (one-time setup)
python -m venv venv

# 3. If PowerShell blocks scripts, run this once:
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass

# 4. Activate virtual environment
.\venv\Scripts\Activate.ps1

# 5. Install required packages
pip install -r requirements.txt

# 6. Train the 5 ML models and generate the best pipeline artifact
python -m src.train_model

# 7. Start the FastAPI server on port 8000
uvicorn src.main:app --reload --host 127.0.0.1 --port 8000
```

**For Windows (Command Prompt / CMD):**
```cmd
cd ml-service
python -m venv venv
.\venv\Scripts\activate.bat
pip install -r requirements.txt
python -m src.train_model
uvicorn src.main:app --reload --host 127.0.0.1 --port 8000
```

**For Linux / macOS (Bash / Zsh):**
```bash
cd ml-service
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python3 -m src.train_model
uvicorn src.main:app --reload --host 127.0.0.1 --port 8000
```

> ✅ **Verify Terminal 1:**  
> Open [http://127.0.0.1:8000/health](http://127.0.0.1:8000/health) $\rightarrow$ Expected output: `{"status":"healthy","model_loaded":true}`.  
> Swagger Documentation: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs).

---

#### 🟢 TERMINAL 2: Node.js Express Backend Gateway

Open **Terminal 2** in the project root directory and run:

**For Windows (PowerShell):**
```powershell
# 1. Navigate to backend directory
cd backend

# 2. Create environment file from template (one-time setup)
Copy-Item .env.example .env

# 3. Install Node.js dependencies
npm install

# 4. Start the Express backend server on port 5000
npm run dev
```

**For Linux / macOS / CMD:**
```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

> ✅ **Verify Terminal 2:**  
> Open [http://localhost:5000/api/health](http://localhost:5000/api/health) $\rightarrow$ Expected output:  
> `{"success":true,"backend":{"status":"healthy"},"mlService":{"status":"healthy","model_loaded":true}}`.

---

#### 🟢 TERMINAL 3: React Vite Frontend Application

Open **Terminal 3** in the project root directory and run:

**For Windows (PowerShell):**
```powershell
# 1. Navigate to frontend directory
cd frontend

# 2. Create environment file from template (one-time setup)
Copy-Item .env.example .env

# 3. Install frontend dependencies
npm install

# 4. Start the Vite React development server on port 5173
npm run dev
```

**For Linux / macOS / CMD:**
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

> ✅ **Verify Terminal 3 & Open App:**  
> Open your browser and navigate to:  
> 👉 **[http://localhost:5173](http://localhost:5173)**

---

### 🧪 Step 4: Verification & End-to-End Walkthrough

Once all 3 terminals are running:
1. **Homepage:** Open [http://localhost:5173](http://localhost:5173) to view the hero section and features.
2. **Assessment Form:** Go to [http://localhost:5173/assessment](http://localhost:5173/assessment).
   - Use the **"High/Moderate Risk"** or **"Low Risk"** *Quick Demo Profile* buttons under the progress bar to populate all 14 questions with 1 click, or enter your own numbers.
   - Click **"Submit Assessment"**.
   - View your estimated risk tier, BMI gauge, probability distribution, and lifestyle recommendations.
3. **Model Information & Visualizations:** Go to [http://localhost:5173/model-info](http://localhost:5173/model-info) to view the algorithm cards, multi-metric comparison bar chart (Recharts), radar plot, and confusion matrices.

---

## 📡 API Reference

### 1. Health Check
- **Endpoint:** `GET /api/health`
- **Description:** Verifies Express server status and polls ML service connectivity.
- **Response:**
  ```json
  {
    "status": "healthy",
    "ml_service": "healthy",
    "model_loaded": true
  }
  ```

### 2. Model Information & Metrics
- **Endpoint:** `GET /api/model/info`
- **Description:** Returns evaluation metrics (accuracy, precision, recall, F1) across all 5 benchmarked models and training metadata.

### 3. Risk Assessment Prediction
- **Endpoint:** `POST /api/assessment/predict`
- **Request Body:**
  ```json
  {
    "age": 45,
    "gender": "Male",
    "height_cm": 175,
    "weight_kg": 85,
    "family_history": true,
    "physical_activity": "Medium",
    "smoking": false,
    "alcohol": true,
    "healthy_diet": false,
    "frequent_thirst": false,
    "frequent_urination": true,
    "fatigue": true,
    "blurred_vision": false,
    "slow_wound_healing": false
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "prediction": {
      "risk_level": "Moderate",
      "bmi": 27.8,
      "probability": {
        "Low": 0.12,
        "Moderate": 0.74,
        "High": 0.14
      }
    },
    "disclaimer": "This is an educational risk estimate generated by a model trained on synthetic data. It is NOT a medical diagnosis. Please consult a qualified healthcare professional for clinical advice."
  }
  ```

---

## 🧪 Machine Learning Pipeline

1. **Feature Engineering:**
   - **Continuous:** `age`, `bmi` scaled with `StandardScaler`.
   - **Categorical (Nominal):** `gender` encoded with `OneHotEncoder(drop='first')`.
   - **Categorical (Ordinal):** `physical_activity` encoded (`Low: 0, Medium: 1, High: 2`).
   - **Binary Flags:** Converted to integers (0 or 1).
2. **Synthetic Dataset Formula:**  
   Calculated based on epidemiological risk points:
   $$\text{Score} = \text{AgePts} + \text{BMIPts} + \text{FamilyHistory}(12) + \text{ActivityPts} + \text{HabitsPts} + \sum \text{SymptomsPts}$$
   - **Low Risk:** $\text{Score} < 20$
   - **Moderate Risk:** $20 \le \text{Score} < 40$
   - **High Risk:** $\text{Score} \ge 40$
3. **Artifacts Generated in `ml-service/`:**
   - `models/best_model_pipeline.joblib`: Serialized scikit-learn pipeline.
   - `models/model_metadata.json`: Model comparison statistics and dataset parameters.
   - `notebooks/*.png`: Correlation heatmap, class distribution, BMI/age histograms, and confusion matrices.

---

## 🎓 Viva Questions & Academic Docs

To help you ace your college external examination, project presentation, and thesis documentation, check out the specialized guides in `docs/`:

- 📋 **[Complete Project Details & Technology Inventory](PROJECT_DETAILS.md):** Exhaustive technical inventory covering everything made, libraries used, dataset formulas, benchmark metrics, and file-by-file directory map.
- 📖 **[Viva Questions & Detailed Answers](docs/viva_questions.md):** 15 core viva questions covering ML theory, architecture, evaluation metrics, and clinical ethics.
- 📝 **[Project Report Outline](docs/project_report_outline.md):** Comprehensive 7-chapter report template complete with IEEE citation guidelines.
- 📮 **[Postman Collection](docs/postman_collection.json):** Pre-configured HTTP requests for testing all backend and microservice endpoints.

---

## ❓ Troubleshooting & FAQ

### 1. `Execution of scripts is disabled on this system` (PowerShell)
When activating Python virtual environments on Windows PowerShell, run:
```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

### 2. `ML prediction service is unavailable (503)`
- Ensure the FastAPI server in `ml-service` is actively running on port 8000.
- Ensure you have executed `python -m src.train_model` at least once so the `.joblib` model file exists in `ml-service/models/`.

### 3. Port Conflict (Port 5000 or 8000 already in use)
- To check what is using a port on Windows:
  ```powershell
  netstat -ano | findstr :5000
  ```
- You can change ports in `.env` files in `backend/` or `ml-service/`.

---

## 📜 License & Academic Integrity
This project is licensed under the MIT License. Developed for academic coursework and portfolio demonstrations.
