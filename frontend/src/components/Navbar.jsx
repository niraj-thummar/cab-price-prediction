import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

const Navbar = () => {
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);

  const handleNavCollapse = () => setIsNavCollapsed(!isNavCollapsed);
  const closeNav = () => setIsNavCollapsed(true);

  return (
    <nav className="navbar navbar-expand-lg navbar-custom sticky-top">
      <div className="container">
        {/* Brand */}
        <Link to="/" className="navbar-brand-custom" onClick={closeNav}>
          <div className="brand-icon-box">
            <i className="bi bi-car-front-fill"></i>
          </div>
          <span>
            Fare<span style={{ color: 'var(--color-primary)' }}>Sense</span>
          </span>
        </Link>

        {/* Mobile Hamburger Toggle */}
        <button
          className="navbar-toggler border-0 shadow-none"
          type="button"
          aria-controls="navbarNav"
          aria-expanded={!isNavCollapsed}
          aria-label="Toggle navigation"
          onClick={handleNavCollapse}
        >
          <i className={`bi ${isNavCollapsed ? 'bi-list' : 'bi-x-lg'} fs-4 text-dark`}></i>
        </button>

        {/* Links & CTA */}
        <div className={`${isNavCollapsed ? 'collapse' : ''} navbar-collapse`} id="navbarNav">
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0 gap-1">
            <li className="nav-item">
              <NavLink
                to="/"
                className={({ isActive }) => `nav-link nav-link-custom ${isActive ? 'active' : ''}`}
                onClick={closeNav}
                end
              >
                <i className="bi bi-house-door me-1"></i> Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/predict"
                className={({ isActive }) => `nav-link nav-link-custom ${isActive ? 'active' : ''}`}
                onClick={closeNav}
              >
                <i className="bi bi-speedometer2 me-1"></i> Predict Price
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/about"
                className={({ isActive }) => `nav-link nav-link-custom ${isActive ? 'active' : ''}`}
                onClick={closeNav}
              >
                <i className="bi bi-info-circle me-1"></i> About
              </NavLink>
            </li>
          </ul>

          <div className="d-flex align-items-center mt-3 mt-lg-0">
            <Link to="/predict" className="btn btn-primary-gradient w-100 w-lg-auto" onClick={closeNav}>
              <i className="bi bi-lightning-charge-fill"></i>
              <span>Predict Now</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
