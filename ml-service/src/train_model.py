"""
Model training pipeline for the Diabetes Risk Assessment System.

Generates a synthetic dataset (clearly labelled for demonstration purposes),
trains five candidate classifiers, evaluates them, selects the best model,
and saves the complete preprocessing + model pipeline using joblib.

IMPORTANT: The dataset is SYNTHETIC. Evaluation metrics describe model
performance on synthetic data only and must NOT be cited as clinically
validated accuracy figures.

Risk-level categorisation method
--------------------------------
A weighted risk score is computed from each sample's features:

  score  = (age − 20) × 0.4
         + max(0, bmi − 25) × 2.0  +  max(0, bmi − 30) × 1.5
         + family_history × 15
         + activity_penalty          (Low → +10, Medium → +3, High → −5)
         + smoking × 8
         + alcohol × 5
         + (1 − healthy_diet) × 7
         + symptom_count × 6
         + noise ~ N(0, 5)

Thresholds:
  Low      → score < 20
  Moderate → 20 ≤ score < 40
  High     → score ≥ 40

The thresholds were chosen to produce roughly balanced classes for
demonstration purposes.
"""

import os
import json
import warnings
from pathlib import Path

import numpy as np
import pandas as pd
import matplotlib
matplotlib.use("Agg")            # non-interactive backend for CI / headless
import matplotlib.pyplot as plt
import seaborn as sns
import joblib

from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import SVC
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    classification_report,
    confusion_matrix,
)

from src.preprocessing import (
    FEATURE_ORDER,
    RISK_LABELS,
    build_preprocessor,
)

warnings.filterwarnings("ignore")

# ---------------------------------------------------------------------------
# Paths (relative to the ml-service/ root)
# ---------------------------------------------------------------------------
BASE_DIR = Path(__file__).resolve().parent.parent
DATASET_DIR = BASE_DIR / "dataset"
MODELS_DIR = BASE_DIR / "models"
NOTEBOOKS_DIR = BASE_DIR / "notebooks"   # for saved plots


def _ensure_dirs():
    DATASET_DIR.mkdir(parents=True, exist_ok=True)
    MODELS_DIR.mkdir(parents=True, exist_ok=True)
    NOTEBOOKS_DIR.mkdir(parents=True, exist_ok=True)


# ---------------------------------------------------------------------------
# Synthetic dataset generation
# ---------------------------------------------------------------------------

def generate_synthetic_dataset(n_samples: int = 2000, random_state: int = 42) -> pd.DataFrame:
    """
    Create a synthetic dataset for SOFTWARE DEMONSTRATION ONLY.

    Features are generated with deliberate correlations so that a classifier
    can learn meaningful patterns, but the data does NOT represent real
    patient populations and the resulting model is NOT clinically validated.
    """
    rng = np.random.RandomState(random_state)

    age = rng.randint(18, 80, n_samples)
    gender = rng.choice(["Male", "Female"], n_samples)
    bmi = np.clip(rng.normal(26.5, 5.5, n_samples), 15, 48).round(1)

    family_history = rng.choice([0, 1], n_samples, p=[0.62, 0.38])
    physical_activity = rng.choice(
        ["Low", "Medium", "High"], n_samples, p=[0.30, 0.45, 0.25]
    )
    smoking = rng.choice([0, 1], n_samples, p=[0.74, 0.26])
    alcohol = rng.choice([0, 1], n_samples, p=[0.68, 0.32])
    healthy_diet = rng.choice([0, 1], n_samples, p=[0.48, 0.52])

    # ---- latent risk (symptoms depend on this) ----------------------------
    activity_map = {"Low": 10, "Medium": 3, "High": -5}
    activity_score = np.array([activity_map[a] for a in physical_activity])

    latent = (
        (age - 20) * 0.4
        + np.maximum(0, bmi - 25) * 2.0
        + np.maximum(0, bmi - 30) * 1.5
        + family_history * 15
        + activity_score
        + smoking * 8
        + alcohol * 5
        + (1 - healthy_diet) * 7
    )

    # normalise to [0.05, 0.65] for symptom probabilities
    lat_min, lat_max = latent.min(), latent.max()
    prob = (latent - lat_min) / (lat_max - lat_min) * 0.6 + 0.05

    frequent_thirst = (rng.random(n_samples) < prob * 0.80).astype(int)
    frequent_urination = (rng.random(n_samples) < prob * 0.75).astype(int)
    fatigue = (rng.random(n_samples) < prob * 0.70).astype(int)
    blurred_vision = (rng.random(n_samples) < prob * 0.40).astype(int)
    slow_wound_healing = (rng.random(n_samples) < prob * 0.35).astype(int)

    symptom_count = (
        frequent_thirst + frequent_urination + fatigue
        + blurred_vision + slow_wound_healing
    )

    # ---- final risk score -------------------------------------------------
    risk_score = latent + symptom_count * 6 + rng.normal(0, 5, n_samples)

    risk_level = np.where(
        risk_score < 20, 0, np.where(risk_score < 40, 1, 2)
    )

    df = pd.DataFrame(
        {
            "age": age,
            "gender": gender,
            "bmi": bmi,
            "family_history": family_history,
            "physical_activity": physical_activity,
            "smoking": smoking,
            "alcohol": alcohol,
            "healthy_diet": healthy_diet,
            "frequent_thirst": frequent_thirst,
            "frequent_urination": frequent_urination,
            "fatigue": fatigue,
            "blurred_vision": blurred_vision,
            "slow_wound_healing": slow_wound_healing,
            "risk_level": risk_level,
        }
    )
    return df


