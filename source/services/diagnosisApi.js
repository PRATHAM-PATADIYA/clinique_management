import api from '../utils/axios';

export const diagnosisApi = {
  add: async (appointmentId, data) => {
    const response = await api.post(`/reports/${appointmentId}`, data);
    return response;
  },

  list: async () => {
    const response = await api.get('/reports/my');
    return response;
  },
};
