import api from '../utils/axios';

export const clinicApi = {
  getInfo: async () => {
    const response = await api.get('/admin/clinic');
    return response;
  },

  getUsers: async () => {
    const response = await api.get('/admin/users');
    return response;
  },

  createUser: async (data) => {
    const response = await api.post('/admin/users', data);
    return response;
  },
};
