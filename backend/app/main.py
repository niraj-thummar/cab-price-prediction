"""
CabPredict FastAPI Backend
Provides REST endpoints for Cab Fare Prediction using Boston Uber & Lyft ML regression.
"""

from fastapi import FastAPI, HTTPException, status, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from typing import Dict, Any

from backend.app.schemas import (
    RidePredictionRequest,
    RidePredictionResponse,
    HealthCheckResponse,
)
from backend.app.pipeline import pipeline

app = FastAPI(
    title="CabPredict API",
    description="Machine Learning Backend API for Boston Cab Fare Prediction (Uber & Lyft)",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# ---------------------------------------------------------------------------
# CORS Configuration
# ---------------------------------------------------------------------------
# Allow React frontend during local development (standard Vite ports, local host, and all origins)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_origin_regex=r"https?://(localhost|127\.0\.0\.1|0\.0\.0\.0|\[::1\])(:\d+)?",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# Exception Handlers
# ---------------------------------------------------------------------------
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Formats 422 validation errors into clear, friendly JSON responses."""
    errors = []
    for err in exc.errors():
        field = " -> ".join([str(loc) for loc in err.get("loc", []) if loc != "body"])
        msg = err.get("msg", "Invalid input")
        errors.append({"field": field or "payload", "message": msg})
    return JSONResponse(
        status_code=422,
        content={
            "status": "error",
            "message": "Input validation failed. Please verify your ride parameters.",
            "errors": errors,
        },
    )


@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    """Catches unhandled errors and returns structured 500 JSON response."""
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "status": "error",
            "message": "An internal server error occurred while processing the prediction.",
            "detail": str(exc),
        },
    )


# ---------------------------------------------------------------------------
# API Routes
# ---------------------------------------------------------------------------
@app.get(
    "/api",
    response_model=HealthCheckResponse,
    summary="Root Health Check",
    tags=["Health"],
)
async def root():
    """Root health check endpoint returning server status."""
    return {"message": "CabPredict Backend is Running!"}


@app.get(
    "/api/metadata",
    summary="Get Model Metadata & Supported Features",
    tags=["Metadata"],
)
async def get_metadata() -> Dict[str, Any]:
    """Returns model features, supported locations, providers, and model metrics."""
    return pipeline.metadata


@app.post(
    "/api/predict",
    response_model=RidePredictionResponse,
    status_code=status.HTTP_200_OK,
    summary="Predict Cab Ride Fare",
    tags=["Prediction"],
)
async def predict_fare(payload: RidePredictionRequest):
    """
    Predicts the cab ride fare (in USD) using the trained Random Forest pipeline.
    Replicates the exact preprocessing, scaling, and feature ordering from the Jupyter notebooks.
    """
    try:
        data = payload.model_dump()

        # Extra validation: Provider check
        valid_providers = pipeline.metadata.get("supported_providers", ["Uber", "Lyft"])
        if data["cab_type"] not in valid_providers:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid cab_type '{data['cab_type']}'. Supported providers are: {valid_providers}",
            )

        # Extra validation: Distance > 0
        if data["distance"] <= 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Distance must be strictly greater than 0 miles.",
            )

        # Run inference through ML pipeline
        predicted_price = pipeline.predict(data)

        return RidePredictionResponse(
            predicted_price=predicted_price,
            cab_type=data["cab_type"],
            name=data["name"],
            distance=data["distance"],
            surge_multiplier=data["surge_multiplier"],
            source=data["source"],
            destination=data["destination"],
            status="success",
            message="Cab fare predicted successfully",
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Prediction failed: {str(e)}",
        )
