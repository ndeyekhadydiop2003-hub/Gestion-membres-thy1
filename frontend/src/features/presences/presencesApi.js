import { api } from '../../api/client';

export const presencesApi = {
  membresAvecPresence: (seanceId, recherche = '') =>
    api.get(`/seances/${seanceId}/membres-presence${recherche ? `?recherche=${encodeURIComponent(recherche)}` : ''}`),
  marquer: (seanceId, membreId, statut) =>
    api.post(`/seances/${seanceId}/presences/${membreId}`, { statut }),
  ajouterAutre: (seanceId, nomAutre, section, sexe) =>
    api.post(`/seances/${seanceId}/autres`, { nom_autre: nomAutre, section, sexe }),
  supprimerAutre: (seanceId, presenceId) =>
    api.delete(`/seances/${seanceId}/autres/${presenceId}`),
  seancesDuProgramme: (programmeId, page = 1) =>
    api.get(`/programmes/${programmeId}/seances?page=${page}`),
};
