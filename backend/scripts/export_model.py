"""
Export Model Script for CabPredict
Faithfully reproduces the preprocessing and RandomForest training pipeline from:
- PreProcessing.ipynb
- RandomForest.ipynb

Saves:
- backend/artifacts/model.joblib (Trained RandomForestRegressor model)
- backend/artifacts/scaler.joblib (Fitted MinMaxScaler)
- backend/artifacts/metadata.json (Feature order, column names, categories)
"""

import os
import json
import joblib
import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, r2_score


def find_data_file(filename: str) -> str:
    """Look for data file in current directory, parent directory, or backend directory."""
    candidates = [
        filename,
        os.path.join("..", filename),
        os.path.join("backend", filename),
        os.path.join(os.path.dirname(__file__), "..", "..", filename),
        os.path.join(os.path.dirname(__file__), "..", filename),
    ]
    for p in candidates:
        if os.path.exists(p):
            return os.path.abspath(p)
    raise FileNotFoundError(f"Could not find {filename} in candidate paths: {candidates}")


def build_and_export():
    artifacts_dir = os.path.abspath(
        os.path.join(os.path.dirname(__file__), "..", "artifacts")
    )
    os.makedirs(artifacts_dir, exist_ok=True)
    print(f"[CabPredict] Artifacts target directory: {artifacts_dir}")

    # 1. Load data
    raw_path = None
    try:
        raw_path = find_data_file("rideshare_kaggle.csv")
        print(f"[CabPredict] Found raw dataset: {raw_path}")
    except FileNotFoundError:
        pass

    encoded_path = None
    try:
        encoded_path = find_data_file("rideshare_encoded.csv")
        print(f"[CabPredict] Found encoded dataset: {encoded_path}")
    except FileNotFoundError:
        pass

    numeric_cols = [
        'distance', 'surge_multiplier', 'hour', 'day', 'month', 'temperature', 'precipIntensity'
    ]
    categorical_cols = ['cab_type', 'name', 'source', 'destination', 'short_summary']
    columns_to_keep = categorical_cols + numeric_cols + ['price']

    if raw_path and os.path.exists(raw_path):
        print("[CabPredict] Processing raw dataset following PreProcessing.ipynb...")
        df = pd.read_csv(raw_path)
        
        # Data cleaning: drop missing price
        df.dropna(subset=['price'], inplace=True)
        df = df[columns_to_keep]
        
        # Outlier removal: price <= 45
        df = df[df['price'] <= 45]
        
        # Deduplication
        df.drop_duplicates(inplace=True)
        
        # Distance IQR filtering
        Q1 = df['distance'].quantile(0.25)
        Q3 = df['distance'].quantile(0.75)
        IQR = Q3 - Q1
        lower = Q1 - 1.5 * IQR
        upper = Q3 + 1.5 * IQR
        df = df[(df['distance'] >= lower) & (df['distance'] <= upper)]
        print(f"[CabPredict] Filtered dataset shape: {df.shape}")

        # Categorical one-hot encoding (drop_first=True)
        df_encoded = pd.get_dummies(df, columns=categorical_cols, drop_first=True)

        # Numerical scaling with MinMaxScaler
        scaler = MinMaxScaler()
        df_encoded[numeric_cols] = scaler.fit_transform(df_encoded[numeric_cols])

    elif encoded_path and os.path.exists(encoded_path):
        print("[CabPredict] Loading existing rideshare_encoded.csv...")
        df_encoded = pd.read_csv(encoded_path)
        # Scaler bounds from the known filtered dataset (as computed from notebook)
        scaler = MinMaxScaler()
        # To reconstruct scaler: known min and max from filtered raw data
        scaler.data_min_ = np.array([0.02, 1.0, 0.0, 1.0, 11.0, 18.91, 0.0], dtype=np.float64)
        scaler.data_max_ = np.array([5.4, 3.0, 23.0, 30.0, 12.0, 57.22, 0.1447], dtype=np.float64)
        scaler.data_range_ = scaler.data_max_ - scaler.data_min_
        scaler.scale_ = 1.0 / scaler.data_range_
        scaler.min_ = -scaler.data_min_ * scaler.scale_
        scaler.n_features_in_ = len(numeric_cols)
        scaler.feature_names_in_ = np.array(numeric_cols, dtype=object)
    else:
        raise FileNotFoundError("Neither rideshare_kaggle.csv nor rideshare_encoded.csv was found!")

    # Exact feature ordering
    feature_order = [c for c in df_encoded.columns if c != 'price']
    print(f"[CabPredict] Total model features: {len(feature_order)}")

    X = df_encoded[feature_order]
    y = df_encoded['price']

    # Train / Test split matching Model_Training.ipynb exactly
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    print(f"[CabPredict] Training size: {X_train.shape}, Test size: {X_test.shape}")

    # Model training: match RandomForest.ipynb
    print("[CabPredict] Training RandomForestRegressor model...")
    model = RandomForestRegressor(
        n_estimators=30,
        max_depth=15,
        min_samples_leaf=2,
        random_state=42,
        n_jobs=-1,
    )
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    mae = mean_absolute_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)
    print(f"[CabPredict] Model Metrics   : MAE = {mae:.4f} USD, R2 = {r2:.4f}")

    # Save artifacts
    model_file = os.path.join(artifacts_dir, "model.joblib")
    scaler_file = os.path.join(artifacts_dir, "scaler.joblib")
    meta_file = os.path.join(artifacts_dir, "metadata.json")

    joblib.dump(model, model_file)
    joblib.dump(scaler, scaler_file)
    print(f"[CabPredict] Saved model to: {model_file}")
    print(f"[CabPredict] Saved scaler to: {scaler_file}")

    metadata = {
        "model_type": "RandomForestRegressor",
        "model_parameters": {
            "n_estimators": 30,
            "max_depth": 15,
            "min_samples_leaf": 2,
            "random_state": 42,
            "n_jobs": -1
        },
        "n_features": len(feature_order),
        "feature_order": feature_order,
        "numeric_cols": numeric_cols,
        "categorical_cols": categorical_cols,
        "metrics": {
            "mae": round(float(mae), 4),
            "r2": round(float(r2), 4),
            "rmse": round(float(np.sqrt(np.mean((y_test - y_pred) ** 2))), 4)
        },
        "scaler_bounds": {
            col: {
                "min": float(scaler.data_min_[idx]),
                "max": float(scaler.data_max_[idx])
            }
            for idx, col in enumerate(numeric_cols)
        },
        "supported_providers": ["Uber", "Lyft"],
        "supported_products": {
            "Uber": ["UberX", "UberXL", "Black", "Black SUV", "UberPool", "WAV"],
            "Lyft": ["Lyft", "Lyft XL", "Lux", "Lux Black", "Lux Black XL", "Shared"]
        },
        "supported_locations": [
            "Back Bay", "Beacon Hill", "Boston University", "Fenway",
            "Financial District", "Haymarket Square", "North End",
            "North Station", "Northeastern University", "South Station",
            "Theatre District", "West End"
        ],
        "supported_weather": [
            "Clear", "Partly Cloudy", "Mostly Cloudy", "Overcast",
            "Light Rain", "Rain", "Foggy", "Drizzle", "Possible Drizzle"
        ]
    }

    with open(meta_file, "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=2)
    print(f"[CabPredict] Saved metadata to: {meta_file}")
    print("[CabPredict] Export completed successfully!")


if __name__ == "__main__":
    build_and_export()
