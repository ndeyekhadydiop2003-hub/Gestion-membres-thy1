const BASE_URL = 'http://localhost:8000/api/v1';

async function requete(endpoint, options = {}) {
  const token = localStorage.getItem('token');

  const reponse = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      Accept: 'application/json',
      ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (reponse.status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/';
    throw new Error('Session expirée.');
  }

  const contentType = reponse.headers.get('content-type');
  const donnees = contentType?.includes('application/json') ? await reponse.json() : null;

  if (!reponse.ok) {
    const erreur = new Error(donnees?.message || 'Une erreur est survenue.');
    erreur.donnees = donnees;
    erreur.statut = reponse.status;
    throw erreur;
  }

  return donnees;
}

export const api = {
  get: (endpoint) => requete(endpoint, { method: 'GET' }),
  post: (endpoint, body) =>
    requete(endpoint, {
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
  put: (endpoint, body) =>
    requete(endpoint, {
      method: 'PUT',
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
  delete: (endpoint) => requete(endpoint, { method: 'DELETE' }),

  // Pour les exports de fichiers (retourne un blob, pas du JSON)
  telecharger: async (endpoint, options = {}) => {
    const token = localStorage.getItem('token');
    const reponse = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        Accept: '*/*',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
      },
    });
    if (!reponse.ok) throw new Error('Échec du téléchargement.');
    return reponse.blob();
  },
};