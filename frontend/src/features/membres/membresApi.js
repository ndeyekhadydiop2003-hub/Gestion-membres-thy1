import { api } from '../../api/client';

export const membresApi = {
  lister: (params = {}) => {
    const query = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v !== '' && v !== undefined && v !== null)
    ).toString();
    return api.get(`/membres${query ? `?${query}` : ''}`);
  },

  obtenir: (id) => api.get(`/membres/${id}`),

  creer: (donnees) => {
    const formData = construireFormData(donnees);
    return api.post('/membres', formData);
  },

  modifier: (id, donnees) => {
    const formData = construireFormData(donnees);
    formData.append('_method', 'PUT'); // spoofing nécessaire pour multipart + Laravel
    return api.post(`/membres/${id}`, formData);
  },

  supprimer: (id) => api.delete(`/membres/${id}`),
};

function construireFormData(donnees) {
  const formData = new FormData();
  Object.entries(donnees).forEach(([cle, valeur]) => {
    if (valeur !== undefined && valeur !== null && valeur !== '') {
      formData.append(cle, valeur);
    }
  });
  return formData;
}