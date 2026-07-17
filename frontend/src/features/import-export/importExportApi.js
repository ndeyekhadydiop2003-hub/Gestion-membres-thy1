import { api } from '../../api/client';

export const importExportApi = {
  importerMembres: (fichier) => {
    const formData = new FormData();
    formData.append('fichier', fichier);
    return api.post('/import-export/importer', formData);
  },

  importerProgrammes: (fichier) => {
    const formData = new FormData();
    formData.append('fichier', fichier);
    return api.post('/import-export/importer-programmes', formData);
  },

  exporter: (colonnes, masquerSensibles, groupeId) =>
    api.telecharger('/import-export/exporter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ colonnes, masquer_sensibles: masquerSensibles, groupe_id: groupeId || null }),
    }),

  historique: () => api.get('/import-export/historique'),
};