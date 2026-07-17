import { useEffect, useState, useCallback } from 'react';
import { programmesApi } from './programmesApi';
import ProgrammeFormModal from './ProgrammeFormModal';
import SeanceFormModal from './SeanceFormModal';
import SeanceDetailPage from './SeanceDetailPage';
import SeancesArchiveModal from './SeancesArchiveModal';
import { useAuth } from '../../context/AuthContext';
import { Plus, Calendar, ChevronRight, Pencil } from 'lucide-react';

export default function ProgrammesPage() {
  const { estSuperAdmin } = useAuth();
  const [programmes, setProgrammes] = useState([]);
  const [programmeSelectionne, setProgrammeSelectionne] = useState(null);
  const [chargementListe, setChargementListe] = useState(true);
  const [chargementDetail, setChargementDetail] = useState(false);
  const [modalProgrammeOuvert, setModalProgrammeOuvert] = useState(false);
  const [modalSeanceOuvert, setModalSeanceOuvert] = useState(false);
  const [seanceSelectionnee, setSeanceSelectionnee] = useState(null);
  const [archiveOuverte, setArchiveOuverte] = useState(false);
  const [modalProgrammeEditOuvert, setModalProgrammeEditOuvert] = useState(false);

  const chargerListe = useCallback(() => {
    setChargementListe(true);
    programmesApi.lister().then((r) => {
      setProgrammes(r.data);
      if (!programmeSelectionne && r.data.length > 0) {
        selectionner(r.data[0].id);
      }
    }).finally(() => setChargementListe(false));
  }, []);

  const selectionner = (id) => {
    setChargementDetail(true);
    programmesApi.obtenir(id).then((r) => setProgrammeSelectionne(r.data)).finally(() => setChargementDetail(false));
  };

  useEffect(() => { chargerListe(); }, []);

  // Vue pointage : on remplace tout l'affichage par la page de détail de la séance
  if (seanceSelectionnee) {
    return (
      <SeanceDetailPage
        seance={seanceSelectionnee}
        programme={programmeSelectionne}
        onRetour={() => setSeanceSelectionnee(null)}
      />
    );
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <p className="text-xs font-medium text-[#2c4f7c] uppercase tracking-wide">Activités</p>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">Programmes</h1>
          <p className="text-slate-400 text-sm mt-1">Gérez les programmes, leurs séances et la présence des membres.</p>
        </div>
        {estSuperAdmin && (
          <button
            onClick={() => setModalProgrammeOuvert(true)}
            className="flex items-center gap-2 bg-[#2c4f7c] text-white rounded-lg px-4 py-2.5 text-sm font-medium hover:opacity-90"
          >
            <Plus className="w-4 h-4" /> Nouveau programme
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-5 items-start">
        <div className="space-y-3">
          {chargementListe ? (
            <p className="text-sm text-slate-400">Chargement...</p>
          ) : programmes.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-100 p-6 text-center">
              <p className="text-sm text-slate-400">Aucun programme créé.</p>
            </div>
          ) : (
            programmes.map((p) => (
              <button
                key={p.id}
                onClick={() => selectionner(p.id)}
                className={`w-full text-left bg-white rounded-xl border p-4 transition ${
                  programmeSelectionne?.id === p.id ? 'border-[#2c4f7c] ring-1 ring-[#2c4f7c]' : 'border-slate-100 hover:border-slate-200'
                }`}
              >
                <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: p.couleur || '#94a3b8' }} />
                <h3 className="font-semibold text-slate-900 truncate">{p.nom}</h3>
               </div>

                {p.description && <p className="text-sm text-slate-500 mt-1 ml-4.5 line-clamp-1">{p.description}</p>}
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-2 ml-4.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {p.nombre_seances} séance{p.nombre_seances > 1 ? 's' : ''}
                  {p.taux_presence !== null && <> · Présence {p.taux_presence}%</>}
                </div>
              </button>
            ))
          )}
        </div>

        <div className="bg-white rounded-xl border border-slate-100 p-6 min-h-[300px]">
          {chargementDetail ? (
            <p className="text-sm text-slate-400">Chargement...</p>
          ) : !programmeSelectionne ? (
            <p className="text-sm text-slate-400">Sélectionnez un programme pour voir ses séances.</p>
          ) : (
            <>
              <div className="flex items-center justify-between mb-5">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold text-slate-900">{programmeSelectionne.nom}</h2>
                  {estSuperAdmin && (
                    <button
                      onClick={() => setModalProgrammeEditOuvert(true)}
                      className="text-slate-400 hover:text-[#2c4f7c] p-1"
                      title="Modifier le programme"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  )}
                </div>
                {programmeSelectionne.description && <p className="text-sm text-slate-500 mt-0.5">{programmeSelectionne.description}</p>}
              </div>
                <button
                  onClick={() => setModalSeanceOuvert(true)}
                  className="flex items-center gap-2 border border-slate-200 rounded-lg px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 shrink-0"
                >
                  <Plus className="w-4 h-4" /> Nouvelle séance
                </button>
              </div>

              {programmeSelectionne.seances?.length === 0 ? (
                <p className="text-sm text-slate-400 py-8 text-center">Aucune séance pour ce programme.</p>
              ) : (
              <div className="divide-y-2 divide-slate-200">
                {programmeSelectionne.seances?.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSeanceSelectionnee(s)}
                    className="w-full flex items-center gap-4 px-4 py-3 hover:bg-slate-50 cursor-pointer group text-left"
                  >
                    <div className="w-10 h-10 rounded-lg bg-[#2c4f7c]/10 flex items-center justify-center shrink-0">
                      <Calendar className="w-4.5 h-4.5 text-[#2c4f7c]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900 capitalize">
                        {programmeSelectionne.nom} — {new Date(s.date_seance).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                      </p>
                      <p className="text-xs text-slate-400 capitalize">
                        {new Date(s.date_seance).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 text-xs font-medium">
                      <span className="bg-green-50 text-green-700 px-2.5 py-1 rounded-full">{s.presents ?? 0} présents</span>
                      <span className="bg-red-50 text-red-700 px-2.5 py-1 rounded-full">{s.absents ?? 0} absents</span>
                      <span className="bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full">{s.excuses ?? 0} excusés</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 shrink-0" />
                  </button>
                ))}
              </div>
              )}

              {programmeSelectionne.nombre_seances > 5 && (
                <button
                  onClick={() => setArchiveOuverte(true)}
                  className="w-full text-center text-sm text-[#2c4f7c] font-medium hover:underline mt-3 pt-3 border-t border-slate-50"
                >
                  Voir toutes les séances ({programmeSelectionne.nombre_seances}) →
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {modalProgrammeOuvert && (
        <ProgrammeFormModal
          onFermer={() => setModalProgrammeOuvert(false)}
          onEnregistre={() => { setModalProgrammeOuvert(false); chargerListe(); }}
        />
      )}

      {modalSeanceOuvert && programmeSelectionne && (
        <SeanceFormModal
          programmeId={programmeSelectionne.id}
          onFermer={() => setModalSeanceOuvert(false)}
          onEnregistre={() => { setModalSeanceOuvert(false); selectionner(programmeSelectionne.id); chargerListe(); }}
        />
      )}

      {archiveOuverte && programmeSelectionne && (
        <SeancesArchiveModal
          programme={programmeSelectionne}
          onFermer={() => setArchiveOuverte(false)}
          onSelectionner={(s) => { setArchiveOuverte(false); setSeanceSelectionnee(s); }}
        />
      )}

      {modalProgrammeEditOuvert && (
        <ProgrammeFormModal
          programme={programmeSelectionne}
          onFermer={() => setModalProgrammeEditOuvert(false)}
          onEnregistre={() => { setModalProgrammeEditOuvert(false); selectionner(programmeSelectionne.id); chargerListe(); }}
        />
      )}
    </div>
  );
}