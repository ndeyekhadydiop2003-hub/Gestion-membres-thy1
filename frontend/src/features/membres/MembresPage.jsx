import { useEffect, useState, useCallback } from 'react';
import { Search, Plus, Trash2, Pencil, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { membresApi } from './membresApi';
import { commissionsApi } from '../commissions/commissionsApi';
import MembreFormModal from './MembreFormModal';
import MembreDetailModal from './MembreDetailModal';
import { useAuth } from '../../context/AuthContext';

const ONGLETS = [
  { cle: '', label: 'Tous' },
  { cle: 'actif', label: 'Actifs' },
  { cle: 'en_attente', label: 'inactifs' },
  { cle: 'suspendu', label: 'Suspendus' },
];

export default function MembresPage() {
  const { estSuperAdmin } = useAuth();
  const [membres, setMembres] = useState([]);
  const [meta, setMeta] = useState(null);
  const [commissions, setCommissions] = useState([]);
  const [statutActif, setStatutActif] = useState('');
  const [commissionId, setCommissionId] = useState('');
  const [recherche, setRecherche] = useState('');
  const [page, setPage] = useState(1);
  const [chargement, setChargement] = useState(true);
  const [modalOuvert, setModalOuvert] = useState(false);
  const [membreEnEdition, setMembreEnEdition] = useState(null);
  const [membreDetailId, setMembreDetailId] = useState(null);

  const charger = useCallback(() => {
    setChargement(true);
    membresApi
      .lister({ statut: statutActif, commission_id: commissionId, recherche, page })
      .then((reponse) => {
        setMembres(reponse.data);
        setMeta(reponse.meta);
      })
      .finally(() => setChargement(false));
  }, [statutActif, commissionId, recherche, page]);

  useEffect(() => { charger(); }, [charger]);

  useEffect(() => {
    commissionsApi.lister().then((r) => setCommissions(r.data));
  }, []);

  useEffect(() => { setPage(1); }, [statutActif, commissionId, recherche]);

  const supprimer = async (membre) => {
    if (!confirm(`Supprimer ${membre.nom} ${membre.prenom} ?`)) return;
    await membresApi.supprimer(membre.id);
    charger();
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Membres</h1>
          <p className="text-slate-400 text-sm mt-1">{meta?.total ?? 0} membres enregistrés</p>
        </div>
        <button
          onClick={() => { setMembreEnEdition(null); setModalOuvert(true); }}
          className="flex items-center gap-2 bg-[#2c4f7c] text-white rounded-lg px-4 py-2.5 text-sm font-medium hover:opacity-90"
        >
          <Plus className="w-4 h-4" /> Nouveau membre
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-100 p-2 flex gap-1 w-fit">
        {ONGLETS.map((o) => (
          <button
            key={o.cle}
            onClick={() => setStatutActif(o.cle)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              statutActif === o.cle ? 'bg-[#2c4f7c] text-white' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>

      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            placeholder="Rechercher un membre..."
            className="w-full border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4f7c]/20"
          />
        </div>
        <select
          value={commissionId}
          onChange={(e) => setCommissionId(e.target.value)}
          className="border border-slate-200 rounded-lg px-4 py-2.5 text-sm"
        >
          <option value="">Toutes les commissions</option>
          {commissions.map((c) => <option key={c.id} value={c.id}>{c.nom}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-400 text-xs uppercase border-b border-slate-100 bg-slate-50">
              <th className="px-5 py-3 font-medium">Membre</th>
              <th className="px-5 py-3 font-medium">Profession</th>
              <th className="px-5 py-3 font-medium">Téléphone</th>
              <th className="px-5 py-3 font-medium">Adhésion</th>
              <th className="px-5 py-3 font-medium">Statut</th>
              <th className="px-5 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {chargement ? (
              <tr><td colSpan={6} className="px-5 py-8 text-center text-slate-400">Chargement...</td></tr>
            ) : membres.length === 0 ? (
              <tr><td colSpan={6} className="px-5 py-8 text-center text-slate-400">Aucun membre trouvé.</td></tr>
            ) : (
              membres.map((m) => (
                <tr key={m.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#2c4f7c]/10 flex items-center justify-center text-xs font-medium text-[#2c4f7c] overflow-hidden shrink-0">
                        {m.photo_url ? <img src={m.photo_url} alt="" className="w-full h-full object-cover" /> : `${m.nom?.[0] ?? ''}${m.prenom?.[0] ?? ''}`}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{m.nom} {m.prenom}</p>
                        <p className="text-slate-400 text-xs">{m.identifiant}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-slate-600">{m.profession || '—'}</td>
                  <td className="px-5 py-3 text-slate-600">{m.telephone || '—'}</td>
                  <td className="px-5 py-3 text-slate-600">{m.date_adhesion}</td>
                  <td className="px-5 py-3">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                    m.statut === 'actif' ? 'bg-green-50 text-green-700' : m.statut === 'inactif' ? 'bg-slate-100 text-slate-600' : 'bg-red-50 text-red-700'
                    }`}>
                    {m.statut === 'actif' ? 'Actif' : m.statut === 'inactif' ? 'Inactif' : 'Suspendu'}
                  </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => setMembreDetailId(m.id)} className="text-slate-400 hover:text-[#2c4f7c]" title="Voir la fiche">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button onClick={() => { setMembreEnEdition(m); setModalOuvert(true); }} className="text-slate-400 hover:text-[#2c4f7c]" title="Modifier">
                        <Pencil className="w-4 h-4" />
                      </button>
                      {estSuperAdmin && (
                        <button onClick={() => supprimer(m)} className="text-slate-400 hover:text-red-600" title="Supprimer">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {meta && meta.last_page > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100">
            <p className="text-xs text-slate-400">Page {meta.current_page} sur {meta.last_page}</p>
            <div className="flex gap-2">
              <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-40">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button disabled={page >= meta.last_page} onClick={() => setPage((p) => p + 1)} className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-40">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {modalOuvert && (
        <MembreFormModal
          membre={membreEnEdition}
          commissions={commissions}
          onFermer={() => setModalOuvert(false)}
          onEnregistre={() => { setModalOuvert(false); charger(); }}
        />
      )}

      {membreDetailId && (
        <MembreDetailModal membreId={membreDetailId} onFermer={() => setMembreDetailId(null)} />
      )}
    </div>
  );
}
