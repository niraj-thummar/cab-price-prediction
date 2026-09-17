import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="row align-items-center g-5">
            {/* Left Content */}
            <div className="col-lg-7">
              <div className="badge-hero">
                <i className="bi bi-cpu-fill text-primary"></i>
                <span>Machine Learning Regression Model</span>
              </div>

              <h1 className="hero-title">
                Uber &amp; Lyft <br />
                <span className="gradient-text">Cab Price Prediction</span>
              </h1>

              <p className="hero-subtitle">
                Predict your estimated cab fare using Machine Learning. Powered by empirical
                rideshare records from Boston, MA—factoring in route distance, dynamic surge multipliers,
                and microclimate weather conditions.
              </p>

              <div className="d-flex flex-wrap gap-3 mb-4">
                <Link to="/predict" className="btn btn-primary-gradient px-4 py-3 fs-6">
                  <i className="bi bi-speedometer2"></i>
                  <span>Predict Price</span>
                </Link>

                <Link to="/about" className="btn btn-secondary-outline px-4 py-3 fs-6">
                  <i className="bi bi-book"></i>
                  <span>About Project</span>
                </Link>
              </div>

              {/* Supported Providers Badges */}
              <div className="d-flex align-items-center gap-3 pt-2">
                <span className="small text-muted fw-semibold">Platforms Analyzed:</span>
                <span className="provider-chip provider-chip-uber text-dark bg-light border">
                  <i className="bi bi-car-front-fill me-1"></i> Uber
                </span>
                <span className="provider-chip provider-chip-lyft">
                  <i className="bi bi-lightning-fill me-1"></i> Lyft
                </span>
              </div>
            </div>

            {/* Right Visual Section */}
            <div className="col-lg-5">
              <div className="hero-visual-card">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div className="d-flex align-items-center gap-2">
                    <span className="badge rounded-pill bg-success-subtle text-success px-3 py-1 fw-bold">
                      <i className="bi bi-circle-fill me-1 small"></i> Active Model
                    </span>
                  </div>
                  <span className="text-white-50 small">Boston, MA</span>
                </div>

                {/* Simulated Live Route Card */}
                <div className="bg-white bg-opacity-10 rounded-4 p-3 mb-3 border border-white border-opacity-10">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="text-white-50 small text-uppercase letter-spacing-1">
                      Route Sample
                    </span>
                    <span className="badge bg-primary text-white small">3.5 mi</span>
                  </div>
                  <div className="d-flex align-items-center gap-3 text-white">
                    <div>
                      <i className="bi bi-geo-alt text-success fs-5"></i>
                    </div>
                    <div className="flex-grow-1">
                      <div className="fw-semibold">Back Bay</div>
                      <div className="text-white-50 small">Pickup Location</div>
                    </div>
                    <div className="text-white-50">
                      <i className="bi bi-arrow-right fs-5"></i>
                    </div>
                    <div>
                      <i className="bi bi-geo-alt-fill text-danger fs-5"></i>
                    </div>
                    <div className="flex-grow-1 text-end">
                      <div className="fw-semibold">Fenway</div>
                      <div className="text-white-50 small">Drop-off</div>
                    </div>
                  </div>
                </div>

                {/* Price Preview Comparison */}
                <div className="row g-2 mb-3">
                  <div className="col-6">
                    <div className="bg-white bg-opacity-10 p-3 rounded-3 border border-white border-opacity-10">
                      <div className="d-flex justify-content-between text-white-50 small mb-1">
                        <span>UberX</span>
                        <span>1.0x</span>
                      </div>
                      <div className="fs-4 fw-bold text-white">$14.50</div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="bg-white bg-opacity-10 p-3 rounded-3 border border-white border-opacity-10">
                      <div className="d-flex justify-content-between text-white-50 small mb-1">
                        <span>Lyft Standard</span>
                        <span>1.0x</span>
                      </div>
                      <div className="fs-4 fw-bold text-white">$15.20</div>
                    </div>
                  </div>
                </div>

                <div className="d-flex align-items-center justify-content-between text-white-50 small pt-2 border-top border-white border-opacity-10">
                  <span>
                    <i className="bi bi-cloud-drizzle me-1 text-info"></i> Weather factor included
                  </span>
                  <span>
                    <i className="bi bi-check2-circle text-success me-1"></i> R² Verified
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section (Requirement 8) */}
      <section className="py-5 bg-white border-top border-bottom">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-3 col-sm-6">
              <div className="stat-card">
                <div className="stat-number">2</div>
                <div className="stat-label">Cab Providers</div>
                <p className="text-muted small mb-0 mt-1">Uber &amp; Lyft comparative analytics</p>
              </div>
            </div>

            <div className="col-lg-3 col-sm-6">
              <div className="stat-card">
                <div className="stat-number">13+</div>
                <div className="stat-label">Multiple Ride Types</div>
                <p className="text-muted small mb-0 mt-1">From Economy to Black SUV &amp; Lux</p>
              </div>
            </div>

            <div className="col-lg-3 col-sm-6">
              <div className="stat-card">
                <div className="stat-number">12</div>
                <div className="stat-label">Boston Hub Locations</div>
                <p className="text-muted small mb-0 mt-1">Key landmarks &amp; university hubs</p>
              </div>
            </div>

            <div className="col-lg-3 col-sm-6">
              <div className="stat-card">
                <div className="stat-number">ML</div>
                <div className="stat-label">ML Regression</div>
                <p className="text-muted small mb-0 mt-1">Continuous numerical fare prediction</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ML-Themed Cards Section */}
      <section className="py-5 bg-light">
        <div className="container py-4">
          <div className="text-center max-w-700 mx-auto mb-5">
            <span className="badge bg-primary-subtle text-primary rounded-pill px-3 py-1 fw-bold mb-2">
              Architecture &amp; Features
            </span>
            <h2 className="fw-bold text-dark">Engineered for Academic ML Rigor</h2>
            <p className="text-muted">
              Built on real-world rideshare transaction records to study dynamic pricing behaviors.
            </p>
          </div>

          <div className="row g-4">
            {/* Card 1: Machine Learning */}
            <div className="col-lg-4 col-md-6">
              <div className="feature-card">
                <div className="feature-icon-box feature-icon-blue">
                  <i className="bi bi-cpu"></i>
                </div>
                <h4 className="fw-bold text-dark mb-2">Machine Learning</h4>
                <p className="text-muted mb-4 flex-grow-1">
                  Utilizes supervised regression techniques trained on multivariate features
                  including distance, temporal variables, weather intensity, and geographic endpoints.
                </p>
                <div className="pt-2 border-top">
                  <span className="small text-primary fw-semibold">
                    Linear &amp; Ensemble Regression <i className="bi bi-arrow-right"></i>
                  </span>
                </div>
              </div>
            </div>

            {/* Card 2: Uber & Lyft */}
            <div className="col-lg-4 col-md-6">
              <div className="feature-card">
                <div className="feature-icon-box feature-icon-purple">
                  <i className="bi bi-arrows-expand-vertical"></i>
                </div>
                <h4 className="fw-bold text-dark mb-2">Uber &amp; Lyft</h4>
                <p className="text-muted mb-4 flex-grow-1">
                  Side-by-side comparative modeling between competing rideshare algorithms,
                  differentiating base rates, per-tier vehicle classes, and surge pricing behaviors.
                </p>
                <div className="pt-2 border-top">
                  <span className="small text-primary fw-semibold">
                    Multi-Provider Analysis <i className="bi bi-arrow-right"></i>
                  </span>
                </div>
              </div>
            </div>

            {/* Card 3: Price Prediction */}
            <div className="col-lg-4 col-md-12">
              <div className="feature-card">
                <div className="feature-icon-box feature-icon-pink">
                  <i className="bi bi-graph-up-arrow"></i>
                </div>
                <h4 className="fw-bold text-dark mb-2">Price Prediction</h4>
                <p className="text-muted mb-4 flex-grow-1">
                  Instantaneous continuous price forecasting. Users can adjust time of day,
                  rain intensity, surge multipliers, and route endpoints to simulate live fare fluctuations.
                </p>
                <div className="pt-2 border-top">
                  <span className="small text-primary fw-semibold">
                    Real-Time Inference <i className="bi bi-arrow-right"></i>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-5 bg-white">
        <div className="container py-4">
          <div className="text-center mb-5">
            <span className="badge bg-secondary-subtle text-secondary rounded-pill px-3 py-1 fw-bold mb-2">
              Workflow
            </span>
            <h2 className="fw-bold text-dark">How It Works in 3 Simple Steps</h2>
          </div>

          <div className="row g-4 text-center">
            <div className="col-md-4">
              <div className="p-4 rounded-4 bg-light h-100 border">
                <div className="fs-1 text-primary mb-3">
                  <i className="bi bi-sliders2"></i>
                </div>
                <h5 className="fw-bold mb-2">1. Enter Ride Parameters</h5>
                <p className="text-muted small mb-0">
                  Select cab provider, vehicle type, Boston pickup/drop-off, and travel distance.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="p-4 rounded-4 bg-light h-100 border">
                <div className="fs-1 text-primary mb-3">
                  <i className="bi bi-cloud-sun-fill"></i>
                </div>
                <h5 className="fw-bold mb-2">2. Factor Environmental Context</h5>
                <p className="text-muted small mb-0">
                  Incorporate surge multipliers, time of day, and weather conditions like rain or overcast.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="p-4 rounded-4 bg-light h-100 border">
                <div className="fs-1 text-primary mb-3">
                  <i className="bi bi-currency-dollar"></i>
                </div>
                <h5 className="fw-bold mb-2">3. Receive Estimated Fare</h5>
                <p className="text-muted small mb-0">
                  The ML model computes the expected fare and presents a transparent breakdown.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mt-5">
            <Link to="/predict" className="btn btn-primary-gradient px-5 py-3 fs-5 shadow">
              <i className="bi bi-speedometer2 me-2"></i> Start Prediction Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
