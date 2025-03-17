import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css';

const NotFound = () => {
  return (
    <div className="not-found">
      <div className="not-found-content">
        <h1>Lost your way?</h1>
        <p>Sorry, we can't find that page. You'll find lots to explore on the home page.</p>
        <Link to="/" className="netflix-btn">Netflix Home</Link>
        <div className="error-code">Error Code: NSES-404</div>
      </div>
    </div>
  );
};

export default NotFound; 