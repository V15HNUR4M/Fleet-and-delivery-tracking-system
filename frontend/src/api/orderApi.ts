import axiosInstance from './axios';
import type {
  OrderAssignRequest,
  OrderRequest,
  OrderResponse,
  OrderStatus,
  OrderStatusUpdateRequest,
  PageResponse,
} from '../types';

export const orderApi = {
  getOrders: (
    status?: OrderStatus | '',
    driverId?: number,
    page = 0,
    size = 20
  ): Promise<PageResponse<OrderResponse>> => {
    const params: Record<string, string | number> = { page, size };
    if (status) params.status = status;
    if (driverId) params.driverId = driverId;
    return axiosInstance.get<PageResponse<OrderResponse>>('/orders', { params }).then((r) => r.data);
  },

  getOrder: (id: number): Promise<OrderResponse> =>
    axiosInstance.get<OrderResponse>(`/orders/${id}`).then((r) => r.data),

  // POST /orders — CUSTOMER role only (enforced by backend)
  createOrder: (data: OrderRequest): Promise<OrderResponse> =>
    axiosInstance.post<OrderResponse>('/orders', data).then((r) => r.data),

  // POST /orders/{id}/assign — authenticated (no role restriction in backend)
  assignOrder: (id: number, data: OrderAssignRequest): Promise<OrderResponse> =>
    axiosInstance.post<OrderResponse>(`/orders/${id}/assign`, data).then((r) => r.data),

  // PATCH /orders/{id}/status — ADMIN, DISPATCHER, DRIVER
  updateStatus: (id: number, data: OrderStatusUpdateRequest): Promise<OrderResponse> =>
    axiosInstance.patch<OrderResponse>(`/orders/${id}/status`, data).then((r) => r.data),
};
