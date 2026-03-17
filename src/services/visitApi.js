import api from '../utils/axios';

export const visitApi = {
  getDaily: async (date) => {
    const response = await api.get(`/queue?date=${date}`);
    return response;
  },

  updateStatus: async (queueId, data) => {
    const response = await api.patch(`/queue/${queueId}`, data);
    return response;
  },

  getToday: async () => {
    const response = await api.get('/doctor/queue');
    return response;
  },
};
