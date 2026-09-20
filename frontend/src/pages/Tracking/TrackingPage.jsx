import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  MapPin,
  RefreshCw,
  Navigation,
  Send,
  Crosshair,
  Play,
  Pause,
  RotateCcw,
  Compass,
  Gauge,
  Activity,
  Info,
  Truck,
  CheckCircle2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { driverApi } from '../../api/driverApi';
import { trackingApi } from '../../api/trackingApi';
import { formatDateTime, getErrorMessage } from '../../utils';
import { useAuth } from '../../auth/AuthContext';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';

// Leaflet & React-Leaflet
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default icon issue in Vite
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconShadowUrl from 'leaflet/dist/images/marker-shadow.png';
import { useSimulatedTracking } from './useSimulatedTracking';
import { CHENNAI_DELIVERY_ROUTE } from './simulatedRouteUtils';

const defaultIcon = L.icon({
  iconUrl,
  shadowUrl: iconShadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});
L.Marker.prototype.options.icon = defaultIcon;

// Animated live driver marker with direction rotation and pulsing beacon
const createLiveDriverIcon = (heading = 0) => {
  return L.divIcon({
    className: 'custom-vehicle-marker-wrapper',
    html: `
      <div class="driver-live-marker-container">
        <div class="driver-marker-pulse"></div>
        <div class="driver-marker-body" style="transform: rotate(${heading}deg);">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="1" y="3" width="15" height="13"></rect>
            <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
            <circle cx="5.5" cy="18.5" r="2.5"></circle>
            <circle cx="18.5" cy="18.5" r="2.5"></circle>
          </svg>
        </div>
        <div class="driver-marker-indicator" title="Telemetry Live"></div>
      </div>
    `,
    iconSize: [44, 44],
    iconAnchor: [22, 22],
    popupAnchor: [0, -22],
  });
};

