/**
 * Utility functions and predefined routes for simulated driver GPS tracking.
 * Provides realistic road waypoints, Haversine distance, bearings, and smooth interpolation.
 */

// Realistic urban delivery corridor: Chennai Central -> Anna Salai -> Guindy -> Airport
export const CHENNAI_DELIVERY_ROUTE = [
  { lat: 13.08268, lng: 80.27072, name: 'Chennai Central Depot' },
  { lat: 13.07684, lng: 80.26651, name: 'Chintadripet Hub' },
  { lat: 13.06942, lng: 80.25983, name: 'Thousand Lights Anna Salai' },
  { lat: 13.06120, lng: 80.25204, name: 'Gemini Flyover Corridor' },
  { lat: 13.05351, lng: 80.24762, name: 'Teynampet Junction' },
  { lat: 13.04403, lng: 80.24101, name: 'Nandanam Hub' },
  { lat: 13.03352, lng: 80.23124, name: 'Saidapet Bridge' },
  { lat: 13.02105, lng: 80.22053, name: 'Little Mount Industrial' },
  { lat: 13.00921, lng: 80.21142, name: 'Guindy Kathipara Junction' },
  { lat: 12.99754, lng: 80.19851, name: 'Alandur Transit Point' },
  { lat: 12.98602, lng: 80.18304, name: 'Meenambakkam Cargo Terminal' },
  { lat: 12.97850, lng: 80.16952, name: 'Pallavaram Distribution Center' },
];

// Alternate realistic urban corridor: Mumbai BKC -> Western Express -> Lower Parel
export const MUMBAI_DELIVERY_ROUTE = [
  { lat: 19.0760, lng: 72.8777, name: 'Bandra Kurla Complex Depot' },
  { lat: 19.0685, lng: 72.8640, name: 'BKC Western Connector' },
  { lat: 19.0600, lng: 72.8520, name: 'Kalanagar Junction' },
  { lat: 19.0520, lng: 72.8420, name: 'Bandra West Highway' },
  { lat: 19.0410, lng: 72.8360, name: 'Mahim Causeway Corridor' },
  { lat: 19.0280, lng: 72.8420, name: 'Dadar TT Transit' },
  { lat: 19.0150, lng: 72.8320, name: 'Prabhadevi Logistics Center' },
  { lat: 19.0020, lng: 72.8250, name: 'Lower Parel Delivery Hub' },
];

/**
 * Calculates distance in meters between two coordinates using Haversine formula.
 */
export function getDistanceMeters(lat1, lon1, lat2, lon2) {
  const R = 6371000; // Earth radius in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Calculates bearing/heading in degrees (0 to 360) from point 1 to point 2.
 */
export function getBearing(lat1, lon1, lat2, lon2) {
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const y = Math.sin(dLon) * Math.cos((lat2 * Math.PI) / 180);
  const x =
    Math.cos((lat1 * Math.PI) / 180) * Math.sin((lat2 * Math.PI) / 180) -
    Math.sin((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.cos(dLon);
  const brng = (Math.atan2(y, x) * 180) / Math.PI;
  return (brng + 360) % 360;
}

/**
 * Converts degrees into a readable cardinal compass direction.
 */
export function getCardinalDirection(degrees) {
  const directions = [
    'North',
    'North-East',
    'East',
    'South-East',
    'South',
    'South-West',
    'West',
    'North-West',
  ];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
}

/**
 * Linearly interpolates between two coordinates.
 */
export function interpolateCoordinates(p1, p2, ratio) {
  const clampedRatio = Math.max(0, Math.min(1, ratio));
  return {
    latitude: p1.lat + (p2.lat - p1.lat) * clampedRatio,
    longitude: p1.lng + (p2.lng - p1.lng) * clampedRatio,
  };
}

/**
 * Calculates dynamic urban speed (25 - 55 km/h).
 * Fluctuates smoothly; slows down if near a turn or intersection.
 */
export function getNextSimulatedSpeed(currentSpeed, isNearTurn = false) {
  const minSpeed = 25;
  const maxSpeed = 55;

  let next = currentSpeed || 38;

  if (isNearTurn) {
    // Decelerate smoothly for cornering (24 - 32 km/h)
    const targetTurnSpeed = 25 + Math.random() * 7;
    next = next * 0.75 + targetTurnSpeed * 0.25;
  } else {
    // Smooth natural driving jitter: -2.0 to +2.2 km/h per second
    const delta = (Math.random() - 0.48) * 3.6;
    next += delta;
  }

  return Math.round(Math.max(minSpeed, Math.min(maxSpeed, next)));
}
