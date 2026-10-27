# Diabetes Risk Assessment System — Viva Questions & Answers

This document contains comprehensive viva voce questions and answers prepared specifically for college evaluations, lab externals, and project defense presentations.

---

## 1. Project Overview & Architecture

### Q1: What is the primary objective of this project?
**Answer:**  
The objective is to design and develop an end-to-end web application that estimates an individual's risk of developing Type-2 diabetes (categorized as Low, Moderate, or High) using non-invasive lifestyle, demographic, and self-reported symptom features, without requiring invasive clinical laboratory tests (such as fasting blood glucose or HbA1c).

### Q2: Explain the system architecture of this application.
**Answer:**  
The system follows a modern **three-tier decoupled architecture**:
1. **Frontend (Presentation Tier):** Built with **React 18** and **Vite**, styled using **Tailwind CSS**. It provides an interactive 3-step assessment form, dynamic BMI calculations, real-time input validation, and visual data representation using **Recharts**.
2. **Backend (Application / API Gateway Tier):** Built with **Node.js** and **Express**. It handles client request routing, redundant server-side validation, cross-origin resource sharing (CORS), error normalization, and acts as an API gateway delegating ML tasks to the microservice.
3. **ML Microservice (Inference & Data Tier):** Built with **Python** and **FastAPI**. It hosts the trained scikit-learn pipeline, preprocesses input features via a `ColumnTransformer`, computes the BMI, executes inference across 5 trained algorithms, and returns predictions and class probabilities.

### Q3: Why did you separate the Express backend from the FastAPI ML service instead of doing everything in one server?
**Answer:**  
1. **Separation of Concerns:** Python is the industry standard for machine learning, data science, and mathematical computing (scikit-learn, NumPy, pandas). Node.js is exceptionally efficient for high-concurrency I/O, web routing, and client gateway management.
2. **Scalability:** The ML service can be scaled horizontally and independently (e.g., using GPU instances or container replicas) without touching the web application layer.
3. **Loose Coupling:** The Express backend abstracts the internal ML implementation from the client. If we migrate from scikit-learn to PyTorch or a cloud endpoint, the frontend remains completely unaffected.

---

## 2. Machine Learning & Algorithms

### Q4: Which machine learning algorithms did you train and compare?
**Answer:**  
We implemented and benchmarked five classic supervised classification algorithms:
1. **Logistic Regression:** A probabilistic linear classifier that applies the sigmoid/softmax function to linear combinations of features.
2. **Decision Tree Classifier:** A tree-structured model that recursively partitions the feature space based on Gini Impurity or Information Gain.
3. **Random Forest Classifier:** An ensemble bagging method that builds multiple de-correlated decision trees with bootstrap samples and aggregates their predictions by majority voting.
4. **Support Vector Machine (SVM):** A max-margin classifier that identifies the optimal separating hyperplane in high-dimensional feature space using an RBF kernel.
5. **K-Nearest Neighbors (KNN):** An instance-based (lazy) non-parametric classifier that assigns labels based on Euclidean distance to the *k* closest training points.

### Q5: How was the "best model" selected?
**Answer:**  
Models were evaluated on a held-out test set (20% split) using 5-fold cross-validation. While accuracy measures overall correctness, in healthcare applications false negatives carry severe consequences. Therefore, we evaluated **Macro F1-Score** (the harmonic mean of Precision and Recall across all classes) to select the production model. Random Forest or Logistic Regression typically yields the highest balanced F1-score and generalization stability.

### Q6: What is the difference between Precision and Recall in this context? Which one is more important?
**Answer:**  
- **Precision:** $\frac{TP}{TP + FP}$ — Out of all patients predicted as High Risk, how many actually were High Risk? High precision minimizes false alarms.
- **Recall (Sensitivity):** $\frac{TP}{TP + FN}$ — Out of all individuals who are truly High Risk, how many did the model correctly identify?
- **Importance:** In medical risk assessment, **Recall is critical**. A False Negative (predicting Low Risk when the individual is actually High Risk) could lead to delayed diagnosis and severe health complications. Thus, a high recall model is preferred, balanced by F1-Score.

### Q7: What is a Confusion Matrix and how do you interpret it for a 3-class problem?
**Answer:**  
A confusion matrix is an $N \times N$ matrix (here $3 \times 3$) comparing the ground truth labels against the model's predictions for the three classes: **Low**, **Moderate**, and **High**.
- Diagonal elements ($C_{00}, C_{11}, C_{22}$) represent correctly classified samples (True Positives for each class).
- Off-diagonal elements represent misclassifications (e.g., $C_{01}$ represents a true "Low" misclassified as "Moderate").
- It allows us to see whether the model confuses Moderate with High, or Low with Moderate.

---