// Start and End Terminal Markers
const createTerminalIcon = (label, isDest = false) => {
  return L.divIcon({
    className: 'custom-vehicle-marker-wrapper',
    html: `<div class="${isDest ? 'terminal-marker-dest' : 'terminal-marker-depot'}">${label}</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14],
  });
};

// Auto-pan to follow the moving driver smoothly when Follow Driver is enabled
const MapFollowController = ({ targetPosition, follow }) => {
  const map = useMap();
  const lat = targetPosition?.latitude;
  const lng = targetPosition?.longitude;

  useEffect(() => {
    if (follow && lat != null && lng != null) {
      map.panTo([lat, lng], {
        animate: true,
        duration: 0.6,
      });
    }
  }, [lat, lng, follow, map]);

  return null;
};

// Initial map centering
const InitialCenter = ({ center, zoom = 13 }) => {
  const map = useMap();
  const centeredRef = useRef(false);
  useEffect(() => {
    if (!centeredRef.current && center) {
      map.setView(center, zoom);
      centeredRef.current = true;
    }
  }, [center, zoom, map]);
  return null;
};

// Auto-fit map to bounds when real locations change
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

  // Mode: 'SIMULATED' (Default demo tracking) or 'REAL' (Actual backend location trail)
  const [activeMode, setActiveMode] = useState('SIMULATED');

  // Driver GPS reporting form (DRIVER role)
  const [driverIdInput, setDriverIdInput] = useState('');
  const [orderIdInput, setOrderIdInput] = useState('');
  const [latInput, setLatInput] = useState('');
  const [lngInput, setLngInput] = useState('');
  const [submittingGps, setSubmittingGps] = useState(false);

  // Date range for real history (default: last 24h)
  const now = useMemo(() => new Date(), []);
  const yesterday = useMemo(() => new Date(now.getTime() - 24 * 60 * 60 * 1000), [now]);
  const [fromDate, setFromDate] = useState(yesterday.toISOString().slice(0, 16));
  const [toDate, setToDate] = useState(now.toISOString().slice(0, 16));

  // Hook for live simulated driver movement
  const sim = useSimulatedTracking({
    route: CHENNAI_DELIVERY_ROUTE,
    updateIntervalMs: 800,
    initialSpeed: 38,
    autoStart: true,
  });

  // Load Drivers list for Dispatcher/Admin
  useEffect(() => {
    if (canListDrivers) {
      driverApi
        .getDrivers('', 0, 100)
        .then((res) => {
          setDrivers(res.content);
          if (res.content.length > 0 && !selectedDriverId) {
            setSelectedDriverId(res.content[0].id);
          }
        })
        .catch(() => {})
        .finally(() => setDriversLoading(false));
    }
  }, [canListDrivers, selectedDriverId]);

  // Fetch real locations from backend
  const fetchLocations = useCallback(async () => {
    if (!selectedDriverId) return;
    setLocationsLoading(true);
    setLocationsError('');
    try {
      const from = new Date(fromDate).toISOString();
      const to = new Date(toDate).toISOString();
      const res = await trackingApi.getDriverLocations(selectedDriverId, from, to);
      setLocations(res);
      if (res && res.length > 0) {
        setActiveMode('REAL');
      } else {
        setActiveMode('SIMULATED');
      }
    } catch (err) {
      setLocationsError(getErrorMessage(err));
      setActiveMode('SIMULATED');
    } finally {
      setLocationsLoading(false);
    }
  }, [selectedDriverId, fromDate, toDate]);

  useEffect(() => {
    if (selectedDriverId) {
      fetchLocations();
    } else {
      setLocations([]);
      setActiveMode('SIMULATED');
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
  const driverDisplayName = selectedDriver ? selectedDriver.name : 'Arun Kumar';
  const driverDisplayMobile = selectedDriver ? selectedDriver.mobile : '+91 98401 23456';

  // Planned route coordinates for visual background polyline
  const plannedRouteCoords = useMemo(
    () => CHENNAI_DELIVERY_ROUTE.map((pt) => [pt.lat, pt.lng]),
    []
  );

  const startPoint = CHENNAI_DELIVERY_ROUTE[0];
  const endPoint = CHENNAI_DELIVERY_ROUTE[CHENNAI_DELIVERY_ROUTE.length - 1];

  // Dynamic marker icon rotated towards heading
  const liveDriverIcon = useMemo(
    () => createLiveDriverIcon(sim.heading),
    [sim.heading]
  );

  const isSimulatedActive = activeMode === 'SIMULATED';
  const realPolylinePositions = locations.map((l) => [l.latitude, l.longitude]);
  const latestRealLocation = locations.length > 0 ? locations[locations.length - 1] : null;

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <div className="page-title" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span>Fleet Tracking</span>
            {isSimulatedActive ? (
              <span className="sim-badge-live" id="tracking-sim-status-badge">
                <span className="sim-pulse-dot" />
                SIMULATED LIVE
              </span>
            ) : (
              <span className="badge badge--success" style={{ fontSize: 11 }}>
                ● REAL GPS RECORDED
              </span>
            )}
          </div>
          <div className="page-subtitle">
            {isSimulatedActive
              ? 'Real-time simulated telemetry along delivery corridor (Demo Mode)'
              : 'Verified GPS location trail from vehicle telemetry records'}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {locations.length > 0 && (
            <button
              className="btn btn--secondary btn--sm"
              onClick={() => setActiveMode((m) => (m === 'SIMULATED' ? 'REAL' : 'SIMULATED'))}
            >
              <Activity size={13} />
              {isSimulatedActive ? 'View Real History' : 'Switch to Demo Simulation'}
            </button>
          )}

          {selectedDriverId && (
            <button
              className="btn btn--ghost btn--sm"
              onClick={fetchLocations}
              disabled={locationsLoading}
              title="Refresh backend records"
            >
              <RefreshCw size={13} /> Refresh Records
            </button>
          )}
        </div>
      </div>

      {/* Honest Technical Status Banner */}
      <div
        className="coming-soon-banner"
        style={{
          background: isSimulatedActive ? 'rgba(16,185,129,0.08)' : 'rgba(59,130,246,0.08)',
          borderColor: isSimulatedActive ? 'rgba(16,185,129,0.28)' : 'rgba(59,130,246,0.28)',
          color: isSimulatedActive ? '#10b981' : 'var(--accent-blue)',
          marginBottom: 16,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 8,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
          <Info size={15} />
          {isSimulatedActive ? (
            <span>
              <strong>DEMO TRACKING ACTIVE:</strong> Realistic driver telemetry simulation with smooth road interpolation, dynamic speed (25–55 km/h), heading calculation, and live breadcrumbs. Full backend REST APIs (<code>/api/v1/locations</code>) remain active.
            </span>
          ) : (
            <span>
              <strong>REAL GPS TELEMETRY:</strong> Displaying {locations.length} recorded coordinates retrieved from backend REST database.
            </span>
          )}
        </div>

        {isSimulatedActive && (
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
            Chennai Corridor • Anna Salai Transit
          </span>
        )}
      </div>

      {/* Main Grid: Left Controls & Right Map + Telemetry HUD */}
      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 16 }}>
        {/* Left Column */}
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
                    <label className="form-label" htmlFor="driver-id-input">
                      Driver ID <span className="required">*</span>
                    </label>
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
                        placeholder="e.g. 13.0827"
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
                        placeholder="e.g. 80.2707"
                        value={lngInput}
                        onChange={(e) => setLngInput(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    className="btn btn--secondary btn--sm"
                    onClick={handleGetBrowserGps}
                    style={{ justifyContent: 'center' }}
                  >
                    <Crosshair size={13} /> Detect GPS Coordinates
                  </button>

                  <button
                    type="submit"
                    className="btn btn--primary"
                    disabled={submittingGps}
                    style={{ justifyContent: 'center' }}
                  >
                    {submittingGps ? <span className="spinner spinner--sm" /> : <Send size={13} />}
                    Submit GPS Update
                  </button>
                </form>
              </div>
            </div>
          ) : (
            /* ADMIN / DISPATCHER: Driver Selector */
            <div className="card">
              <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="card-title">Select Driver</span>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                  {drivers.length} available
                </span>
              </div>
              <div style={{ maxHeight: 280, overflowY: 'auto' }}>
                {driversLoading ? (
                  <div style={{ padding: 16 }}>
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="skeleton" style={{ height: 36, marginBottom: 8, borderRadius: 6 }} />
                    ))}
                  </div>
                ) : drivers.length === 0 ? (
                  <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 12 }}>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>
                      Demo Fleet Active
                    </div>
                    Simulating live tracking for Arun Kumar
                  </div>
                ) : (
                  drivers.map((d) => (
                    <div
                      key={d.id}
                      onClick={() => {
                        setSelectedDriverId(d.id);
                        sim.reset();
                      }}
                      style={{
                        padding: '10px 16px',
                        cursor: 'pointer',
                        borderBottom: '1px solid var(--border-light)',
                        background: selectedDriverId === d.id ? 'rgba(59,130,246,0.1)' : 'transparent',
                        borderLeft: selectedDriverId === d.id ? '3px solid var(--accent-blue)' : '3px solid transparent',
                        transition: 'all 0.15s',
                      }}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === 'Enter' && setSelectedDriverId(d.id)}
                      aria-selected={selectedDriverId === d.id}
                      id={`tracking-driver-${d.id}`}
                    >
                      <div style={{ fontWeight: 500, fontSize: 13, display: 'flex', justifyContent: 'space-between' }}>
                        <span>{d.name}</span>
                        <span style={{ fontSize: 11, color: d.availability === 'AVAILABLE' ? 'var(--accent-green)' : 'var(--text-muted)' }}>
                          {d.availability || 'ON_DUTY'}
                        </span>
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{d.mobile}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Date range filter for Real Backend History */}
          {(selectedDriverId || isDriver) && (
            <div className="card" style={{ marginTop: 16 }}>
              <div className="card-header">
                <span className="card-title">Backend Trail Filter</span>
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
                  <input
                    id="track-from"
                    type="datetime-local"
                    className="form-input"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 10 }}>
                  <label className="form-label" htmlFor="track-to">To</label>
                  <input
                    id="track-to"
                    type="datetime-local"
                    className="form-input"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                  />
                </div>
                <button
                  className="btn btn--primary w-full"
                  style={{ justifyContent: 'center' }}
                  onClick={fetchLocations}
                  disabled={locationsLoading || !selectedDriverId}
                >
                  {locationsLoading ? <span className="spinner spinner--sm" /> : <Navigation size={13} />}
                  Query Backend Trail
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Live Map + Telemetry Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Telemetry HUD & Simulation Controls */}
          {isSimulatedActive && (
            <div className="card" style={{ padding: '16px 20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                <div>
                  <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
                    Tracked Vehicle & Operator
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8, marginTop: 2 }}>
                    <Truck size={16} color="var(--accent-blue)" />
                    <span>{driverDisplayName}</span>
                    <span className="badge badge--success" style={{ fontSize: 10 }}>ON DUTY</span>
                    <span style={{ fontSize: 12, fontWeight: 400, color: 'var(--text-muted)' }}>
                      • Express Van (TN-09-EV-4210)
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <button
                    className={`btn ${sim.isPlaying ? 'btn--secondary' : 'btn--primary'} btn--sm`}
                    onClick={sim.togglePlay}
                    id="tracking-play-pause-btn"
                  >
                    {sim.isPlaying ? <Pause size={13} /> : <Play size={13} />}
                    {sim.isPlaying ? 'Pause' : 'Resume'}
                  </button>

                  <button
                    className="btn btn--ghost btn--sm"
                    onClick={sim.reset}
                    title="Reset to route start point"
                    id="tracking-reset-btn"
                  >
                    <RotateCcw size={13} /> Reset
                  </button>

                  <button
                    className={`btn ${sim.followDriver ? 'btn--primary' : 'btn--ghost'} btn--sm`}
                    onClick={sim.toggleFollowDriver}
                    title="Keep driver centered on map"
                    id="tracking-follow-toggle-btn"
                  >
                    <Crosshair size={13} />
                    {sim.followDriver ? 'Following Driver' : 'Follow: Off'}
                  </button>

                  <button
                    className="btn btn--ghost btn--sm"
                    onClick={() => sim.setMultiplier(sim.multiplier === 1 ? 2 : 1)}
                    title="Toggle demo simulation speed"
                  >
                    {sim.multiplier}x Speed
                  </button>
                </div>
              </div>

              {/* Telemetry Metrics Grid */}
              <div className="telemetry-metrics-grid">
                <div className="telemetry-metric-box">
                  <div className="telemetry-metric-label">
                    <Gauge size={11} style={{ display: 'inline', marginRight: 4 }} /> Live Speed
                  </div>
                  <div className="telemetry-metric-value" style={{ color: '#10b981' }}>
                    {sim.speed} <span className="telemetry-metric-sub">km/h</span>
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>
                    Urban corridor range (25–55)
                  </div>
                </div>

                <div className="telemetry-metric-box">
                  <div className="telemetry-metric-label">
                    <Compass size={11} style={{ display: 'inline', marginRight: 4 }} /> Heading
                  </div>
                  <div className="telemetry-metric-value">
                    {sim.cardinalHeading}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>
                    Bearing: {sim.heading}°
                  </div>
                </div>

                <div className="telemetry-metric-box">
                  <div className="telemetry-metric-label">
                    <MapPin size={11} style={{ display: 'inline', marginRight: 4 }} /> Location
                  </div>
                  <div className="telemetry-metric-value font-mono" style={{ fontSize: 13 }}>
                    {sim.currentPosition.latitude.toFixed(4)}, {sim.currentPosition.longitude.toFixed(4)}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>
                    GPS Accuracy: ±3m
                  </div>
                </div>

                <div className="telemetry-metric-box">
                  <div className="telemetry-metric-label">
                    <Activity size={11} style={{ display: 'inline', marginRight: 4 }} /> Route Covered
                  </div>
                  <div className="telemetry-metric-value">
                    {sim.distanceCoveredKm} <span className="telemetry-metric-sub">km</span>
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>
                    Breadcrumbs: {sim.trail.length} pts
                  </div>
                </div>

                <div className="telemetry-metric-box">
                  <div className="telemetry-metric-label">
                    <CheckCircle2 size={11} style={{ display: 'inline', marginRight: 4 }} /> Last Updated
                  </div>
                  <div className="telemetry-metric-value" style={{ fontSize: 13 }}>
                    Just now
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>
                    Interval: 800ms
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Interactive Map */}
          <div className="card" style={{ overflow: 'hidden' }}>
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="card-title">
                <MapPin size={12} style={{ display: 'inline', marginRight: 6 }} />
                {isSimulatedActive
                  ? `${driverDisplayName} — Simulated Live Route`
                  : selectedDriver
                  ? `${selectedDriver.name} — Recorded GPS Trail`
                  : `Driver #${selectedDriverId} — Route Trail`}
              </span>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 11, color: 'var(--text-muted)' }}>
                {isSimulatedActive ? (
                  <span>Status: <strong>Active Telemetry Feed</strong></span>
                ) : latestRealLocation ? (
                  <span>Last Recorded: {formatDateTime(latestRealLocation.recordedAt)}</span>
                ) : (
                  <span>No backend points in window</span>
                )}
              </div>
            </div>

            <div className="map-container" style={{ height: 480 }}>
              <MapContainer
                center={[sim.currentPosition.latitude, sim.currentPosition.longitude]}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />

                {/* Auto-pan follow driver controller */}
                {isSimulatedActive && (
                  <MapFollowController
                    targetPosition={sim.currentPosition}
                    follow={sim.followDriver}
                  />
                )}

                {/* Initial Centering */}
                <InitialCenter
                  center={[sim.currentPosition.latitude, sim.currentPosition.longitude]}
                  zoom={13}
                />

                {/* SIMULATED MODE: Planned corridor (dashed) + Live dynamic breadcrumb trail (solid) */}
                {isSimulatedActive && (
                  <>
                    {/* Planned Route Corridor (Dashed guide line) */}
                    <Polyline
                      positions={plannedRouteCoords}
                      color="#60a5fa"
                      weight={3}
                      opacity={0.35}
                      dashArray="8, 8"
                    />

                    {/* Live Traveled Breadcrumbs Trail */}
                    {sim.trail.length > 1 && (
                      <Polyline
                        positions={sim.trail}
                        color="#10b981"
                        weight={4}
                        opacity={0.85}
                      />
                    )}

                    {/* Origin Depot Pin */}
                    {startPoint && (
                      <Marker
                        position={[startPoint.lat, startPoint.lng]}
                        icon={createTerminalIcon('A', false)}
                      >
                        <Popup>
                          <strong>Route Origin</strong><br />
                          {startPoint.name}<br />
                          Lat: {startPoint.lat}, Lng: {startPoint.lng}
                        </Popup>
                      </Marker>
                    )}

                    {/* Destination Terminal Pin */}
                    {endPoint && (
                      <Marker
                        position={[endPoint.lat, endPoint.lng]}
                        icon={createTerminalIcon('B', true)}
                      >
                        <Popup>
                          <strong>Delivery Terminal</strong><br />
                          {endPoint.name}<br />
                          Lat: {endPoint.lat}, Lng: {endPoint.lng}
                        </Popup>
                      </Marker>
                    )}

                    {/* Live Moving Driver Marker with pulsing beacon & directional rotation */}
                    <Marker
                      position={[sim.currentPosition.latitude, sim.currentPosition.longitude]}
                      icon={liveDriverIcon}
                    >
                      <Popup>
                        <div style={{ minWidth: 170 }}>
                          <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 4 }}>
                            {driverDisplayName}
                          </div>
                          <div style={{ fontSize: 11, color: '#10b981', fontWeight: 600, marginBottom: 6 }}>
                            ● SIMULATED LIVE TRACKING
                          </div>
                          <div style={{ fontSize: 11, display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <div>Speed: <strong>{sim.speed} km/h</strong></div>
                            <div>Heading: <strong>{sim.cardinalHeading} ({sim.heading}°)</strong></div>
                            <div>Lat: <code>{sim.currentPosition.latitude.toFixed(6)}</code></div>
                            <div>Lng: <code>{sim.currentPosition.longitude.toFixed(6)}</code></div>
                            <div>Distance: <strong>{sim.distanceCoveredKm} km</strong></div>
                            <div>Mobile: {driverDisplayMobile}</div>
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  </>
                )}

                {/* REAL BACKEND MODE: Actual historical GPS breadcrumb polyline & latest marker */}
                {!isSimulatedActive && (
                  <>
                    {locations.length > 1 && (
                      <Polyline positions={realPolylinePositions} color="#3b82f6" weight={3} opacity={0.85} />
                    )}
                    {latestRealLocation && (
                      <Marker position={[latestRealLocation.latitude, latestRealLocation.longitude]}>
                        <Popup>
                          <strong>{driverDisplayName}</strong><br />
                          Lat: {latestRealLocation.latitude.toFixed(6)}<br />
                          Lng: {latestRealLocation.longitude.toFixed(6)}<br />
                          {formatDateTime(latestRealLocation.recordedAt)}
                        </Popup>
                      </Marker>
                    )}
                    {locations.length > 0 && <FitBounds locations={locations} />}
                  </>
                )}
              </MapContainer>
            </div>
          </div>

          {/* Backend Location Records History Table */}
          {selectedDriverId && (
            <div className="card" style={{ overflow: 'hidden' }}>
              <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="card-title">Backend Telemetry Records ({locations.length} points)</span>
                {locations.length > 0 && (
                  <button
                    className="btn btn--ghost btn--sm"
                    onClick={() => setActiveMode('REAL')}
                  >
                    Plot on Map
                  </button>
                )}
              </div>
              {locationsLoading ? (
                <div style={{ padding: 16 }}>
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="skeleton" style={{ height: 14, marginBottom: 10, width: `${50 + i * 12}%` }} />
                  ))}
                </div>
              ) : locationsError ? (
                <ErrorState message={locationsError} onRetry={fetchLocations} />
              ) : locations.length === 0 ? (
                <EmptyState
                  title="No backend telemetry records found"
                  description="No historical GPS updates recorded for this driver yet. Live simulation is running on the map above."
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
                        <tr key={loc.id || idx}>
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
