import { api } from '../../api/client';

export const parametresApi = {
  mettreAJourProfil: (donnees) => api.put('/profil', donnees),
  changerMotDePasse: (donnees) => api.put('/mot-de-passe', donnees),
  deconnecterAutresAppareils: () => api.post('/deconnecter-autres-appareils'),
};
