import { api } from '../../api/client';

export const programmesApi = {
  lister: () => api.get('/programmes'),
  obtenir: (id) => api.get(`/programmes/${id}`),
  creer: (donnees) => api.post('/programmes', donnees),
  modifier: (id, donnees) => api.put(`/programmes/${id}`, donnees),
  supprimer: (id) => api.delete(`/programmes/${id}`),
  obtenirSeance: (id) => api.get(`/seances/${id}`),
};


export const seancesApi = {
  creer: (donnees) => api.post('/seances', donnees),
  modifier: (id, donnees) => api.put(`/seances/${id}`, donnees),
  supprimer: (id) => api.delete(`/seances/${id}`),
};