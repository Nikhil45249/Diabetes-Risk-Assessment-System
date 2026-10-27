"""
Prediction module — loads the saved pipeline and exposes a predict function.
"""

import json
from pathlib import Path
from typing import Optional

import pandas as pd
import joblib

from src.preprocessing import FEATURE_ORDER, RISK_LABELS, calculate_bmi

# ---------------------------------------------------------------------------
# Globals (loaded once at import / startup)
# ---------------------------------------------------------------------------
_pipeline = None
_metadata = None

MODELS_DIR = Path(__file__).resolve().parent.parent / "models"
DEFAULT_MODEL_PATH = MODELS_DIR / "best_model_pipeline.joblib"
DEFAULT_META_PATH = MODELS_DIR / "model_metadata.json"


def load_model(model_path: Optional[str] = None):
    """Load the saved sklearn pipeline and metadata into module-level globals."""
    global _pipeline, _metadata

    path = Path(model_path) if model_path else DEFAULT_MODEL_PATH
    if not path.exists():
        raise FileNotFoundError(f"Model file not found: {path}")

    _pipeline = joblib.load(path)

    meta_path = DEFAULT_META_PATH
    if meta_path.exists():
        with open(meta_path) as f:
            _metadata = json.load(f)
    else:
        _metadata = {"note": "No metadata file found."}

    return _pipeline


def get_metadata() -> dict:
    """Return model metadata (training info, metrics, etc.)."""
    if _metadata is None:
        return {"note": "Model not loaded yet."}
    return _metadata


def is_model_loaded() -> bool:
    return _pipeline is not None


def predict(features: dict) -> dict:
    """
    Run prediction on a single sample.

    Parameters
    ----------
    features : dict
        Must include height_cm and weight_kg (BMI is computed here),
        plus all other questionnaire fields.

    Returns
    -------
    dict with keys: risk_level (str), bmi (float), probability (float | None)
    """
    if _pipeline is None:
        raise RuntimeError("Model not loaded. Call load_model() first.")

    # Calculate BMI from height & weight
    bmi = calculate_bmi(
        weight_kg=features["weight_kg"],
        height_cm=features["height_cm"],
    )

    # Build a single-row DataFrame with the expected feature order
    row = {
        "age": features["age"],
        "bmi": bmi,
        "gender": features["gender"],
        "physical_activity": features["physical_activity"],
        "family_history": int(features["family_history"]),
        "smoking": int(features["smoking"]),
        "alcohol": int(features["alcohol"]),
        "healthy_diet": int(features["healthy_diet"]),
        "frequent_thirst": int(features["frequent_thirst"]),
        "frequent_urination": int(features["frequent_urination"]),
        "fatigue": int(features["fatigue"]),
        "blurred_vision": int(features["blurred_vision"]),
        "slow_wound_healing": int(features["slow_wound_healing"]),
    }

    df = pd.DataFrame([row], columns=FEATURE_ORDER)

    # Predict
    prediction = int(_pipeline.predict(df)[0])
    risk_label = RISK_LABELS.get(prediction, "Unknown")

    # Probability (if supported by the classifier)
    probability = None
    if hasattr(_pipeline, "predict_proba"):
        try:
            proba = _pipeline.predict_proba(df)[0]
            probability = {
                RISK_LABELS[i]: round(float(p), 4) for i, p in enumerate(proba)
            }
        except Exception:
            probability = None

    return {
        "risk_level": risk_label,
        "bmi": bmi,
        "probability": probability,
    }
