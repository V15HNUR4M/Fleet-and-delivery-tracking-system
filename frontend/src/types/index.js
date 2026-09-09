// ─── Enums / Constants for Entities ──────────────────────────────────────────

export const RoleType = {
  ADMIN: 'ADMIN',
  DISPATCHER: 'DISPATCHER',
  DRIVER: 'DRIVER',
  CUSTOMER: 'CUSTOMER',
};

export const VehicleStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  MAINTENANCE: 'MAINTENANCE',
  DECOMMISSIONED: 'DECOMMISSIONED',
};

export const DriverAvailability = {
  OFF_DUTY: 'OFF_DUTY',
  AVAILABLE: 'AVAILABLE',
  ON_DUTY: 'ON_DUTY',
  BREAK: 'BREAK',
};

export const OrderStatus = {
  CREATED: 'CREATED',
  ASSIGNED: 'ASSIGNED',
  PICKED_UP: 'PICKED_UP',
  IN_TRANSIT: 'IN_TRANSIT',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
  FAILED: 'FAILED',
  RE_ATTEMPT: 'RE_ATTEMPT',
  RTO: 'RTO',
};
