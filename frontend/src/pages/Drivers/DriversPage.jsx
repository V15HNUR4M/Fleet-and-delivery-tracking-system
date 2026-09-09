import React, { useCallback, useEffect, useState } from 'react';
import { Plus, Search, RefreshCw, SlidersHorizontal, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import { driverApi } from '../../api/driverApi';
import { DRIVER_AVAILABILITIES } from '../../constants';
import StatusBadge from '../../components/common/StatusBadge';
import Pagination from '../../components/common/Pagination';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';
import Modal from '../../components/common/Modal';
import { formatDate, getErrorMessage, labelify } from '../../utils';

const PAGE_SIZE = 20;

const defaultForm = {
  name: '',
  mobile: '',
  licenseNumber: '',
  licenseExpiry: '',
};

const DriversPage = () => {
  const [drivers, setDrivers] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [page, setPage] = useState(0);
  const [availFilter, setAvailFilter] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Create modal
  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Availability modal
  const [availModalOpen, setAvailModalOpen] = useState(false);
  const [availTarget, setAvailTarget] = useState(null);
  const [newAvail, setNewAvail] = useState('AVAILABLE');
  const [availSubmitting, setAvailSubmitting] = useState(false);

  const fetchDrivers = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const res = await driverApi.getDrivers(availFilter, page, PAGE_SIZE);
      setDrivers(res.content);
      setTotalElements(res.totalElements);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [availFilter, page]);

  useEffect(() => { fetchDrivers(); }, [fetchDrivers]);

  const filtered = search.trim()
    ? drivers.filter(
        (d) =>
          d.name.toLowerCase().includes(search.toLowerCase()) ||
          d.mobile.includes(search) ||
          d.licenseNumber.toLowerCase().includes(search.toLowerCase())
      )
    : drivers;

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required.';
    if (!form.mobile.trim()) errs.mobile = 'Mobile is required.';
    else if (!/^\d{10,15}$/.test(form.mobile.trim())) errs.mobile = 'Mobile must be 10–15 digits.';
    if (!form.licenseNumber.trim()) errs.licenseNumber = 'License number is required.';
    if (!form.licenseExpiry) errs.licenseExpiry = 'License expiry date is required.';
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await driverApi.createDriver(form);
      toast.success('Driver registered successfully.');
      setCreateOpen(false);
      setForm(defaultForm);
      fetchDrivers();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const openAvailModal = (d) => {
    setAvailTarget(d);
    setNewAvail(d.availability);
    setAvailModalOpen(true);
  };

  const handleAvailUpdate = async (e) => {
    e.preventDefault();
    if (!availTarget) return;
    setAvailSubmitting(true);
    try {
      await driverApi.updateAvailability(availTarget.id, { availability: newAvail });
      toast.success('Availability updated.');
      setAvailModalOpen(false);
      fetchDrivers();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setAvailSubmitting(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Driver Management</div>
          <div className="page-subtitle">Manage your delivery drivers</div>
        </div>
        <button className="btn btn--primary" onClick={() => { setForm(defaultForm); setFormErrors({}); setCreateOpen(true); }} id="btn-add-driver">
          <Plus size={14} /> Add Driver
        </button>
      </div>

      {/* Toolbar */}
      <div className="toolbar">
        <div className="search-input-wrap">
          <Search size={14} />
          <input
            type="search"
            className="search-input"
            placeholder="Search by name, mobile, or license…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search drivers"
            id="driver-search"
          />
        </div>
        <select
          className="filter-select"
          value={availFilter}
          onChange={(e) => { setAvailFilter(e.target.value); setPage(0); }}
          aria-label="Filter by availability"
          id="driver-avail-filter"
        >
          <option value="">All Availability</option>
          {DRIVER_AVAILABILITIES.map((a) => (
            <option key={a} value={a}>{labelify(a)}</option>
          ))}
        </select>
        <button className="btn btn--ghost btn--sm" onClick={fetchDrivers} disabled={loading}>
          <RefreshCw size={13} /> Refresh
        </button>
      </div>

      {/* Table */}
      <div className="card" style={{ overflow: 'hidden' }}>
        {loading ? (
          <LoadingSkeleton rows={8} columns={7} />
        ) : error ? (
          <ErrorState message={error} onRetry={fetchDrivers} />
        ) : filtered.length === 0 ? (
          <EmptyState
            title="No drivers found"
            description="Register your first driver to get started."
            action={
              <button className="btn btn--primary btn--sm" onClick={() => setCreateOpen(true)}>
                <Plus size={13} /> Add Driver
              </button>
            }
          />
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Driver</th>
                  <th>Mobile</th>
                  <th>License No.</th>
                  <th>License Expiry</th>
                  <th>Availability</th>
                  <th>Suspended</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((d) => (
                  <tr key={d.id}>
                    <td>
                      <div style={{ fontWeight: 500 }}>{d.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>ID: {d.id}</div>
                    </td>
                    <td className="font-mono">{d.mobile}</td>
                    <td className="font-mono">{d.licenseNumber}</td>
                    <td>{formatDate(d.licenseExpiry)}</td>
                    <td><StatusBadge value={d.availability} type="driver" /></td>
                    <td>
                      {d.isSuspended ? (
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--accent-red)' }}>
                          <AlertTriangle size={12} /> Yes
                        </span>
                      ) : (
                        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>No</span>
                      )}
                    </td>
                    <td>
                      <button
                        className="btn btn--ghost btn--sm"
                        onClick={() => openAvailModal(d)}
                        aria-label={`Update availability for ${d.name}`}
                        id={`btn-avail-driver-${d.id}`}
                      >
                        <SlidersHorizontal size={13} /> Availability
                      </button>
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

      {/* Create Driver Modal */}
      <Modal isOpen={createOpen} onClose={() => setCreateOpen(false)} title="Register Driver" size="md">
        <form onSubmit={handleCreate} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="drv-name">Full Name <span className="required">*</span></label>
            <input
              id="drv-name"
              className="form-input"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Rahul Sharma"
              required
              autoFocus
            />
            {formErrors.name && <div className="form-error">{formErrors.name}</div>}
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="drv-mobile">Mobile Number <span className="required">*</span></label>
              <input
                id="drv-mobile"
                type="tel"
                className="form-input"
                value={form.mobile}
                onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                placeholder="10–15 digits"
                required
              />
              {formErrors.mobile && <div className="form-error">{formErrors.mobile}</div>}
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="drv-license">License Number <span className="required">*</span></label>
              <input
                id="drv-license"
                className="form-input"
                value={form.licenseNumber}
                onChange={(e) => setForm({ ...form, licenseNumber: e.target.value })}
                placeholder="e.g. MH1220210012345"
                required
              />
              {formErrors.licenseNumber && <div className="form-error">{formErrors.licenseNumber}</div>}
            </div>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="drv-expiry">License Expiry Date <span className="required">*</span></label>
            <input
              id="drv-expiry"
              type="date"
              className="form-input"
              value={form.licenseExpiry}
              onChange={(e) => setForm({ ...form, licenseExpiry: e.target.value })}
              required
            />
            {formErrors.licenseExpiry && <div className="form-error">{formErrors.licenseExpiry}</div>}
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn--ghost" onClick={() => setCreateOpen(false)} disabled={submitting}>Cancel</button>
            <button type="submit" className="btn btn--primary" disabled={submitting} id="btn-submit-driver">
              {submitting ? <span className="spinner spinner--sm" /> : null}
              Register Driver
            </button>
          </div>
        </form>
      </Modal>

      {/* Availability Update Modal */}
      <Modal
        isOpen={availModalOpen}
        onClose={() => setAvailModalOpen(false)}
        title={`Update Availability — ${availTarget?.name}`}
        size="sm"
      >
        <form onSubmit={handleAvailUpdate}>
          <div className="form-group">
            <label className="form-label" htmlFor="avail-select">Availability Status</label>
            <select
              id="avail-select"
              className="form-select"
              value={newAvail}
              onChange={(e) => setNewAvail(e.target.value)}
            >
              {DRIVER_AVAILABILITIES.map((a) => <option key={a} value={a}>{labelify(a)}</option>)}
            </select>
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn--ghost" onClick={() => setAvailModalOpen(false)} disabled={availSubmitting}>Cancel</button>
            <button type="submit" className="btn btn--primary" disabled={availSubmitting}>
              {availSubmitting ? <span className="spinner spinner--sm" /> : null}
              Update
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default DriversPage;
