import api from '../utils/axios';

export const medicineApi = {
  add: async (appointmentId, data) => {
    const response = await api.post(`/prescriptions/${appointmentId}`, data);
    return response;
  },

  list: async () => {
    const response = await api.get('/prescriptions/my');
    return response;
  },
};
