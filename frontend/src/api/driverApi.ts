import axiosInstance from './axios';
import type {
  DriverAvailability,
  DriverAvailabilityUpdateRequest,
  DriverRequest,
  DriverResponse,
  PageResponse,
} from '../types';

export const driverApi = {
  getDrivers: (
    availability?: DriverAvailability | '',
    page = 0,
    size = 20
  ): Promise<PageResponse<DriverResponse>> => {
    const params: Record<string, string | number> = { page, size };
    if (availability) params.availability = availability;
    return axiosInstance.get<PageResponse<DriverResponse>>('/drivers', { params }).then((r) => r.data);
  },

  createDriver: (data: DriverRequest): Promise<DriverResponse> =>
    axiosInstance.post<DriverResponse>('/drivers', data).then((r) => r.data),

  updateAvailability: (id: number, data: DriverAvailabilityUpdateRequest): Promise<DriverResponse> =>
    axiosInstance
      .patch<DriverResponse>(`/drivers/${id}/availability`, data)
      .then((r) => r.data),
};
