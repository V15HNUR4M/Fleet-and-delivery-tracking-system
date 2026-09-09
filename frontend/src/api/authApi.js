import axiosInstance from './axios';

export const authApi = {
  login: (data) =>
    axiosInstance.post('/auth/login', data).then((r) => r.data),

  register: (data) =>
    axiosInstance.post('/auth/register', data).then((r) => r.data),
};