## 3. Data Preprocessing & Feature Engineering

### Q8: What features are used in the questionnaire, and why are they non-invasive?
**Answer:**  
The model utilizes 14 non-invasive features categorized into 3 groups:
1. **Demographics & Physical Metrics:** Age, Gender, Height (cm), Weight (kg), and calculated BMI ($kg/m^2$).
2. **Lifestyle & Family History:** Family history of diabetes, Physical activity level (Low, Medium, High), Smoking habit, Alcohol consumption, Healthy diet adherence.
3. **Self-Reported Early Symptoms:** Frequent thirst (polydipsia), Frequent urination (polyuria), Persistent fatigue, Blurred vision, Slow wound healing.
These are non-invasive because they can be gathered via a self-administered digital questionnaire without requiring blood draws, laboratory equipment, or clinic visits.

### Q9: How are different types of features preprocessed before model training?
**Answer:**  
We utilize scikit-learn's `ColumnTransformer` inside an end-to-end `Pipeline`:
- **Continuous numerical features (Age, BMI):** Scaled using `StandardScaler` to have zero mean and unit variance ($z = \frac{x - \mu}{\sigma}$), preventing features with larger scales from dominating distance-based algorithms like KNN and SVM.
- **Nominal categorical features (Gender):** Encoded using `OneHotEncoder(drop='first')` to prevent the dummy variable trap.
- **Ordinal categorical features (Physical Activity):** Mapped ordinally (`Low: 0, Medium: 1, High: 2`) via `OrdinalEncoder`.
- **Binary symptom & lifestyle flags (Yes/No):** Encoded as binary integers (`0` or `1`).

### Q10: Why is it important to fit the scaler and encoder only on training data?
**Answer:**  
To prevent **Data Leakage**. If we fit a scaler or encoder on the entire dataset before splitting, the test set's mean, variance, or category distributions leak into the model training phase. By combining transformers and estimators inside a scikit-learn `Pipeline`, transformations are fitted strictly on `X_train` and applied to `X_test` and production inference inputs.

---

## 4. Software Engineering & Full-Stack Implementation

### Q11: How do you handle input validation across the application?
**Answer:**  
We implement **defense-in-depth dual validation**:
1. **Client-Side (React):** Real-time field validation, range checks (e.g., Age 1–120, Height 50–300 cm, Weight 10–400 kg), preventing unnecessary network requests.
2. **Server-Side Gateway (Express):** Independent validation middleware (`assessmentValidator.js`) sanitizing and checking all constraints before passing payloads to downstream services.
3. **ML Microservice (FastAPI + Pydantic):** Strict type coercion and Pydantic field validators (`PredictionRequest`) ensuring that only valid numeric and categorical schemas enter the prediction pipeline.

### Q12: How does the system handle errors and service outages?
**Answer:**  
- If the Python ML service is unreachable or restarting, Axios in the Express layer catches `ECONNREFUSED` or timeout exceptions and returns HTTP **503 Service Unavailable** with a friendly error envelope instead of crashing the server.
- The centralized Express error handler intercepts uncaught exceptions and avoids leaking sensitive stack traces in production.
- The React frontend handles 503 and network errors gracefully by displaying alert banners and keeping the user's completed questionnaire state intact.

### Q13: What is the significance of the medical disclaimer in this application?
**Answer:**  
From an ethical and legal standpoint, machine learning models trained on synthetic or non-clinical data cannot provide medical diagnoses. The application explicitly displays a prominent **Disclaimer** on the homepage, assessment form, results view, and model info pages stating that the output is an educational risk estimate and that users should consult certified medical practitioners for actual diagnosis.

---

## 5. Dataset & Ethical Considerations

### Q14: What dataset was used and why is it marked synthetic?
**Answer:**  
The model is trained on a 2,000-sample synthetic dataset generated using clinical risk score heuristics (incorporating known epidemiological risk ratios for age, elevated BMI, family history, sedentary habits, and classic symptoms like polyuria and polydipsia).  
It is explicitly labeled as **synthetic** in accordance with academic integrity standards: college demonstration projects should never falsely claim that unverified models are clinically tested on real patient health records.

### Q15: What are the future enhancements for this project?
**Answer:**  
1. **Clinical Validation:** Training on anonymized real-world longitudinal cohorts (such as the CDC BRFSS or NHANES datasets).
2. **Model Explainability:** Integrating SHAP (SHapley Additive exPlanations) or LIME to show users exactly how each specific factor (e.g., +15% risk due to BMI) contributed to their individual score.
3. **User Accounts & Tracking:** Adding MongoDB persistence to allow users to track their risk trajectory over time as they adopt healthier lifestyle habits.
4. **Exportable PDF Reports:** Allowing users to download a summary to discuss with their physician.
