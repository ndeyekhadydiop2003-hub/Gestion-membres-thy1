import { useEffect, useState, useCallback } from 'react';
import { Plus, Pencil, Trash2, Users, ChevronRight } from 'lucide-react';
import { commissionsApi } from './commissionsApi';
import CommissionFormModal from './CommissionFormModal';
import CommissionMembresModal from './CommissionMembresModal';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function CommissionsPage() {
  const { estSuperAdmin } = useAuth();
  const { showToast } = useToast();
  const [commissions, setCommissions] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [modalOuvert, setModalOuvert] = useState(false);
  const [commissionEnEdition, setCommissionEnEdition] = useState(null);
  const [commissionSelectionnee, setCommissionSelectionnee] = useState(null);

  const charger = useCallback(() => {
    setChargement(true);
    commissionsApi.lister().then((r) => setCommissions(r.data)).finally(() => setChargement(false));
  }, []);

  useEffect(() => { charger(); }, [charger]);

  const supprimer = async (e, commission) => {
    e.stopPropagation();
    if (!confirm(`Supprimer la commission "${commission.nom}" ?`)) return;
    try {
      await commissionsApi.supprimer(commission.id);
      showToast('Commission supprimée avec succès.');
      charger();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const modifier = (e, commission) => {
    e.stopPropagation();
    setCommissionEnEdition(commission);
    setModalOuvert(true);
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <p className="text-xs font-medium text-[#2c4f7c] uppercase tracking-wide">Section Thiaroye Yeumbeul 1</p>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">Commissions</h1>
          <p className="text-slate-400 text-sm mt-1">
            Les commissions du bureau de la section — Points Focaux, Logistique, Intelligence et Perception
            Spirituelle, Trésor et Capacitation, Administrative.
          </p>
        </div>
        {estSuperAdmin && (
          <button
            onClick={() => { setCommissionEnEdition(null); setModalOuvert(true); }}
            className="flex items-center gap-2 bg-[#2c4f7c] text-white rounded-lg px-4 py-2.5 text-sm font-medium hover:opacity-90"
          >
            <Plus className="w-4 h-4" /> Nouvelle commission
          </button>
        )}
      </div>

      {chargement ? (
        <p className="text-slate-400 text-sm">Chargement...</p>
      ) : commissions.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-100 p-10 text-center">
          <p className="text-slate-400 text-sm">Aucune commission créée pour le moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {commissions.map((c) => (
            <button
              key={c.id}
              onClick={() => setCommissionSelectionnee(c)}
              className="text-left bg-white rounded-xl border border-slate-100 p-5 hover:border-slate-200 hover:shadow-sm transition group"
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-11 h-11 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${c.couleur || '#94a3b8'}20` }}
                >
                  <Users className="w-5 h-5" style={{ color: c.couleur || '#94a3b8' }} />
                </div>
                {estSuperAdmin && (
                  <div className="flex gap-1">
                    <button
                      onClick={(e) => modifier(e, c)}
                      className="text-slate-400 hover:text-[#2c4f7c] p-1.5"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => supprimer(e, c)}
                      className="text-slate-400 hover:text-red-600 p-1.5"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              <h3 className="font-semibold text-slate-900">{c.nom}</h3>
              {c.description && <p className="text-sm text-slate-500 mt-1 line-clamp-2">{c.description}</p>}

              <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.couleur || '#94a3b8' }} />
                  <span className="text-sm text-slate-600">{c.nombre_membres} membre{c.nombre_membres > 1 ? 's' : ''}</span>
                </div>
                <span className="flex items-center gap-1 text-xs text-[#2c4f7c] font-medium opacity-0 group-hover:opacity-100 transition">
                  Voir <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </button>
          ))}
        </div>
      )}

      {modalOuvert && (
        <CommissionFormModal
          commission={commissionEnEdition}
          onFermer={() => setModalOuvert(false)}
          onEnregistre={() => { setModalOuvert(false); charger(); }}
        />
      )}

      {commissionSelectionnee && (
        <CommissionMembresModal
          commission={commissionSelectionnee}
          onFermer={() => { setCommissionSelectionnee(null); charger(); }}
        />
      )}
    </div>
  );
}
