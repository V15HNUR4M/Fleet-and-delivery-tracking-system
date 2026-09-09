import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { RefreshCw, Truck, Users, ShoppingBag, AlertCircle } from 'lucide-react';
import { orderApi } from '../../api/orderApi';
import { vehicleApi } from '../../api/vehicleApi';
import { driverApi } from '../../api/driverApi';
import { ORDER_STATUSES } from '../../constants';
import StatusBadge from '../../components/common/StatusBadge';
import ErrorState from '../../components/common/ErrorState';
import { getErrorMessage, getSlaCountdown, isSlaBreached, truncate } from '../../utils';

const DashboardPage = () => {
  const [orders, setOrders] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const fetchAll = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const [ordersRes, vehiclesRes, driversRes] = await Promise.all([
        orderApi.getOrders('', undefined, 0, 100),
        vehicleApi.getVehicles('', 0, 100),
        driverApi.getDrivers('', 0, 100),
      ]);
      setOrders(ordersRes.content);
      setVehicles(vehiclesRes.content);
      setDrivers(driversRes.content);
      setLastRefresh(new Date());
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const kpi = {
    totalVehicles: vehicles.length,
    activeVehicles: vehicles.filter((v) => v.status === 'ACTIVE').length,
    availableDrivers: drivers.filter((d) => d.availability === 'AVAILABLE').length,
    activeOrders: orders.filter((o) =>
      ['ASSIGNED', 'PICKED_UP', 'IN_TRANSIT'].includes(o.status)
    ).length,
    inTransit: orders.filter((o) => o.status === 'IN_TRANSIT').length,
    deliveredToday: orders.filter((o) => o.status === 'DELIVERED').length,
    slaBreaches: orders.filter((o) =>
      isSlaBreached(o.slaDeadline) && !['DELIVERED', 'CANCELLED', 'FAILED', 'RTO'].includes(o.status)
    ).length,
  };

  const statusCounts = {};
  ORDER_STATUSES.forEach((s) => { statusCounts[s] = 0; });
  orders.forEach((o) => {
    if (statusCounts[o.status] !== undefined) statusCounts[o.status]++;
  });

  if (error && !loading) {
    return (
      <div>
        <div className="page-header">
          <div><div className="page-title">Dashboard</div></div>
        </div>
        <ErrorState message={error} onRetry={fetchAll} />
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Dispatcher Dashboard</div>
          <div className="page-subtitle">Last updated: {lastRefresh.toLocaleTimeString()}</div>
        </div>
        <button className="btn btn--secondary btn--sm" onClick={fetchAll} disabled={loading}>
          <RefreshCw size={13} />
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="kpi-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="kpi-card">
              <div className="skeleton" style={{ height: 12, width: '60%', marginBottom: 12 }} />
              <div className="skeleton" style={{ height: 30, width: '40%', marginBottom: 8 }} />
              <div className="skeleton" style={{ height: 10, width: '50%' }} />
            </div>
          ))}
        </div>
      ) : (
        <div className="kpi-grid">
          <div className="kpi-card kpi-card--blue">
            <div className="kpi-label">Total Vehicles</div>
            <div className="kpi-value kpi-value--blue">{kpi.totalVehicles}</div>
            <div className="kpi-sub">{kpi.activeVehicles} active</div>
          </div>
          <div className="kpi-card kpi-card--green">
            <div className="kpi-label">Available Drivers</div>
            <div className="kpi-value kpi-value--green">{kpi.availableDrivers}</div>
            <div className="kpi-sub">of {drivers.length} total</div>
          </div>
          <div className="kpi-card kpi-card--amber">
            <div className="kpi-label">Active Orders</div>
            <div className="kpi-value kpi-value--amber">{kpi.activeOrders}</div>
            <div className="kpi-sub">{kpi.inTransit} in transit</div>
          </div>
          <div className="kpi-card kpi-card--green">
            <div className="kpi-label">Delivered</div>
            <div className="kpi-value kpi-value--green">{kpi.deliveredToday}</div>
            <div className="kpi-sub">of {orders.length} orders</div>
          </div>
          <div className="kpi-card kpi-card--red">
            <div className="kpi-label">SLA Breaches</div>
            <div className="kpi-value kpi-value--red">{kpi.slaBreaches}</div>
            <div className="kpi-sub">active orders past deadline</div>
          </div>
          <div className="kpi-card kpi-card--purple">
            <div className="kpi-label">On Route Drivers</div>
            <div className="kpi-value kpi-value--purple">
              {drivers.filter((d) => d.availability === 'ON_DUTY').length}
            </div>
            <div className="kpi-sub">{drivers.filter((d) => d.availability === 'BREAK').length} on break</div>
          </div>
        </div>
      )}

      <div className="dashboard-grid" style={{ marginTop: 16 }}>
        <div className="card" style={{ overflow: 'hidden' }}>
          <div className="card-header">
            <span className="card-title">Recent Orders</span>
            <Link to="/orders" className="btn btn--ghost btn--sm">View All</Link>
          </div>
          <div className="table-container">
            {loading ? (
              <div style={{ padding: 20 }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="skeleton" style={{ height: 14, marginBottom: 12, width: `${60 + i * 8}%` }} />
                ))}
              </div>
            ) : orders.length === 0 ? (
              <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>No orders yet</div>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Order Ref</th>
                    <th>Pickup</th>
                    <th>Status</th>
                    <th>SLA</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 8).map((order) => {
                    const breached = isSlaBreached(order.slaDeadline) &&
                      !['DELIVERED', 'CANCELLED', 'FAILED', 'RTO'].includes(order.status);
                    return (
                      <tr key={order.id}>
                        <td>
                          <Link to={`/orders/${order.id}`} className="table-link">{order.orderRef}</Link>
                        </td>
                        <td>
                          <span className="truncate" style={{ display: 'block', maxWidth: 180 }}>
                            {truncate(order.pickupAddress, 30)}
                          </span>
                        </td>
                        <td><StatusBadge value={order.status} type="order" /></td>
                        <td>
                          <span className={`sla-badge ${breached ? 'sla-badge--breached' : 'sla-badge--ok'}`}>
                            {getSlaCountdown(order.slaDeadline)}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="card">
            <div className="card-header">
              <span className="card-title"><Truck size={13} style={{ display: 'inline', marginRight: 6 }} />Fleet Status</span>
            </div>
            <div className="card-body">
              {['ACTIVE', 'INACTIVE', 'MAINTENANCE', 'DECOMMISSIONED'].map((status) => {
                const count = vehicles.filter((v) => v.status === status).length;
                return (
                  <div key={status} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border-light)' }}>
                    <StatusBadge value={status} type="vehicle" />
                    <span style={{ fontWeight: 600 }}>{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <span className="card-title"><Users size={13} style={{ display: 'inline', marginRight: 6 }} />Driver Status</span>
            </div>
            <div className="card-body">
              {['AVAILABLE', 'ON_DUTY', 'BREAK', 'OFF_DUTY'].map((avail) => {
                const count = drivers.filter((d) => d.availability === avail).length;
                return (
                  <div key={avail} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border-light)' }}>
                    <StatusBadge value={avail} type="driver" />
                    <span style={{ fontWeight: 600 }}>{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {kpi.slaBreaches > 0 && (
            <div className="card" style={{ borderColor: 'rgba(239,68,68,0.3)' }}>
              <div className="card-header" style={{ borderColor: 'rgba(239,68,68,0.2)' }}>
                <span className="card-title" style={{ color: 'var(--accent-red)' }}>
                  <AlertCircle size={13} style={{ display: 'inline', marginRight: 6 }} />
                  SLA Alerts ({kpi.slaBreaches})
                </span>
              </div>
              <div className="card-body" style={{ padding: '8px 16px' }}>
                {orders
                  .filter((o) => isSlaBreached(o.slaDeadline) && !['DELIVERED', 'CANCELLED', 'FAILED', 'RTO'].includes(o.status))
                  .slice(0, 4)
                  .map((order) => (
                    <div key={order.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border-light)' }}>
                      <Link to={`/orders/${order.id}`} className="table-link">{order.orderRef}</Link>
                      <span className="sla-badge sla-badge--breached">BREACHED</span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="order-board" style={{ marginTop: 16 }}>
        <div className="card">
          <div className="card-header">
            <span className="card-title"><ShoppingBag size={13} style={{ display: 'inline', marginRight: 6 }} />Order Status Board</span>
            <Link to="/orders" className="btn btn--ghost btn--sm">All Orders</Link>
          </div>
          <div className="card-body">
            <div className="order-board-grid">
              {ORDER_STATUSES.map((status) => (
                <div key={status} className="order-board-col">
                  <div className="order-board-col-header">
                    <StatusBadge value={status} type="order" />
                  </div>
                  <div className="order-board-count">{statusCounts[status] ?? 0}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
