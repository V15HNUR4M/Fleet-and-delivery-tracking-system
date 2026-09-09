import axiosInstance from './axios';

export const orderApi = {
  getOrders: (status = '', driverId, page = 0, size = 20) => {
    const params = { page, size };
    if (status) params.status = status;
    if (driverId) params.driverId = driverId;
    return axiosInstance.get('/orders', { params }).then((r) => r.data);
  },

  getOrder: (id) =>
    axiosInstance.get(`/orders/${id}`).then((r) => r.data),

  // POST /orders — CUSTOMER role only (enforced by backend)
  createOrder: (data) =>
    axiosInstance.post('/orders', data).then((r) => r.data),

  // POST /orders/{id}/assign — authenticated (no role restriction in backend)
  assignOrder: (id, data) =>
    axiosInstance.post(`/orders/${id}/assign`, data).then((r) => r.data),

  // PATCH /orders/{id}/status — ADMIN, DISPATCHER, DRIVER
  updateStatus: (id, data) =>
    axiosInstance.patch(`/orders/${id}/status`, data).then((r) => r.data),
};
