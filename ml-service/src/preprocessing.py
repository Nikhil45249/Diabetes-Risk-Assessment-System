"""
Preprocessing utilities for the Diabetes Risk Assessment ML pipeline.

Defines feature names, column groupings, and the sklearn ColumnTransformer
used by both training and inference.
"""

from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder

# ---------------------------------------------------------------------------
# Feature definitions — single source of truth for the entire ML service
# ---------------------------------------------------------------------------

NUMERIC_FEATURES = ["age", "bmi"]

CATEGORICAL_FEATURES = ["gender", "physical_activity"]

BINARY_FEATURES = [
    "family_history",
    "smoking",
    "alcohol",
    "healthy_diet",
    "frequent_thirst",
    "frequent_urination",
    "fatigue",
    "blurred_vision",
    "slow_wound_healing",
]

# Ordered list used when building DataFrames for prediction
FEATURE_ORDER = NUMERIC_FEATURES + CATEGORICAL_FEATURES + BINARY_FEATURES

# Risk-level label mapping
RISK_LABELS = {0: "Low", 1: "Moderate", 2: "High"}


def build_preprocessor() -> ColumnTransformer:
    """Return an *unfitted* ColumnTransformer matching the feature schema."""
    return ColumnTransformer(
        transformers=[
            ("num", StandardScaler(), NUMERIC_FEATURES),
            (
                "cat",
                OneHotEncoder(drop="first", sparse_output=False, handle_unknown="error"),
                CATEGORICAL_FEATURES,
            ),
            ("bin", "passthrough", BINARY_FEATURES),
        ]
    )


def calculate_bmi(weight_kg: float, height_cm: float) -> float:
    """Calculate BMI from weight (kg) and height (cm)."""
    height_m = height_cm / 100.0
    if height_m <= 0:
        raise ValueError("Height must be positive.")
    return round(weight_kg / (height_m ** 2), 2)
