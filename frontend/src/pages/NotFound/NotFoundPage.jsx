import React from 'react';
import { Link } from 'react-router-dom';
import { Home, AlertCircle } from 'lucide-react';

const NotFoundPage = () => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 16, textAlign: 'center', padding: 40 }}>
    <AlertCircle size={64} strokeWidth={1} style={{ color: 'var(--text-muted)' }} />
    <div style={{ fontSize: 64, fontWeight: 800, color: 'var(--border)', lineHeight: 1 }}>404</div>
    <div style={{ fontSize: 20, fontWeight: 600 }}>Page not found</div>
    <div style={{ fontSize: 14, color: 'var(--text-muted)' }}>
      The page you're looking for doesn't exist or has been moved.
    </div>
    <Link to="/" className="btn btn--primary" style={{ marginTop: 8 }}>
      <Home size={14} /> Back to Dashboard
    </Link>
  </div>
);

export default NotFoundPage;
