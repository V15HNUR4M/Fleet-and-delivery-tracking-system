import React, { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, RefreshCw, Truck, Clock, MapPin, Package, SlidersHorizontal, Navigation } from 'lucide-react';
import toast from 'react-hot-toast';
import { orderApi } from '../../api/orderApi';
import { driverApi } from '../../api/driverApi';
import { vehicleApi } from '../../api/vehicleApi';
import type { DriverResponse, OrderResponse, OrderStatus, VehicleResponse } from '../../types';

import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';
import ErrorState from '../../components/common/ErrorState';
import { formatDateTime, getErrorMessage, getSlaCountdown, isSlaBreached, labelify } from '../../utils';
import { useAuth } from '../../auth/AuthContext';
import { ORDER_STATUSES } from '../../constants';

const ORDER_STATUS_DOT: Record<string, string> = {
  DELIVERED: 'timeline-dot--green',
  CANCELLED: 'timeline-dot--red',
  FAILED: 'timeline-dot--red',
  IN_TRANSIT: 'timeline-dot--amber',
};

const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Assign modal
  const [assignOpen, setAssignOpen] = useState(false);
  const [drivers, setDrivers] = useState<DriverResponse[]>([]);
  const [vehicles, setVehicles] = useState<VehicleResponse[]>([]);
  const [assignDriverId, setAssignDriverId] = useState<string>('');
  const [assignVehicleId, setAssignVehicleId] = useState<string>('');
  const [assigning, setAssigning] = useState(false);

  // Status update modal
  const [statusOpen, setStatusOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<OrderStatus>('IN_TRANSIT');
  const [statusReason, setStatusReason] = useState('');
  const [statusUpdating, setStatusUpdating] = useState(false);

  const fetchOrder = useCallback(async () => {
    if (!id) return;
    setLoading(true); setError('');
    try {
      const res = await orderApi.getOrder(parseInt(id));
      setOrder(res);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchOrder(); }, [fetchOrder]);

  const openAssign = async () => {
    try {
      const [driversRes, vehiclesRes] = await Promise.all([
        driverApi.getDrivers('AVAILABLE', 0, 100),
        vehicleApi.getVehicles('ACTIVE', 0, 100),
      ]);
      setDrivers(driversRes.content);
      setVehicles(vehiclesRes.content);
      setAssignDriverId(order?.driverId?.toString() || '');
      setAssignVehicleId(order?.vehicleId?.toString() || '');
      setAssignOpen(true);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order) return;
    setAssigning(true);
    try {
      const updated = await orderApi.assignOrder(order.id, {
        driverId: assignDriverId ? parseInt(assignDriverId) : null,
        vehicleId: assignVehicleId ? parseInt(assignVehicleId) : null,
      });
      setOrder(updated);
      toast.success('Order assigned successfully.');
      setAssignOpen(false);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setAssigning(false);
    }
  };

  const handleStatusUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order) return;
    setStatusUpdating(true);
    try {
      const updated = await orderApi.updateStatus(order.id, {
        newStatus,
        reason: statusReason || undefined,
      });
      setOrder(updated);
      toast.success('Order status updated.');
      setStatusOpen(false);
      setStatusReason('');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setStatusUpdating(false);
    }
  };

  const canAssign = user?.role === 'ADMIN' || user?.role === 'DISPATCHER';
  const canUpdateStatus = user?.role === 'ADMIN' || user?.role === 'DISPATCHER' || user?.role === 'DRIVER';

  if (loading) {
    return (
      <div>
        <div className="page-header">
          <button className="btn btn--ghost btn--sm" onClick={() => navigate(-1)}><ArrowLeft size={13} /> Back</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton" style={{ height: 100, borderRadius: 10 }} />
          ))}
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div>
        <button className="btn btn--ghost btn--sm" onClick={() => navigate(-1)} style={{ marginBottom: 16 }}>
          <ArrowLeft size={13} /> Back
        </button>
        <ErrorState message={error || 'Order not found.'} onRetry={fetchOrder} />
      </div>
    );
  }

  const breached = isSlaBreached(order.slaDeadline) &&
    !['DELIVERED', 'CANCELLED', 'FAILED', 'RTO'].includes(order.status);

  return (
    <div>
      {/* Page header */}
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button className="btn btn--ghost btn--sm btn--icon" onClick={() => navigate(-1)} aria-label="Back to orders">
            <ArrowLeft size={14} />
          </button>
          <div>
            <div className="page-title">Order {order.orderRef}</div>
            <div className="page-subtitle">
              Customer ID: {order.customerId} &bull; Attempt #{order.attemptCount}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn--ghost btn--sm" onClick={fetchOrder}><RefreshCw size={13} /></button>
          {canAssign && (
            <button className="btn btn--secondary btn--sm" onClick={openAssign} id="btn-assign-order">
              <Truck size={13} /> Assign
            </button>
          )}
          {canUpdateStatus && (
            <button className="btn btn--primary btn--sm" onClick={() => { setNewStatus('IN_TRANSIT'); setStatusOpen(true); }} id="btn-update-status">
              <SlidersHorizontal size={13} /> Update Status
            </button>
          )}
        </div>
      </div>

      {/* Header card */}
      <div className="detail-header">
        <div>
          <div className="detail-ref-label">Status</div>
          <StatusBadge value={order.status} type="order" />
        </div>
        <div>
          <div className="detail-ref-label">SLA Deadline</div>
          <span className={`sla-badge sla-badge--${breached ? 'breached' : 'ok'}`} style={{ fontSize: 14 }}>
            {getSlaCountdown(order.slaDeadline)}
          </span>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 3 }}>
            {formatDateTime(order.slaDeadline)}
          </div>
        </div>
        <div>
          <div className="detail-ref-label">Driver</div>
          <div style={{ fontWeight: 500 }}>{order.driverId ? `Driver #${order.driverId}` : '—'}</div>
        </div>
        <div>
          <div className="detail-ref-label">Vehicle</div>
          <div style={{ fontWeight: 500 }}>{order.vehicleId ? `Vehicle #${order.vehicleId}` : '—'}</div>
        </div>
      </div>

      <div className="detail-grid">
        {/* Addresses */}
        <div className="detail-section">
          <div className="card-header">
            <span className="card-title"><MapPin size={12} style={{ display: 'inline', marginRight: 6 }} />Addresses</span>
          </div>
          <div className="detail-field">
            <div className="detail-field-label">Pickup</div>
            <div className="detail-field-value">{order.pickupAddress}</div>
          </div>
          <div className="detail-field">
            <div className="detail-field-label">Delivery</div>
            <div className="detail-field-value">{order.deliveryAddress}</div>
          </div>
        </div>

        {/* Order details */}
        <div className="detail-section">
          <div className="card-header">
            <span className="card-title"><Package size={12} style={{ display: 'inline', marginRight: 6 }} />Order Details</span>
          </div>
          <div className="detail-field">
            <div className="detail-field-label">Weight</div>
            <div className="detail-field-value">{Number(order.weightKg).toFixed(2)} kg</div>
          </div>
          <div className="detail-field">
            <div className="detail-field-label">COD Amount</div>
            <div className="detail-field-value">
              {Number(order.codAmount) > 0
                ? <span style={{ color: 'var(--accent-amber)' }}>₹{Number(order.codAmount).toLocaleString('en-IN')}</span>
                : <span style={{ color: 'var(--text-muted)' }}>Prepaid</span>}
            </div>
          </div>
          <div className="detail-field">
            <div className="detail-field-label">Attempt Count</div>
            <div className="detail-field-value">{order.attemptCount}</div>
          </div>
          {order.notes && (
            <div className="detail-field">
              <div className="detail-field-label">Notes</div>
              <div className="detail-field-value" style={{ color: 'var(--text-secondary)' }}>{order.notes}</div>
            </div>
          )}
        </div>
      </div>

      {/* Status Timeline */}
      {order.statusHistory && order.statusHistory.length > 0 && (
        <div className="detail-section" style={{ marginTop: 16 }}>
          <div className="card-header">
            <span className="card-title"><Clock size={12} style={{ display: 'inline', marginRight: 6 }} />Status Timeline</span>
          </div>
          <div className="card-body">
            <div className="timeline">
              {order.statusHistory.map((h, idx) => (
                <div key={idx} className="timeline-item">
                  {idx < order.statusHistory.length - 1 && <div className="timeline-line" />}
                  <div className={`timeline-dot ${ORDER_STATUS_DOT[h.newStatus] || ''}`} />
                  <div className="timeline-content">
                    <div className="timeline-title">
                      {h.previousStatus ? (
                        <><StatusBadge value={h.previousStatus} type="order" /> → <StatusBadge value={h.newStatus} type="order" /></>
                      ) : (
                        <StatusBadge value={h.newStatus} type="order" />
                      )}
                    </div>
                    <div className="timeline-meta">
                      {formatDateTime(h.changedAt)} &bull; Changed by user #{h.changedBy}
                    </div>
                    {h.reason && <div className="timeline-reason">"{h.reason}"</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Customer Tracking Section (SRS feature — backend pending) */}
      <div className="card" style={{ marginTop: 16 }}>
        <div className="card-header">
          <span className="card-title">
            <Navigation size={12} style={{ display: 'inline', marginRight: 6 }} />
            Customer Real-Time Tracking
          </span>
          <span style={{ fontSize: 11, color: 'var(--accent-amber)', padding: '2px 8px', background: 'rgba(245,158,11,0.1)', borderRadius: 4, border: '1px solid rgba(245,158,11,0.2)' }}>
            Backend integration pending (GET /api/v1/orders/{id}/track)
          </span>
        </div>
        <div className="card-body" style={{ color: 'var(--text-secondary)', fontSize: 13, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(59,130,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-blue)', flexShrink: 0 }}>
            <Navigation size={18} />
          </div>
          <div>
            <div style={{ fontWeight: 500, color: 'var(--text-primary)', marginBottom: 2 }}>Real-time GPS Tracking & Live ETA</div>
            <div>The customer order tracking endpoint is not yet available in the Spring Boot backend. Live courier location and map streaming will be connected once the endpoint is deployed.</div>
          </div>
        </div>
      </div>

      {/* Assign Modal */}
      <Modal isOpen={assignOpen} onClose={() => setAssignOpen(false)} title="Assign Driver & Vehicle" size="md">
        <form onSubmit={handleAssign}>
          <div className="form-group">
            <label className="form-label" htmlFor="assign-driver">Driver (Available)</label>
            <select
              id="assign-driver"
              className="form-select"
              value={assignDriverId}
              onChange={(e) => setAssignDriverId(e.target.value)}
            >
              <option value="">— No driver —</option>
              {drivers.map((d) => (
                <option key={d.id} value={d.id}>{d.name} ({d.mobile})</option>
              ))}
            </select>
            {drivers.length === 0 && (
              <div className="form-hint">No available drivers at this time.</div>
            )}
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="assign-vehicle">Vehicle (Active)</label>
            <select
              id="assign-vehicle"
              className="form-select"
              value={assignVehicleId}
              onChange={(e) => setAssignVehicleId(e.target.value)}
            >
              <option value="">— No vehicle —</option>
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>{v.regNumber} — {v.type} ({v.capacityKg} kg)</option>
              ))}
            </select>
            {vehicles.length === 0 && (
              <div className="form-hint">No active vehicles at this time.</div>
            )}
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn--ghost" onClick={() => setAssignOpen(false)} disabled={assigning}>Cancel</button>
            <button type="submit" className="btn btn--primary" disabled={assigning}>
              {assigning ? <span className="spinner spinner--sm" /> : null}
              Assign
            </button>
          </div>
        </form>
      </Modal>

      {/* Status Update Modal */}
      <Modal isOpen={statusOpen} onClose={() => setStatusOpen(false)} title="Update Order Status" size="sm">
        <form onSubmit={handleStatusUpdate}>
          <div className="form-group">
            <label className="form-label" htmlFor="new-status">New Status <span className="required">*</span></label>
            <select
              id="new-status"
              className="form-select"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
            >
              {ORDER_STATUSES.filter((s) => s !== order.status).map((s) => (
                <option key={s} value={s}>{labelify(s)}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="status-reason">Reason (optional)</label>
            <textarea
              id="status-reason"
              className="form-textarea"
              value={statusReason}
              onChange={(e) => setStatusReason(e.target.value)}
              placeholder="Provide a reason for this status change…"
              rows={3}
            />
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn--ghost" onClick={() => setStatusOpen(false)} disabled={statusUpdating}>Cancel</button>
            <button type="submit" className="btn btn--primary" disabled={statusUpdating}>
              {statusUpdating ? <span className="spinner spinner--sm" /> : null}
              Update Status
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default OrderDetailPage;
