import React from 'react';

const PredictionResult = ({ result, rideData, onPredictAgain }) => {
  const isUber = rideData.cab_type === 'Uber';
  const price = typeof result?.predicted_price === 'number'
    ? result.predicted_price.toFixed(2)
    : result?.predicted_price || '0.00';

  return (
    <div className="result-card">
      {/* Top Hero Banner */}
      <div className="result-hero">
        <div className="d-flex justify-content-center align-items-center gap-2 mb-2">
          <span
            className={`badge rounded-pill ${
              isUber ? 'bg-dark text-white' : 'bg-danger text-white'
            } px-3 py-2`}
          >
            <i className="bi bi-car-front me-1"></i> {rideData.cab_type}
          </span>
          <span className="badge rounded-pill bg-light text-dark px-3 py-2">
            {rideData.name}
          </span>
          {result?.is_mock && (
            <span className="badge rounded-pill bg-warning text-dark px-2 py-1 small">
              <i className="bi bi-info-circle me-1"></i> Demo Mode
            </span>
          )}
        </div>

        <p className="text-white-50 text-uppercase letter-spacing-1 fw-semibold small mb-1">
          Estimated Cab Price
        </p>

        <div className="result-price-display">
          ${price}
        </div>

        <p className="text-white-50 small mb-0">
          Predicted based on Boston ML Regression Model
        </p>
      </div>

      {/* Details Grid */}
      <div className="p-4">
        <h6 className="fw-bold text-dark mb-3">
          <i className="bi bi-receipt me-2 text-primary"></i>Ride Summary Breakdown
        </h6>

        <div className="row g-3">
          {/* Cab Type & Name */}
          <div className="col-sm-6">
            <div className="result-grid-item">
              <div className="result-grid-label">Cab Provider & Type</div>
              <div className="result-grid-value d-flex align-items-center gap-2">
                <span className={isUber ? 'text-dark' : 'text-danger'}>
                  {rideData.cab_type}
                </span>
                <span className="text-muted fw-normal">·</span>
                <span>{rideData.name}</span>
              </div>
            </div>
          </div>

          {/* Distance */}
          <div className="col-sm-6">
            <div className="result-grid-item">
              <div className="result-grid-label">Trip Distance</div>
              <div className="result-grid-value">
                <i className="bi bi-signpost-2 text-primary me-1"></i>
                {rideData.distance} miles
              </div>
            </div>
          </div>

          {/* Source Location */}
          <div className="col-sm-6">
            <div className="result-grid-item">
              <div className="result-grid-label">Pickup (Source)</div>
              <div className="result-grid-value text-truncate">
                <i className="bi bi-geo-alt-fill text-success me-1"></i>
                {rideData.source}
              </div>
            </div>
          </div>

          {/* Destination Location */}
          <div className="col-sm-6">
            <div className="result-grid-item">
              <div className="result-grid-label">Drop-off (Destination)</div>
              <div className="result-grid-value text-truncate">
                <i className="bi bi-geo-alt-fill text-danger me-1"></i>
                {rideData.destination}
              </div>
            </div>
          </div>

          {/* Surge Multiplier */}
          <div className="col-sm-6">
            <div className="result-grid-item">
              <div className="result-grid-label">Surge Multiplier</div>
              <div className="result-grid-value">
                <span
                  className={`badge ${
                    parseFloat(rideData.surge_multiplier) > 1.0
                      ? 'bg-warning text-dark'
                      : 'bg-success-subtle text-success'
                  }`}
                >
                  <i className="bi bi-lightning-charge-fill me-1"></i>
                  {rideData.surge_multiplier}x
                </span>
              </div>
            </div>
          </div>

          {/* Weather & Time */}
          <div className="col-sm-6">
            <div className="result-grid-item">
              <div className="result-grid-label">Conditions</div>
              <div className="result-grid-value small d-flex align-items-center gap-2">
                <span>
                  <i className="bi bi-cloud-sun text-info me-1"></i>
                  {rideData.short_summary || 'Normal'}
                </span>
                <span className="text-muted">|</span>
                <span>
                  <i className="bi bi-clock me-1 text-secondary"></i>
                  {rideData.hour}:00
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="d-flex flex-column flex-sm-row gap-2 mt-4 pt-2">
          <button
            type="button"
            className="btn btn-primary-gradient flex-grow-1 py-2"
            onClick={onPredictAgain}
            id="predict-again-btn"
          >
            <i className="bi bi-arrow-repeat me-1"></i> Predict Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default PredictionResult;
