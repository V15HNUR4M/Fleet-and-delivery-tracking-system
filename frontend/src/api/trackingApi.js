import axiosInstance from './axios';

export const trackingApi = {
  // POST /locations — DRIVER role only
  addLocation: (data) =>
    axiosInstance.post('/locations', data).then((r) => r.data),

  // GET /drivers/{id}/locations?from=ISO&to=ISO — ADMIN, DISPATCHER, DRIVER
  // from/to must be ISO OffsetDateTime strings, e.g. 2026-09-08T00:00:00+05:30
  getDriverLocations: (driverId, from, to) =>
    axiosInstance
      .get(`/drivers/${driverId}/locations`, { params: { from, to } })
      .then((r) => r.data),
};

/*
 * NOTE: The backend does NOT currently implement WebSocket/STOMP for live GPS streaming.
 * This tracking service uses polling via the REST endpoint above.
 * When WebSocket support is added to the backend, a WsTrackingService can be created
 * that subscribes to the STOMP topic and replaces the polling approach without
 * changing any component interface.
 */
