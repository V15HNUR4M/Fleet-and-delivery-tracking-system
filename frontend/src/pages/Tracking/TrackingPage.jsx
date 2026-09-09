import React, { useCallback, useEffect, useState } from 'react';
import { MapPin, RefreshCw, Clock, Navigation, Send, Crosshair } from 'lucide-react';
import toast from 'react-hot-toast';
import { driverApi } from '../../api/driverApi';
import { trackingApi } from '../../api/trackingApi';
import { formatDateTime, getErrorMessage } from '../../utils';
import { useAuth } from '../../auth/AuthContext';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';

// Leaflet is loaded dynamically to avoid SSR issues
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default icon issue in Vite
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconShadowUrl from 'leaflet/dist/images/marker-shadow.png';
const defaultIcon = L.icon({
  iconUrl,
  shadowUrl: iconShadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});
L.Marker.prototype.options.icon = defaultIcon;

// Auto-fit map to bounds when locations change
const FitBounds = ({ locations }) => {
  const map = useMap();
  useEffect(() => {
    if (locations && locations.length > 0) {
      const bounds = L.latLngBounds(locations.map((l) => [l.latitude, l.longitude]));
      map.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [locations, map]);
  return null;
};

const TrackingPage = () => {
  const { user } = useAuth();
  const isDriver = user?.role === 'DRIVER';
  const canListDrivers = user?.role === 'ADMIN' || user?.role === 'DISPATCHER';

  const [drivers, setDrivers] = useState([]);
  const [selectedDriverId, setSelectedDriverId] = useState(null);
  const [locations, setLocations] = useState([]);
  const [driversLoading, setDriversLoading] = useState(canListDrivers);
  const [locationsLoading, setLocationsLoading] = useState(false);
  const [locationsError, setLocationsError] = useState('');

  // Driver GPS reporting form
  const [driverIdInput, setDriverIdInput] = useState('');
  const [orderIdInput, setOrderIdInput] = useState('');
  const [latInput, setLatInput] = useState('');
  const [lngInput, setLngInput] = useState('');
  const [submittingGps, setSubmittingGps] = useState(false);

  // Date range (default: last 24h)
  const now = new Date();
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const [fromDate, setFromDate] = useState(yesterday.toISOString().slice(0, 16));
  const [toDate, setToDate] = useState(now.toISOString().slice(0, 16));

  useEffect(() => {
    if (canListDrivers) {
      driverApi.getDrivers('', 0, 100)
        .then((res) => setDrivers(res.content))
        .catch(() => {})
        .finally(() => setDriversLoading(false));
    }
  }, [canListDrivers]);

  const fetchLocations = useCallback(async () => {
    if (!selectedDriverId) return;
    setLocationsLoading(true);
    setLocationsError('');
    try {
      const from = new Date(fromDate).toISOString();
      const to = new Date(toDate).toISOString();
      const res = await trackingApi.getDriverLocations(selectedDriverId, from, to);
      setLocations(res);
    } catch (err) {
      setLocationsError(getErrorMessage(err));
    } finally {
      setLocationsLoading(false);
    }
  }, [selectedDriverId, fromDate, toDate]);

  useEffect(() => {
    if (selectedDriverId) {
      fetchLocations();
    } else {
      setLocations([]);
    }
  }, [selectedDriverId, fetchLocations]);

  // Handle GPS location reporting (DRIVER role)
  const handleGetBrowserGps = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatInput(pos.coords.latitude.toFixed(6));
        setLngInput(pos.coords.longitude.toFixed(6));
        toast.success('Location obtained from GPS.');
      },
      (err) => {
        toast.error(`Geolocation error: ${err.message}`);
      }
    );
  };

  const handlePostLocation = async (e) => {
    e.preventDefault();
    const dId = parseInt(driverIdInput.trim());
    const lat = parseFloat(latInput.trim());
    const lng = parseFloat(lngInput.trim());
    const oId = orderIdInput.trim() ? parseInt(orderIdInput.trim()) : undefined;

    if (isNaN(dId) || dId <= 0) {
      toast.error('Please enter a valid numeric Driver ID.');
      return;
    }
    if (isNaN(lat) || isNaN(lng)) {
      toast.error('Please enter valid numeric latitude and longitude coordinates.');
      return;
    }

    setSubmittingGps(true);
    try {
      await trackingApi.addLocation({
        driverId: dId,
        orderId: oId,
        latitude: lat,
        longitude: lng,
      });
      toast.success('GPS location recorded successfully.');
      setSelectedDriverId(dId);
      fetchLocations();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSubmittingGps(false);
    }
  };

  const selectedDriver = drivers.find((d) => d.id === selectedDriverId);
  const latestLocation = locations.length > 0 ? locations[locations.length - 1] : null;
  const polylinePositions = locations.map((l) => [l.latitude, l.longitude]);
  const defaultCenter = [19.076, 72.877]; // Mumbai

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Fleet Tracking</div>
          <div className="page-subtitle">Driver route history and GPS telemetry</div>
        </div>
        {selectedDriverId && (
          <button className="btn btn--ghost btn--sm" onClick={fetchLocations} disabled={locationsLoading}>
            <RefreshCw size={13} /> Refresh
          </button>
        )}
      </div>

      {/* Note: REST polling only — WebSocket not yet implemented in backend */}
      <div className="coming-soon-banner" style={{ background: 'rgba(245,158,11,0.08)', borderColor: 'rgba(245,158,11,0.2)', color: 'var(--accent-amber)', marginBottom: 16 }}>
        <Clock size={14} />
        Live WebSocket GPS streaming is not implemented in the backend. Location history is retrieved via the verified REST API.
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 16 }}>
        {/* Left Column: Driver Selector or Driver GPS Reporter */}
        <div>
          {/* DRIVER ROLE: Location Reporting Form */}
          {isDriver ? (
            <div className="card" style={{ marginBottom: 16 }}>
              <div className="card-header">
                <span className="card-title">
                  <Send size={13} style={{ display: 'inline', marginRight: 6 }} /> Report GPS Location
                </span>
              </div>
              <div className="card-body">
                <form onSubmit={handlePostLocation} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="driver-id-input">Driver ID <span className="required">*</span></label>
                    <input
                      id="driver-id-input"
                      type="number"
                      className="form-input"
                      placeholder="Your Driver ID"
                      value={driverIdInput}
                      onChange={(e) => setDriverIdInput(e.target.value)}
                      required
                      min={1}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="order-id-input">Order ID (optional)</label>
                    <input
                      id="order-id-input"
                      type="number"
                      className="form-input"
                      placeholder="Associated Order ID"
                      value={orderIdInput}
                      onChange={(e) => setOrderIdInput(e.target.value)}
                      min={1}
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label" htmlFor="gps-lat">Latitude <span className="required">*</span></label>
                      <input
                        id="gps-lat"
                        type="number"
                        step="any"
                        className="form-input"
                        placeholder="e.g. 19.076"
                        value={latInput}
                        onChange={(e) => setLatInput(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="gps-lng">Longitude <span className="required">*</span></label>
                      <input
                        id="gps-lng"
                        type="number"
                        step="any"
                        className="form-input"
                        placeholder="e.g. 72.877"
                        value={lngInput}
                        onChange={(e) => setLngInput(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <button type="button" className="btn btn--secondary btn--sm" onClick={handleGetBrowserGps} style={{ justifyContent: 'center' }}>
                    <Crosshair size={13} /> Detect GPS Coordinates
                  </button>

                  <button type="submit" className="btn btn--primary" disabled={submittingGps} style={{ justifyContent: 'center' }}>
                    {submittingGps ? <span className="spinner spinner--sm" /> : <Send size={13} />}
                    Submit GPS Update
                  </button>
                </form>
              </div>
            </div>
          ) : (
            /* ADMIN / DISPATCHER: Driver Selector */
            <div className="card">
              <div className="card-header">
                <span className="card-title">Select Driver</span>
              </div>
              <div style={{ maxHeight: 320, overflowY: 'auto' }}>
                {driversLoading ? (
                  <div style={{ padding: 16 }}>
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="skeleton" style={{ height: 36, marginBottom: 8, borderRadius: 6 }} />
                    ))}
                  </div>
                ) : drivers.length === 0 ? (
                  <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 12 }}>
                    No drivers found
                  </div>
                ) : (
                  drivers.map((d) => (
                    <div
                      key={d.id}
                      onClick={() => setSelectedDriverId(d.id === selectedDriverId ? null : d.id)}
                      style={{
                        padding: '10px 16px',
                        cursor: 'pointer',
                        borderBottom: '1px solid var(--border-light)',
                        background: selectedDriverId === d.id ? 'rgba(59,130,246,0.08)' : 'transparent',
                        borderLeft: selectedDriverId === d.id ? '3px solid var(--accent-blue)' : '3px solid transparent',
                        transition: 'background 0.15s',
                      }}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === 'Enter' && setSelectedDriverId(d.id === selectedDriverId ? null : d.id)}
                      aria-selected={selectedDriverId === d.id}
                      id={`tracking-driver-${d.id}`}
                    >
                      <div style={{ fontWeight: 500, fontSize: 13 }}>{d.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{d.mobile}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Date range filter */}
          {(selectedDriverId || isDriver) && (
            <div className="card" style={{ marginTop: 16 }}>
              <div className="card-header">
                <span className="card-title">Trail Time Window</span>
              </div>
              <div className="card-body">
                {isDriver && !selectedDriverId && (
                  <div className="form-group" style={{ marginBottom: 10 }}>
                    <label className="form-label" htmlFor="track-driver-id">Driver ID to View</label>
                    <input
                      id="track-driver-id"
                      type="number"
                      className="form-input"
                      placeholder="Enter your Driver ID"
                      value={driverIdInput}
                      onChange={(e) => {
                        setDriverIdInput(e.target.value);
                        const val = parseInt(e.target.value);
                        if (!isNaN(val) && val > 0) setSelectedDriverId(val);
                      }}
                    />
                  </div>
                )}
                <div className="form-group" style={{ marginBottom: 10 }}>
                  <label className="form-label" htmlFor="track-from">From</label>
                  <input id="track-from" type="datetime-local" className="form-input" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
                </div>
                <div className="form-group" style={{ marginBottom: 10 }}>
                  <label className="form-label" htmlFor="track-to">To</label>
                  <input id="track-to" type="datetime-local" className="form-input" value={toDate} onChange={(e) => setToDate(e.target.value)} />
                </div>
                <button
                  className="btn btn--primary w-full"
                  style={{ justifyContent: 'center' }}
                  onClick={fetchLocations}
                  disabled={locationsLoading || !selectedDriverId}
                >
                  {locationsLoading ? <span className="spinner spinner--sm" /> : <Navigation size={13} />}
                  Load Location Trail
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Map + location list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Map */}
          <div className="card" style={{ overflow: 'hidden' }}>
            <div className="card-header">
              <span className="card-title">
                <MapPin size={12} style={{ display: 'inline', marginRight: 6 }} />
                {selectedDriver
                  ? `${selectedDriver.name} — Route Trail`
                  : selectedDriverId
                  ? `Driver #${selectedDriverId} — Route Trail`
                  : 'Select or specify a driver to view route'}
              </span>
              {latestLocation && (
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                  Last: {formatDateTime(latestLocation.recordedAt)}
                </span>
              )}
            </div>
            <div className="map-container">
              <MapContainer
                center={latestLocation ? [latestLocation.latitude, latestLocation.longitude] : defaultCenter}
                zoom={12}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />
                {locations.length > 1 && (
                  <Polyline positions={polylinePositions} color="#3b82f6" weight={3} opacity={0.8} />
                )}
                {latestLocation && (
                  <Marker position={[latestLocation.latitude, latestLocation.longitude]}>
                    <Popup>
                      <strong>{selectedDriver?.name || `Driver #${selectedDriverId}`}</strong><br />
                      Lat: {latestLocation.latitude.toFixed(6)}<br />
                      Lng: {latestLocation.longitude.toFixed(6)}<br />
                      {formatDateTime(latestLocation.recordedAt)}
                    </Popup>
                  </Marker>
                )}
                {locations.length > 0 && <FitBounds locations={locations} />}
              </MapContainer>
            </div>
          </div>

          {/* Location list */}
          {selectedDriverId && (
            <div className="card" style={{ overflow: 'hidden' }}>
              <div className="card-header">
                <span className="card-title">Location History ({locations.length} points)</span>
              </div>
              {locationsLoading ? (
                <div style={{ padding: 16 }}>
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="skeleton" style={{ height: 14, marginBottom: 10, width: `${50 + (i * 12)}%` }} />
                  ))}
                </div>
              ) : locationsError ? (
                <ErrorState message={locationsError} onRetry={fetchLocations} />
              ) : locations.length === 0 ? (
                <EmptyState
                  title="No locations found"
                  description="No GPS telemetry recorded for this driver in the selected time range."
                />
              ) : (
                <div style={{ maxHeight: 200, overflowY: 'auto' }}>
                  <table className="table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Latitude</th>
                        <th>Longitude</th>
                        <th>Recorded At</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...locations].reverse().map((loc, idx) => (
                        <tr key={loc.id}>
                          <td style={{ color: 'var(--text-muted)', fontSize: 11 }}>{locations.length - idx}</td>
                          <td className="font-mono">{loc.latitude.toFixed(6)}</td>
                          <td className="font-mono">{loc.longitude.toFixed(6)}</td>
                          <td style={{ fontSize: 12 }}>{formatDateTime(loc.recordedAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrackingPage;
