import { useEffect, useState } from 'react';
import { Plus, Trash2, ShieldCheck, Shield, Clock } from 'lucide-react';
import { securiteApi } from './securiteApi';
import NouvelAdminModal from './NouvelAdminModal';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function SecuriteRolesPage() {
  const { utilisateur } = useAuth();
  const { showToast } = useToast();
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [logs, setLogs] = useState([]);
  const [onglet, setOnglet] = useState('comptes');
  const [modalOuvert, setModalOuvert] = useState(false);
  const [chargement, setChargement] = useState(true);

  const chargerUtilisateurs = () => {
    setChargement(true);
    securiteApi.listerUtilisateurs().then((r) => setUtilisateurs(r.data)).finally(() => setChargement(false));
  };

  const chargerLogs = () => {
    securiteApi.journalActivite().then((r) => setLogs(r.data || []));
  };

  useEffect(() => {
    chargerUtilisateurs();
    chargerLogs();
  }, []);

  const supprimer = async (user) => {
    if (!confirm(`Supprimer le compte de ${user.nom} ?`)) return;
    try {
      await securiteApi.supprimerUtilisateur(user.id);
      showToast('Compte supprimé avec succès.');
      chargerUtilisateurs();
    } catch (err) {
      showToast(err.donnees?.message || err.message, 'error');
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <p className="text-xs font-medium text-[#2c4f7c] uppercase tracking-wide">Administration</p>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">Sécurité & rôles</h1>
          <p className="text-slate-400 text-sm mt-1">Gérez les comptes administrateurs et consultez le journal d'activité.</p>
        </div>
        {onglet === 'comptes' && (
          <button
            onClick={() => setModalOuvert(true)}
            className="flex items-center gap-2 bg-[#2c4f7c] text-white rounded-lg px-4 py-2.5 text-sm font-medium hover:opacity-90"
          >
            <Plus className="w-4 h-4" /> Nouveau compte
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl border border-slate-100 p-2 flex gap-1 w-fit">
        <button
          onClick={() => setOnglet('comptes')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${onglet === 'comptes' ? 'bg-[#2c4f7c] text-white' : 'text-slate-600 hover:bg-slate-50'}`}
        >
          Comptes admin
        </button>
        <button
          onClick={() => setOnglet('activite')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${onglet === 'activite' ? 'bg-[#2c4f7c] text-white' : 'text-slate-600 hover:bg-slate-50'}`}
        >
          Journal d'activité
        </button>
      </div>

      {onglet === 'comptes' ? (
        <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 text-xs uppercase border-b border-slate-100 bg-slate-50">
                <th className="px-5 py-3 font-medium">Nom</th>
                <th className="px-5 py-3 font-medium">Email</th>
                <th className="px-5 py-3 font-medium">Rôle</th>
                <th className="px-5 py-3 font-medium">Dernière connexion</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {chargement ? (
                <tr><td colSpan={5} className="px-5 py-8 text-center text-slate-400">Chargement...</td></tr>
              ) : (
                utilisateurs.map((u) => (
                  <tr key={u.id} className="border-b border-slate-50 last:border-0">
                    <td className="px-5 py-3 font-medium text-slate-900">{u.nom}</td>
                    <td className="px-5 py-3 text-slate-600">{u.email}</td>
                    <td className="px-5 py-3">
                      <span className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full w-fit ${
                        u.role === 'super_admin' ? 'bg-[#2c4f7c]/10 text-[#2c4f7c]' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {u.role === 'super_admin' ? <ShieldCheck className="w-3.5 h-3.5" /> : <Shield className="w-3.5 h-3.5" />}
                        {u.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-slate-500">{u.derniere_connexion || 'Jamais connecté'}</td>
                    <td className="px-5 py-3">
                      {u.id !== utilisateur.id && (
                        <div className="flex justify-end">
                          <button onClick={() => supprimer(u)} className="text-slate-400 hover:text-red-600 p-1.5">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
          {logs.length === 0 ? (
            <p className="text-sm text-slate-400 px-6 py-8 text-center">Aucune activité enregistrée.</p>
          ) : (
            <ul className="divide-y divide-slate-50">
              {logs.map((log) => (
                <li key={log.id} className="flex items-center gap-3 px-6 py-3">
                  <Clock className="w-4 h-4 text-slate-300 shrink-0" />
                  <p className="text-sm text-slate-700 flex-1">
                    <span className="font-medium">{log.utilisateur}</span> {log.action}
                  </p>
                  <span className="text-xs text-slate-400">{log.cree_le}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {modalOuvert && (
        <NouvelAdminModal
          onFermer={() => setModalOuvert(false)}
          onEnregistre={chargerUtilisateurs}
        />
      )}
    </div>
  );
}