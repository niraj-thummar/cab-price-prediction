import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer-custom">
      <div className="container">
        <div className="row g-4 pb-4">
          {/* Brand Col */}
          <div className="col-lg-5 col-md-6">
            <div className="d-flex align-items-center gap-2 mb-3">
              <div className="brand-icon-box" style={{ width: '32px', height: '32px', fontSize: '1rem' }}>
                <i className="bi bi-car-front-fill"></i>
              </div>
              <span className="fw-bold fs-5 text-dark">FareSense</span>
            </div>
            <p className="text-muted small pe-lg-4">
              A modern Machine Learning web application designed to forecast Boston Uber and Lyft cab fares
              based on trip distance, surge pricing, location nodes, and atmospheric weather patterns.
            </p>
            <div className="d-flex gap-2 flex-wrap mt-2">
              <span className="badge bg-light text-secondary border">React + Vite</span>
              <span className="badge bg-light text-secondary border">Bootstrap 5</span>
              <span className="badge bg-light text-secondary border">ML Regression</span>
              <span className="badge bg-light text-secondary border">Boston Dataset</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-3 col-md-3 col-6">
            <h6 className="fw-bold text-dark mb-3">Navigation</h6>
            <ul className="list-unstyled d-flex flex-column gap-2 small mb-0">
              <li>
                <Link to="/" className="footer-link">
                  <i className="bi bi-chevron-right me-1 text-primary"></i> Home
                </Link>
              </li>
              <li>
                <Link to="/predict" className="footer-link">
                  <i className="bi bi-chevron-right me-1 text-primary"></i> Predict Price
                </Link>
              </li>
              <li>
                <Link to="/about" className="footer-link">
                  <i className="bi bi-chevron-right me-1 text-primary"></i> About Project
                </Link>
              </li>
            </ul>
          </div>

          {/* Project Details */}
          <div className="col-lg-4 col-md-3 col-6">
            <h6 className="fw-bold text-dark mb-3">Dataset & Research</h6>
            <p className="small text-muted mb-2">
              <strong>Source:</strong> Uber and Lyft Dataset – Boston, MA
            </p>
            <p className="small text-muted mb-2">
              <strong>Focus:</strong> Multivariable Fare Regression Analysis
            </p>
            <div className="d-flex gap-2 mt-3">
              <span className="badge rounded-pill bg-dark text-white px-3 py-2">
                <i className="bi bi-shield-check me-1"></i> Academic ML Project
              </span>
            </div>
          </div>
        </div>

        <hr className="my-3 border-secondary-subtle" />

        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center gap-2 pt-2">
          <p className="small text-muted mb-0">
            &copy; {new Date().getFullYear()} <strong>FareSense</strong>. Built for Machine Learning Regression.
          </p>
          <div className="small text-muted d-flex align-items-center gap-3">
            <span>
              <i className="bi bi-geo-alt-fill text-danger me-1"></i> Boston, MA
            </span>
            <span>
              <i className="bi bi-lightning-charge text-warning me-1"></i> Real-time API
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
