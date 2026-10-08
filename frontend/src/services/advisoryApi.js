import api from './api';

export const advisoryApi = {
  createAdvisory: async (data) => {
    const response = await api.post('/advisories', data);
    return response.data;
  },

  getAdvisories: async (params = {}) => {
    const response = await api.get('/advisories', { params });
    return response.data;
  },

  getAdvisoryById: async (id) => {
    const response = await api.get(`/advisories/${id}`);
    return response.data;
  },

  deleteAdvisory: async (id) => {
    const response = await api.delete(`/advisories/${id}`);
    return response.data;
  },

  getAdvisoryAgents: async (id) => {
    const response = await api.get(`/advisories/${id}/agents`);
    return response.data;
  },
};
