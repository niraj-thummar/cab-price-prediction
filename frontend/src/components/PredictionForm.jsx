import React, { useState } from 'react';
import {
  BOSTON_LOCATIONS,
  CAB_PRODUCTS,
  SURGE_MULTIPLIERS,
  WEATHER_SUMMARIES,
} from '../constants/datasetConstants';

const INITIAL_FORM_STATE = {
  cab_type: 'Uber',
  name: 'UberX',
  distance: 3.5,
  surge_multiplier: 1.0,
  source: 'Back Bay',
  destination: 'Fenway',
  hour: 18,
  day: 15,
  month: 11,
  temperature: 40.0,
  short_summary: 'Clear',
  precipIntensity: 0,
};

const PredictionForm = ({ onSubmit, isLoading, useMockMode, onToggleMockMode }) => {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState({});

  // Handle provider switch (auto-update default product for that provider)
  const handleProviderChange = (provider) => {
    const defaultProduct = CAB_PRODUCTS[provider][0];
    setFormData((prev) => ({
      ...prev,
      cab_type: provider,
      name: defaultProduct,
    }));
    if (errors.cab_type || errors.name) {
      setErrors((prev) => ({ ...prev, cab_type: null, name: null }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error for field on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // Validate inputs
  const validateForm = () => {
    const newErrors = {};

    if (!formData.cab_type) {
      newErrors.cab_type = 'Cab type is required';
    }

    if (!formData.name) {
      newErrors.name = 'Cab product/name is required';
    }

    // Distance > 0
    const distanceVal = parseFloat(formData.distance);
    if (isNaN(distanceVal) || distanceVal <= 0 || distanceVal > 5.4) {
      newErrors.distance = 'Distance must be between 0 and 5.4 miles';
    }

    // Surge multiplier
    const surgeVal = parseFloat(formData.surge_multiplier);
    if (isNaN(surgeVal) || surgeVal < 1.0) {
      newErrors.surge_multiplier = 'Select a valid surge multiplier';
    }

    // Source & Destination
    if (!formData.source) {
      newErrors.source = 'Source location is required';
    }
    if (!formData.destination) {
      newErrors.destination = 'Destination location is required';
    }
    if (formData.source && formData.destination && formData.source === formData.destination) {
      newErrors.destination = 'Destination must be different from pickup location';
    }

    // Hour 0 - 23
    const hourVal = parseInt(formData.hour, 10);
    if (isNaN(hourVal) || hourVal < 0 || hourVal > 23) {
      newErrors.hour = 'Hour must be an integer between 0 and 23';
    }

    // Day 1 - 31
    const dayVal = parseInt(formData.day, 10);
    if (isNaN(dayVal) || dayVal < 1 || dayVal > 30) {
      newErrors.day = 'Day must be between 1 and 30 for this model';
    }

    // Month 1 - 12
    const monthVal = parseInt(formData.month, 10);
    if (isNaN(monthVal) || monthVal < 11 || monthVal > 12) {
      newErrors.month = 'Month must be 11 or 12 for this model';
    }

    // Temperature
    const temperatureVal = parseFloat(formData.temperature);
    if (isNaN(temperatureVal) || temperatureVal < 18.91 || temperatureVal > 57.22) {
      newErrors.temperature = 'Temperature must be between 18.91°F and 57.22°F';
    }

    // Weather summary
    if (!formData.short_summary) {
      newErrors.short_summary = 'Weather summary is required';
    }

    // Precipitation intensity >= 0
    const precipVal = parseFloat(formData.precipIntensity);
    if (isNaN(precipVal) || precipVal < 0 || precipVal > 0.1447) {
      newErrors.precipIntensity = 'Precipitation intensity must be between 0 and 0.1447';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleQuickFill = (presetType) => {
    if (presetType === 'rushHour') {
      setFormData({
        cab_type: 'Uber',
        name: 'UberXL',
        distance: 4.8,
        surge_multiplier: 1.5,
        source: 'Financial District',
        destination: 'Boston University',
        hour: 17,
        day: 18,
        month: 11,
        temperature: 54.3,
        short_summary: 'Overcast',
        precipIntensity: 0.05,
      });
    } else if (presetType === 'lyftLux') {
      setFormData({
        cab_type: 'Lyft',
        name: 'Lux Black',
        distance: 2.3,
        surge_multiplier: 1.0,
        source: 'Beacon Hill',
        destination: 'Theatre District',
        hour: 20,
        day: 22,
        month: 11,
        temperature: 49.6,
        short_summary: 'Clear',
        precipIntensity: 0,
      });
    } else {
      setFormData(INITIAL_FORM_STATE);
    }
    setErrors({});
  };

  return (
    <div className="card-modern">
      {/* Card Header */}
      <div className="card-header-gradient d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
        <div>
          <span className="badge bg-primary bg-opacity-25 text-white border border-light border-opacity-25 mb-2 px-3 py-1">
            <i className="bi bi-sliders me-1"></i> Ride Parameters
          </span>
          <h3 className="fw-bold text-white mb-1">Predict Cab Price</h3>
          <p className="text-white-50 small mb-0">
            Configure trip details and atmospheric conditions for regression price prediction.
          </p>
        </div>

        {/* Quick Fill & Mode Toggle */}
        <div className="d-flex align-items-center gap-2 flex-wrap">
          <div className="dropdown">
            <button
              className="btn btn-sm btn-outline-light dropdown-toggle rounded-pill"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i className="bi bi-magic me-1"></i> Quick Presets
            </button>
            <ul className="dropdown-menu dropdown-menu-end shadow-sm">
              <li>
                <button
                  type="button"
                  className="dropdown-item small"
                  onClick={() => handleQuickFill('default')}
                >
                  <i className="bi bi-arrow-counterclockwise me-2 text-primary"></i> Default Ride (UberX, 3.5 mi)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="dropdown-item small"
                  onClick={() => handleQuickFill('rushHour')}
                >
                  <i className="bi bi-lightning-charge me-2 text-warning"></i> Rush Hour Surge (UberXL, 4.8 mi)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="dropdown-item small"
                  onClick={() => handleQuickFill('lyftLux')}
                >
                  <i className="bi bi-gem me-2 text-danger"></i> Lyft Lux Black (2.3 mi)
                </button>
              </li>
            </ul>
          </div>

          {/* Fallback / Mock Mode Switch */}
          <div
            className={`badge rounded-pill px-3 py-2 cursor-pointer border ${
              useMockMode
                ? 'bg-warning text-dark border-warning'
                : 'bg-dark text-white-50 border-secondary'
            }`}
            onClick={onToggleMockMode}
            role="button"
            title="Toggle between real Axios API and offline Demo Mock service"
            id="mock-mode-toggle"
          >
            <i className={`bi ${useMockMode ? 'bi-toggle-on text-dark' : 'bi-toggle-off'} me-1`}></i>
            {useMockMode ? 'Demo Mode: ON' : 'API Mode: Real'}
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="p-4 p-md-5">
        <form onSubmit={handleSubmit} noValidate>
          {/* Section 1: Cab Provider & Product */}
          <div className="mb-4 pb-3 border-bottom">
            <h5 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
              <span className="badge bg-primary-subtle text-primary rounded-circle">1</span>
              <span>Vehicle & Provider</span>
            </h5>

            <div className="row g-3">
              {/* Cab Type Selection */}
              <div className="col-md-6">
                <label className="form-label-custom">
                  <span>1. Cab Provider</span>
                  <span className="text-muted fw-normal small">Uber or Lyft</span>
                </label>
                <div className="provider-selector-grid">
                  <div
                    className={`provider-radio-card ${
                      formData.cab_type === 'Uber' ? 'active-uber' : ''
                    }`}
                    onClick={() => handleProviderChange('Uber')}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="fs-4">
                      <i className="bi bi-car-front-fill"></i>
                    </div>
                    <div>
                      <div className="fw-bold">Uber</div>
                      <div className="small text-muted">Boston fleet</div>
                    </div>
                  </div>

                  <div
                    className={`provider-radio-card ${
                      formData.cab_type === 'Lyft' ? 'active-lyft' : ''
                    }`}
                    onClick={() => handleProviderChange('Lyft')}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="fs-4">
                      <i className="bi bi-lightning-fill"></i>
                    </div>
                    <div>
                      <div className="fw-bold">Lyft</div>
                      <div className="small text-muted">Pink line</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cab Name / Product */}
              <div className="col-md-6">
                <label htmlFor="cab-name" className="form-label-custom">
                  <span>2. Cab Name / Product Tier</span>
                  <span className="text-muted fw-normal small">
                    {formData.cab_type} options
                  </span>
                </label>
                <select
                  id="cab-name"
                  name="name"
                  className={`form-select form-select-custom ${errors.name ? 'is-invalid' : ''}`}
                  value={formData.name}
                  onChange={handleChange}
                >
                  <optgroup label={`${formData.cab_type} Options`}>
                    {CAB_PRODUCTS[formData.cab_type].map((tier) => (
                      <option key={tier} value={tier}>
                        {tier}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Other Provider Options">
                    {formData.cab_type === 'Uber'
                      ? CAB_PRODUCTS.Lyft.map((tier) => (
                          <option key={tier} value={tier}>
                            {tier} (Lyft)
                          </option>
                        ))
                      : CAB_PRODUCTS.Uber.map((tier) => (
                          <option key={tier} value={tier}>
                            {tier} (Uber)
                          </option>
                        ))}
                  </optgroup>
                </select>
                {errors.name && <div className="invalid-feedback">{errors.name}</div>}
              </div>
            </div>
          </div>

          {/* Section 2: Trip Route & Surge */}
          <div className="mb-4 pb-3 border-bottom">
            <h5 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
              <span className="badge bg-primary-subtle text-primary rounded-circle">2</span>
              <span>Route & Distance</span>
            </h5>

            <div className="row g-3">
              {/* Source */}
              <div className="col-md-6">
                <label htmlFor="source-location" className="form-label-custom">
                  <span>
                    <i className="bi bi-geo-alt-fill text-success me-1"></i>5. Source (Pickup)
                  </span>
                  <span className="text-muted fw-normal small">Boston location</span>
                </label>
                <select
                  id="source-location"
                  name="source"
                  className={`form-select form-select-custom ${errors.source ? 'is-invalid' : ''}`}
                  value={formData.source}
                  onChange={handleChange}
                >
                  <option value="">Select pickup point</option>
                  {BOSTON_LOCATIONS.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
                {errors.source && <div className="invalid-feedback">{errors.source}</div>}
              </div>

              {/* Destination */}
              <div className="col-md-6">
                <label htmlFor="destination-location" className="form-label-custom">
                  <span>
                    <i className="bi bi-geo-alt-fill text-danger me-1"></i>6. Destination (Drop-off)
                  </span>
                  <span className="text-muted fw-normal small">Boston location</span>
                </label>
                <select
                  id="destination-location"
                  name="destination"
                  className={`form-select form-select-custom ${errors.destination ? 'is-invalid' : ''}`}
                  value={formData.destination}
                  onChange={handleChange}
                >
                  <option value="">Select drop-off point</option>
                  {BOSTON_LOCATIONS.map((loc) => (
                    <option key={loc} value={loc} disabled={loc === formData.source}>
                      {loc} {loc === formData.source ? '(Pickup point)' : ''}
                    </option>
                  ))}
                </select>
                {errors.destination && <div className="invalid-feedback">{errors.destination}</div>}
              </div>

              {/* Distance */}
              <div className="col-md-6">
                <label htmlFor="trip-distance" className="form-label-custom">
                  <span>3. Distance</span>
                  <span className="text-muted fw-normal small">miles</span>
                </label>
                <div className="input-group">
                  <input
                    id="trip-distance"
                    type="number"
                    step="0.1"
                    min="0.1"
                    max="5.4"
                    name="distance"
                    className={`form-control form-control-custom ${errors.distance ? 'is-invalid' : ''}`}
                    placeholder="e.g. 3.5"
                    value={formData.distance}
                    onChange={handleChange}
                  />
                  <span className="input-group-text bg-light text-muted">miles</span>
                  {errors.distance && <div className="invalid-feedback">{errors.distance}</div>}
                </div>
              </div>

              {/* Surge Multiplier */}
              <div className="col-md-6">
                <label htmlFor="surge-multiplier" className="form-label-custom">
                  <span>4. Surge Multiplier</span>
                  <span className="text-muted fw-normal small">Demand factor</span>
                </label>
                <select
                  id="surge-multiplier"
                  name="surge_multiplier"
                  className={`form-select form-select-custom ${errors.surge_multiplier ? 'is-invalid' : ''}`}
                  value={formData.surge_multiplier}
                  onChange={handleChange}
                >
                  {SURGE_MULTIPLIERS.map((surge) => (
                    <option key={surge} value={surge}>
                      {surge.toFixed(2)}x {surge === 1.0 ? '(Normal rate)' : '(High Demand)'}
                    </option>
                  ))}
                </select>
                {errors.surge_multiplier && (
                  <div className="invalid-feedback">{errors.surge_multiplier}</div>
                )}
              </div>
            </div>
          </div>

          {/* Section 3: Time & Calendar Features */}
          <div className="mb-4 pb-3 border-bottom">
            <h5 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
              <span className="badge bg-primary-subtle text-primary rounded-circle">3</span>
              <span>Time & Date</span>
            </h5>

            <div className="row g-3">
              {/* Hour */}
              <div className="col-md-4 col-sm-6">
                <label htmlFor="trip-hour" className="form-label-custom">
                  <span>7. Hour</span>
                  <span className="text-muted fw-normal small">0 – 23</span>
                </label>
                <input
                  id="trip-hour"
                  type="number"
                  min="0"
                  max="23"
                  name="hour"
                  className={`form-control form-control-custom ${errors.hour ? 'is-invalid' : ''}`}
                  placeholder="18"
                  value={formData.hour}
                  onChange={handleChange}
                />
                {errors.hour && <div className="invalid-feedback">{errors.hour}</div>}
              </div>

              {/* Day */}
              <div className="col-md-4 col-sm-6">
                <label htmlFor="trip-day" className="form-label-custom">
                  <span>8. Day</span>
                  <span className="text-muted fw-normal small">1 – 30</span>
                </label>
                <input
                  id="trip-day"
                  type="number"
                  min="1"
                  max="30"
                  name="day"
                  className={`form-control form-control-custom ${errors.day ? 'is-invalid' : ''}`}
                  placeholder="15"
                  value={formData.day}
                  onChange={handleChange}
                />
                {errors.day && <div className="invalid-feedback">{errors.day}</div>}
              </div>

              {/* Month */}
              <div className="col-md-4 col-sm-12">
                <label htmlFor="trip-month" className="form-label-custom">
                  <span>9. Month</span>
                  <span className="text-muted fw-normal small">11 – 12</span>
                </label>
                <input
                  id="trip-month"
                  type="number"
                  min="11"
                  max="12"
                  name="month"
                  className={`form-control form-control-custom ${errors.month ? 'is-invalid' : ''}`}
                  placeholder="11"
                  value={formData.month}
                  onChange={handleChange}
                />
                {errors.month && <div className="invalid-feedback">{errors.month}</div>}
              </div>
            </div>
          </div>

          {/* Section 4: Weather & Atmosphere */}
          <div className="mb-4">
            <h5 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
              <span className="badge bg-primary-subtle text-primary rounded-circle">4</span>
              <span>Weather Conditions</span>
            </h5>

            <div className="row g-3">
              {/* Temperature */}
              <div className="col-md-4 col-sm-6">
                <label htmlFor="weather-temperature" className="form-label-custom">
                  <span>10. Temperature</span>
                  <span className="text-muted fw-normal small">°F</span>
                </label>
                <input
                  id="weather-temperature"
                  type="number"
                  step="0.1"
                  name="temperature"
                  className={`form-control form-control-custom ${errors.temperature ? 'is-invalid' : ''}`}
                  placeholder="40.0"
                  value={formData.temperature}
                  onChange={handleChange}
                />
                {errors.temperature && <div className="invalid-feedback">{errors.temperature}</div>}
              </div>

              {/* Weather Summary */}
              <div className="col-md-4 col-sm-6">
                <label htmlFor="weather-summary" className="form-label-custom">
                  <span>11. Weather Summary</span>
                  <span className="text-muted fw-normal small">Sky</span>
                </label>
                <select
                  id="weather-summary"
                  name="short_summary"
                  className={`form-select form-select-custom ${errors.short_summary ? 'is-invalid' : ''}`}
                  value={formData.short_summary}
                  onChange={handleChange}
                >
                  {WEATHER_SUMMARIES.map((summary) => (
                    <option key={summary} value={summary}>
                      {summary}
                    </option>
                  ))}
                </select>
                {errors.short_summary && (
                  <div className="invalid-feedback">{errors.short_summary}</div>
                )}
              </div>

              {/* Precipitation Intensity */}
              <div className="col-md-4 col-sm-12">
                <label htmlFor="precip-intensity" className="form-label-custom">
                  <span>12. Precip. Intensity</span>
                  <span className="text-muted fw-normal small">0 to 1</span>
                </label>
                <input
                  id="precip-intensity"
                  type="number"
                  step="0.01"
                  min="0"
                  max="0.1447"
                  name="precipIntensity"
                  className={`form-control form-control-custom ${errors.precipIntensity ? 'is-invalid' : ''}`}
                  placeholder="0"
                  value={formData.precipIntensity}
                  onChange={handleChange}
                />
                {errors.precipIntensity && (
                  <div className="invalid-feedback">{errors.precipIntensity}</div>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-4 pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary-gradient w-100 py-3 fs-5 shadow"
              id="predict-price-submit-btn"
            >
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Calculating Prediction...
                </>
              ) : (
                <>
                  <i className="bi bi-speedometer2 me-2"></i>
                  Predict Price
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PredictionForm;
