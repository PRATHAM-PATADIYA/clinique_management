import api from '../utils/axios';

export const bookingApi = {
  create: async (data) => {
    const response = await api.post('/appointments', data);
    return response;
  },

  list: async () => {
    const response = await api.get('/appointments/my');
    return response;
  },

  getOne: async (id) => {
    const response = await api.get(`/appointments/${id}`);
    return response;
  },
};
