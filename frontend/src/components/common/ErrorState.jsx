import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

const ErrorState = ({ message, onRetry }) => (
  <div className="error-state">
    <AlertCircle size={48} strokeWidth={1} />
    <div className="error-state-title">Something went wrong</div>
    <div className="error-state-desc">{message}</div>
    {onRetry && (
      <button className="btn btn--secondary" onClick={onRetry} style={{ marginTop: 8 }}>
        <RefreshCw size={14} /> Retry
      </button>
    )}
  </div>
);

export default ErrorState;
