# 📋 Complete Project Details & Technology Inventory

**Project Title:** Diabetes Risk Assessment System Using Machine Learning  
**Project Type:** Full-Stack Academic / College Mini Project  
**Domain:** Artificial Intelligence / Healthcare Informatics / Modern Web Engineering  
**Version:** 1.0.0 (Production Ready)  

---

## 📑 Table of Contents
1. [Executive Summary](#1-executive-summary)
2. [What Was Made (Product & Features Overview)](#2-what-was-made-product--features-overview)
   - [Frontend Application (React + Vite)](#21-frontend-application-react--vite)
   - [Backend API Gateway (Node.js + Express)](#22-backend-api-gateway-nodejs--express)
   - [Machine Learning Microservice (Python + FastAPI)](#23-machine-learning-microservice-python--fastapi)
   - [Academic & Submission Deliverables](#24-academic--submission-deliverables)
3. [What Was Used (Complete Technology Stack)](#3-what-was-used-complete-technology-stack)
   - [Frontend Technologies & Libraries](#31-frontend-technologies--libraries)
   - [Backend Technologies & Libraries](#32-backend-technologies--libraries)
   - [Machine Learning & Data Science Stack](#33-machine-learning--data-science-stack)
   - [DevOps, Runtime & Tooling](#34-devops-runtime--tooling)
4. [Dataset & Scientific Methodology](#4-dataset--scientific-methodology)
   - [Feature Definitions (14 Non-Invasive Factors)](#41-feature-definitions-14-non-invasive-factors)
   - [Risk Scoring Heuristic & Stratification Thresholds](#42-risk-scoring-heuristic--stratification-thresholds)
   - [Data Preprocessing Pipeline](#43-data-preprocessing-pipeline)
5. [Machine Learning Algorithms & Benchmark Results](#5-machine-learning-algorithms--benchmark-results)
6. [Complete Repository File Tree & Purpose of Every File](#6-complete-repository-file-tree--purpose-of-every-file)
7. [System Execution & Port Mapping](#7-system-execution--port-mapping)

---

## 1. Executive Summary

The **Diabetes Risk Assessment System** is an end-to-end full-stack web application and machine learning system. Its goal is to provide **non-invasive, early-stage Type-2 diabetes risk estimation** without requiring users to undergo invasive clinical blood draws (such as Fasting Plasma Glucose or HbA1c tests).

By analyzing self-reported demographic data, anthropometric measurements (Height, Weight, calculated Body Mass Index), lifestyle patterns, family history, and symptomatic indicators (such as polydipsia, polyuria, chronic fatigue, blurred vision, and impaired wound healing), the system calculates an individual's risk tier (**Low**, **Moderate**, or **High**) alongside probabilistic confidence scores and lifestyle recommendations.

The project strictly emphasizes **academic integrity**: it utilizes a documented synthetic dataset reflecting epidemiological risk ratios and prominently displays medical disclaimers informing users that predictions are educational assessments rather than clinical diagnoses.

---

## 2. What Was Made (Product & Features Overview)

### 2.1 Frontend Application (React + Vite)
Built as a responsive Single Page Application (SPA) with a healthcare-inspired aesthetic (Teal/Emerald/Slate color palette):

1. **Pages Created:**
   - `HomePage.jsx`: Hero presentation, feature highlights, step-by-step workflow guide, and legal/medical disclaimer.
   - `AssessmentPage.jsx`: Dynamic 3-section collapsible questionnaire:
     - Section 1: Demographics & Body Metrics (Age, Gender, Height, Weight).
     - Section 2: Lifestyle & Family History (Physical Activity, Smoking, Alcohol, Diet, Family History).
     - Section 3: Self-Reported Symptoms (Thirst, Urination, Fatigue, Blurred Vision, Wound Healing).
     - *Real-time Features*: Dynamic live BMI calculation meter, visual completion progress percentage (0–100%), and field-level validation with contextual error badges.
   - `ResultsPage.jsx`: Displays assessment output:
     - Color-coded risk status badge (Green for Low, Amber for Moderate, Red for High).
     - Model confidence probability breakdown (e.g., Low: 0%, Moderate: 0.2%, High: 99.8%).
     - Body Mass Index categorical gauge (Underweight, Normal, Overweight, Obese).
     - Evidence-based lifestyle and medical consultation recommendations tailored to the specific risk tier.
     - Collapsible summary table of all submitted questionnaire responses.
   - `ModelInfoPage.jsx`: Interactive dashboard showing:
     - Cards explaining each of the 5 implemented classification algorithms.
     - Dataset characteristics (sample size, train/test split, synthetic data disclosure).
     - Recharts multi-bar comparative performance chart (Accuracy, Precision, Recall, F1).
     - Recharts Radar chart demonstrating balanced metrics of the selected best model.
     - Tabular confusion matrix and evaluation metrics summary.
     - Technical limitations and academic scope.
   - `AboutPage.jsx`: Project objectives, full architecture diagram, technology stack directory, and college course information.

2. **Custom Reusable Components Built:**
   - `Navbar.jsx`: Sticky responsive navigation bar with active route highlighting and mobile drawer.
   - `Footer.jsx`: Global footer with quick navigation links, system status indicators, and medical disclaimers.
   - `FormSection.jsx`: Accessible collapsible accordion wrapper with numeric sequence badges.
   - `BMIIndicator.jsx`: Graphical scale displaying computed BMI with color-coded classification segments.
   - `RiskResultCard.jsx`: Hero result container rendering the risk tier, probability distribution bar, and risk severity banner.
   - `RecommendationList.jsx`: Context-aware health tips categorized by physical activity, nutrition, hydration, and medical follow-up.
   - `Disclaimer.jsx`: Reusable banner reminding users of non-diagnostic educational limitations.
   - `LoadingSpinner.jsx`: Pulse animation with custom status messages for asynchronous API queries.

---

### 2.2 Backend API Gateway (Node.js + Express)
Acts as an API gateway between the frontend and the Python ML microservice:

1. **API Endpoints Implemented:**
   - `GET /api/health`: Polls both Express server uptime and Python FastAPI availability; returns unified system health.
   - `GET /api/model/info`: Fetches and caches serialized model metadata, algorithm scores, and feature listings from the ML microservice.
   - `POST /api/assessment/predict`: Primary prediction endpoint. Accepts questionnaire payloads, performs redundant validation, forwards data to the ML microservice, and wraps predictions in standardized JSON envelopes.

2. **Middleware & Robustness Layers:**
   - `assessmentValidator.js`: Strict server-side validation checking types, ranges (Age 1–120, Height 50–300 cm, Weight 10–400 kg), and categorical enums before delegating to ML.
   - `errorHandler.js`: Centralized error handler catching uncaught exceptions, masking internal stack traces in production, and returning structured error responses.
   - **Fault Tolerance:** If the Python ML microservice is offline or restarting, Axios intercepts `ECONNREFUSED` or timeout exceptions and returns HTTP `503 Service Unavailable` with user-friendly instructions rather than crashing the gateway.

---

### 2.3 Machine Learning Microservice (Python + FastAPI)
A standalone high-performance REST microservice dedicated to machine learning operations:

1. **Dataset Generation (`src/train_model.py`):**
   - Synthesizes 2,000 representative records based on clinical diabetes risk score models (incorporating epidemiological weightings for age, BMI, family history, sedentary habits, and classic symptoms).
   - Saves CSV artifact to `ml-service/dataset/synthetic_diabetes_risk.csv`.

2. **Exploratory Data Analysis (EDA):**
   - Automatically computes and saves 4 publication-quality visualization charts to `ml-service/notebooks/`:
     - `class_distribution.png`: Bar chart of Low, Moderate, and High class counts.
     - `correlation_heatmap.png`: Seaborn correlation matrix of numerical and binary features.
     - `bmi_by_risk.png`: Histogram comparing BMI distributions across risk categories.
     - `age_by_risk.png`: Histogram comparing Age distributions across risk categories.

3. **Benchmarking 5 Machine Learning Algorithms:**
   - Splits data into 80% training (1,600 samples) and 20% test (400 samples) with stratification.
   - Evaluates:
     1. **Logistic Regression** (Linear probabilistic classifier)
     2. **Decision Tree Classifier** (Rule-based non-linear partitions)
     3. **Random Forest Classifier** (Ensemble bagging of 120 estimators)
     4. **Support Vector Machine - SVM** (RBF kernel with probability calibration)
     5. **K-Nearest Neighbors - KNN** (Instance-based distance classification, $k=7$)
   - Calculates Accuracy, Precision, Recall, Macro F1-Score, and full Confusion Matrices for all 5 models.
   - Generates `model_comparison.png` and `confusion_matrices.png`.

4. **Pipeline Serialization & Metadata Export:**
   - Automatically selects the top-performing model based on **Macro F1-Score**.
   - Serializes the entire preprocessing `ColumnTransformer` + trained estimator into a single portable binary artifact: `ml-service/models/best_model_pipeline.joblib`.
   - Generates machine-readable technical metadata: `ml-service/models/model_metadata.json`.

5. **FastAPI Serving (`src/main.py`):**
   - Implements async request handlers with Pydantic request/response schema validation.
   - Lifespan model loader: loads the `.joblib` pipeline into memory at server startup for sub-millisecond inference.

---

### 2.4 Academic & Submission Deliverables
Specially formulated to assist students during college project reviews, external lab examinations, and report submission:

1. **[README.md](file:///c:/Users/nikhi/.gemini/antigravity-ide/scratch/diabetes-risk-assessment/README.md):** Comprehensive project manual with architecture diagrams, step-by-step setup commands, troubleshooting guides, and API schemas.
2. **[Viva Questions & Answers](file:///c:/Users/nikhi/.gemini/antigravity-ide/scratch/diabetes-risk-assessment/docs/viva_questions.md):** 15 core questions covering ML concepts (Bias vs Variance, Recall in healthcare, Confusion Matrix, OneHot vs Ordinal encoding, Data Leakage prevention, 3-tier architecture).
3. **[Project Report Outline](file:///c:/Users/nikhi/.gemini/antigravity-ide/scratch/diabetes-risk-assessment/docs/project_report_outline.md):** 7-chapter college report structure (Introduction, Literature Review, Architecture, ML Methodology, Implementation, Results & Discussion, Conclusion & References).
4. **[Postman Test Collection](file:///c:/Users/nikhi/.gemini/antigravity-ide/scratch/diabetes-risk-assessment/docs/postman_collection.json):** Ready-to-import Postman JSON collection containing pre-configured requests for testing all backend and microservice routes.

---

## 3. What Was Used (Complete Technology Stack)

### 3.1 Frontend Technologies & Libraries
- **React.js (v18.2.0):** Component-based UI library.
- **Vite (v5.0.8):** Next-generation frontend build tool and hot-module reloading (HMR) development server.
- **Tailwind CSS (v3.4.0):** Utility-first CSS framework configured with custom healthcare color palettes (Teal primary theme), responsive breakpoints, and custom animation utilities.
- **PostCSS (v8.4.32) & Autoprefixer (v10.4.16):** Automated CSS post-processing and cross-browser vendor prefixing.
- **React Router DOM (v6.21.0):** Client-side declarative routing with nested layout routes (`MainLayout`), protected state passing, and redirection.
- **Recharts (v2.10.3):** Declarative SVG charting library used for multi-bar algorithm comparisons and radar performance visualizations.
- **Lucide React (v0.294.0):** Modern icon collection for medical, technical, and navigation iconography.
- **Axios (v1.6.2):** Promise-based HTTP client for asynchronous communication with the Express backend.

---

### 3.2 Backend Technologies & Libraries
- **Node.js (v24.x LTS runtime):** Asynchronous event-driven JavaScript server runtime.
- **Express.js (v4.18.2):** Fast, unopinionated minimalist web framework for building RESTful API endpoints.
- **CORS (v2.8.5):** Express middleware to securely enable Cross-Origin Resource Sharing between frontend (`http://localhost:5173`) and backend (`http://localhost:5000`).
- **dotenv (v16.3.1):** Zero-dependency module that loads environment variables from `.env` into `process.env`.
- **Axios (v1.6.2):** Used within Express to make inter-service HTTP REST calls to the FastAPI microservice with a configured 15-second timeout.

---

### 3.3 Machine Learning & Data Science Stack
- **Python (v3.14.x / v3.10+ compatible):** High-level programming language standard for machine learning and scientific computing.
- **scikit-learn (v1.9.1 / >=1.3.0):** Industry-standard machine learning library used for:
  - Classification models (`LogisticRegression`, `DecisionTreeClassifier`, `RandomForestClassifier`, `SVC`, `KNeighborsClassifier`).
  - Data preprocessing (`ColumnTransformer`, `StandardScaler`, `OneHotEncoder`).
  - Model evaluation metrics (`accuracy_score`, `precision_recall_fscore_support`, `confusion_matrix`).
  - Stratified train/test splitting (`train_test_split`).
- **FastAPI (v0.162.0 / >=0.104.0):** Modern, high-performance web framework for building Python APIs based on standard Python type hints.
- **Uvicorn (v0.54.0 / >=0.24.0):** Lightning-fast ASGI web server implementation for Python.
- **Pydantic (v2.14.1 / >=2.5.0):** Data validation and settings management using Python type annotations.
- **Joblib (v1.6.0 / >=1.3.0):** Lightweight pipelining and disk serialization for Python objects and trained scikit-learn models.
- **pandas (v3.1.0 / >=2.1.0):** High-performance data manipulation, DataFrame structure, and dataset ingestion.
- **NumPy (v2.5.4 / >=1.26.0):** Fundamental package for array computing, numerical vectorization, and matrix manipulation.
- **Matplotlib (v3.11.2 / >=3.8.0):** Comprehensive data visualization and plotting library.
- **Seaborn (v0.13.2 / >=0.13.0):** Statistical data visualization library used for generating correlation heatmaps and confusion matrix displays.
- **python-dotenv (v1.2.4 / >=1.0.0):** Reads key-value pairs from `.env` and sets them as environment variables.

---

### 3.4 DevOps, Runtime & Tooling
- **Git & GitHub:** Version control, branch management, and code tracking.
- **PowerShell & Windows Terminal:** Scripting and command execution environment.
- **Postman:** API endpoint testing, debugging, and documentation suite.
- **Visual Studio Code / Antigravity IDE:** Integrated Development Environment with syntax highlighting, linter, and terminal integration.

---

## 4. Dataset & Scientific Methodology

### 4.1 Feature Definitions (14 Non-Invasive Factors)

The application evaluates risk using 14 non-invasive features requiring zero clinical laboratory equipment:

| # | Feature Name | Data Type | Domain / Range | Medical Relevance |
| :---: | :--- | :---: | :---: | :--- |
| **1** | `age` | Integer | 18 – 80 years | Risk of Type-2 diabetes increases significantly with age due to declining beta-cell function. |
| **2** | `gender` | Categorical | Male, Female | Epidemiological variation in visceral fat accumulation and hormonal influences. |
| **3** | `height_cm` | Float | 50 – 300 cm | Required to compute standard Body Mass Index ($kg/m^2$). |
| **4** | `weight_kg` | Float | 10 – 400 kg | Required to compute standard Body Mass Index ($kg/m^2$). |
| **5** | `bmi` | Float | Computed ($15.0 - 50.0$) | Elevated BMI (especially $\ge 25.0$ Overweight, $\ge 30.0$ Obese) is a major driver of insulin resistance. |
| **6** | `family_history` | Boolean | True (1) / False (0) | Strong genetic predisposition; first-degree family history doubles diabetes susceptibility. |
| **7** | `physical_activity` | Ordinal | Low, Medium, High | Sedentary lifestyle impairs muscle glucose uptake and metabolic clearance. |
| **8** | `smoking` | Boolean | True (1) / False (0) | Nicotine alters glucose metabolism and increases systemic inflammation. |
| **9** | `alcohol` | Boolean | True (1) / False (0) | Excessive alcohol consumption affects liver glycogenolysis and pancreatic function. |
| **10** | `healthy_diet` | Boolean | True (1) / False (0) | Diets low in fiber and high in refined carbohydrates exacerbate glycemic spikes. |
| **11** | `frequent_thirst` | Boolean | True (1) / False (0) | *Polydipsia*: Classic osmotic symptom caused by high circulating serum glucose. |
| **12** | `frequent_urination`| Boolean | True (1) / False (0) | *Polyuria*: Excessive urination when blood glucose exceeds renal threshold ($180 mg/dL$). |
| **13** | `fatigue` | Boolean | True (1) / False (0) | Impaired cellular glucose uptake leads to systemic energy depletion. |
| **14** | `blurred_vision` | Boolean | True (1) / False (0) | Osmotic swelling of the ocular lens caused by acute glycemic variations. |
| **15** | `slow_wound_healing`| Boolean | True (1) / False (0) | Microvascular impairment and delayed immune response characteristic of hyperglycemia. |

---

### 4.2 Risk Scoring Heuristic & Stratification Thresholds

The synthetic dataset generates ground-truth labels using a weighted risk score formula derived from clinical risk heuristics (e.g., ADA Risk Score and FINDRISC principles):

$$\text{Total Score} = S_{\text{Age}} + S_{\text{BMI}} + S_{\text{Family}} + S_{\text{Activity}} + S_{\text{Habits}} + \sum S_{\text{Symptoms}} + \epsilon$$

Where:
- $S_{\text{Age}}$: $<35 \rightarrow 0$, $35–49 \rightarrow 5$, $50–64 \rightarrow 10$, $\ge 65 \rightarrow 15$ points.
- $S_{\text{BMI}}$: $<25.0 \rightarrow 0$, $25.0–29.9 \rightarrow 10$, $30.0–34.9 \rightarrow 20$, $\ge 35.0 \rightarrow 30$ points.
- $S_{\text{Family}}$: $+12$ points if family history is positive.
- $S_{\text{Activity}}$: $\text{Low} \rightarrow +10$, $\text{Medium} \rightarrow +5$, $\text{High} \rightarrow 0$ points.
- $S_{\text{Habits}}$: $\text{Smoking} \rightarrow +5$, $\text{Alcohol} \rightarrow +3$, $\text{Unhealthy Diet} \rightarrow +5$ points.
- $\sum S_{\text{Symptoms}}$: $+6$ points each for Thirst, Urination, Fatigue; $+8$ points each for Blurred Vision, Slow Wound Healing.
- $\epsilon$: Gaussian noise $\sim \mathcal{N}(0, 3)$ simulating biological variance.

**Risk Classification Tiers:**
- **Low Risk (Class 0):** $\text{Total Score} < 20$
- **Moderate Risk (Class 1):** $20 \le \text{Total Score} < 40$
- **High Risk (Class 2):** $\text{Total Score} \ge 40$

---

### 4.3 Data Preprocessing Pipeline

To eliminate data leakage, all transformations are encapsulated in a scikit-learn `Pipeline` utilizing `ColumnTransformer`:
- **Numeric Features (`age`, `bmi`):** Scaled using `StandardScaler` to achieve zero mean and unit variance ($z = \frac{x - \mu}{\sigma}$).
- **Nominal Features (`gender`):** Encoded with `OneHotEncoder(drop='first')` to prevent multicollinearity.
- **Ordinal Features (`physical_activity`):** Encoded ordinally (`Low: 0, Medium: 1, High: 2`).
- **Binary Features (7 flags):** Passed through directly as binary integers ($0$ or $1$).

---

## 5. Machine Learning Algorithms & Benchmark Results

All models were evaluated on an independent test set of 400 samples (stratified 20% holdout):

| Algorithm | Type | Accuracy | Precision | Recall | Macro F1-Score | Status |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: |
| **Support Vector Machine (SVM)** | Margin Classifier (RBF Kernel) | **83.00%** | **83.03%** | **83.00%** | **0.8299** | 🏆 **Selected Best Model** |
| **Random Forest** | Ensemble Bagging (120 Trees) | 81.75% | 81.67% | 81.75% | 0.8159 | Candidate |
| **Logistic Regression** | Linear Probabilistic | 80.50% | 81.22% | 80.50% | 0.8061 | Candidate |
| **K-Nearest Neighbors (KNN)** | Non-parametric ($k=7$) | 79.75% | 81.42% | 79.75% | 0.8010 | Candidate |
| **Decision Tree** | Partition Tree ($\text{max\_depth}=8$) | 75.75% | 76.03% | 75.75% | 0.7574 | Candidate |

### Detailed Confusion Matrix for Best Model (SVM):
```text
                 Predicted Low   Predicted Moderate   Predicted High
Actual Low             48                13                 0
Actual Moderate         8               115                25
Actual High             0                22               169
```
*Key Finding:* Zero High-Risk cases were misclassified as Low-Risk, demonstrating excellent clinical sensitivity and safety against dangerous false negatives.

---

## 6. Complete Repository File Tree & Purpose of Every File

```text
diabetes-risk-assessment/
│
├── PROJECT_DETAILS.md              # [THIS FILE] Complete documentation of what was made and used
├── README.md                       # Main project setup manual, quickstart guide, and API reference
├── .gitignore                      # Git exclusion rules (node_modules, venv, caches, env files)
│
├── backend/                        # Node.js + Express API Gateway Tier
│   ├── .env                        # Local runtime environment variables (PORT, ML_SERVICE_URL)
│   ├── .env.example                # Example environment template
│   ├── package.json                # Express project dependencies & start scripts
│   └── src/
│       ├── app.js                  # Express bootstrap, CORS setup, route mounting & error handling
│       ├── controllers/
│       │   ├── assessmentController.js # Handles /api/assessment/predict; coordinates validation & ML
│       │   └── modelController.js      # Handles /api/model/info; proxies model metadata from ML service
│       ├── middleware/
│       │   └── errorHandler.js     # Centralized error interceptor masking sensitive server errors
│       ├── routes/
│       │   ├── assessment.js       # Express router for prediction endpoints
│       │   ├── health.js           # Express router for multi-service health checking
│       │   └── model.js            # Express router for model evaluation metrics
│       ├── services/
│       │   └── mlService.js        # Axios client for inter-service communication with FastAPI (:8000)
│       └── validators/
│           └── assessmentValidator.js # Independent server-side request sanitization & range checks
│
├── frontend/                       # React 18 + Vite Single Page Application Tier
│   ├── .env                        # Local runtime environment variables (VITE_API_BASE_URL)
│   ├── .env.example                # Example environment template
│   ├── index.html                  # HTML entry point with metadata, title & favicon
│   ├── package.json                # Frontend dependencies (React, Vite, Tailwind, Recharts, Lucide)
│   ├── postcss.config.js           # PostCSS configuration for Tailwind CSS
│   ├── tailwind.config.js          # Tailwind CSS theme configuration (custom Teal palette)
│   ├── vite.config.js              # Vite bundling & development server configuration
│   └── src/
│       ├── main.jsx                # React root bootstrap rendering App inside BrowserRouter
│       ├── App.jsx                 # Route definitions (Home, Assessment, Results, ModelInfo, About)
│       ├── index.css               # Tailwind directives & reusable custom component classes
│       ├── layouts/
│       │   └── MainLayout.jsx      # Persistent outer layout containing Navbar and Footer
│       ├── components/
│       │   ├── Navbar.jsx          # Top navigation bar with active links and mobile support
│       │   ├── Footer.jsx          # Global footer with disclaimers and status indicators
│       │   ├── FormSection.jsx     # Accordion container for grouping form fields with numbers
│       │   ├── BMIIndicator.jsx    # Visual meter categorizing Underweight, Normal, Overweight, Obese
│       │   ├── RiskResultCard.jsx  # Hero result card displaying risk tier and confidence probability
│       │   ├── RecommendationList.jsx # Evidence-based lifestyle and clinical follow-up advice
│       │   ├── Disclaimer.jsx      # Standardized non-diagnostic educational warning banner
│       │   └── LoadingSpinner.jsx  # Animated spinner with status text during API requests
│       ├── pages/
│       │   ├── HomePage.jsx        # Landing page with hero banner, feature grid, and workflow
│       │   ├── AssessmentPage.jsx  # Interactive 3-section questionnaire with live BMI & validation
│       │   ├── ResultsPage.jsx     # Assessment results, probability meter, and response summary
│       │   ├── ModelInfoPage.jsx   # Technical page featuring algorithm charts & comparison metrics
│       │   └── AboutPage.jsx       # Academic summary, system architecture, and tech directory
│       └── services/
│           └── assessmentApi.js    # Frontend Axios client for calling the Express Gateway (:5000)
│
├── ml-service/                     # Python FastAPI Machine Learning Microservice Tier
│   ├── .env                        # Local runtime environment variables (MODEL_PATH, HOST, PORT)
│   ├── .env.example                # Example environment template
│   ├── requirements.txt            # Python dependencies (scikit-learn, fastapi, pandas, numpy, etc.)
│   ├── dataset/
│   │   └── synthetic_diabetes_risk.csv # Generated 2,000-sample synthetic dataset
│   ├── models/
│   │   ├── best_model_pipeline.joblib  # Serialized scikit-learn preprocessor + SVM pipeline
│   │   └── model_metadata.json         # Evaluation metrics and parameters exported for frontend display
│   ├── notebooks/                  # Visual plots generated during model training:
│   │   ├── age_by_risk.png         # Histogram of Age distribution by risk category
│   │   ├── bmi_by_risk.png         # Histogram of BMI distribution by risk category
│   │   ├── class_distribution.png  # Bar chart of Low, Moderate, High target counts
│   │   ├── confusion_matrices.png  # Seaborn heatmaps comparing all 5 confusion matrices
│   │   ├── correlation_heatmap.png # Feature correlation matrix
│   │   └── model_comparison.png    # Multi-metric comparative bar chart
│   └── src/
│       ├── __init__.py             # Python package marker
│       ├── main.py                 # FastAPI application endpoints (/health, /predict, /model-info)
│       ├── predict.py              # Model loading logic, feature mapping, and inference execution
│       ├── preprocessing.py        # ColumnTransformer definition, feature schema, and BMI calculator
│       └── train_model.py          # Synthetic data generator, EDA, cross-validation, and pipeline exporter
│
└── docs/                           # Academic & Examination Documentation Suite
    ├── postman_collection.json     # Ready-to-import Postman test collection with sample payloads
    ├── viva_questions.md           # 15 detailed viva questions & answers for external exams
    └── project_report_outline.md   # Standard 7-chapter college mini project thesis outline
```

---

## 7. System Execution & Port Mapping

When the application is running, three concurrent services communicate over local network loopback:

```text
┌───────────────────────┬──────────────────────────┬────────────────────────────────────────────┐
│ Service Name          │ Local Network Address    │ Purpose                                    │
├───────────────────────┼──────────────────────────┼────────────────────────────────────────────┤
│ React Client (Vite)   │ http://localhost:5173    │ Interactive user interface and dashboard   │
│ Express API Gateway   │ http://localhost:5000    │ Route routing, validation, error handling  │
│ FastAPI ML Service    │ http://127.0.0.1:8000    │ Scikit-learn inference & model metadata    │
│ FastAPI Interactive UI│ http://127.0.0.1:8000/docs│ Swagger UI for direct microservice testing │
└───────────────────────┴──────────────────────────┴────────────────────────────────────────────┘
```

### Quick Commands Reference to Restart or Run:
1. **ML Service:**
   ```powershell
   cd ml-service
   .\venv\Scripts\Activate.ps1
   uvicorn src.main:app --host 127.0.0.1 --port 8000
   ```
2. **Backend Gateway:**
   ```powershell
   cd backend
   npm run dev
   ```
3. **Frontend Application:**
   ```powershell
   cd frontend
   npm run dev
   ```

---
*Document generated for final project evaluation, laboratory defense, and coursework submission.*
