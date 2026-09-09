import axiosInstance from './axios';

export const driverApi = {
  getDrivers: (availability = '', page = 0, size = 20) => {
    const params = { page, size };
    if (availability) params.availability = availability;
    return axiosInstance.get('/drivers', { params }).then((r) => r.data);
  },

  createDriver: (data) =>
    axiosInstance.post('/drivers', data).then((r) => r.data),

  updateAvailability: (id, data) =>
    axiosInstance
      .patch(`/drivers/${id}/availability`, data)
      .then((r) => r.data),
};
