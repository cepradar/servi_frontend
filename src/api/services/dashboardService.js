import axiosClient from '../axiosClient';

const dashboardService = {
  getDashboard: () => axiosClient.get('/api/dashboard'),
  getConfig: (role) => role ? axiosClient.get(`/api/dashboard/config/${role}`) : axiosClient.get('/api/dashboard/config'),
  setConfig: (role, payload) => axiosClient.put(`/api/dashboard/config/${role}`, payload),
};

export default dashboardService;
