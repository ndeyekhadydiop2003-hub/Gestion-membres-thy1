import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [utilisateur, setUtilisateur] = useState(null);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setChargement(false);
      return;
    }

    api
      .get('/moi')
      .then(setUtilisateur)
      .catch(() => localStorage.removeItem('token'))
      .finally(() => setChargement(false));
  }, []);

  const connecter = (donneesUtilisateur, token) => {
    localStorage.setItem('token', token);
    setUtilisateur(donneesUtilisateur);
  };

  const deconnecter = async () => {
    try {
      await api.post('/logout');
    } catch {
      // on déconnecte localement même si l'appel échoue
    }
    localStorage.removeItem('token');
    setUtilisateur(null);
  };

  const estSuperAdmin = utilisateur?.role === 'super_admin';

  return (
    <AuthContext.Provider value={{ utilisateur, chargement, connecter, deconnecter, estSuperAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const contexte = useContext(AuthContext);
  if (!contexte) throw new Error('useAuth doit être utilisé dans un AuthProvider');
  return contexte;
}