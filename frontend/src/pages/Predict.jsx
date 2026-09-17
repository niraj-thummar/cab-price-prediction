import React, { useState } from 'react';
import PredictionForm from '../components/PredictionForm';
import PredictionResult from '../components/PredictionResult';
import LoadingSpinner from '../components/LoadingSpinner';
import { predictCabPrice } from '../services/predictionService';
import { mockPredictCabPrice } from '../services/mockPredictionService';

const Predict = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [predictionResult, setPredictionResult] = useState(null);
  const [lastRideData, setLastRideData] = useState(null);

  // Toggle for standalone UI testing / fallback mode
  const [useMockMode, setUseMockMode] = useState(false);

  const handleToggleMockMode = () => {
    setUseMockMode((prev) => !prev);
    setErrorMessage(null);
  };

  const handlePredict = async (rideData) => {
    setIsLoading(true);
    setErrorMessage(null);
    setPredictionResult(null);
    setLastRideData(rideData);

    if (useMockMode) {
      try {
        const mockResult = await mockPredictCabPrice(rideData);
        setPredictionResult(mockResult);
      } catch {
        setErrorMessage('Unable to predict price in demo mode. Please try again.');
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // Production Axios API Call
    try {
      const result = await predictCabPrice(rideData);
      setPredictionResult(result);
    } catch (err) {
      console.error('API Prediction failed:', err);
      const validationErrors = err.response?.data?.errors;
      const backendDetail = err.response?.data?.detail;
      const details = validationErrors
        ?.map((error) => `${error.field}: ${error.message}`)
        .join(' | ');
      setErrorMessage(
        details || backendDetail || 'Unable to predict price. Please check the backend/API connection.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handlePredictAgain = () => {
    setPredictionResult(null);
    setErrorMessage(null);
  };

  // Helper to quickly retry in Demo Mode if real API fails
  const handleTryInDemoMode = async () => {
    if (lastRideData) {
      setUseMockMode(true);
      setErrorMessage(null);
      setIsLoading(true);
      try {
        const mockResult = await mockPredictCabPrice(lastRideData);
        setPredictionResult(mockResult);
      } catch {
        setErrorMessage('Failed in demo mode.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="predict-page py-5">
      <div className="container">
        {/* Page Heading */}
        <div className="text-center max-w-700 mx-auto mb-4">
          <span className="badge bg-primary-subtle text-primary rounded-pill px-3 py-1 fw-bold mb-2">
            Inference Engine
          </span>
          <h1 className="fw-bold text-dark">Cab Fare Predictor</h1>
          <p className="text-muted mb-0">
            Fill in the trip features below to calculate an estimated fare using our ML regression pipeline.
          </p>
        </div>

        {/* Error Alert (Bootstrap alert) */}
        {errorMessage && (
          <div
            className="alert alert-danger alert-dismissible fade show border-danger-subtle shadow-sm mx-auto"
            style={{ maxWidth: '820px' }}
            role="alert"
          >
            <div className="d-flex align-items-start gap-2">
              <i className="bi bi-exclamation-triangle-fill fs-5 text-danger mt-1"></i>
              <div className="flex-grow-1">
                <strong>Connection Alert:</strong> {errorMessage}
                <div className="mt-2 small text-muted">
                  Backend target: <code>{import.meta.env.VITE_API_URL || 'http://localhost:8000'}</code>
                  <div className="mt-1">
                    Want to test the UI right now while your backend is offline?
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger ms-2"
                      onClick={handleTryInDemoMode}
                    >
                      <i className="bi bi-play-circle me-1"></i> Test in Demo Mode
                    </button>
                  </div>
                </div>
              </div>
              <button
                type="button"
                className="btn-close"
                onClick={() => setErrorMessage(null)}
                aria-label="Close"
              ></button>
            </div>
          </div>
        )}

        {/* Content Container */}
        <div className="mx-auto" style={{ maxWidth: '880px' }}>
          {isLoading ? (
            <div className="card-modern p-4">
              <LoadingSpinner />
            </div>
          ) : predictionResult ? (
            <PredictionResult
              result={predictionResult}
              rideData={lastRideData}
              onPredictAgain={handlePredictAgain}
            />
          ) : (
            <PredictionForm
              onSubmit={handlePredict}
              isLoading={isLoading}
              useMockMode={useMockMode}
              onToggleMockMode={handleToggleMockMode}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Predict;
