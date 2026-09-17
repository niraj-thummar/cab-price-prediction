import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  const datasetFeatures = [
    {
      name: 'Cab Type',
      icon: 'bi-car-front',
      color: 'text-primary',
      description: 'Specifies the rideshare platform (Uber or Lyft), which differ in pricing policies and commission structures.',
    },
    {
      name: 'Cab Name / Product',
      icon: 'bi-tags',
      color: 'text-purple',
      description: 'The vehicle tier (e.g., UberX, UberXL, Black, Lux, Shared), determining base fare and passenger capacity.',
    },
    {
      name: 'Distance',
      icon: 'bi-signpost-2',
      color: 'text-success',
      description: 'Trip route distance in miles, directly correlated with fuel, vehicle wear, and driver time compensation.',
    },
    {
      name: 'Surge Multiplier',
      icon: 'bi-lightning-charge',
      color: 'text-warning',
      description: 'Dynamic price multiplier activated during peak demand, rush hours, or adverse conditions (1.0x to 3.0x).',
    },
    {
      name: 'Source & Destination',
      icon: 'bi-geo-alt',
      color: 'text-danger',
      description: '12 landmark Boston pickup and drop-off zones including Back Bay, Fenway, Financial District, and universities.',
    },
    {
      name: 'Time Attributes',
      icon: 'bi-clock-history',
      color: 'text-info',
      description: 'Hour of day (0–23), day of month (1–30), and month (11–12) supported by the trained model.',
    },
    {
      name: 'Weather Summary',
      icon: 'bi-cloud-sun',
      color: 'text-primary',
      description: 'Atmospheric weather conditions (Clear, Partly Cloudy, Rain, Foggy, Overcast) affecting road velocity and driver availability.',
    },
    {
      name: 'Precipitation Intensity',
      icon: 'bi-cloud-rain-heavy',
      color: 'text-secondary',
      description: 'Quantitative rainfall measurement impacting transit safety, delays, and surge probability.',
    },
  ];

  const pipelineSteps = [
    {
      number: '1',
      title: 'Dataset',
      subtitle: 'Boston Rideshare Data',
      desc: 'Uber & Lyft ride transactions paired with meteorological reports.',
    },
    {
      number: '2',
      title: 'Data Preprocessing',
      subtitle: 'Cleaning & Cleaning',
      desc: 'Handling nulls, filtering irrelevant metadata, and type normalization.',
    },
    {
      number: '3',
      title: 'Encoding',
      subtitle: 'Categorical One-Hot',
      desc: 'Converting provider, vehicle tier, and location categories into numeric vectors.',
    },
    {
      number: '4',
      title: 'Feature Scaling',
      subtitle: 'Standardization',
      desc: 'Normalizing continuous features like distance, temperature, and time.',
    },
    {
      number: '5',
      title: 'Model Training',
      subtitle: 'Regression Fitting',
      desc: 'Fitting regression algorithms to minimize Mean Absolute Error (MAE) and RMSE.',
    },
    {
      number: '6',
      title: 'Price Prediction',
      subtitle: 'Inference Output',
      desc: 'Continuous real-time estimation of ride fare in USD ($).',
    },
  ];

  return (
    <div className="about-page py-5">
      <div className="container">
        {/* Page Title & Overview */}
        <div className="text-center max-w-700 mx-auto mb-5">
          <span className="badge bg-primary-subtle text-primary rounded-pill px-3 py-1 fw-bold mb-2">
            Documentation &amp; Methodology
          </span>
          <h1 className="fw-bold text-dark">About the Project</h1>
          <p className="lead text-muted">
            This project uses Machine Learning to predict cab prices using historical Uber and Lyft ride data from Boston.
          </p>
        </div>

        {/* Project Overview Card */}
        <div className="card-modern mb-5">
          <div className="card-header-gradient">
            <h4 className="fw-bold text-white mb-1">
              <i className="bi bi-bookmark-star me-2"></i> Project Overview
            </h4>
            <p className="text-white-50 small mb-0">
              Understanding empirical rideshare mechanics through algorithmic pricing models.
            </p>
          </div>
          <div className="p-4 p-md-5">
            <div className="row align-items-center g-4">
              <div className="col-lg-8">
                <p className="text-muted">
                  Modern ridesharing platforms dynamically calculate fares using proprietary algorithms
                  that balance passenger supply with driver availability. This project analyzes the
                  <strong> Uber and Lyft Dataset – Boston, MA</strong> to build an interpretable,
                  responsive Machine Learning regression application.
                </p>
                <p className="text-muted mb-0">
                  By supplying key trip parameters such as origin, destination, distance, time of travel,
                  and local weather factors, users can observe how algorithmic surge and vehicle class
                  drive price variations between competing transportation providers.
                </p>
              </div>
              <div className="col-lg-4">
                <div className="p-4 rounded-4 bg-light border text-center">
                  <div className="stat-number mb-1">Boston, MA</div>
                  <div className="fw-semibold text-dark">Empirical Study Location</div>
                  <p className="small text-muted mb-0 mt-2">
                    Features paired with real-time DarkSky weather data points.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Machine Learning Pipeline Flow (Requirement 6) */}
        <div className="card-modern mb-5">
          <div className="card-header-gradient">
            <h4 className="fw-bold text-white mb-1">
              <i className="bi bi-diagram-3 me-2"></i> Machine Learning Pipeline
            </h4>
            <p className="text-white-50 small mb-0">
              End-to-end workflow from raw dataset ingestion to real-time fare inference.
            </p>
          </div>
          <div className="p-4 p-md-5">
            {/* Desktop Sequence Bar */}
            <div className="d-none d-lg-flex justify-content-between align-items-center mb-4 p-3 bg-light rounded-4 border">
              <span className="fw-bold text-dark">Dataset</span>
              <i className="bi bi-arrow-right text-primary fs-5"></i>
              <span className="fw-bold text-dark">Data Preprocessing</span>
              <i className="bi bi-arrow-right text-primary fs-5"></i>
              <span className="fw-bold text-dark">Encoding</span>
              <i className="bi bi-arrow-right text-primary fs-5"></i>
              <span className="fw-bold text-dark">Feature Scaling</span>
              <i className="bi bi-arrow-right text-primary fs-5"></i>
              <span className="fw-bold text-dark">Model Training</span>
              <i className="bi bi-arrow-right text-primary fs-5"></i>
              <span className="fw-bold text-primary">Price Prediction</span>
            </div>

            {/* Pipeline Grid Cards */}
            <div className="row g-3">
              {pipelineSteps.map((step) => (
                <div key={step.number} className="col-lg-4 col-md-6">
                  <div className="pipeline-step-card h-100 text-start">
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <div className="pipeline-number">{step.number}</div>
                      <span className="badge bg-light text-muted border small">{step.subtitle}</span>
                    </div>
                    <h5 className="fw-bold text-dark mb-1">{step.title}</h5>
                    <p className="text-muted small mb-0">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dataset Features Section (Requirement 6) */}
        <div className="mb-5">
          <div className="text-center max-w-700 mx-auto mb-4">
            <span className="badge bg-secondary-subtle text-secondary rounded-pill px-3 py-1 fw-bold mb-2">
              Feature Engineering
            </span>
            <h2 className="fw-bold text-dark">Key Dataset Features</h2>
            <p className="text-muted">
              The regression model relies on the following primary attributes extracted from the Boston dataset.
            </p>
          </div>

          <div className="row g-4">
            {datasetFeatures.map((feat) => (
              <div key={feat.name} className="col-lg-3 col-md-6">
                <div className="feature-card">
                  <div className="feature-icon-box feature-icon-blue">
                    <i className={`bi ${feat.icon}`}></i>
                  </div>
                  <h5 className="fw-bold text-dark mb-2">{feat.name}</h5>
                  <p className="text-muted small mb-0">{feat.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center p-5 rounded-4 bg-light border">
          <h3 className="fw-bold text-dark mb-2">Ready to test fare predictions?</h3>
          <p className="text-muted mb-4">
            Try custom ride scenarios or toggle Demo Mode to explore fare fluctuations.
          </p>
          <Link to="/predict" className="btn btn-primary-gradient px-4 py-3">
            <i className="bi bi-speedometer2 me-2"></i> Launch Predictor
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;
