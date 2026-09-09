// ─── Auth ───────────────────────────────────────────────────────────────────

export interface LoginRequest {
  mobile: string;
  otp: string;
}

export interface RegisterRequest {
  mobile: string;
  name: string;
  role: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  role: string;
  expiresIn: number;
}

export interface RegisterResponse {
  id: number;
  mobile: string;
  name: string;
  role: string;
}

// ─── User / Auth Context ─────────────────────────────────────────────────────

export type RoleType = 'ADMIN' | 'DISPATCHER' | 'DRIVER' | 'CUSTOMER';

export interface AuthUser {
  accessToken: string;
  refreshToken: string;
  role: RoleType;
  expiresIn: number;
}

// ─── Vehicle ─────────────────────────────────────────────────────────────────

export type VehicleStatus = 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE' | 'DECOMMISSIONED';

export interface VehicleRequest {
  regNumber: string;
  type: string;
  capacityKg: number;
  fuelType: string;
  status: VehicleStatus;
}

export interface VehicleResponse {
  id: number;
  regNumber: string;
  type: string;
  capacityKg: number;
  fuelType: string;
  status: VehicleStatus;
}

export interface VehicleStatusUpdateRequest {
  status: VehicleStatus;
}

// ─── Driver ──────────────────────────────────────────────────────────────────

export type DriverAvailability = 'OFF_DUTY' | 'AVAILABLE' | 'ON_DUTY' | 'BREAK';

export interface DriverRequest {
  name: string;
  mobile: string;
  licenseNumber: string;
  licenseExpiry: string; // ISO date string
}

export interface DriverResponse {
  id: number;
  name: string;
  mobile: string;
  licenseNumber: string;
  licenseExpiry: string; // LocalDate serialized
  availability: DriverAvailability;
  isSuspended: boolean;
}

export interface DriverAvailabilityUpdateRequest {
  availability: DriverAvailability;
}

// ─── Order ───────────────────────────────────────────────────────────────────

export type OrderStatus =
  | 'CREATED'
  | 'ASSIGNED'
  | 'PICKED_UP'
  | 'IN_TRANSIT'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'FAILED'
  | 'RE_ATTEMPT'
  | 'RTO';

export interface OrderStatusHistoryResponse {
  previousStatus: string | null;
  newStatus: string;
  changedBy: number;
  reason: string | null;
  changedAt: string; // LocalDateTime
}

export interface OrderRequest {
  pickupAddress: string;
  deliveryAddress: string;
  weightKg: number;
  codAmount: number;
  slaDeadline: string; // ISO datetime string
}

export interface OrderResponse {
  id: number;
  orderRef: string;
  customerId: number;
  pickupAddress: string;
  deliveryAddress: string;
  weightKg: number;
  codAmount: number;
  slaDeadline: string; // LocalDateTime
  status: OrderStatus;
  driverId: number | null;
  vehicleId: number | null;
  attemptCount: number;
  notes: string | null;
  statusHistory: OrderStatusHistoryResponse[];
}

export interface OrderAssignRequest {
  driverId: number | null;
  vehicleId: number | null;
}

export interface OrderStatusUpdateRequest {
  newStatus: OrderStatus;
  reason?: string;
}

// ─── Pagination ───────────────────────────────────────────────────────────────

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  page: number;
}

// ─── Location / Tracking ─────────────────────────────────────────────────────

export interface LocationRequest {
  driverId: number;
  orderId?: number;
  latitude: number;
  longitude: number;
}

export interface LocationResponse {
  id: number;
  latitude: number;
  longitude: number;
  recordedAt: string; // LocalDateTime
}

// ─── API Error ────────────────────────────────────────────────────────────────

export interface ApiError {
  type: string;
  title: string;
  status: number;
  detail: string;
  timestamp: string;
}
