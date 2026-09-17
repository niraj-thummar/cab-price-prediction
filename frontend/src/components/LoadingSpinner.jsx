import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="spinner-container">
      <div className="pulse-circle">
        <i className="bi bi-car-front-fill fs-2 text-primary"></i>
      </div>
      <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
        <div className="spinner-border text-primary spinner-border-sm" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <h4 className="fw-bold mb-0 text-dark">Predicting price...</h4>
      </div>
      <p className="text-muted small mb-0">
        Processing trip parameters through ML regression model...
      </p>
    </div>
  );
};

export default LoadingSpinner;
