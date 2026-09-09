// ─── Routes ──────────────────────────────────────────────────────────────────

export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/',
  VEHICLES: '/vehicles',
  DRIVERS: '/drivers',
  ORDERS: '/orders',
  ORDER_DETAIL: '/orders/:id',
  DISPATCH: '/dispatch',
  TRACKING: '/tracking',
  ANALYTICS: '/analytics',
  ADMIN: '/admin',
};

// ─── Enums (mirroring backend exactly) ───────────────────────────────────────

export const VEHICLE_STATUSES = [
  'ACTIVE',
  'INACTIVE',
  'MAINTENANCE',
  'DECOMMISSIONED',
];

export const VEHICLE_TYPES = ['BIKE', 'TRUCK', 'VAN', 'TEMPO', 'CAR'];

export const FUEL_TYPES = ['PETROL', 'DIESEL', 'CNG', 'ELECTRIC', 'HYBRID'];

export const DRIVER_AVAILABILITIES = [
  'AVAILABLE',
  'ON_DUTY',
  'BREAK',
  'OFF_DUTY',
];

export const ORDER_STATUSES = [
  'CREATED',
  'ASSIGNED',
  'PICKED_UP',
  'IN_TRANSIT',
  'DELIVERED',
  'CANCELLED',
  'FAILED',
  'RE_ATTEMPT',
  'RTO',
];

export const ROLES = ['ADMIN', 'DISPATCHER', 'DRIVER', 'CUSTOMER'];

// ─── Status Colours ───────────────────────────────────────────────────────────

export const ORDER_STATUS_COLORS = {
  CREATED: '#6B7280',
  ASSIGNED: '#3B82F6',
  PICKED_UP: '#8B5CF6',
  IN_TRANSIT: '#F59E0B',
  DELIVERED: '#10B981',
  CANCELLED: '#EF4444',
  FAILED: '#DC2626',
  RE_ATTEMPT: '#F97316',
  RTO: '#EC4899',
};

export const ORDER_STATUS_BG = {
  CREATED: 'status-badge--created',
  ASSIGNED: 'status-badge--assigned',
  PICKED_UP: 'status-badge--picked-up',
  IN_TRANSIT: 'status-badge--in-transit',
  DELIVERED: 'status-badge--delivered',
  CANCELLED: 'status-badge--cancelled',
  FAILED: 'status-badge--failed',
  RE_ATTEMPT: 'status-badge--re-attempt',
  RTO: 'status-badge--rto',
};

export const VEHICLE_STATUS_BG = {
  ACTIVE: 'status-badge--delivered',
  INACTIVE: 'status-badge--created',
  MAINTENANCE: 'status-badge--in-transit',
  DECOMMISSIONED: 'status-badge--cancelled',
};

export const DRIVER_AVAILABILITY_BG = {
  AVAILABLE: 'status-badge--delivered',
  ON_DUTY: 'status-badge--assigned',
  BREAK: 'status-badge--in-transit',
  OFF_DUTY: 'status-badge--created',
};

// ─── Role nav visibility ──────────────────────────────────────────────────────

export const ROLE_NAV_ACCESS = {
  ADMIN: ['dashboard', 'vehicles', 'drivers', 'orders', 'dispatch', 'tracking', 'analytics', 'admin'],
  DISPATCHER: ['dashboard', 'vehicles', 'drivers', 'orders', 'dispatch', 'tracking', 'analytics'],
  DRIVER: ['orders', 'tracking'],
  CUSTOMER: ['orders'],
};
