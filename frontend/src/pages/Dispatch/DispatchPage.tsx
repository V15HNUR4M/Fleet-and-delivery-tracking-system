import React, { useCallback, useEffect, useState } from 'react';
import { Zap, RefreshCw, Check, Truck, User, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { orderApi } from '../../api/orderApi';
import { driverApi } from '../../api/driverApi';
import { vehicleApi } from '../../api/vehicleApi';
import type { DriverResponse, OrderResponse, VehicleResponse } from '../../types';
import StatusBadge from '../../components/common/StatusBadge';
import ErrorState from '../../components/common/ErrorState';
import { getErrorMessage, getSlaCountdown, isSlaBreached, truncate } from '../../utils';

const DispatchPage: React.FC = () => {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [drivers, setDrivers] = useState<DriverResponse[]>([]);
  const [vehicles, setVehicles] = useState<VehicleResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [selectedOrder, setSelectedOrder] = useState<OrderResponse | null>(null);
  const [selectedDriverId, setSelectedDriverId] = useState<number | null>(null);
  const [selectedVehicleId, setSelectedVehicleId] = useState<number | null>(null);
  const [assigning, setAssigning] = useState(false);

  const fetchAll = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const [ordersRes, driversRes, vehiclesRes] = await Promise.all([
        orderApi.getOrders('CREATED', undefined, 0, 50),
        driverApi.getDrivers('AVAILABLE', 0, 100),
        vehicleApi.getVehicles('ACTIVE', 0, 100),
      ]);
      setOrders(ordersRes.content);
      setDrivers(driversRes.content);
      setVehicles(vehiclesRes.content);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const handleAssign = async () => {
    if (!selectedOrder) {
      toast.error('Please select an order first.'); return;
    }
    setAssigning(true);
    try {
      const updated = await orderApi.assignOrder(selectedOrder.id, {
        driverId: selectedDriverId,
        vehicleId: selectedVehicleId,
      });
      toast.success(`Order ${updated.orderRef} assigned successfully.`);
      // Remove assigned order from queue
      setOrders((prev) => prev.filter((o) => o.id !== selectedOrder.id));
      setSelectedOrder(null);
      setSelectedDriverId(null);
      setSelectedVehicleId(null);
      // Refresh to get updated driver/vehicle availability
      fetchAll();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setAssigning(false);
    }
  };

  if (error && !loading) return <ErrorState message={error} onRetry={fetchAll} />;

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Dispatch Console</div>
          <div className="page-subtitle">Assign unassigned orders to available drivers</div>
        </div>
        <button className="btn btn--ghost btn--sm" onClick={fetchAll} disabled={loading}>
          <RefreshCw size={13} /> Refresh
        </button>
      </div>

      <div className="dispatch-grid">
        {/* Unassigned Orders */}
        <div>
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 600 }}>
              Unassigned Orders ({loading ? '…' : orders.length})
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Select an order to assign</div>
          </div>
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="skeleton" style={{ height: 64, borderRadius: 8 }} />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div style={{
              padding: 32, textAlign: 'center', color: 'var(--text-muted)',
              border: '1px dashed var(--border)', borderRadius: 10
            }}>
              <Check size={24} style={{ margin: '0 auto 8px', color: 'var(--accent-green)' }} />
              <div>All orders are assigned!</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {orders.map((order) => {
                const breached = isSlaBreached(order.slaDeadline);
                return (
                  <div
                    key={order.id}
                    className={`dispatch-item ${selectedOrder?.id === order.id ? 'selected' : ''}`}
                    onClick={() => setSelectedOrder(order)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && setSelectedOrder(order)}
                    aria-selected={selectedOrder?.id === order.id}
                    id={`dispatch-order-${order.id}`}
                  >
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--accent-blue-light)' }}>
                        {order.orderRef}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
                        {truncate(order.pickupAddress, 30)} → {truncate(order.deliveryAddress, 20)}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                        {Number(order.weightKg).toFixed(1)} kg
                        {Number(order.codAmount) > 0 && ` · COD ₹${Number(order.codAmount).toLocaleString('en-IN')}`}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <span className={`sla-badge ${breached ? 'sla-badge--breached' : 'sla-badge--ok'}`}>
                        {getSlaCountdown(order.slaDeadline)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Assignment Panel */}
        <div>
          {/* Assignment details */}
          <div className="card" style={{ marginBottom: 16 }}>
            <div className="card-header">
              <span className="card-title"><Zap size={12} style={{ display: 'inline', marginRight: 6 }} />Assignment</span>
            </div>
            <div className="card-body">
              {selectedOrder ? (
                <div>
                  <div style={{ marginBottom: 12, padding: '8px 12px', background: 'var(--bg-tertiary)', borderRadius: 8 }}>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Selected Order</div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{selectedOrder.orderRef}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                      {truncate(selectedOrder.pickupAddress, 35)} → {truncate(selectedOrder.deliveryAddress, 35)}
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="dispatch-driver">
                      <User size={12} style={{ display: 'inline', marginRight: 4 }} />
                      Driver (Available)
                    </label>
                    <select
                      id="dispatch-driver"
                      className="form-select"
                      value={selectedDriverId ?? ''}
                      onChange={(e) => setSelectedDriverId(e.target.value ? parseInt(e.target.value) : null)}
                    >
                      <option value="">— No driver —</option>
                      {drivers.map((d) => (
                        <option key={d.id} value={d.id}>{d.name} ({d.mobile})</option>
                      ))}
                    </select>
                    {drivers.length === 0 && (
                      <div className="form-hint" style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--accent-amber)' }}>
                        <AlertCircle size={11} /> No available drivers
                      </div>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="dispatch-vehicle">
                      <Truck size={12} style={{ display: 'inline', marginRight: 4 }} />
                      Vehicle (Active)
                    </label>
                    <select
                      id="dispatch-vehicle"
                      className="form-select"
                      value={selectedVehicleId ?? ''}
                      onChange={(e) => setSelectedVehicleId(e.target.value ? parseInt(e.target.value) : null)}
                    >
                      <option value="">— No vehicle —</option>
                      {vehicles.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.regNumber} — {v.type} ({v.capacityKg} kg)
                        </option>
                      ))}
                    </select>
                    {vehicles.length === 0 && (
                      <div className="form-hint" style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--accent-amber)' }}>
                        <AlertCircle size={11} /> No active vehicles
                      </div>
                    )}
                  </div>

                  <button
                    className="btn btn--primary w-full"
                    style={{ justifyContent: 'center', marginTop: 8 }}
                    onClick={handleAssign}
                    disabled={assigning}
                    id="btn-dispatch-assign"
                  >
                    {assigning ? <span className="spinner spinner--sm" /> : <Zap size={13} />}
                    Assign Order
                  </button>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-muted)' }}>
                  <Zap size={28} style={{ margin: '0 auto 8px', opacity: 0.3 }} />
                  <div style={{ fontSize: 13 }}>Select an order from the queue to assign</div>
                </div>
              )}
            </div>
          </div>

          {/* Available drivers summary */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">Available Drivers ({drivers.length})</span>
            </div>
            <div style={{ maxHeight: 200, overflowY: 'auto' }}>
              {drivers.length === 0 ? (
                <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 12 }}>
                  No available drivers
                </div>
              ) : (
                drivers.map((d) => (
                  <div
                    key={d.id}
                    style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 16px', borderBottom: '1px solid var(--border-light)', fontSize: 12 }}
                  >
                    <span>{d.name}</span>
                    <StatusBadge value={d.availability} type="driver" />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DispatchPage;
