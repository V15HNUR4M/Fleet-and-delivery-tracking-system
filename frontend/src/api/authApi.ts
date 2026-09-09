import axiosInstance from './axios';
import type { AuthResponse, LoginRequest, RegisterRequest, RegisterResponse } from '../types';

export const authApi = {
  login: (data: LoginRequest): Promise<AuthResponse> =>
    axiosInstance.post<AuthResponse>('/auth/login', data).then((r) => r.data),

  register: (data: RegisterRequest): Promise<RegisterResponse> =>
    axiosInstance.post<RegisterResponse>('/auth/register', data).then((r) => r.data),
};
