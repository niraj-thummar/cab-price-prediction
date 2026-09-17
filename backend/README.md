# CabPredict Backend API

FastAPI-powered Machine Learning backend for the **CabPredict** Boston cab fare prediction project. It directly serves the trained Random Forest model replicating the data cleaning, outlier removal, categorical one-hot encoding, and feature scaling from `PreProcessing.ipynb` and `RandomForest.ipynb`.

---

## 1. Quickstart

### Prerequisites
- Python 3.10+ (Python 3.13 supported)

### Install Dependencies
From the `backend/` directory (or workspace root):
```bash
pip install -r backend/requirements.txt
```

### (Optional) Regenerate Model Artifacts
Artifacts (`model.joblib`, `scaler.joblib`, `metadata.json`) are already pre-trained and saved in `backend/artifacts/`. If you ever need to re-train from the source dataset:
```bash
python backend/scripts/export_model.py
```

### Start FastAPI Server
From the workspace root (`d:\ML_Project\PROJECT`):
```bash
uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload
```
Or from inside the `backend/` directory:
```bash
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

---

## 2. Endpoints & URLs

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `http://127.0.0.1:8000/` | `GET` | Health check endpoint |
| `http://127.0.0.1:8000/api/predict` | `POST` | Core ML ride fare prediction |
| `http://127.0.0.1:8000/api/metadata` | `GET` | Model features & supported categories |
| `http://127.0.0.1:8000/docs` | `GET` | Interactive Swagger UI documentation |
| `http://127.0.0.1:8000/redoc` | `GET` | ReDoc interactive API specification |

---

## 3. Example Prediction Request

### `POST /api/predict`

#### Request Headers
```http
Content-Type: application/json
```

#### Request Body
```json
{
  "cab_type": "Uber",
  "name": "UberX",
  "distance": 3.5,
  "surge_multiplier": 1.0,
  "source": "Back Bay",
  "destination": "Fenway",
  "hour": 18,
  "day": 15,
  "month": 11,
  "temperature": 40.0,
  "short_summary": "Clear",
  "precipIntensity": 0.0
}
```

#### Successful Response (`200 OK`)
```json
{
  "predicted_price": 11.62,
  "cab_type": "Uber",
  "name": "UberX",
  "distance": 3.5,
  "surge_multiplier": 1.0,
  "source": "Back Bay",
  "destination": "Fenway",
  "status": "success",
  "message": "Cab fare predicted successfully"
}
```

---

## 4. Frontend Integration

In your React frontend (`frontend/src/services/predictionService.js`):
```javascript
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const predictCabPrice = async (rideData) => {
  const response = await axios.post(`${API_BASE_URL}/api/predict`, rideData);
  return response.data; // contains { predicted_price: 13.44, ... }
};
```
The React frontend can access `result.predicted_price` directly.
