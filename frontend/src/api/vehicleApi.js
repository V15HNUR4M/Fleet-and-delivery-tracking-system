import axiosInstance from './axios';

export const vehicleApi = {
  getVehicles: (status = '', page = 0, size = 20) => {
    const params = { page, size };
    if (status) params.status = status;
    return axiosInstance.get('/vehicles', { params }).then((r) => r.data);
  },

  createVehicle: (data) =>
    axiosInstance.post('/vehicles', data).then((r) => r.data),

  updateVehicle: (id, data) =>
    axiosInstance.put(`/vehicles/${id}`, data).then((r) => r.data),

  updateStatus: (id, data) =>
    axiosInstance.patch(`/vehicles/${id}/status`, data).then((r) => r.data),
};
