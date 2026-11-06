import React from 'react';

const LoadingSpinner = ({ message = 'Loading...', size = 'default' }) => {
  return (
    <div className="spinner-wrapper" role="status" aria-live="polite">
      <div className={`spinner ${size === 'small' ? 'spinner-sm' : ''}`} />
      {message && <p className="text-muted" style={{ fontSize: '0.9rem' }}>{message}</p>}
    </div>
  );
};

export default LoadingSpinner;
