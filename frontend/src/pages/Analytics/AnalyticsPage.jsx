import React from 'react';
import { Info, Truck, DollarSign, Users, CheckCircle2 } from 'lucide-react';

/*
 * Analytics Page — Backend Integration Pending
 *
 * In accordance with requirements:
 * The SRS contains analytics requirements, but the current backend does not
 * provide verified analytics endpoints.
 *
 * Sections:
 * - On-Time Delivery
 * - Driver Performance
 * - Turnaround Time
 * - Fleet Utilization
 * - COD Analytics
 *
 * All clearly marked as "Backend integration pending". No fabricated charts or fake statistics.
 */

const AnalyticsPage = () => (
  <div>
    <div className="page-header">
      <div>
        <div className="page-title">Analytics</div>
        <div className="page-subtitle">Delivery performance and operational insights</div>
      </div>
    </div>

    <div className="coming-soon-banner" style={{ marginBottom: 20 }}>
      <Info size={15} />
      <div>
        <strong>Backend integration pending:</strong> Analytics endpoints are not yet implemented in the Spring Boot backend.
        The UI shells below outline the metrics structure for future API integration without fabricating mock data.
      </div>
    </div>

    {/* Section 1: On-Time Delivery & Turnaround Time KPIs */}
    <div style={{ marginBottom: 24 }}>
      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
        <CheckCircle2 size={16} color="var(--accent-blue)" /> On-Time Delivery & Turnaround Time
      </div>
      <div className="kpi-grid">
        {[
          { label: 'On-Time Delivery Rate', sub: 'Backend integration pending' },
          { label: 'Average Turnaround Time (TAT)', sub: 'Backend integration pending' },
          { label: 'First-Attempt Success Rate', sub: 'Backend integration pending' },
          { label: 'SLA Breach Frequency', sub: 'Backend integration pending' },
        ].map((k) => (
          <div key={k.label} className="kpi-card" style={{ opacity: 0.65 }}>
            <div className="kpi-label">{k.label}</div>
            <div className="kpi-value" style={{ color: 'var(--text-muted)', fontSize: 22 }}>—</div>
            <div className="kpi-sub" style={{ color: 'var(--accent-amber)', fontSize: 11 }}>{k.sub}</div>
          </div>
        ))}
      </div>
    </div>

    {/* Section 2: Fleet Utilization & COD Analytics */}
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16, marginBottom: 24 }}>
      <div className="card">
        <div className="card-header">
          <span className="card-title">
            <Truck size={13} style={{ display: 'inline', marginRight: 6 }} /> Fleet Utilization
          </span>
          <span style={{ fontSize: 11, color: 'var(--accent-amber)', padding: '2px 8px', background: 'rgba(245,158,11,0.1)', borderRadius: 4, border: '1px solid rgba(245,158,11,0.2)' }}>
            Backend integration pending
          </span>
        </div>
        <div style={{ padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, color: 'var(--text-muted)' }}>
          <Truck size={42} strokeWidth={1} style={{ opacity: 0.3 }} />
          <div style={{ fontSize: 13, fontWeight: 500 }}>Fleet Utilization Metrics</div>
          <div style={{ fontSize: 12, textAlign: 'center', maxWidth: 300 }}>
            Metrics for vehicle active vs idle hours, capacity utilization, and fuel efficiency pending backend telemetry APIs.
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title">
            <DollarSign size={13} style={{ display: 'inline', marginRight: 6 }} /> COD Analytics & Reconciliation
          </span>
          <span style={{ fontSize: 11, color: 'var(--accent-amber)', padding: '2px 8px', background: 'rgba(245,158,11,0.1)', borderRadius: 4, border: '1px solid rgba(245,158,11,0.2)' }}>
            Backend integration pending
          </span>
        </div>
        <div style={{ padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, color: 'var(--text-muted)' }}>
          <DollarSign size={42} strokeWidth={1} style={{ opacity: 0.3 }} />
          <div style={{ fontSize: 13, fontWeight: 500 }}>Cash on Delivery Reconciliation</div>
          <div style={{ fontSize: 12, textAlign: 'center', maxWidth: 300 }}>
            Daily collected cash, driver remittance reconciliation, and outstanding COD balance pending finance module endpoints.
          </div>
        </div>
      </div>
    </div>

    {/* Section 3: Driver Performance */}
    <div className="card" style={{ overflow: 'hidden' }}>
      <div className="card-header">
        <span className="card-title">
          <Users size={13} style={{ display: 'inline', marginRight: 6 }} /> Driver Performance Scoreboard
        </span>
        <span style={{ fontSize: 11, color: 'var(--accent-amber)', padding: '2px 8px', background: 'rgba(245,158,11,0.1)', borderRadius: 4, border: '1px solid rgba(245,158,11,0.2)' }}>
          Backend integration pending
        </span>
      </div>
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Driver</th>
              <th>On-Time %</th>
              <th>Avg. Turnaround</th>
              <th>Completed Deliveries</th>
              <th>Exceptions / RTO</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)', fontSize: 13 }}>
                Driver performance analytics will populate automatically once the backend analytics endpoints are connected.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

export default AnalyticsPage;
