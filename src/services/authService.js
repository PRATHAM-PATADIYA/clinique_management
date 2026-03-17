import api from '../utils/axios';

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', {
      email: email,
      password: password,
    });
    return response.data;
  },
};
