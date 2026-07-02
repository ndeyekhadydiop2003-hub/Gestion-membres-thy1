import { useEffect, useState, useCallback } from 'react';
import { Plus, Pencil, Trash2, Users } from 'lucide-react';
import { groupesApi } from './groupesApi';
import GroupeFormModal from './GroupeFormModal';
import GroupeMembresModal from './GroupeMembresModal';
import { useAuth } from '../../context/AuthContext';

export default function GroupesPage() {
  const { estSuperAdmin } = useAuth();
  const [groupes, setGroupes] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [modalOuvert, setModalOuvert] = useState(false);
  const [groupeEnEdition, setGroupeEnEdition] = useState(null);
  const [groupeSelectionne, setGroupeSelectionne] = useState(null);

  const charger = useCallback(() => {
    setChargement(true);
    groupesApi.lister().then((r) => setGroupes(r.data)).finally(() => setChargement(false));
  }, []);

  useEffect(() => { charger(); }, [charger]);

  const supprimer = async (e, groupe) => {
    e.stopPropagation();
    if (!confirm(`Supprimer le groupe "${groupe.nom}" ?`)) return;
    try {
      await groupesApi.supprimer(groupe.id);
      charger();
    } catch (err) { alert(err.message); }
  };

  const modifier = (e, groupe) => {
    e.stopPropagation();
    setGroupeEnEdition(groupe);
    setModalOuvert(true);
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Groupes</h1>
          <p className="text-slate-400 text-sm mt-1">Segmenter les membres pour la communication et le suivi.</p>
        </div>
        {estSuperAdmin && (
          <button
            onClick={() => { setGroupeEnEdition(null); setModalOuvert(true); }}
            className="flex items-center gap-2 bg-[#2c4f7c] text-white rounded-lg px-4 py-2.5 text-sm font-medium hover:opacity-90"
          >
            <Plus className="w-4 h-4" /> Nouveau groupe
          </button>
        )}
      </div>

      {/* Grille */}
      {chargement ? (
        <p className="text-slate-400 text-sm">Chargement...</p>
      ) : groupes.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-100 p-10 text-center">
          <p className="text-slate-400 text-sm">Aucun groupe créé pour le moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {groupes.map((g) => (
            <div
              key={g.id}
              onClick={() => setGroupeSelectionne(g)}
              className="bg-white rounded-xl border border-slate-100 p-5 hover:shadow-sm hover:border-slate-200 transition cursor-pointer"
            >
              {/* Icône (couleur du groupe) + nom + description */}
              <div className="flex items-start gap-3 mb-5">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: g.couleur || '#2c4f7c' }}
                >
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className="min-w-0 pt-0.5">
                  <h3 className="font-bold text-slate-900 leading-tight">{g.nom}</h3>
                  {g.description && (
                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{g.description}</p>
                  )}
                </div>
              </div>

              {/* Compteur + boutons */}
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-3xl font-bold text-slate-900 leading-none">{g.nombre_membres ?? 0}</p>
                  <p className="text-[10px] uppercase tracking-widest text-slate-400 font-medium mt-1">Membres</p>
                </div>
                {estSuperAdmin && (
                  <div className="flex items-center gap-0.5" onClick={(e) => e.stopPropagation()}>
                    <button onClick={(e) => modifier(e, g)} className="p-2 text-slate-300 hover:text-[#2c4f7c] rounded-lg hover:bg-slate-50 transition">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={(e) => supprimer(e, g)} className="p-2 text-slate-300 hover:text-red-500 rounded-lg hover:bg-red-50 transition">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOuvert && (
        <GroupeFormModal
          groupe={groupeEnEdition}
          onFermer={() => setModalOuvert(false)}
          onEnregistre={() => { setModalOuvert(false); charger(); }}
        />
      )}
      {groupeSelectionne && (
        <GroupeMembresModal
          groupe={groupeSelectionne}
          onFermer={() => { setGroupeSelectionne(null); charger(); }}
        />
      )}
    </div>
  );
}