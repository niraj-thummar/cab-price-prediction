"""
CabPredict ML Inference Pipeline
Replicates the exact preprocessing, scaling, and RandomForest inference
established in PreProcessing.ipynb and RandomForest.ipynb.
"""

import os
import json
import joblib
import pandas as pd
import numpy as np
from typing import Dict, Any


class CabPredictPipeline:
    def __init__(self, artifacts_dir: str = None):
        if artifacts_dir is None:
            # Default to backend/artifacts/
            artifacts_dir = os.path.abspath(
                os.path.join(os.path.dirname(__file__), "..", "artifacts")
            )
        self.artifacts_dir = artifacts_dir
        self.model = None
        self.scaler = None
        self.metadata = None
        self.feature_order = []
        self.numeric_cols = []
        self.load_artifacts()

    def load_artifacts(self):
        model_path = os.path.join(self.artifacts_dir, "model.joblib")
        scaler_path = os.path.join(self.artifacts_dir, "scaler.joblib")
        meta_path = os.path.join(self.artifacts_dir, "metadata.json")

        if not os.path.exists(model_path) or not os.path.exists(scaler_path) or not os.path.exists(meta_path):
            raise FileNotFoundError(
                f"Required model artifacts not found in {self.artifacts_dir}. "
                "Please run `python backend/scripts/export_model.py` to generate them."
            )

        self.model = joblib.load(model_path)
        self.scaler = joblib.load(scaler_path)

        with open(meta_path, "r", encoding="utf-8") as f:
            self.metadata = json.load(f)

        self.feature_order = self.metadata["feature_order"]
        self.numeric_cols = self.metadata["numeric_cols"]
        print(f"[Pipeline] Successfully loaded model and scaler ({len(self.feature_order)} features).")

    def preprocess_input(self, ride_data: Dict[str, Any]) -> pd.DataFrame:
        """
        Preprocesses a single ride input dictionary into the exact 49-feature
        vector required by the trained RandomForest model.
        """
        # Initialize all 49 feature columns to 0.0
        row_dict = {col: 0.0 for col in self.feature_order}

        # 1. Scale continuous numerical features using the fitted MinMaxScaler
        # Exact order: ['distance', 'surge_multiplier', 'hour', 'day', 'month', 'temperature', 'precipIntensity']
        raw_num_df = pd.DataFrame([{col: float(ride_data[col]) for col in self.numeric_cols}])
        scaled_nums = self.scaler.transform(raw_num_df)[0]
        for col, val in zip(self.numeric_cols, scaled_nums):
            row_dict[col] = float(val)

        # 2. Categorical One-Hot Encoding (matching pd.get_dummies(..., drop_first=True))

        # A. cab_type (baseline dropped: Lyft)
        cab = str(ride_data.get("cab_type", "")).strip()
        cab_col = f"cab_type_{cab}"
        if cab_col in row_dict:
            row_dict[cab_col] = 1.0

        # B. name / product tier (baseline dropped: Black)
        name = str(ride_data.get("name", "")).strip()
        name_col = f"name_{name}"
        if name_col in row_dict:
            row_dict[name_col] = 1.0

        # C. source location (baseline dropped: Back Bay)
        src = str(ride_data.get("source", "")).strip()
        src_col = f"source_{src}"
        if src_col in row_dict:
            row_dict[src_col] = 1.0

        # D. destination location (baseline dropped: Back Bay)
        dest = str(ride_data.get("destination", "")).strip()
        dest_col = f"destination_{dest}"
        if dest_col in row_dict:
            row_dict[dest_col] = 1.0

        # E. short_summary weather (baseline dropped: ' Clear ')
        # Note: the Kaggle dataset columns have whitespace e.g. 'short_summary_ Overcast '
        weather = str(ride_data.get("short_summary", "")).strip()
        weather_col = f"short_summary_ {weather} "
        if weather_col in row_dict:
            row_dict[weather_col] = 1.0

        # Return single-row DataFrame with the exact feature order
        features_df = pd.DataFrame([row_dict], columns=self.feature_order)
        return features_df

    def predict(self, ride_data: Dict[str, Any]) -> float:
        """
        Executes full preprocessing and model inference.
        Returns predicted price in USD rounded to 2 decimal places.
        """
        features_df = self.preprocess_input(ride_data)
        raw_prediction = self.model.predict(features_df)
        predicted_price = float(raw_prediction[0])

        # Cab fare cannot be negative
        price = max(0.0, round(predicted_price, 2))
        return price


# Singleton instance ready for FastAPI injection
pipeline = CabPredictPipeline()
