import React from 'react';
import { Activity, Database, Shield } from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';

const AdminPage = () => {
  const { user } = useAuth();

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Admin Panel</div>
          <div className="page-subtitle">System administration and configuration</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16, marginBottom: 24 }}>
        {/* System info */}
        <div className="card">
          <div className="card-header">
            <span className="card-title"><Activity size={12} style={{ display: 'inline', marginRight: 6 }} />System Info</span>
          </div>
          <div className="card-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: 'Backend URL', value: 'http://localhost:8081' },
                { label: 'API Version', value: 'v1' },
                { label: 'Current Role', value: user?.role ?? '—' },
              ].map((item) => (
                <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, borderBottom: '1px solid var(--border-light)', paddingBottom: 8 }}>
                  <span style={{ color: 'var(--text-muted)' }}>{item.label}</span>
                  <span style={{ fontWeight: 500, fontFamily: 'monospace', fontSize: 12 }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Security info */}
        <div className="card">
          <div className="card-header">
            <span className="card-title"><Shield size={12} style={{ display: 'inline', marginRight: 6 }} />Security</span>
          </div>
          <div className="card-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13 }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', color: 'var(--accent-green)' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'currentColor', flexShrink: 0 }} />
                JWT Authentication Active
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', color: 'var(--accent-green)' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'currentColor', flexShrink: 0 }} />
                Role-based Access Control
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', color: 'var(--accent-green)' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'currentColor', flexShrink: 0 }} />
                Stateless Session (CSRF disabled)
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 4 }}>
                Token expires in {user?.expiresIn ? Math.round(user.expiresIn / 60000) : '—'} minutes
              </div>
            </div>
          </div>
        </div>

        {/* Unavailable features */}
        <div className="card" style={{ borderColor: 'rgba(245,158,11,0.3)' }}>
          <div className="card-header" style={{ borderColor: 'rgba(245,158,11,0.2)' }}>
            <span className="card-title" style={{ color: 'var(--accent-amber)' }}>
              <Database size={12} style={{ display: 'inline', marginRight: 6 }} />
              Pending Backend Features
            </span>
          </div>
          <div className="card-body">
            <ul style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: 8, paddingLeft: 0, listStyle: 'none' }}>
              {[
                'Analytics endpoints (on-time rate, TAT, driver performance)',
                'Customer order tracking (GET /orders/{id}/track)',
                'WebSocket/STOMP live GPS streaming',
                'Zone management API',
                'Multi-stop run API',
                'Driver suspension toggle API',
              ].map((f) => (
                <li key={f} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--accent-amber)', flexShrink: 0, marginTop: 2 }}>•</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
