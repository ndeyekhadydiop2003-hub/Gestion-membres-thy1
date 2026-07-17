import { api } from '../../api/client';

export const securiteApi = {
  listerUtilisateurs: () => api.get('/utilisateurs'),
  creerUtilisateur: (donnees) => api.post('/utilisateurs', donnees),
  supprimerUtilisateur: (id) => api.delete(`/utilisateurs/${id}`),
  journalActivite: (page = 1) => api.get(`/journal-activite?page=${page}`),
};