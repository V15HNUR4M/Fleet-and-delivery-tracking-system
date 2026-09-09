import React, { useCallback, useEffect, useState } from 'react';
import { Plus, Search, RefreshCw, Pencil, SlidersHorizontal } from 'lucide-react';
import toast from 'react-hot-toast';
import { vehicleApi } from '../../api/vehicleApi';
import { VEHICLE_STATUSES, VEHICLE_TYPES, FUEL_TYPES } from '../../constants';
import StatusBadge from '../../components/common/StatusBadge';
import Pagination from '../../components/common/Pagination';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';
import Modal from '../../components/common/Modal';
import { getErrorMessage, labelify } from '../../utils';

const PAGE_SIZE = 20;

const defaultForm = {
  regNumber: '',
  type: 'BIKE',
  capacityKg: 0,
  fuelType: 'PETROL',
  status: 'ACTIVE',
};

const VehiclesPage = () => {
  const [vehicles, setVehicles] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [page, setPage] = useState(0);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Form modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Status modal
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [statusTarget, setStatusTarget] = useState(null);
  const [newStatus, setNewStatus] = useState('ACTIVE');
  const [statusSubmitting, setStatusSubmitting] = useState(false);

  const fetchVehicles = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const res = await vehicleApi.getVehicles(statusFilter, page, PAGE_SIZE);
      setVehicles(res.content);
      setTotalElements(res.totalElements);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [statusFilter, page]);

  useEffect(() => { fetchVehicles(); }, [fetchVehicles]);

  // Client-side search filter
  const filtered = search.trim()
    ? vehicles.filter(
        (v) =>
          v.regNumber.toLowerCase().includes(search.toLowerCase()) ||
          v.type.toLowerCase().includes(search.toLowerCase())
      )
    : vehicles;

  const validateForm = () => {
    const errs = {};
    if (!form.regNumber.trim()) errs.regNumber = 'Registration number is required.';
    if (!form.type) errs.type = 'Vehicle type is required.';
    if (!form.capacityKg || form.capacityKg <= 0) errs.capacityKg = 'Capacity must be greater than 0.';
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const openCreate = () => {
    setEditId(null);
    setForm(defaultForm);
    setFormErrors({});
    setModalOpen(true);
  };

  const openEdit = (v) => {
    setEditId(v.id);
    setForm({
      regNumber: v.regNumber,
      type: v.type,
      capacityKg: Number(v.capacityKg),
      fuelType: v.fuelType,
      status: v.status,
    });
    setFormErrors({});
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setSubmitting(true);
    try {
      if (editId !== null) {
        await vehicleApi.updateVehicle(editId, form);
        toast.success('Vehicle updated successfully.');
      } else {
        await vehicleApi.createVehicle(form);
        toast.success('Vehicle created successfully.');
      }
      setModalOpen(false);
      fetchVehicles();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const openStatusModal = (v) => {
    setStatusTarget(v);
    setNewStatus(v.status);
    setStatusModalOpen(true);
  };

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    if (!statusTarget) return;
    setStatusSubmitting(true);
    try {
      await vehicleApi.updateStatus(statusTarget.id, { status: newStatus });
      toast.success('Vehicle status updated.');
      setStatusModalOpen(false);
      fetchVehicles();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setStatusSubmitting(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Fleet Management</div>
          <div className="page-subtitle">Manage vehicles in your fleet</div>
        </div>
        <button className="btn btn--primary" onClick={openCreate} id="btn-add-vehicle">
          <Plus size={14} /> Add Vehicle
        </button>
      </div>

      {/* Toolbar */}
      <div className="toolbar">
        <div className="search-input-wrap">
          <Search size={14} />
          <input
            type="search"
            className="search-input"
            placeholder="Search by reg number or type…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search vehicles"
            id="vehicle-search"
          />
        </div>
        <select
          className="filter-select"
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}
          aria-label="Filter by status"
          id="vehicle-status-filter"
        >
          <option value="">All Statuses</option>
          {VEHICLE_STATUSES.map((s) => (
            <option key={s} value={s}>{labelify(s)}</option>
          ))}
        </select>
        <button className="btn btn--ghost btn--sm" onClick={fetchVehicles} disabled={loading} aria-label="Refresh">
          <RefreshCw size={13} /> Refresh
        </button>
      </div>

      {/* Table */}
      <div className="card" style={{ overflow: 'hidden' }}>
        {loading ? (
          <LoadingSkeleton rows={8} columns={6} />
        ) : error ? (
          <ErrorState message={error} onRetry={fetchVehicles} />
        ) : filtered.length === 0 ? (
          <EmptyState
            title="No vehicles found"
            description="Add your first vehicle to get started."
            action={
              <button className="btn btn--primary btn--sm" onClick={openCreate}>
                <Plus size={13} /> Add Vehicle
              </button>
            }
          />
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Reg Number</th>
                  <th>Type</th>
                  <th>Capacity (kg)</th>
                  <th>Fuel Type</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((v) => (
                  <tr key={v.id}>
                    <td><span className="font-mono">{v.regNumber}</span></td>
                    <td>{labelify(v.type)}</td>
                    <td>{Number(v.capacityKg).toFixed(1)}</td>
                    <td>{v.fuelType ? labelify(v.fuelType) : '—'}</td>
                    <td><StatusBadge value={v.status} type="vehicle" /></td>
                    <td>
                      <div className="table-actions">
                        <button
                          className="btn btn--ghost btn--sm btn--icon"
                          onClick={() => openEdit(v)}
                          title="Edit vehicle"
                          aria-label={`Edit ${v.regNumber}`}
                          id={`btn-edit-vehicle-${v.id}`}
                        >
                          <Pencil size={13} />
                        </button>
                        <button
                          className="btn btn--ghost btn--sm"
                          onClick={() => openStatusModal(v)}
                          title="Update status"
                          aria-label={`Update status of ${v.regNumber}`}
                          id={`btn-status-vehicle-${v.id}`}
                        >
                          <SlidersHorizontal size={13} /> Status
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {!loading && !error && totalElements > PAGE_SIZE && (
          <Pagination
            page={page}
            totalElements={totalElements}
            pageSize={PAGE_SIZE}
            onPageChange={setPage}
          />
        )}
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editId !== null ? 'Edit Vehicle' : 'Add Vehicle'}
        size="md"
      >
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="veh-reg">
                Registration Number <span className="required">*</span>
              </label>
              <input
                id="veh-reg"
                className="form-input"
                value={form.regNumber}
                onChange={(e) => setForm({ ...form, regNumber: e.target.value })}
                placeholder="e.g. MH12AB1234"
                required
              />
              {formErrors.regNumber && <div className="form-error">{formErrors.regNumber}</div>}
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="veh-type">
                Vehicle Type <span className="required">*</span>
              </label>
              <select
                id="veh-type"
                className="form-select"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              >
                {VEHICLE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              {formErrors.type && <div className="form-error">{formErrors.type}</div>}
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="veh-capacity">
                Capacity (kg) <span className="required">*</span>
              </label>
              <input
                id="veh-capacity"
                type="number"
                step="0.01"
                min="0.01"
                className="form-input"
                value={form.capacityKg || ''}
                onChange={(e) => setForm({ ...form, capacityKg: parseFloat(e.target.value) || 0 })}
                placeholder="e.g. 500"
                required
              />
              {formErrors.capacityKg && <div className="form-error">{formErrors.capacityKg}</div>}
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="veh-fuel">Fuel Type</label>
              <select
                id="veh-fuel"
                className="form-select"
                value={form.fuelType}
                onChange={(e) => setForm({ ...form, fuelType: e.target.value })}
              >
                {FUEL_TYPES.map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="veh-status">Status</label>
            <select
              id="veh-status"
              className="form-select"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              {VEHICLE_STATUSES.map((s) => <option key={s} value={s}>{labelify(s)}</option>)}
            </select>
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn--ghost" onClick={() => setModalOpen(false)} disabled={submitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn--primary" disabled={submitting} id="btn-submit-vehicle">
              {submitting ? <span className="spinner spinner--sm" /> : null}
              {editId !== null ? 'Save Changes' : 'Create Vehicle'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Quick status update modal */}
      <Modal
        isOpen={statusModalOpen}
        onClose={() => setStatusModalOpen(false)}
        title={`Update Status — ${statusTarget?.regNumber}`}
        size="sm"
      >
        <form onSubmit={handleStatusUpdate}>
          <div className="form-group">
            <label className="form-label" htmlFor="status-select">New Status</label>
            <select
              id="status-select"
              className="form-select"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
            >
              {VEHICLE_STATUSES.map((s) => <option key={s} value={s}>{labelify(s)}</option>)}
            </select>
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn--ghost" onClick={() => setStatusModalOpen(false)} disabled={statusSubmitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn--primary" disabled={statusSubmitting}>
              {statusSubmitting ? <span className="spinner spinner--sm" /> : null}
              Update Status
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default VehiclesPage;
