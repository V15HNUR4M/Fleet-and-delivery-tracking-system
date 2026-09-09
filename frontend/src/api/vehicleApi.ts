import axiosInstance from './axios';
import type {
  PageResponse,
  VehicleRequest,
  VehicleResponse,
  VehicleStatus,
  VehicleStatusUpdateRequest,
} from '../types';

export const vehicleApi = {
  getVehicles: (
    status?: VehicleStatus | '',
    page = 0,
    size = 20
  ): Promise<PageResponse<VehicleResponse>> => {
    const params: Record<string, string | number> = { page, size };
    if (status) params.status = status;
    return axiosInstance.get<PageResponse<VehicleResponse>>('/vehicles', { params }).then((r) => r.data);
  },

  createVehicle: (data: VehicleRequest): Promise<VehicleResponse> =>
    axiosInstance.post<VehicleResponse>('/vehicles', data).then((r) => r.data),

  updateVehicle: (id: number, data: VehicleRequest): Promise<VehicleResponse> =>
    axiosInstance.put<VehicleResponse>(`/vehicles/${id}`, data).then((r) => r.data),

  updateStatus: (id: number, data: VehicleStatusUpdateRequest): Promise<VehicleResponse> =>
    axiosInstance.patch<VehicleResponse>(`/vehicles/${id}/status`, data).then((r) => r.data),
};
