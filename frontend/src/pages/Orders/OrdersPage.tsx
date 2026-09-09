import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Search, RefreshCw, Eye, ArrowRight, Package, Navigation, Clock, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { orderApi } from '../../api/orderApi';
import type { OrderResponse, OrderStatus } from '../../types';
import { ORDER_STATUSES } from '../../constants';
import StatusBadge from '../../components/common/StatusBadge';
import Pagination from '../../components/common/Pagination';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';
import Modal from '../../components/common/Modal';
import { getErrorMessage, getSlaCountdown, isSlaBreached, labelify, truncate } from '../../utils';
import { useAuth } from '../../auth/AuthContext';

const PAGE_SIZE = 20;

interface SavedOrderRecord {
  id: number;
  orderRef: string;
  pickupAddress: string;
  deliveryAddress: string;
  createdAt: string;
}

const OrdersPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const isCustomer = user?.role === 'CUSTOMER';
  const isDriver = user?.role === 'DRIVER';
  const canListOrders = user?.role === 'ADMIN' || user?.role === 'DISPATCHER';

  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [page, setPage] = useState(0);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | ''>('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(canListOrders);
  const [error, setError] = useState('');

  // Lookup by ID
  const [lookupId, setLookupId] = useState('');
  const [lookupLoading, setLookupLoading] = useState(false);

  // Customer local saved orders
  const [savedOrders, setSavedOrders] = useState<SavedOrderRecord[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('customer_orders') || '[]');
    } catch {
      return [];
    }
  });

  // Create order modal
  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    pickupAddress: '',
    deliveryAddress: '',
    weightKg: '',
    codAmount: '',
    slaDeadline: '',
  });
  const [createErrors, setCreateErrors] = useState<Record<string, string>>({});
  const [creating, setCreating] = useState(false);

  const fetchOrders = useCallback(async () => {
    if (!canListOrders) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await orderApi.getOrders(statusFilter, undefined, page, PAGE_SIZE);
      setOrders(res.content);
      setTotalElements(res.totalElements);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [canListOrders, statusFilter, page]);

  useEffect(() => {
    if (canListOrders) {
      fetchOrders();
    }
  }, [canListOrders, fetchOrders]);

  const filtered = search.trim()
    ? orders.filter(
        (o) =>
          o.orderRef?.toLowerCase().includes(search.toLowerCase()) ||
          o.pickupAddress.toLowerCase().includes(search.toLowerCase()) ||
          o.deliveryAddress.toLowerCase().includes(search.toLowerCase())
      )
    : orders;

  const validateCreate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!createForm.pickupAddress.trim()) errs.pickupAddress = 'Pickup address is required.';
    if (!createForm.deliveryAddress.trim()) errs.deliveryAddress = 'Delivery address is required.';
    const w = parseFloat(createForm.weightKg);
    if (!createForm.weightKg || isNaN(w) || w <= 0) errs.weightKg = 'Weight must be greater than 0.';
    const c = parseFloat(createForm.codAmount);
    if (createForm.codAmount === '' || isNaN(c) || c < 0) errs.codAmount = 'COD amount cannot be negative.';
    if (!createForm.slaDeadline) errs.slaDeadline = 'SLA deadline is required.';
    else if (new Date(createForm.slaDeadline) <= new Date()) errs.slaDeadline = 'SLA deadline must be in the future.';
    setCreateErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateCreate()) return;
    setCreating(true);
    try {
      const slaIso = new Date(createForm.slaDeadline).toISOString();
      const created = await orderApi.createOrder({
        pickupAddress: createForm.pickupAddress.trim(),
        deliveryAddress: createForm.deliveryAddress.trim(),
        weightKg: parseFloat(createForm.weightKg),
        codAmount: parseFloat(createForm.codAmount),
        slaDeadline: slaIso,
      });
      toast.success(`Order ${created.orderRef} created successfully.`);

      // Save to customer's order history in localStorage
      const newRecord: SavedOrderRecord = {
        id: created.id,
        orderRef: created.orderRef,
        pickupAddress: created.pickupAddress,
        deliveryAddress: created.deliveryAddress,
        createdAt: new Date().toISOString(),
      };
      const updated = [newRecord, ...savedOrders.filter((o) => o.id !== created.id)].slice(0, 25);
      localStorage.setItem('customer_orders', JSON.stringify(updated));
      setSavedOrders(updated);

      setCreateOpen(false);
      setCreateForm({ pickupAddress: '', deliveryAddress: '', weightKg: '', codAmount: '', slaDeadline: '' });
      if (canListOrders) fetchOrders();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setCreating(false);
    }
  };

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    const idNum = parseInt(lookupId.trim());
    if (isNaN(idNum) || idNum <= 0) {
      toast.error('Please enter a valid numeric Order ID.');
      return;
    }
    setLookupLoading(true);
    try {
      await orderApi.getOrder(idNum);
      navigate(`/orders/${idNum}`);
    } catch (err) {
      toast.error(`Order #${idNum} not found or inaccessible: ${getErrorMessage(err)}`);
    } finally {
      setLookupLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">
            {isCustomer ? 'Customer Orders' : isDriver ? 'Driver Delivery Console' : 'Orders'}
          </div>
          <div className="page-subtitle">
            {isCustomer
              ? 'Place new delivery orders and track your shipments'
              : isDriver
              ? 'Find your assigned delivery and update transit status'
              : 'Track and manage fleet delivery orders'}
          </div>
        </div>
        {isCustomer && (
          <button className="btn btn--primary" onClick={() => setCreateOpen(true)} id="btn-create-order">
            <Plus size={14} /> New Order
          </button>
        )}
      </div>

      {/* CUSTOMER PORTAL VIEW */}
      {isCustomer && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Order Lookup Card */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">
                <Search size={13} style={{ display: 'inline', marginRight: 6 }} /> Track Order by ID
              </span>
            </div>
            <div className="card-body">
              <form onSubmit={handleLookup} style={{ display: 'flex', gap: 12, maxWidth: 500 }}>
                <input
                  type="number"
                  className="form-input"
                  placeholder="Enter numeric Order ID (e.g. 1)"
                  value={lookupId}
                  onChange={(e) => setLookupId(e.target.value)}
                  id="customer-order-lookup"
                  min={1}
                />
                <button type="submit" className="btn btn--primary" disabled={lookupLoading} id="btn-track-order">
                  {lookupLoading ? <span className="spinner spinner--sm" /> : <ArrowRight size={14} />}
                  Track Order
                </button>
              </form>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>
                Lookup your order details, assigned driver, courier status, and SLA timeline.
              </div>
            </div>
          </div>

          {/* Customer Saved Orders List */}
          <div className="card" style={{ overflow: 'hidden' }}>
            <div className="card-header">
              <span className="card-title">
                <Package size={13} style={{ display: 'inline', marginRight: 6 }} /> My Created Orders ({savedOrders.length})
              </span>
            </div>
            {savedOrders.length === 0 ? (
              <EmptyState
                title="No orders created yet"
                description="Click 'New Order' above to place your first delivery request."
              />
            ) : (
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Reference</th>
                      <th>Pickup Address</th>
                      <th>Delivery Destination</th>
                      <th>Placed On</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {savedOrders.map((ord) => (
                      <tr key={ord.id}>
                        <td className="font-mono">#{ord.id}</td>
                        <td style={{ fontWeight: 600 }}>{ord.orderRef}</td>
                        <td>{truncate(ord.pickupAddress, 30)}</td>
                        <td>{truncate(ord.deliveryAddress, 30)}</td>
                        <td style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                          {new Date(ord.createdAt).toLocaleString()}
                        </td>
                        <td>
                          <Link to={`/orders/${ord.id}`} className="btn btn--ghost btn--sm">
                            <Eye size={13} /> View Order
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* DRIVER PORTAL VIEW */}
      {isDriver && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Driver Order Lookup Card */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">
                <Search size={13} style={{ display: 'inline', marginRight: 6 }} /> Look Up Assigned Delivery Order
              </span>
            </div>
            <div className="card-body">
              <form onSubmit={handleLookup} style={{ display: 'flex', gap: 12, maxWidth: 500 }}>
                <input
                  type="number"
                  className="form-input"
                  placeholder="Enter assigned Order ID"
                  value={lookupId}
                  onChange={(e) => setLookupId(e.target.value)}
                  id="driver-order-lookup"
                  min={1}
                />
                <button type="submit" className="btn btn--primary" disabled={lookupLoading}>
                  {lookupLoading ? <span className="spinner spinner--sm" /> : <ArrowRight size={14} />}
                  Open Order
                </button>
              </form>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>
                Enter the Order ID assigned by dispatch to update its transit status (Picked Up, In Transit, Delivered, etc.).
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
            <div className="card">
              <div className="card-header">
                <span className="card-title"><Clock size={13} style={{ display: 'inline', marginRight: 6 }} /> Status Updates</span>
              </div>
              <div className="card-body" style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                Once you open an order, use the <strong>Update Status</strong> button on the order page to transition it through <em>PICKED_UP</em>, <em>IN_TRANSIT</em>, and <em>DELIVERED</em>.
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <span className="card-title"><Navigation size={13} style={{ display: 'inline', marginRight: 6 }} /> GPS Location Reporting</span>
              </div>
              <div className="card-body" style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                Visit the <Link to="/tracking" style={{ color: 'var(--accent-blue)', textDecoration: 'underline' }}>Tracking page</Link> to report your GPS coordinates and view your recorded route trail.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADMIN & DISPATCHER TABLE VIEW */}
      {canListOrders && (
        <>
          <div className="toolbar">
            <div className="search-input-wrap">
              <Search size={14} />
              <input
                type="search"
                className="search-input"
                placeholder="Search by order ref or address…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search orders"
                id="order-search"
              />
            </div>
            <select
              className="filter-select"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as OrderStatus | '');
                setPage(0);
              }}
              aria-label="Filter by status"
              id="order-status-filter"
            >
              <option value="">All Statuses</option>
              {ORDER_STATUSES.map((s) => (
                <option key={s} value={s}>{labelify(s)}</option>
              ))}
            </select>
            <button className="btn btn--ghost btn--sm" onClick={fetchOrders} disabled={loading}>
              <RefreshCw size={13} /> Refresh
            </button>
          </div>

          <div className="card" style={{ overflow: 'hidden' }}>
            {loading ? (
              <LoadingSkeleton rows={10} columns={8} />
            ) : error ? (
              <ErrorState message={error} onRetry={fetchOrders} />
            ) : filtered.length === 0 ? (
              <EmptyState
                title="No orders found"
                description={
                  statusFilter
                    ? `No orders with status "${labelify(statusFilter)}".`
                    : 'No orders have been placed yet.'
                }
              />
            ) : (
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Pickup</th>
                      <th>Destination</th>
                      <th>Weight</th>
                      <th>COD</th>
                      <th>SLA</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((order) => {
                      const breached =
                        isSlaBreached(order.slaDeadline) &&
                        !['DELIVERED', 'CANCELLED', 'FAILED', 'RTO'].includes(order.status);
                      return (
                        <tr key={order.id}>
                          <td>
                            <Link to={`/orders/${order.id}`} className="table-link">
                              {order.orderRef}
                            </Link>
                          </td>
                          <td style={{ maxWidth: 160 }}>{truncate(order.pickupAddress, 26)}</td>
                          <td style={{ maxWidth: 160 }}>{truncate(order.deliveryAddress, 26)}</td>
                          <td>{Number(order.weightKg).toFixed(1)} kg</td>
                          <td>
                            {Number(order.codAmount) > 0 ? (
                              <span style={{ color: 'var(--accent-amber)' }}>
                                ₹{Number(order.codAmount).toLocaleString('en-IN')}
                              </span>
                            ) : (
                              <span style={{ color: 'var(--text-muted)' }}>Prepaid</span>
                            )}
                          </td>
                          <td>
                            <span className={`sla-badge sla-badge--${breached ? 'breached' : 'ok'}`}>
                              {getSlaCountdown(order.slaDeadline)}
                            </span>
                          </td>
                          <td>
                            <StatusBadge value={order.status} type="order" />
                          </td>
                          <td>
                            <Link
                              to={`/orders/${order.id}`}
                              className="btn btn--ghost btn--sm btn--icon"
                              title="View details"
                              aria-label={`View order ${order.orderRef}`}
                            >
                              <Eye size={13} />
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
            <Pagination
              page={page}
              totalElements={totalElements}
              pageSize={PAGE_SIZE}
              onPageChange={(p) => setPage(p)}
            />
          </div>
        </>
      )}

      {/* CREATE ORDER MODAL (CUSTOMER ONLY) */}
      <Modal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Create Delivery Order"
        size="md"
      >
        <form onSubmit={handleCreate}>
          <div className="form-group">
            <label className="form-label" htmlFor="order-pickup">
              Pickup Address <span className="required">*</span>
            </label>
            <textarea
              id="order-pickup"
              className={`form-textarea ${createErrors.pickupAddress ? 'form-input--error' : ''}`}
              value={createForm.pickupAddress}
              onChange={(e) => setCreateForm((f) => ({ ...f, pickupAddress: e.target.value }))}
              placeholder="Full pickup location address…"
              rows={2}
            />
            {createErrors.pickupAddress && <div className="form-error">{createErrors.pickupAddress}</div>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="order-delivery">
              Delivery Address <span className="required">*</span>
            </label>
            <textarea
              id="order-delivery"
              className={`form-textarea ${createErrors.deliveryAddress ? 'form-input--error' : ''}`}
              value={createForm.deliveryAddress}
              onChange={(e) => setCreateForm((f) => ({ ...f, deliveryAddress: e.target.value }))}
              placeholder="Full delivery destination address…"
              rows={2}
            />
            {createErrors.deliveryAddress && <div className="form-error">{createErrors.deliveryAddress}</div>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="order-weight">
                Weight (kg) <span className="required">*</span>
              </label>
              <input
                id="order-weight"
                type="number"
                step="0.01"
                min="0.01"
                className={`form-input ${createErrors.weightKg ? 'form-input--error' : ''}`}
                value={createForm.weightKg}
                onChange={(e) => setCreateForm((f) => ({ ...f, weightKg: e.target.value }))}
                placeholder="e.g. 2.5"
              />
              {createErrors.weightKg && <div className="form-error">{createErrors.weightKg}</div>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="order-cod">
                COD Amount (₹) <span className="required">*</span>
              </label>
              <input
                id="order-cod"
                type="number"
                step="1"
                min="0"
                className={`form-input ${createErrors.codAmount ? 'form-input--error' : ''}`}
                value={createForm.codAmount}
                onChange={(e) => setCreateForm((f) => ({ ...f, codAmount: e.target.value }))}
                placeholder="0 for prepaid"
              />
              {createErrors.codAmount && <div className="form-error">{createErrors.codAmount}</div>}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="order-sla">
              SLA Deadline <span className="required">*</span>
            </label>
            <input
              id="order-sla"
              type="datetime-local"
              className={`form-input ${createErrors.slaDeadline ? 'form-input--error' : ''}`}
              value={createForm.slaDeadline}
              onChange={(e) => setCreateForm((f) => ({ ...f, slaDeadline: e.target.value }))}
            />
            {createErrors.slaDeadline && <div className="form-error">{createErrors.slaDeadline}</div>}
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => setCreateOpen(false)}
              disabled={creating}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn--primary"
              disabled={creating}
              id="btn-submit-order"
            >
              {creating ? <span className="spinner spinner--sm" /> : null}
              Create Order
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default OrdersPage;