# ---------------------------------------------------------------------------
# EDA helpers
# ---------------------------------------------------------------------------

def run_eda(df: pd.DataFrame):
    """Print summary statistics and save plots."""
    print("\n" + "=" * 60)
    print("EXPLORATORY DATA ANALYSIS")
    print("=" * 60)
    print(f"\nDataset shape: {df.shape}")
    print(f"\nMissing values:\n{df.isnull().sum()}")
    print(f"\nDuplicate rows: {df.duplicated().sum()}")
    print(f"\nClass distribution:\n{df['risk_level'].value_counts().sort_index()}")
    print(f"\nDescriptive statistics:\n{df.describe()}")

    # --- Plot 1: class distribution ----------------------------------------
    fig, ax = plt.subplots(figsize=(6, 4))
    counts = df["risk_level"].value_counts().sort_index()
    labels = [RISK_LABELS[i] for i in counts.index]
    colors = ["#10B981", "#F59E0B", "#EF4444"]
    ax.bar(labels, counts.values, color=colors, edgecolor="white", linewidth=1.2)
    ax.set_title("Class Distribution (Synthetic Data)", fontweight="bold")
    ax.set_ylabel("Count")
    fig.tight_layout()
    fig.savefig(NOTEBOOKS_DIR / "class_distribution.png", dpi=150)
    plt.close(fig)

    # --- Plot 2: correlation heatmap (numeric & binary only) ---------------
    numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
    fig, ax = plt.subplots(figsize=(10, 8))
    sns.heatmap(
        df[numeric_cols].corr(), annot=True, fmt=".2f", cmap="coolwarm",
        square=True, linewidths=0.5, ax=ax
    )
    ax.set_title("Feature Correlation Heatmap (Synthetic Data)", fontweight="bold")
    fig.tight_layout()
    fig.savefig(NOTEBOOKS_DIR / "correlation_heatmap.png", dpi=150)
    plt.close(fig)

    # --- Plot 3: BMI distribution by risk level ----------------------------
    fig, ax = plt.subplots(figsize=(7, 4))
    for level in sorted(df["risk_level"].unique()):
        subset = df[df["risk_level"] == level]["bmi"]
        ax.hist(subset, bins=25, alpha=0.5, label=RISK_LABELS[level], color=colors[level])
    ax.set_title("BMI Distribution by Risk Level (Synthetic Data)", fontweight="bold")
    ax.set_xlabel("BMI")
    ax.set_ylabel("Frequency")
    ax.legend()
    fig.tight_layout()
    fig.savefig(NOTEBOOKS_DIR / "bmi_by_risk.png", dpi=150)
    plt.close(fig)

    # --- Plot 4: age distribution by risk level ----------------------------
    fig, ax = plt.subplots(figsize=(7, 4))
    for level in sorted(df["risk_level"].unique()):
        subset = df[df["risk_level"] == level]["age"]
        ax.hist(subset, bins=25, alpha=0.5, label=RISK_LABELS[level], color=colors[level])
    ax.set_title("Age Distribution by Risk Level (Synthetic Data)", fontweight="bold")
    ax.set_xlabel("Age")
    ax.set_ylabel("Frequency")
    ax.legend()
    fig.tight_layout()
    fig.savefig(NOTEBOOKS_DIR / "age_by_risk.png", dpi=150)
    plt.close(fig)

    print(f"\nEDA plots saved to {NOTEBOOKS_DIR}")


# ---------------------------------------------------------------------------
# Training & evaluation
# ---------------------------------------------------------------------------

