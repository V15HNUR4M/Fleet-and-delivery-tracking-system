import { useCallback, useEffect, useRef, useState } from 'react';
import {
  CHENNAI_DELIVERY_ROUTE,
  getBearing,
  getCardinalDirection,
  getDistanceMeters,
  getNextSimulatedSpeed,
  interpolateCoordinates,
} from './simulatedRouteUtils';

/**
 * Custom hook providing a realistic, physics-grounded live driver tracking simulation.
 * Continuous road waypoint progression, smooth interpolation, dynamic speed,
 * breadcrumb tracking, and strict cleanup without memory leaks.
 */
export const useSimulatedTracking = (options = {}) => {
  const {
    route = CHENNAI_DELIVERY_ROUTE,
    updateIntervalMs = 800,
    initialSpeed = 38,
    autoStart = true,
  } = options;

  const [isPlaying, setIsPlaying] = useState(autoStart);
  const [followDriver, setFollowDriver] = useState(true);
  const [multiplier, setMultiplier] = useState(1); // 1x or 2x demo speed

  // Initial calculations
  const initialPoint = route[0] || { lat: 13.0827, lng: 80.2707 };
  const nextPoint = route[1] || initialPoint;
  const initialBearing = getBearing(
    initialPoint.lat,
    initialPoint.lng,
    nextPoint.lat,
    nextPoint.lng
  );

  const [currentPosition, setCurrentPosition] = useState({
    latitude: initialPoint.lat,
    longitude: initialPoint.lng,
  });
  const [speed, setSpeed] = useState(initialSpeed);
  const [heading, setHeading] = useState(Math.round(initialBearing));
  const [cardinalHeading, setCardinalHeading] = useState(
    getCardinalDirection(initialBearing)
  );
  const [lastUpdated, setLastUpdated] = useState(() => new Date());
  const [trail, setTrail] = useState([
    [initialPoint.lat, initialPoint.lng],
  ]);
  const [routeProgress, setRouteProgress] = useState(0);
  const [distanceCoveredKm, setDistanceCoveredKm] = useState(0);

  // Internal mutable simulation state tracked via Ref to prevent interval re-instantiation
  const simStateRef = useRef({
    waypointIndex: 0,
    direction: 1, // 1 for forward, -1 for reverse
    segmentDistanceTraveled: 0,
    totalDistanceTraveledMeters: 0,
    currentSpeed: initialSpeed,
    currentHeading: Math.round(initialBearing),
    lastTickTime: 0,
  });

  const intervalIdRef = useRef(null);

  const reset = useCallback(() => {
    const p0 = route[0] || { lat: 13.0827, lng: 80.2707 };
    const p1 = route[1] || p0;
    const brng = Math.round(getBearing(p0.lat, p0.lng, p1.lat, p1.lng));

    simStateRef.current = {
      waypointIndex: 0,
      direction: 1,
      segmentDistanceTraveled: 0,
      totalDistanceTraveledMeters: 0,
      currentSpeed: initialSpeed,
      currentHeading: brng,
      lastTickTime: 0,
    };

    setCurrentPosition({ latitude: p0.lat, longitude: p0.lng });
    setSpeed(initialSpeed);
    setHeading(brng);
    setCardinalHeading(getCardinalDirection(brng));
    setLastUpdated(new Date());
    setTrail([[p0.lat, p0.lng]]);
    setRouteProgress(0);
    setDistanceCoveredKm(0);
  }, [route, initialSpeed]);

  const togglePlay = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  const pause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const resume = useCallback(() => {
    setIsPlaying(true);
  }, []);

  const toggleFollowDriver = useCallback(() => {
    setFollowDriver((prev) => !prev);
  }, []);

  // Main simulation loop
  useEffect(() => {
    if (!isPlaying || !route || route.length < 2) {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
      }
      return;
    }

    simStateRef.current.lastTickTime = Date.now();

    const tick = () => {
      const now = Date.now();
      const lastTick = simStateRef.current.lastTickTime || now;
      const deltaSec = Math.max(0.2, Math.min(2.0, (now - lastTick) / 1000));
      simStateRef.current.lastTickTime = now;

      const state = simStateRef.current;
      const totalWaypoints = route.length;

      // Current segment waypoints
      const fromIndex = state.waypointIndex;
      const toIndex = fromIndex + state.direction;

      const pFrom = route[fromIndex];
      const pTo = route[toIndex];

      if (!pFrom || !pTo) {
        // Reverse if out of bounds
        state.direction *= -1;
        state.segmentDistanceTraveled = 0;
        return;
      }

      const segmentTotalDistance = Math.max(1, getDistanceMeters(pFrom.lat, pFrom.lng, pTo.lat, pTo.lng));
      const isNearTurn = state.segmentDistanceTraveled / segmentTotalDistance > 0.75;

      // Calculate next dynamic speed
      const nextSpeed = getNextSimulatedSpeed(state.currentSpeed, isNearTurn);
      state.currentSpeed = nextSpeed;

      // Calculate distance traveled in meters
      const speedMps = (nextSpeed * 1000) / 3600;
      const distanceStep = speedMps * deltaSec * multiplier;

      state.segmentDistanceTraveled += distanceStep;
      state.totalDistanceTraveledMeters += distanceStep;

      // Check if vehicle reached or passed next waypoint
      while (state.segmentDistanceTraveled >= segmentTotalDistance) {
        state.segmentDistanceTraveled -= segmentTotalDistance;
        state.waypointIndex += state.direction;

        // Turn around at endpoints
        if (state.direction === 1 && state.waypointIndex >= totalWaypoints - 1) {
          state.waypointIndex = totalWaypoints - 1;
          state.direction = -1;
          state.segmentDistanceTraveled = 0;
          break;
        } else if (state.direction === -1 && state.waypointIndex <= 0) {
          state.waypointIndex = 0;
          state.direction = 1;
          state.segmentDistanceTraveled = 0;
          break;
        }
      }

      // Re-evaluate segment after possible waypoint change
      const curFrom = route[state.waypointIndex];
      const curTo = route[state.waypointIndex + state.direction];

      let newLat = curFrom.lat;
      let newLng = curFrom.lng;
      let curBearing = state.currentHeading;

      if (curTo) {
        const curSegLen = Math.max(1, getDistanceMeters(curFrom.lat, curFrom.lng, curTo.lat, curTo.lng));
        const ratio = Math.min(1, Math.max(0, state.segmentDistanceTraveled / curSegLen));
        const interpolated = interpolateCoordinates(curFrom, curTo, ratio);
        newLat = interpolated.latitude;
        newLng = interpolated.longitude;
        curBearing = Math.round(getBearing(curFrom.lat, curFrom.lng, curTo.lat, curTo.lng));
      }

      state.currentHeading = curBearing;

      // Overall route percentage
      const totalRouteSegments = totalWaypoints - 1;
      const currentSegmentFraction = state.direction === 1
        ? state.waypointIndex / totalRouteSegments
        : (totalWaypoints - 1 - state.waypointIndex) / totalRouteSegments;
      const progressPercent = Math.round(Math.min(100, Math.max(0, currentSegmentFraction * 100)));

      // Update state
      setCurrentPosition({ latitude: newLat, longitude: newLng });
      setSpeed(nextSpeed);
      setHeading(curBearing);
      setCardinalHeading(getCardinalDirection(curBearing));
      setLastUpdated(new Date());
      setRouteProgress(progressPercent);
      setDistanceCoveredKm(parseFloat((state.totalDistanceTraveledMeters / 1000).toFixed(2)));

      setTrail((prevTrail) => {
        const lastPoint = prevTrail[prevTrail.length - 1];
        if (!lastPoint) return [[newLat, newLng]];
        const distFromLast = getDistanceMeters(lastPoint[0], lastPoint[1], newLat, newLng);
        // Only append point if moved at least 8 meters
        if (distFromLast >= 8) {
          const updated = [...prevTrail, [newLat, newLng]];
          // Cap trail to 120 points to prevent browser memory issues
          return updated.length > 120 ? updated.slice(updated.length - 120) : updated;
        }
        return prevTrail;
      });
    };

    intervalIdRef.current = setInterval(tick, updateIntervalMs);

    return () => {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
      }
    };
  }, [isPlaying, route, updateIntervalMs, multiplier]);

  return {
    currentPosition,
    speed,
    heading,
    cardinalHeading,
    lastUpdated,
    isPlaying,
    followDriver,
    multiplier,
    trail,
    routeProgress,
    distanceCoveredKm,
    routeWaypoints: route,
    start: resume,
    pause,
    togglePlay,
    reset,
    setFollowDriver,
    toggleFollowDriver,
    setMultiplier,
  };
};
