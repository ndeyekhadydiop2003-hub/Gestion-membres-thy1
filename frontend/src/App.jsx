import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './features/auth/LoginPage';
import AppLayout from './components/layout/AppLayout';
import DashboardPage from './features/dashboard/DashboardPage';
import MembresPage from './features/membres/MembresPage';
import GroupesPage from './features/groupes/GroupesPage';

function Contenu() {
  const { utilisateur, chargement } = useAuth();
  const [pageActive, setPageActive] = useState('dashboard');

  if (chargement) {
    return <div className="min-h-screen flex items-center justify-center text-slate-500">Chargement...</div>;
  }

  if (!utilisateur) {
    return <LoginPage />;
  }

  return (
    <AppLayout pageActive={pageActive} onNaviguer={setPageActive}>
      {pageActive === 'dashboard' && <DashboardPage />}
      {pageActive === 'membres' && <MembresPage />}
      {pageActive === 'groupes' && <GroupesPage />}
      {!['dashboard', 'membres', 'groupes'].includes(pageActive) && (
        <div className="p-8">
          <h1 className="text-2xl font-bold text-slate-900">Page : {pageActive}</h1>
          <p className="text-slate-500 mt-2">Cette page sera construite ensuite.</p>
        </div>
      )}
    </AppLayout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Contenu />
    </AuthProvider>
  );
}