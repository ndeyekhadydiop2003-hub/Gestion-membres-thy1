import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import LoginPage from './features/auth/LoginPage';
import AppLayout from './components/layout/AppLayout';
import DashboardPage from './features/dashboard/DashboardPage';
import MembresPage from './features/membres/MembresPage';
import GroupesPage from './features/groupes/GroupesPage';
import ProgrammesPage from './features/programmes/ProgrammesPage';
import ImportExportPage from './features/import-export/ImportExportPage';
import SecuriteRolesPage from './features/securite/SecuriteRolesPage';
import ActivationPage from './features/auth/ActivationPage';

function Contenu() {
  const { utilisateur, chargement } = useAuth();
  const [pageActive, setPageActive] = useState('dashboard');

  if (chargement) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500">
        Chargement...
      </div>
    );
  }

  if (!utilisateur) {
    return <LoginPage />;
  }

  return (
    <AppLayout pageActive={pageActive} onNaviguer={setPageActive}>
      {pageActive === 'dashboard'   && <DashboardPage />}
      {pageActive === 'membres'     && <MembresPage />}
      {pageActive === 'groupes'     && <GroupesPage />}
      {pageActive === 'programmes'  && <ProgrammesPage />}
      {pageActive === 'import-export' && <ImportExportPage />}
      {pageActive === 'securite' && <SecuriteRolesPage />}
    </AppLayout>
  );
}


export default function App() {
  const params = new URLSearchParams(window.location.search);
  const tokenActivation = params.get('activation');

  if (tokenActivation) {
    return (
      <ToastProvider>
        <ActivationPage token={tokenActivation} />
      </ToastProvider>
    );
  }

  return (
    <ToastProvider>
      <AuthProvider>
        <Contenu />
      </AuthProvider>
    </ToastProvider>
  );
}
