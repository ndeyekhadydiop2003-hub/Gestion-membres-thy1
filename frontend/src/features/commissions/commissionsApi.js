import { api } from '../../api/client';

export const commissionsApi = {
  lister: () => api.get('/commissions'),
  creer: (donnees) => api.post('/commissions', donnees),
  modifier: (id, donnees) => api.put(`/commissions/${id}`, donnees),
  supprimer: (id) => api.delete(`/commissions/${id}`),
  membres: (id) => api.get(`/commissions/${id}/membres`),
  ajouterMembre: (id, donnees) => api.post(`/commissions/${id}/membres`, donnees),
  // ✅ Nouvelles méthodes
  supprimerMembre: (commissionId, membreId) => api.delete(`/commissions/${commissionId}/membres/${membreId}`),
  modifierMembre: (membreId, donnees) => api.put(`/membres/${membreId}`, donnees),
};
