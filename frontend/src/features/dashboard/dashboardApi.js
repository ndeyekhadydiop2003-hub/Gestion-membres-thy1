import { api } from '../../api/client';

export const dashboardApi = {
  statistiques: () => api.get('/dashboard/statistiques'),
};