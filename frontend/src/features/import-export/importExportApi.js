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

  exporter: (colonnes, masquerSensibles, commissionId) =>
    api.telecharger('/import-export/exporter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ colonnes, masquer_sensibles: masquerSensibles, commission_id: commissionId || null }),
    }),

  historique: () => api.get('/import-export/historique'),
};