def train_and_evaluate():
    """Full training pipeline."""
    _ensure_dirs()

    # 1. Generate / load dataset
    csv_path = DATASET_DIR / "synthetic_diabetes_risk.csv"
    if csv_path.exists():
        print(f"Loading existing dataset from {csv_path}")
        df = pd.read_csv(csv_path)
    else:
        print("Generating synthetic dataset …")
        df = generate_synthetic_dataset()
        df.to_csv(csv_path, index=False)
        print(f"Dataset saved to {csv_path}")

    # 2. EDA
    run_eda(df)

    # 3. Split
    X = df[FEATURE_ORDER]
    y = df["risk_level"]
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42, stratify=y
    )
    print(f"\nTrain size: {len(X_train)}, Test size: {len(X_test)}")

    # 4. Define candidate models
    candidates = {
        "Logistic Regression": LogisticRegression(
            max_iter=1000, random_state=42
        ),
        "Decision Tree": DecisionTreeClassifier(
            max_depth=8, random_state=42
        ),
        "Random Forest": RandomForestClassifier(
            n_estimators=120, max_depth=12, random_state=42
        ),
        "SVM": SVC(
            probability=True, kernel="rbf", random_state=42
        ),
        "KNN": KNeighborsClassifier(
            n_neighbors=7
        ),
    }

    results = {}
    best_score = -1
    best_name = None
    best_pipeline = None

    print("\n" + "=" * 60)
    print("MODEL TRAINING & EVALUATION (on synthetic data)")
    print("=" * 60)

    for name, clf in candidates.items():
        pipe = Pipeline([
            ("preprocessor", build_preprocessor()),
            ("classifier", clf),
        ])
        pipe.fit(X_train, y_train)
        y_pred = pipe.predict(X_test)

        acc = accuracy_score(y_test, y_pred)
        prec = precision_score(y_test, y_pred, average="weighted", zero_division=0)
        rec = recall_score(y_test, y_pred, average="weighted", zero_division=0)
        f1 = f1_score(y_test, y_pred, average="weighted", zero_division=0)
        cm = confusion_matrix(y_test, y_pred)

        results[name] = {
            "accuracy": round(acc, 4),
            "precision": round(prec, 4),
            "recall": round(rec, 4),
            "f1_score": round(f1, 4),
            "confusion_matrix": cm.tolist(),
        }

        print(f"\n--- {name} ---")
        print(classification_report(y_test, y_pred, target_names=list(RISK_LABELS.values()), zero_division=0))

        if f1 > best_score:
            best_score = f1
            best_name = name
            best_pipeline = pipe

    # 5. Save best model
    model_path = MODELS_DIR / "best_model_pipeline.joblib"
    joblib.dump(best_pipeline, model_path)
    print(f"\n[OK] Best model: {best_name} (F1 = {best_score:.4f})")
    print(f"   Saved to {model_path}")

    # 6. Save metadata
    meta = {
        "best_model": best_name,
        "evaluation_results": results,
        "features": FEATURE_ORDER,
        "risk_labels": RISK_LABELS,
        "dataset": {
            "type": "synthetic",
            "samples": len(df),
            "train_size": len(X_train),
            "test_size": len(X_test),
            "note": (
                "This dataset is SYNTHETIC, generated for software demonstration only. "
                "Evaluation metrics reflect model performance on synthetic data and are "
                "NOT clinically validated."
            ),
        },
        "categorisation_method": (
            "Weighted risk score with thresholds: Low < 20, Moderate 20–40, High ≥ 40. "
            "See train_model.py docstring for the full formula."
        ),
    }
    meta_path = MODELS_DIR / "model_metadata.json"
    with open(meta_path, "w", encoding="utf-8") as f:
        json.dump(meta, f, indent=2)
    print(f"   Metadata saved to {meta_path}")

    # 7. Comparison bar chart
    model_names = list(results.keys())
    metrics = ["accuracy", "precision", "recall", "f1_score"]
    fig, ax = plt.subplots(figsize=(10, 5))
    x = np.arange(len(model_names))
    width = 0.18
    palette = ["#0D9488", "#3B82F6", "#8B5CF6", "#F59E0B"]
    for i, m in enumerate(metrics):
        vals = [results[n][m] for n in model_names]
        ax.bar(x + i * width, vals, width, label=m.replace("_", " ").title(), color=palette[i])
    ax.set_xticks(x + width * 1.5)
    ax.set_xticklabels(model_names, rotation=15, ha="right")
    ax.set_ylim(0, 1.05)
    ax.set_ylabel("Score")
    ax.set_title("Model Comparison (Synthetic Data)", fontweight="bold")
    ax.legend(loc="lower right")
    fig.tight_layout()
    fig.savefig(NOTEBOOKS_DIR / "model_comparison.png", dpi=150)
    plt.close(fig)

    # 8. Confusion matrices
    fig, axes = plt.subplots(1, len(results), figsize=(4 * len(results), 4))
    for idx, (name, res) in enumerate(results.items()):
        sns.heatmap(
            np.array(res["confusion_matrix"]),
            annot=True, fmt="d", cmap="Blues",
            xticklabels=list(RISK_LABELS.values()),
            yticklabels=list(RISK_LABELS.values()),
            ax=axes[idx],
        )
        axes[idx].set_title(name, fontsize=9, fontweight="bold")
        axes[idx].set_xlabel("Predicted")
        axes[idx].set_ylabel("Actual")
    fig.suptitle("Confusion Matrices (Synthetic Data)", fontweight="bold", y=1.02)
    fig.tight_layout()
    fig.savefig(NOTEBOOKS_DIR / "confusion_matrices.png", dpi=150, bbox_inches="tight")
    plt.close(fig)

    print(f"\n[INFO] Plots saved to {NOTEBOOKS_DIR}")
    print("\nTraining complete [OK]")


# ---------------------------------------------------------------------------
# Entry point:  python -m src.train_model
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    train_and_evaluate()
