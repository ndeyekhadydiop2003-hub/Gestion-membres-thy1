import { api } from '../../api/client';

export const groupesApi = {
  lister: () => api.get('/groupes'),
  creer: (donnees) => api.post('/groupes', donnees),
  modifier: (id, donnees) => api.put(`/groupes/${id}`, donnees),
  supprimer: (id) => api.delete(`/groupes/${id}`),
  membres: (id) => api.get(`/groupes/${id}/membres`),
  ajouterMembre: (id, donnees) => api.post(`/groupes/${id}/membres`, donnees),
  // ✅ Nouvelles méthodes
  supprimerMembre: (groupeId, membreId) => api.delete(`/groupes/${groupeId}/membres/${membreId}`),
  modifierMembre: (membreId, donnees) => api.put(`/membres/${membreId}`, donnees),
};